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
}

function FlatMap({ lat, lon, zoom = 12, className = "" }: FlatMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = new Map({
            target: mapRef.current,
            layers: [new TileLayer({ source: new OSM() })],
            view: new View({
                center: fromLonLat([lon, lat]),
                zoom,
            }),
            controls: [],
        });

        return () => {
            map.setTarget(undefined);
        };
    }, [lat, lon, zoom]);

    return <div ref={mapRef} className={`w-full h-screen ${className}`} />;
}

export default FlatMap;
