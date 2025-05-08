import { Feature } from "ol";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Style, Icon } from "ol/style";

interface AudioMarkerProps {
    id: number;
    lat: number;
    lng: number;
    name: string;
    audioUrl: string;
}

export const createAudioMarker = ({
    lat,
    lng,
    name,
    audioUrl,
}: AudioMarkerProps) => {
    const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
        name,
        audioUrl,
    });

    feature.setStyle(
        new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: "/audio-marker.png",
                scale: 0.1,
            }),
        })
    );

    return feature;
};
