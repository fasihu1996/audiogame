"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons in Next.js - needs to run only once
function fixLeafletIcons() {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Use dynamic import instead of require
    import("leaflet").then((L) => {
        L.Icon.Default.prototype.options.iconRetinaUrl =
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
        L.Icon.Default.prototype.options.iconUrl =
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
        L.Icon.Default.prototype.options.shadowUrl =
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";
    });
}

interface MapCircleProps {
    center: { lat: number; lng: number };
    markerLabel: string;
    className?: string;
    mapZoom?: number;
}

export default function MapCircle({
    center,
    markerLabel,
    className = "",
    mapZoom = 12,
}: MapCircleProps) {
    useMemo(fixLeafletIcons, []);

    const createCustomLabel = (text: string) =>
        divIcon({
            html: `<div style="font-family: cursive; font-size: 24px; font-weight: bold;">${text}</div>`,
            className: "custom-map-label",
            iconSize: [100, 40],
            iconAnchor: [50, 20],
        });

    const mapOptions = {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        attributionControl: false,
        zoom: mapZoom,
    };

    return (
        <div className={`map-circle-container ${className}`}>
            <MapContainer
                center={[center.lat, center.lng]}
                {...mapOptions}
                className="rounded-full border border-gray-200 shadow-lg w-full h-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                    position={[center.lat, center.lng]}
                    icon={createCustomLabel(markerLabel)}
                />
            </MapContainer>
        </div>
    );
}
// ...existing code...

export function MapCircles() {
    // Center coordinates for Brandenburg and Mataro
    const brandenburgCenter = {
        lat: 52.4106,
        lng: 12.5245,
    };

    const mataroCenter = {
        lat: 41.5296,
        lng: 2.4645,
    };

    return (
        <>
            {/* Left circle map (Brandenburg) */}
            <div className="absolute map-circle-left">
                <MapCircle
                    center={brandenburgCenter}
                    markerLabel="Brandenburg"
                    className="leaflet-round-container"
                />
                <div className="absolute top-1/4 left-0 w-full text-center pointer-events-none">
                    <p className="text-sm opacity-70 rotate-[-20deg] font-handwriting">
                        clickable
                        <br />
                        to get to map
                    </p>
                </div>
            </div>

            {/* Right circle map (Mataro) */}
            <div className="absolute map-circle-right">
                <MapCircle
                    center={mataroCenter}
                    markerLabel="Mataró"
                    className="leaflet-round-container"
                />
                <div className="absolute top-1/4 right-0 w-full text-center pointer-events-none">
                    <p className="text-sm opacity-70 rotate-[20deg] font-handwriting">
                        clickable
                        <br />
                        to get to map
                    </p>
                </div>
            </div>
        </>
    );
}
