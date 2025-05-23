// Define location types for Brandenburg and Mataro
type Region = "Brandenburg" | "Mataro";

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
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/wald_08.mp3",
                videoS3Key: "brandenburg/video/wald_08.mp4",
            },
            {
                id: 3,
                audioS3Key: "brandenburg/audio/wald_09.mp3",
                videoS3Key: "brandenburg/video/wald_09.mp4",
            },
            {
                id: 4,
                audioS3Key: "brandenburg/audio/wald_10.mp3",
                videoS3Key: "brandenburg/video/wald_10.mp4",
            },
            {
                id: 5,
                audioS3Key: "brandenburg/audio/wald_11.mp3",
                videoS3Key: "brandenburg/video/wald_11.mp4",
            },
            {
                id: 6,
                audioS3Key: "brandenburg/audio/wald_12.mp3",
                videoS3Key: "brandenburg/video/wald_12.mp4",
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
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
            },
            {
                id: 2,
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
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
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
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
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
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
                audioS3Key: "brandenburg/audio/wald_07.mp3",
                videoS3Key: "brandenburg/video/wald_07.mp4",
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
                audioS3Key: "brandenburg/audio/city_02.mp3",
                videoS3Key: "brandenburg/video/city_02.mp4",
            },
        ],
    },
    {
        id: 7,
        name: "Forest",
        region: "Mataro",
        coordinates: {
            lat: 41.58409,
            lng: 2.43437,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/city_02.mp3",
                videoS3Key: "brandenburg/video/city_02.mp4",
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
                audioS3Key: "brandenburg/audio/city_02.mp3",
                videoS3Key: "brandenburg/video/city_02.mp4",
            },
        ],
    },
    {
        id: 9,
        name: "Tecno Campus",
        region: "Mataro",
        coordinates: {
            lat: 41.527927,
            lng: 2.434416,
        },
        media: [
            {
                id: 1,
                audioS3Key: "brandenburg/audio/city_02.mp3",
                videoS3Key: "brandenburg/video/city_02.mp4",
            },
        ],
    },
];
export async function getRandomLocationWithMedia(): Promise<{
    location: Location;
    mediaItem: MediaItem;
}> {
    // Get a random location
    const locationIndex = Math.floor(Math.random() * locationData.length);
    const location = locationData[locationIndex];

    // Get a random media item from this location
    const mediaIndex = Math.floor(Math.random() * location.media.length);
    const mediaItem = { ...location.media[mediaIndex] };

    try {
        // Generate signed URLs from the API endpoint
        const audioResponse = await fetch("/api/s3/url", {
            // Note the correct path
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: mediaItem.audioS3Key }),
        });

        const videoResponse = await fetch("/api/s3/url", {
            // Note the correct path
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: mediaItem.videoS3Key }),
        });

        if (!audioResponse.ok || !videoResponse.ok) {
            throw new Error("Failed to fetch signed URLs");
        }

        //const audioData = await audioResponse.json();
        //const videoData = await videoResponse.json();

        // Update the S3 bucket policy to allow public read access
        // Then modify getRandomLocationWithMedia() to use direct URLs:

        mediaItem.audioUrl = `https://audiogame.fsn1.your-objectstorage.com/${mediaItem.audioS3Key}`;
        mediaItem.videoUrl = `https://audiogame.fsn1.your-objectstorage.com/${mediaItem.videoS3Key}`;
    } catch (error) {
        console.error("Error generating signed URLs:", error);
        // Fallback to local paths if API fails - Fix the path here too
        mediaItem.audioUrl = `/${mediaItem.audioS3Key}`; // Removed '/public'
        mediaItem.videoUrl = `/${mediaItem.videoS3Key}`; // Removed '/public'
    }

    return { location, mediaItem };
}
