import {cloudinaryInstance} from "../config/cloudinaryConfig.js";

// Upload function
export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinaryInstance.uploader.upload(filePath, {
      resource_type: "image",
    });

    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
