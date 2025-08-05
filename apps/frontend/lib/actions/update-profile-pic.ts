"use server";

import { revalidatePath } from "next/cache";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { eq } from "drizzle-orm";

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "10m"),
});

const UpdateProfilePic = async (formData: FormData, userId: string) => {
  const ip =
    (await headers()).get("x-real-ip") ||
    (await headers()).get("x-forwarded-for");

  //   const {
  //     remaining,
  //     limit,
  //     success: limitReached,
  //   } = await rateLimit.limit(ip!);

  //   console.log({ remaining, limit, limitReached });

  //   if (!limitReached) {
  //     return {
  //       success: false,
  //       message: "Too Many requests!!!. Please try again later after 10 minutes",
  //     };
  //   }

  const image = formData.get("image") as File;
  const fileName = formData.get("fileName") as string;

  console.log("file is", image);

  // For container-level SAS tokens, we need to use a different approach
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
  const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;

  // Construct the URL for container-level SAS
  const baseUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
  const formattedSasToken = sasToken?.startsWith("?")
    ? sasToken
    : `?${sasToken}`;
  const url = `${baseUrl}${formattedSasToken}`;

  console.log("url is", url);

  try {
    // Create the request headers for blob upload
    const headers: Record<string, string> = {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-blob-content-type": image.type,
      "Content-Length": image.size.toString(),
      "x-ms-version": "2020-04-08",
    };

    // Add additional headers that might be required
    headers["x-ms-date"] = new Date().toUTCString();
    headers["x-ms-blob-cache-control"] = "no-cache";

    const response = await fetch(url, {
      method: "PUT",
      headers,
      body: image,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Azure upload error:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    console.log("Upload successful, status:", response.status);
  } catch (error) {
    console.log("error in profile pic server action", error);
    return {
      success: false,
      message: "Error in profile pic server action",
    };
  }

  const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${fileName}`;

  console.log("image url", imageUrl);

  try {
    await db
      .update(user)
      .set({
        image: imageUrl,
      })
      .where(eq(user.id, userId));

    revalidatePath(`/profile/${userId}`);

    return {
      success: true,
      message: "Successfully Uploaded Image",
      imageUrl,
    };
  } catch (error) {
    console.log("error in profile pic server action", error);
    return {
      success: false,
      message: "Error in profile pic server action",
    };
  }
};

export default UpdateProfilePic;
