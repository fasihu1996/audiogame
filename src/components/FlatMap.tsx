import { useEffect, useRef } from "react";
import Map from "ol/Map.js";
import View from "ol/View.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import { fromLonLat } from "ol/proj.js";

interface FlatMapProps {
    lat: number;
    lon: number;
    zoom?: number;
    className?: string;
    isFullPage?: boolean;
}

function FlatMap({
    lat,
    lon,
    zoom = 12,
    className = "",
    isFullPage = false,
}: FlatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new Map({
            target: mapRef.current,
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({
                center: fromLonLat([lon, lat]),
                zoom,
                rotation: 0,
                enableRotation: isFullPage,
            }),
            controls: [],
            interactions: isFullPage ? undefined : [],
        });

        // Force a map resize after initialization
        setTimeout(() => {
            map.updateSize();
        }, 100);

        return () => {
            map.setTarget(undefined);
        };
    }, [lat, lon, zoom, isFullPage]);

    return (
        <div
            ref={mapRef}
            className={`w-full ${isFullPage ? "h-screen" : ""} ${className}`}
            style={{
                ...(isFullPage ? { minHeight: "100vh" } : { height: "100%" }),
                aspectRatio: isFullPage ? "auto" : "1",
            }}
        />
    );
}

export default FlatMap;
