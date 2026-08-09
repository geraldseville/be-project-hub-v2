import type { Request, Response } from 'express';

import type { CreateTaskDto, UpdateTaskDto } from '../types/task.dto';
import { taskRepository } from '../repositories/task.repository';

export const createTask = async (
  req: Request<{}, {}, CreateTaskDto>,
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

    assignee: {
      connect: {
        id: assigneeId,
      },
    },
  });

  return res.status(201).json({
    status: 'success',
    message: 'task created successfully',
    data: {
      task,
    },
  });
};

export const deleteTask = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response | void> => {
  const taskId = req.params.id;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  await taskRepository.deleteTaskById(taskId);

  return res.status(200).json({
    status: 'success',
    message: 'task deleted successfully',
  });
};

export const getTask = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response | void> => {
  const taskId = req.params.id;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'successfully get task',
    data: {
      task,
    },
  });
};

export const getTasks = async (_: Request, res: Response) => {
  const tasks = await taskRepository.getAllTasks();

  return res.status(201).json({
    status: 'success',
    message: 'successfully get tasks',
    data: {
      tasks,
    },
  });
};

export const updateTask = async (
  req: Request<{ id: string }, {}, UpdateTaskDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const taskId = req.params.id;

  const {
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    projectId,
    assigneeId,
  } = req.body;

  const task = await taskRepository.getTaskById(taskId);

  if (!task) {
    return res.status(404).json({
      status: 'error',
      message: 'task not found.',
    });
  }

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(startDate !== undefined && { startDate }),
    ...(endDate !== undefined && { endDate }),

    ...(assigneeId !== undefined && { assigneeId }),

    updatedAt: new Date(),
  };

  const updatedTask = await taskRepository.updateTaskById(taskId, updateData);

  return res.status(200).json({
    status: 'success',
    message: 'task updated successfully',
    data: {
      task: updatedTask,
    },
  });
};
