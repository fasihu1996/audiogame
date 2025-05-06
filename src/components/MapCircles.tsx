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

export default function MapCircles() {
    // Fix Leaflet icons
    useMemo(fixLeafletIcons, []);

    // Center coordinates for Brandenburg and Mataro
    const brandenburgCenter = {
        lat: 52.3906,
        lng: 13.0645,
    };

    const mataroCenter = {
        lat: 41.5296,
        lng: 2.4445,
    };

    // Create custom label icon
    const createCustomLabel = (text: string) =>
        divIcon({
            html: `<div style="font-family: cursive; font-size: 24px; font-weight: bold;">${text}</div>`,
            className: "custom-map-label",
            iconSize: [100, 40],
            iconAnchor: [50, 20],
        });

    // Map options
    const mapOptions = {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        attributionControl: false,
        zoom: 12,
    };

    return (
        <>
            {/* Left circle map (Brandenburg) */}
            <div className="absolute left-0 transform -translate-x-1/2">
                <div className="relative">
                    <MapContainer
                        center={[brandenburgCenter.lat, brandenburgCenter.lng]}
                        {...mapOptions}
                        className="rounded-full w-[500px] h-[500px] border border-gray-200 shadow-lg"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                            position={[
                                brandenburgCenter.lat,
                                brandenburgCenter.lng,
                            ]}
                            icon={createCustomLabel("Brandenburg")}
                        />
                    </MapContainer>
                    <div className="absolute top-1/4 left-0 w-full text-center pointer-events-none">
                        <p className="text-sm opacity-70 rotate-[-20deg] font-handwriting">
                            clickable
                            <br />
                            to get to map
                        </p>
                    </div>
                </div>
            </div>

            {/* Right circle map (Mataro) */}
            <div className="absolute right-0 transform translate-x-1/2">
                <div className="relative">
                    <MapContainer
                        center={[mataroCenter.lat, mataroCenter.lng]}
                        {...mapOptions}
                        className="rounded-full w-[500px] h-[500px] border border-gray-200 shadow-lg"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                            position={[mataroCenter.lat, mataroCenter.lng]}
                            icon={createCustomLabel("Mataró")}
                        />
                    </MapContainer>
                    <div className="absolute top-1/4 right-0 w-full text-center pointer-events-none">
                        <p className="text-sm opacity-70 rotate-[20deg] font-handwriting">
                            clickable
                            <br />
                            to get to map
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
