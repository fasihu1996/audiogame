import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { locationData } from "@/lib/data";
import { createAudioMarker } from "./AudioMarker";
import { AudioPopup } from "./AudioPopup";
import { useRouter } from "@/i18n/navigation";
import { defaults as defaultInteractions } from "ol/interaction";
import type Interaction from "ol/interaction/Interaction";

interface MediaItem {
    id: number;
    audioS3Key: string;
    videoS3Key?: string;
    audioUrl?: string;
    videoUrl?: string;
}

interface SelectedFeature {
    name: string;
    media: MediaItem[];
    coordinates: number[];
}

interface FlatMapProps {
    lat: number;
    lon: number;
    zoom?: number;
    className?: string;
    isFullPage?: boolean;
    currentRegion?: string;
}

function FlatMap({
    lat,
    lon,
    zoom = 12,
    className = "",
    isFullPage = false,
    currentRegion,
}: FlatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);
    const [selectedFeature, setSelectedFeature] =
        useState<SelectedFeature | null>(null);
    const overlayRef = useRef<Overlay | null>(null);
    const originalInteractions = useRef<Interaction[]>([]);

    // Cleanup function
    const cleanup = () => {
        if (mapInstance.current) {
            mapInstance.current.setTarget(undefined);
        }
        if (overlayRef.current) {
            overlayRef.current.setPosition(undefined);
        }
        setSelectedFeature(null);
    };

    const router = useRouter();

    // Helper to fetch signed URLs for all media items
    async function fetchSignedMedia(media: MediaItem[]): Promise<MediaItem[]> {
        return Promise.all(
            media.map(async (item) => {
                let audioUrl = item.audioUrl;
                if (!audioUrl && item.audioS3Key) {
                    try {
                        const res = await fetch("/api/s3/url", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ key: item.audioS3Key }),
                        });
                        const data = await res.json();
                        audioUrl = data.url;
                    } catch (e) {
                        audioUrl = `/${item.audioS3Key}`;
                        console.log(e);
                    }
                }
                return { ...item, audioUrl };
            })
        );
    }

    useEffect(() => {
        if (!mapRef.current || !popupRef.current) return;

        // Create popup overlay
        overlayRef.current = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            stopEvent: false,
            offset: [0, -10],
        });

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        // Add markers for the current region
        if (isFullPage) {
            locationData.forEach((location) => {
                const marker = createAudioMarker({
                    id: location.id,
                    lat: location.coordinates.lat,
                    lng: location.coordinates.lng,
                    name: location.name,
                    audioUrl: location.media[0]?.audioS3Key || "",
                });
                marker.set("media", location.media);
                vectorSource.addFeature(marker);
            });
        }

        mapInstance.current = new Map({
            target: mapRef.current,
            layers: [new TileLayer({ source: new OSM() }), vectorLayer],
            view: new View({
                center: fromLonLat([lon, lat]),
                zoom,
                rotation: 0,
                enableRotation: isFullPage,
            }),
            controls: [],
            overlays: [overlayRef.current],
            interactions: isFullPage ? defaultInteractions() : [],
        });

        // Store original interactions for later restoration
        originalInteractions.current = mapInstance.current
            .getInteractions()
            .getArray()
            .slice() as Interaction[];

        mapInstance.current.on("click", async (event) => {
            // Prevent closing the popup if the click is inside the popup
            const domEvent = event.originalEvent as MouseEvent;
            if (
                popupRef.current &&
                domEvent.target instanceof Node &&
                popupRef.current.contains(domEvent.target)
            ) {
                return; // Click was inside the popup, do nothing
            }

            const feature = mapInstance.current?.forEachFeatureAtPixel(
                event.pixel,
                (feature) => feature
            );
            if (feature) {
                const media = feature.get("media"); // array of media items
                const geometry = feature.getGeometry();
                let coordinates: number[] = [];
                if (geometry && geometry instanceof Point) {
                    coordinates = geometry.getCoordinates();
                }
                // Fetch signed URLs for all media items
                const signedMedia = await fetchSignedMedia(media);
                setSelectedFeature({
                    name: feature.get("name"),
                    media: signedMedia,
                    coordinates,
                });
                // Set the overlay position so the popup is visible
                overlayRef.current?.setPosition(coordinates);
            } else {
                // Hide popup if clicking elsewhere
                overlayRef.current?.setPosition(undefined);
                setSelectedFeature(null);
            }
        });

        // Force map resize after initialization
        setTimeout(() => {
            mapInstance.current?.updateSize();
        }, 100);

        return cleanup;
    }, [lat, lon, zoom, isFullPage, currentRegion, router]);

    // Disable interactions when popup is open, re-enable when closed
    useEffect(() => {
        if (!isFullPage || !mapInstance.current) return;
        if (selectedFeature) {
            // Remove all interactions
            mapInstance.current.getInteractions().clear();
        } else {
            // Restore original interactions
            if (originalInteractions.current) {
                originalInteractions.current.forEach((interaction) => {
                    if (
                        !mapInstance
                            .current!.getInteractions()
                            .getArray()
                            .includes(interaction)
                    ) {
                        mapInstance.current!.addInteraction(interaction);
                    }
                });
            }
        }
    }, [selectedFeature, isFullPage]);

    return (
        <>
            <div
                ref={mapRef}
                className={`w-full ${
                    isFullPage ? "h-screen" : ""
                } ${className}`}
                style={{
                    ...(isFullPage
                        ? { minHeight: "100vh" }
                        : { height: "100%" }),
                    aspectRatio: isFullPage ? "auto" : "1",
                }}
            />
            <div ref={popupRef} className="absolute z-50">
                {selectedFeature && (
                    <AudioPopup
                        name={selectedFeature.name}
                        media={selectedFeature.media}
                        onClose={() => {
                            setSelectedFeature(null);
                            overlayRef.current?.setPosition(undefined);
                        }}
                    />
                )}
            </div>
        </>
    );
}

export default FlatMap;
