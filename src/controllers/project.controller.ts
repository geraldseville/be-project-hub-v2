import type { Request, Response } from 'express';
import { NotificationType, NotificationEntityType } from '@prisma/client';

import { projectRepository } from '../repositories/project.repository';
import { notificationService } from '../services/notification.service';
import type { CreateProjectDto, UpdateProjectDto } from '../types/project.dto';

export const createProject = async (
  req: Request<{}, {}, CreateProjectDto>,
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
    secondaryColor,
    memberIds,
  } = req.body;

  const project = await projectRepository.createProject({
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    primaryColor,
    secondaryColor,

    owner: {
      connect: {
        id: userId,
      },
    },

    members: {
      connect: memberIds.map((id) => ({
        id,
      })),
    },
  });

  const notifications = memberIds
    .filter((recipientId) => recipientId !== userId)
    .map((recipientId) => ({
      recipientId,
      actorId: userId,
      type: NotificationType.PROJECT_MEMBER_ADDED,
      entityType: NotificationEntityType.PROJECT,
      entityId: project.id,
      title: 'Added to project',
      message: `You were added to "${project.title}".`,
    }));

  if (notifications.length > 0) {
    await notificationService.createNotifications(notifications);
  }

  const newProject = await projectRepository.getProjectById(project.id);

  return res.status(201).json({
    status: 'success',
    message: 'project created successfully.',
    data: {
      project: newProject,
    },
  });
};

export const deleteProject = async (
  req: Request<{ projectId: string }>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const { projectId } = req.params;

  const project = await projectRepository.getProjectById(projectId);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'project not found.',
    });
  }

  const recipientIds = project.members
    .map((member) => member.id)
    .filter((recipientId) => recipientId !== userId);

  await projectRepository.deleteProjectById(projectId);

  if (recipientIds.length > 0) {
    const notifications = recipientIds.map((recipientId) => ({
      recipientId,
      actorId: userId,
      type: NotificationType.PROJECT_DELETED,
      entityType: NotificationEntityType.PROJECT,
      entityId: projectId,
      title: 'Project deleted',
      message: `"${project.title}" was deleted.`,
    }));

    await notificationService.createNotifications(notifications);
  }

  return res.status(200).json({
    status: 'success',
    message: 'project deleted successfully.',
  });
};

export const getProject = async (
  req: Request<{ projectId: string }>,
  res: Response,
): Promise<Response | void> => {
  const { projectId } = req.params;

  const project = await projectRepository.getProjectById(projectId);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'project not found.',
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'successfully get project',
    data: {
      project,
    },
  });
};

export const getProjects = async (_: Request, res: Response) => {
  const projects = await projectRepository.getAllProjects();

  return res.status(201).json({
    status: 'success',
    message: 'successfully get projects',
    data: {
      projects,
    },
  });
};

export const updateProject = async (
  req: Request<{ projectId: string }, {}, UpdateProjectDto>,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;
  const { projectId } = req.params;

  const {
    title,
    description,
    status,
    priority,
    startDate,
    endDate,
    primaryColor,
    secondaryColor,
    memberIds,
  } = req.body;

  const project = await projectRepository.getProjectById(projectId);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'project not found.',
    });
  }

  const hasProjectChanges =
    title !== undefined ||
    description !== undefined ||
    status !== undefined ||
    priority !== undefined ||
    startDate !== undefined ||
    endDate !== undefined ||
    primaryColor !== undefined ||
    secondaryColor !== undefined;

  /**
   * Determine membership changes before updating the project.
   */
  const previousMemberIds = new Set(project.members.map((member) => member.id));

  const newMemberIds = new Set(memberIds ?? []);

  const addedMemberIds =
    memberIds?.filter((id) => !previousMemberIds.has(id)) ?? [];

  const removedMemberIds =
    memberIds !== undefined
      ? project.members
          .map((member) => member.id)
          .filter((id) => !newMemberIds.has(id))
      : [];

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(startDate !== undefined && { startDate }),
    ...(endDate !== undefined && { endDate }),
    ...(primaryColor !== undefined && { primaryColor }),
    ...(secondaryColor !== undefined && { secondaryColor }),

    ...(memberIds !== undefined && {
      members: {
        set: memberIds.map((id: string) => ({
          id,
        })),
      },
    }),

    updatedAt: new Date(),
  };

  const updatedProject = await projectRepository.updateProjectById(
    projectId,
    updateData,
  );

  /**
   * Project details changed.
   *
   * Notify existing members except the actor.
   */
  if (hasProjectChanges) {
    const recipientIds = project.members
      .map((member) => member.id)
      .filter((recipientId) => recipientId !== userId);

    const notifications = recipientIds.map((recipientId) => ({
      recipientId,
      actorId: userId,
      type: NotificationType.PROJECT_UPDATED,
      entityType: NotificationEntityType.PROJECT,
      entityId: projectId,
      title: 'Project updated',
      message: `"${updatedProject.title}" was updated.`,
    }));

    if (notifications.length > 0) {
      await notificationService.createNotifications(notifications);
    }
  }

  /**
   * New members added.
   */
  if (addedMemberIds.length > 0) {
    const notifications = addedMemberIds
      .filter((recipientId) => recipientId !== userId)
      .map((recipientId) => ({
        recipientId,
        actorId: userId,
        type: NotificationType.PROJECT_MEMBER_ADDED,
        entityType: NotificationEntityType.PROJECT,
        entityId: projectId,
        title: 'Added to project',
        message: `You were added to "${updatedProject.title}".`,
      }));

    if (notifications.length > 0) {
      await notificationService.createNotifications(notifications);
    }
  }

  /**
   * Members removed.
   */
  if (removedMemberIds.length > 0) {
    const notifications = removedMemberIds.map((recipientId) => ({
      recipientId,
      actorId: userId,
      type: NotificationType.PROJECT_MEMBER_REMOVED,
      entityType: NotificationEntityType.PROJECT,
      entityId: projectId,
      title: 'Removed from project',
      message: `You were removed from "${project.title}".`,
    }));

    await notificationService.createNotifications(notifications);
  }

  return res.status(200).json({
    status: 'success',
    message: 'project updated successfully.',
    data: {
      project: updatedProject,
    },
  });
};
