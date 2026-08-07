import type { Request, Response } from 'express';

import { supabase } from '../config/supabase.js';

const userProfileImageBucket = 'user-profile-image';

export const uploadProfileImage = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'unauthorized.',
    });
  }

  const userId = req.user.id;

  const file = req.file;

  if (!file) {
    return res.status(400).json({
      status: 'error',
      message: 'no image uploaded.',
    });
  }

  const fileName = `${userId}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(userProfileImageBucket)
    .upload(fileName, file.buffer, {
      upsert: true,
      contentType: file.mimetype,
    });

  if (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(userProfileImageBucket).getPublicUrl(fileName);

  return res.status(200).json({
    status: 'success',
    message: 'successfully uploaded image.',
    data: {
      url: publicUrl,
    },
  });
};
