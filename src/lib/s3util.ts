import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize the S3 client with your provider's credentials
const s3Client = new S3Client({
    region: "eu-central",
    endpoint: process.env.S3_ENDPOINT || "",
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_API_KEY || "",
    },
});

// Your bucket name
const BUCKET_NAME = process.env.S3_BUCKET;

/**
 * Generate a signed URL for an S3 object that expires after a specified time
 * @param key - The path to the file in S3 bucket
 * @param expiresIn - Seconds until the URL expires (default 3600 = 1 hour)
 * @returns Promise with the signed URL
 */
export async function getSignedS3Url(
    key: string,
    expiresIn = 3600
): Promise<string> {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });

        // Generate the signed URL
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error;
    }
}

/**
 * Maps a local path to an S3 key path
 * @param localPath - Path as defined in data.ts (e.g., "/audios/file.mp3")
 * @returns The S3 key path
 */
export function mapLocalPathToS3Key(localPath: string): string {
    // Remove leading slash if present
    const cleanPath = localPath.startsWith("/")
        ? localPath.substring(1)
        : localPath;

    return cleanPath;
}
