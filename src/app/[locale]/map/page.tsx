"use client";

import FlatMap from "@/components/FlatMap";

function MapPage() {
    return (
        <div className="w-full h-full z-0">
            <FlatMap lat={52.4106} lon={12.5445} zoom={16} />
        </div>
    );
}

export default MapPage;
