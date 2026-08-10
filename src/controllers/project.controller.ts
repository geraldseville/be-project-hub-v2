import type { Request, Response } from 'express';

import { projectRepository } from '../repositories/project.repository';
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
    urgency,
    startDate,
    endDate,
    primaryColor,
    secondaryColor,
    memberIds,
    // tasks,
  } = req.body;

  const project = await projectRepository.createProject({
    title,
    description,
    status,
    urgency,
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
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response | void> => {
  const projectId = req.params.id;

  const project = await projectRepository.getProjectById(projectId);

  if (!project) {
    return res.status(404).json({
      status: 'error',
      message: 'project not found.',
    });
  }

  await projectRepository.deleteProjectById(projectId);

  return res.status(200).json({
    status: 'success',
    message: 'project deleted successfully.',
  });
};

export const getProject = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<Response | void> => {
  const projectId = req.params.id;

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
  req: Request<{ id: string }, {}, UpdateProjectDto>,
  res: Response,
): Promise<Response | void> => {
  const projectId = req.params.id;

  const {
    title,
    description,
    status,
    urgency,
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

  const updateData = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(urgency !== undefined && { urgency }),
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

  return res.status(200).json({
    status: 'success',
    message: 'project updated successfully.',
    data: {
      project: updatedProject,
    },
  });
};
