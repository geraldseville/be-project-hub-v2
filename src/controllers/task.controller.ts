import { prisma } from '../lib/prisma';
import { taskRepository } from '../repositories/task.repository.js';
import { taskActivityRepository } from '../repositories/task-activity.repository.js';
import { notificationService } from '../services/notification.service.js';

import type { Response } from 'express';
import type { AuthenticatedRequest } from '../types/auth.dto.js';
import type { CreateTaskDto, UpdateTaskDto } from '../types/task.dto.js';
import type { TaskActivityType } from '@prisma/client';

export const createTask = async (
  req: AuthenticatedRequest<{}, {}, CreateTaskDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const {
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    primaryColor,
    projectId,
    assigneeId,
  } = req.body;

  const task = await taskRepository.createTask({
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    primaryColor,

    project: {
      connect: {
        id: projectId,
      },
    },

    createdBy: {
      connect: {
        id: userId,
      },
    },

    assignee: assigneeId
      ? {
          connect: {
            id: assigneeId,
          },
        }
      : undefined,
  });

  await taskActivityRepository.createTaskActivity({
    taskId: task.id,
    actorId: userId,
    type: 'CREATED',
  });

  // Notify the assignee
  if (assigneeId && assigneeId !== userId) {
    await notificationService.createNotification({
      recipientId: assigneeId,
      actorId: userId,
      type: 'TASK_ASSIGNED',
      entityType: 'TASK',
      entityId: task.id,
      title: 'Task assigned to you',
      message: `You have been assigned to the task "${task.title}".`,
      metadata: {
        projectId,
        taskId: task.id,
      },
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'task created successfully.',
    data: {
      task,
    },
  });
};

export const createTaskComment = async (
  req: AuthenticatedRequest<{ taskId: string }>,
  res: Response,
): Promise<Response | void> => {
  try {
    const { taskId } = req.params;

    const { content } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized.',
      });
    }

    if (!taskId) {
      return res.status(400).json({
        status: 'error',
        message: 'taskId is required.',
      });
    }

    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'comment content is required.',
      });
    }

    const taskExists = await taskRepository.getTaskById(taskId);

    if (!taskExists) {
      return res.status(404).json({
        status: 'error',
        message: 'task not found.',
      });
    }

    const comment = await prisma.$transaction(async (tx) => {
      const createdComment = await tx.taskComment.create({
        data: {
          content: content.trim(),
          taskId: taskExists.id,
          authorId: userId,
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
        },
      });

      await taskActivityRepository.createTaskActivity({
        taskId: taskExists.id,
        actorId: userId,
        type: 'COMMENT_ADDED',
        metadata: {
          commentId: createdComment.id,
          comment: createdComment,
        },
      });

      return createdComment;
    });

    return res.status(201).json({
      status: 'success',
      message: 'comment created successfully.',
      data: {
        comment,
      },
    });
  } catch (error) {
    console.error('create task comment error:', error);

    return res.status(500).json({
      status: 'error',
      message: 'failed to create comment.',
    });
  }
};

export const deleteTask = async (
  req: AuthenticatedRequest<{ taskId: string }>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const { taskId } = req.params;
  const userId = req.user.id;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  await taskRepository.deleteTaskById(taskId);

  // Notify the assignee before the task data is no longer available.
  if (task.assigneeId && task.assigneeId !== userId) {
    await notificationService.createNotification({
      recipientId: task.assigneeId,
      actorId: userId,
      type: 'TASK_DELETED',
      entityType: 'TASK',
      entityId: taskId,
      title: 'Task deleted',
      message: `The task "${task.title}" assigned to you was deleted.`,
      metadata: {
        taskId,
        projectId: task.projectId,
      },
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'task deleted successfully',
  });
};

export const getTask = async (
  req: AuthenticatedRequest<{ taskId: string }>,
  res: Response,
): Promise<Response | void> => {
  const { taskId } = req.params;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'task get successfully.',
    data: {
      task,
    },
  });
};

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const { tasks, pagination } = await taskRepository.getTasks({ page, limit });

  return res.status(201).json({
    status: 'success',
    message: 'tasks get successfully.',
    data: {
      tasks,
      pagination,
    },
  });
};

export const getTasksByProjectId = async (
  req: AuthenticatedRequest<{ projectId: string }>,
  res: Response,
): Promise<Response> => {
  const { projectId } = req.params;

  const pageParam = Number(req.query.page ?? 1);
  const limitParam = Number(req.query.limit ?? 20);

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limit =
    Number.isInteger(limitParam) && limitParam > 0
      ? Math.min(limitParam, 100)
      : 20;

  const { tasks, pagination } = await taskRepository.getTasksByProjectId({
    projectId,
    page,
    limit,
  });

  return res.status(200).json({
    status: 'success',
    message: 'successfully fetched project tasks.',
    data: {
      tasks,
      pagination,
    },
  });
};

