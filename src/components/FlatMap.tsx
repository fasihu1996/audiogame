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

interface SelectedFeature {
    name: string;
    media: Array<{
        id: number;
        audioS3Key: string;
        videoS3Key?: string;
        audioUrl?: string;
        videoUrl?: string;
    }>;
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
            interactions: isFullPage ? undefined : [],
        });

        mapInstance.current.on("click", (event) => {
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
                setSelectedFeature({
                    name: feature.get("name"),
                    media, // now matches the new SelectedFeature type
                    coordinates,
                });
            }
        });

        // Force map resize after initialization
        setTimeout(() => {
            mapInstance.current?.updateSize();
        }, 100);

        return cleanup;
    }, [lat, lon, zoom, isFullPage, currentRegion, router]);

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
