// Define location types for Brandenburg and Mataro
type Region = "Brandenburg" | "Mataro";

// Configuration: Set to true to use local files from public folder, false to use S3 API
const USE_LOCAL_FILES = false;

// Define a media item structure
interface MediaItem {
    id: number;
    audioS3Key: string;
    videoS3Key?: string;
    audioUrl?: string;
    videoUrl?: string;
}

// Define location structure
interface Location {
    id: number;
    name: string;
    region: Region;
    coordinates: {
        lat: number;
        lng: number;
    };
    media: MediaItem[];
}

export const locationData: Location[] = [
    {
        id: 1,
        name: "Diebesgrund",
        region: "Brandenburg",
        coordinates: {
            lat: 52.335668,
            lng: 12.448754,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/forest_01.mp3",
                videoS3Key: "brandenburg/video/forest_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/forest_02.mp3",
                videoS3Key: "brandenburg/video/forest_01.mp4",
            },
            {
                id: 3,
                audioS3Key: "brandenburg/audio/forest_03.mp3",
                videoS3Key: "brandenburg/video/forest_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "brandenburg/audio/forest_04.mp3",
                videoS3Key: "brandenburg/video/forest_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "brandenburg/audio/forest_05.mp3",
                videoS3Key: "brandenburg/video/forest_05.mp4",
            },
        ],
    },
    {
        id: 2,
        name: "Neustädtischer Markt",
        region: "Brandenburg",
        coordinates: {
            lat: 52.408967,
            lng: 12.563298,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/mall_01.aac",
                videoS3Key: "brandenburg/video/mall_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/mall_02.aac",
                videoS3Key: "brandenburg/video/mall_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "brandenburg/audio/mall_03.aac",
                videoS3Key: "brandenburg/video/mall_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "brandenburg/audio/mall_04.aac",
                videoS3Key: "brandenburg/video/mall_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "brandenburg/audio/mall_05.aac",
                videoS3Key: "brandenburg/video/mall_05.mp4",
            },
        ],
    },
    {
        id: 3,
        name: "Glockenspiel",
        region: "Brandenburg",
        coordinates: {
            lat: 52.411026,
            lng: 12.557673,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/city_01.mp3",
                videoS3Key: "brandenburg/video/city_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/city_02.mp3",
                videoS3Key: "brandenburg/video/city_02.mp4",
            },
        ],
    },
    {
        id: 4,
        name: "Am Mühlendamm",
        region: "Brandenburg",
        coordinates: {
            lat: 52.411096,
            lng: 12.564217,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/water_01.aac",
                videoS3Key: "brandenburg/video/water_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/water_02.aac",
                videoS3Key: "brandenburg/video/water_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "brandenburg/audio/water_03.aac",
                videoS3Key: "brandenburg/video/water_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "brandenburg/audio/water_04.aac",
                videoS3Key: "brandenburg/video/water_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "brandenburg/audio/water_05.aac",
                videoS3Key: "brandenburg/video/water_05.mp4",
            },
        ],
    },
    {
        id: 5,
        name: "Tram Station",
        region: "Brandenburg",
        coordinates: {
            lat: 52.412245,
            lng: 12.53904,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/tram_01.aac",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/tram_02.aac",
            },
            {
                id: 3,
                audioS3Key: "brandenburg/audio/tram_03.aac",
            },
            {
                id: 4,
                audioS3Key: "brandenburg/audio/tram_04.aac",
            },
            {
                id: 5,
                audioS3Key: "brandenburg/audio/tram_05.aac",
            },
        ],
    },
    {
        id: 6,
        name: "Beach",
        region: "Mataro",
        coordinates: {
            lat: 41.526686,
            lng: 2.436851,
        },
        media: [
            {
                id: 1,
                audioS3Key: "mataro/audio/beach_01.aac",
                videoS3Key: "mataro/video/beach_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "mataro/audio/beach_02.aac",
                videoS3Key: "mataro/video/beach_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "mataro/audio/beach_03.aac",
                videoS3Key: "mataro/video/beach_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "mataro/audio/beach_04.aac",
                videoS3Key: "mataro/video/beach_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "mataro/audio/beach_05.aac",
                videoS3Key: "mataro/video/beach_05.mp4",
            },
        ],
    },
    {
        id: 7,
        name: "Waterfall",
        region: "Mataro",
        coordinates: {
            lat: 41.58409,
            lng: 2.43437,
        },
        media: [
            {
                id: 1,
                audioS3Key: "mataro/audio/water_01.aac",
                videoS3Key: "mataro/video/water_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "mataro/audio/water_02.aac",
                videoS3Key: "mataro/video/water_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "mataro/audio/water_03.aac",
                videoS3Key: "mataro/video/water_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "mataro/audio/water_04.aac",
                videoS3Key: "mataro/video/water_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "mataro/audio/water_05.aac",
                videoS3Key: "mataro/video/water_05.mp4",
            },
        ],
    },
    {
        id: 8,
        name: "Mataró Parc",
        region: "Mataro",
        coordinates: {
            lat: 41.554726,
            lng: 2.433179,
        },
        media: [
            {
                id: 1,
                audioS3Key: "mataro/audio/mall_01.aac",
                videoS3Key: "mataro/video/mall_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "mataro/audio/mall_02.aac",
                videoS3Key: "mataro/video/mall_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "mataro/audio/mall_03.aac",
                videoS3Key: "mataro/video/mall_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "mataro/audio/mall_04.aac",
                videoS3Key: "mataro/video/mall_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "mataro/audio/mall_05.aac",
                videoS3Key: "mataro/video/mall_05.mp4",
            },
        ],
    },
    {
        id: 9,
        name: "Forest",
        region: "Mataro",
        coordinates: {
            lat: 41.582823,
            lng: 2.435417,
        },
        media: [
            {
                id: 1,
                audioS3Key: "mataro/audio/forest_01.aac",
                videoS3Key: "mataro/video/forest_01.mp4",
            },
            {
                id: 2,
                audioS3Key: "mataro/audio/forest_02.aac",
                videoS3Key: "mataro/video/forest_02.mp4",
            },
            {
                id: 3,
                audioS3Key: "mataro/audio/forest_03.aac",
                videoS3Key: "mataro/video/forest_03.mp4",
            },
            {
                id: 4,
                audioS3Key: "mataro/audio/forest_04.aac",
                videoS3Key: "mataro/video/forest_04.mp4",
            },
            {
                id: 5,
                audioS3Key: "mataro/audio/forest_05.aac",
                videoS3Key: "mataro/video/forest_05.mp4",
            },
        ],
    },
];
export async function getRandomLocationWithMedia(): Promise<{
    location: Location;
    mediaItem: MediaItem;
}> {
    // Create a flat array of all media items with their location info
    // This ensures equal probability for every media item regardless of location size
    const allMediaItems: Array<{ location: Location; mediaItem: MediaItem }> =
        [];

    for (const location of locationData) {
        for (const media of location.media) {
            allMediaItems.push({
                location,
                mediaItem: { ...media },
            });
        }
    } // Select a random item from the flattened array
    const randomIndex = Math.floor(Math.random() * allMediaItems.length);
    const { location, mediaItem } = allMediaItems[randomIndex];

    // Check if we should use local files instead of S3 API
    if (USE_LOCAL_FILES) {
        // Use local files from public folder
        mediaItem.audioUrl = `/${mediaItem.audioS3Key}`;
        if (mediaItem.videoS3Key) {
            mediaItem.videoUrl = `/${mediaItem.videoS3Key}`;
        }
        return { location, mediaItem };
    }

    try {
        // Generate signed URLs from the API endpoint
        const audioResponse = await fetch("/api/s3/url", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: mediaItem.audioS3Key }),
        });

        let videoResponse: Response;
        if (mediaItem.videoS3Key) {
            videoResponse = await fetch("/api/s3/url", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ key: mediaItem.videoS3Key }),
            });
        }

        if (
            !audioResponse.ok ||
            (mediaItem.videoS3Key && videoResponse && !videoResponse.ok)
        ) {
            throw new Error("Failed to fetch signed URLs");
        }

        const audioData = await audioResponse.json();
        const videoData =
            mediaItem.videoS3Key && videoResponse
                ? await videoResponse.json()
                : null;

        // Use the signed URLs from the API
        mediaItem.audioUrl = audioData.url;
        if (videoData) {
            mediaItem.videoUrl = videoData.url;
        }
    } catch (error) {
        console.error("Error generating signed URLs:", error);
        // Fallback to local paths if API fails
        mediaItem.audioUrl = `/${mediaItem.audioS3Key}`;
        if (mediaItem.videoS3Key) {
            mediaItem.videoUrl = `/${mediaItem.videoS3Key}`;
        }
    }

    return { location, mediaItem };
}
