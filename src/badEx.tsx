export default function MapCircles() {
    const leftMapRef = useRef<HTMLDivElement>(null);
    const rightMapRef = useRef<HTMLDivElement>(null);

    // Center coordinates for Brandenburg and Mataro
    const brandenburgCenter = {
        lat: 52.3906,
        lng: 13.0645,
    };

    const mataroCenter = {
        lat: 41.5296,
        lng: 2.4445,
    };

    useLayoutEffect(() => {
        // Exit early if refs aren't available yet
        if (!leftMapRef.current || !rightMapRef.current) return;

        // Required for proper loading of Leaflet icons
        const fixLeafletIcon = () => {
            L.Icon.Default.prototype.options.iconRetinaUrl =
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png";
            L.Icon.Default.prototype.options.iconUrl =
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png";
            L.Icon.Default.prototype.options.shadowUrl =
                "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png";
        };

        fixLeafletIcon();

        // Initialize Brandenburg map
        const leftMap = L.map(leftMapRef.current, {
            center: [brandenburgCenter.lat, brandenburgCenter.lng],
            zoom: 12,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            attributionControl: false,
        });

        // Initialize Mataro map
        const rightMap = L.map(rightMapRef.current, {
            center: [mataroCenter.lat, mataroCenter.lng],
            zoom: 12,
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            attributionControl: false,
        });

        // Add OpenStreetMap tiles
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {}
        ).addTo(leftMap);
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {}
        ).addTo(rightMap);

        // Add city labels
        const createCustomLabel = (text: string) => {
            const label = L.divIcon({
                html: `<div style="font-family: cursive; font-size: 24px; font-weight: bold;">${text}</div>`,
                className: "custom-map-label",
                iconSize: [100, 40],
                iconAnchor: [50, 20],
            });
            return label;
        };

        L.marker([brandenburgCenter.lat, brandenburgCenter.lng], {
            icon: createCustomLabel("Brandenburg"),
        }).addTo(leftMap);

        L.marker([mataroCenter.lat, mataroCenter.lng], {
            icon: createCustomLabel("Mataró"),
        }).addTo(rightMap);

        // Clean up on unmount
        return () => {
            leftMap.remove();
            rightMap.remove();
        };
    }, [
        brandenburgCenter.lat,
        brandenburgCenter.lng,
        mataroCenter.lat,
        mataroCenter.lng,
    ]);

    return (
        <>
            {/* Left circle map (Brandenburg) */}
            <div className="absolute left-0 transform -translate-x-1/2">
                <div className="relative">
                    <div
                        ref={leftMapRef}
                        className="rounded-full w-[500px] h-[500px] border border-gray-200 shadow-lg"
                        style={{ minWidth: 500, minHeight: 500 }}
                    />
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
                    <div
                        ref={rightMapRef}
                        className="rounded-full w-[500px] h-[500px] border border-gray-200 shadow-lg"
                        style={{ minWidth: 500, minHeight: 500 }}
                    />
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
