"use server";

import { env } from "@repo/env/admin";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});



export async function getCloudinarySignature(publicId?: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    timestamp: timestamp,
    folder: "blog",
  };

  if (publicId) {
    params.public_id = publicId;
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    env.CLOUDINARY_API_SECRET
  );

  return {
    timestamp,
    signature,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    folder: "blog",
    publicId, 
  };
}

