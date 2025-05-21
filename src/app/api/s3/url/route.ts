import { NextRequest, NextResponse } from "next/server";
import { getSignedS3Url } from "@/lib/s3util";

export async function POST(req: NextRequest) {
    try {
        const { key } = await req.json();

        if (!key) {
            return NextResponse.json(
                { error: "Missing S3 key" },
                { status: 400 }
            );
        }

        const signedUrl = await getSignedS3Url(key);
        return NextResponse.json({ url: signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error);
        return NextResponse.json(
            { error: "Failed to generate signed URL" },
            { status: 500 }
        );
    }
}