export const getTaskActivities = async (
  req: AuthenticatedRequest<{ taskId: string }>,
  res: Response,
): Promise<Response> => {
  const { taskId } = req.params;

  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const { taskActivities, pagination } =
    await taskActivityRepository.getTaskActivities({
      taskId,
      page,
      limit,
    });

  return res.status(200).json({
    status: 'success',
    message: 'task activities retrieved successfully.',
    data: {
      taskActivities,
      pagination,
    },
  });
};

interface TaskActivityChanges {
  type: TaskActivityType;
  metadata: {
    from: string | null;
    to: string | null;
  };
}

export const updateTask = async (
  req: AuthenticatedRequest<{ taskId: string }, {}, UpdateTaskDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const { taskId } = req.params;
  const userId = req.user.id;

  const {
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    primaryColor,
    assigneeId,
  } = req.body;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  const newStartDate = startDate !== undefined ? startDate : task.startDate;
  const newEndDate = endDate !== undefined ? endDate : task.endDate;

  if (newStartDate && newEndDate && newStartDate > newEndDate) {
    return res.status(400).json({
      status: 'error',
      message: 'start date must be before or equal to end date.',
    });
  }

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(startDate !== undefined && { startDate }),
    ...(endDate !== undefined && { endDate }),
    ...(primaryColor !== undefined && { primaryColor }),
    ...(assigneeId !== undefined && { assigneeId }),
    updatedAt: new Date(),
  };

  const changes: TaskActivityChanges[] = [];

  if (title !== undefined && title !== task.title) {
    changes.push({
      type: 'TITLE_CHANGED',
      metadata: {
        from: task.title,
        to: title,
      },
    });
  }

  if (description !== undefined && description !== task.description) {
    changes.push({
      type: 'DESCRIPTION_CHANGED',
      metadata: {
        from: task.description,
        to: description,
      },
    });
  }

  if (status !== undefined && status !== task.status) {
    changes.push({
      type: 'STATUS_CHANGED',
      metadata: {
        from: task.status,
        to: status,
      },
    });
  }

  if (priority !== undefined && priority !== task.priority) {
    changes.push({
      type: 'PRIORITY_CHANGED',
      metadata: {
        from: task.priority,
        to: priority,
      },
    });
  }

  if (
    startDate !== undefined &&
    startDate?.getTime() !== task.startDate?.getTime()
  ) {
    changes.push({
      type: 'START_DATE_CHANGED',
      metadata: {
        from: task.startDate?.toISOString() ?? null,
        to: startDate?.toISOString() ?? null,
      },
    });
  }

  if (endDate !== undefined && endDate?.getTime() !== task.endDate?.getTime()) {
    changes.push({
      type: 'END_DATE_CHANGED',
      metadata: {
        from: task.endDate?.toISOString() ?? null,
        to: endDate?.toISOString() ?? null,
      },
    });
  }

  if (primaryColor !== undefined && primaryColor !== task.primaryColor) {
    changes.push({
      type: 'PRIMARY_COLOR_CHANGED',
      metadata: {
        from: task.primaryColor,
        to: primaryColor,
      },
    });
  }

  if (assigneeId !== undefined && assigneeId !== task.assigneeId) {
    changes.push({
      type: 'ASSIGNEE_CHANGED',
      metadata: {
        from: task.assigneeId,
        to: assigneeId,
      },
    });
  }

  if (changes.length === 0) {
    return res.status(200).json({
      status: 'success',
      message: 'task is already up to date.',
      data: {
        task,
      },
    });
  }

  const updatedTask = await taskRepository.updateTaskById(taskId, updateData);

  await Promise.all(
    changes.map((change) =>
      taskActivityRepository.createTaskActivity({
        taskId,
        actorId: userId,
        type: change.type,
        metadata: change.metadata,
      }),
    ),
  );

  // New assignee
  if (
    assigneeId !== undefined &&
    assigneeId !== task.assigneeId &&
    assigneeId !== null &&
    assigneeId !== userId
  ) {
    await notificationService.createNotification({
      recipientId: assigneeId,
      actorId: userId,
      type: 'TASK_ASSIGNED',
      entityType: 'TASK',
      entityId: taskId,
      title: 'Task assigned to you',
      message: `You have been assigned to the task "${updatedTask.title}".`,
      metadata: {
        taskId,
        projectId: updatedTask.projectId,
      },
    });
  }

  // Task details changed
  const hasTaskChanges = changes.some(
    (change) => change.type !== 'ASSIGNEE_CHANGED',
  );

  if (
    hasTaskChanges &&
    updatedTask.assigneeId &&
    updatedTask.assigneeId !== userId
  ) {
    await notificationService.createNotification({
      recipientId: updatedTask.assigneeId,
      actorId: userId,
      type: 'TASK_UPDATED',
      entityType: 'TASK',
      entityId: taskId,
      title: 'Task updated',
      message: `The task "${updatedTask.title}" has been updated.`,
      metadata: {
        taskId,
        projectId: updatedTask.projectId,
        changes: changes
          .filter((change) => change.type !== 'ASSIGNEE_CHANGED')
          .map((change) => ({
            type: change.type,
            metadata: change.metadata,
          })),
      },
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'task updated successfully.',
    data: {
      task: updatedTask,
    },
  });
};
