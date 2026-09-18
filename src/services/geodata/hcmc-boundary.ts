// Official approximated administrative boundary for Ho Chi Minh City
export const HCMC_BOUNDARY_COORDINATES: [number, number][] = [
  [106.37, 11.16], // Northwest Cu Chi border with Tay Ninh
  [106.49, 11.19],
  [106.60, 11.14],
  [106.72, 11.02], // North border with Binh Duong
  [106.82, 10.95],
  [106.89, 10.91], // Northeast border with Dong Nai
  [106.86, 10.84], // Thu Duc - Dong Nai River
  [106.88, 10.77],
  [106.94, 10.68], // Nha Be - Dong Nai boundary
  [107.02, 10.58], // Can Gio northern mangrove
  [107.03, 10.42], // Can Gio coastal tip
  [106.91, 10.37], // South China Sea coastline
  [106.83, 10.45], // Soai Rap river mouth
  [106.74, 10.58], // Can Gio - Long An boundary
  [106.63, 10.62], // Nha Be - Long An boundary
  [106.51, 10.66], // Binh Chanh south border
  [106.43, 10.71], // Binh Chanh west border with Long An
  [106.40, 10.82], // Binh Chanh - Hoc Mon
  [106.41, 10.96], // Hoc Mon - Cu Chi
  [106.37, 11.16], // Close polygon
];

// Inverted polygon: Outer box covering Southern Vietnam with HCMC as a hole
export const HCMC_OUTSIDE_MASK_GEOJSON = {
  type: 'Feature' as const,
  properties: {},
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      // Outer ring
      [
        [103.0, 8.0],
        [110.0, 8.0],
        [110.0, 13.0],
        [103.0, 13.0],
        [103.0, 8.0],
      ],
      // Inner hole (HCMC boundary in reverse winding order)
      [...HCMC_BOUNDARY_COORDINATES].reverse(),
    ],
  },
};

export const HCMC_BOUNDARY_LINE_GEOJSON = {
  type: 'Feature' as const,
  properties: { name: 'Ranh giới TP. Hồ Chí Minh' },
  geometry: {
    type: 'LineString' as const,
    coordinates: HCMC_BOUNDARY_COORDINATES,
  },
};
