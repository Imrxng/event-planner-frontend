import { RootObjectMongoDbUser } from "../types/types";
const server = import.meta.env.VITE_SERVER_URL;

export const uploadUserImage = async (
  file: File,
  userId: string,
  token: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("userId", userId);

  const response = await fetch(`${server}/api/users/upload/${userId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload image");
  }

  const data = await response.json();
  return data.url;
};

export const checkUserImageExists = async (
  userId: string,
  token: string,
): Promise<{ exists: boolean; url?: string }> => {
  const response = await fetch(`${server}/api/check-user-picture/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    return { exists: false };
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to check image");
  }

  const data = await response.json();
  return { exists: data.exists, url: data.url };
};

const convertBlobToFile = (blob: Blob, filename: string): File => {
  return new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

export const uploadBlobAsUserImage = async (
  blob: Blob,
  userId: string,
  token: string,
): Promise<string> => {
  const file = convertBlobToFile(blob, `${userId}.jpg`);
  return await uploadUserImage(file, userId, token);
};

export const updateUserPhotoIfNecessary = async (
  oid: string,
  token: string,
  server: string,
) => {
  try {
    const photoResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/photo/$value",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (photoResponse.status === 404) {
      console.log("No photo found.");
      return;
    }

    const photoBlob = await photoResponse.blob();

    const userResponse = await fetch(`${server}/api/users/${oid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data: RootObjectMongoDbUser = await userResponse.json();

    if (data.user.picture === "not-found" || photoBlob.size > 0) {
      const uploadedImageUrl = await uploadBlobAsUserImage(
        photoBlob,
        oid,
        token,
      );

      data.user.picture = uploadedImageUrl;

      await fetch(`${server}/api/users/${oid}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data.user, userId: oid }),
      });
      console.log("User photo updated successfully.");
    } else {
      console.log("User photo is up-to-date.");
    }
  } catch (error) {
    console.error("Error updating user photo:", error);
  }
};

export const fetchImageWithToken = async (oid: string, token: string) => {
  try {
    const url = `${server}/uploads/${oid}.jpg`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } else {
      console.error("Failed to fetch image:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
