import { getSignedUrl } from "@/graphql/file";
import { gql } from "@apollo/client";

export const warpGql = (query: string) => {
  return gql`
    ${query}
  `;
};

export const getSignedUrlAndImageDataUpload = async (
  fileData: File | null,
  folder: "CREDIT_TOP_UP",
  uploadUrl?: string | null
) => {
  if (fileData) {
    try {
      const signedUrlResponse: any = await getSignedUrl({
        filename: fileData.type,
        folder: folder,
        updateUrl: uploadUrl,
      });

      const { url, fields } = signedUrlResponse.data.getPresignedPost;

      const formData: any = new FormData();

      Object.entries(fields).forEach(([field, value]) => {
        formData.append(field, value);
      });

      formData.append("file", fileData);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        return {
          status: 200,
          url: `${url}${fields.key}`,
        };
      } else {
        return {
          status: 500,
          url: "",
          message: "Failed Image Upload to Server!",
        };
      }
    } catch (err: any) {
      return {
        status: 500,
        message: err.message,
      };
    }
  } else {
    return {
      status: 500,
      message: "File is null",
    };
  }
};


export const uploadMultipleImages = async (
  files: File[],
  folder: "CREDIT_TOP_UP"
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const res = await getSignedUrlAndImageDataUpload(
      file,
      folder
    );

    if (res?.status !== 200 || !res.url) {
      throw new Error("Image upload failed");
    }

    uploadedUrls.push(res.url);
  }

  return uploadedUrls;
};
