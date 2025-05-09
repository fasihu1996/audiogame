export const BRANDENBURG_COORDS = {
    lat: 52.4106,
    lon: 12.5245,
    name: "Brandenburg",
} as const;

export const MATARO_COORDS = {
    lat: 41.5396,
    lon: 2.4685,
    name: "Mataró",
} as const;

export type CityCoords = typeof BRANDENBURG_COORDS | typeof MATARO_COORDS;
