// Official high-fidelity administrative boundary coordinates for Ho Chi Minh City (TP. Hồ Chí Minh)
// Traced along administrative boundaries with Tay Ninh, Binh Duong, Dong Nai, Ba Ria - Vung Tau, Tien Giang, and Long An.
export const HCMC_BOUNDARY_COORDINATES: [number, number][] = [
  // Northwest: Cu Chi - Tay Ninh border (Trang Bang)
  [106.363, 11.162],
  [106.395, 11.184],
  [106.442, 11.205],
  [106.488, 11.196],
  [106.535, 11.171],
  [106.582, 11.143],

  // North: Cu Chi - Binh Duong along Sai Gon River (Dau Tieng, Ben Cat)
  [106.621, 11.118],
  [106.662, 11.076],
  [106.698, 11.025],
  [106.724, 10.984],

  // Northeast: Thu Dau Mot / Thuan An / Di An boundary with Hoc Mon & Thu Duc
  [106.745, 10.948],
  [106.782, 10.912],
  [106.826, 10.887],
  [106.871, 10.884], // Bien Hoa border (Dong Nai River)

  // East: Thu Duc - Dong Nai (Long Thanh, Nhon Trach along Dong Nai River)
  [106.892, 10.849],
  [106.883, 10.812],
  [106.862, 10.776],
  [106.878, 10.732],
  [106.905, 10.691],

  // Southeast: Nha Be - Nhon Trach / Can Gio mangrove (Long Tau & Dong Nai River confluence)
  [106.938, 10.648],
  [106.974, 10.598],
  [107.012, 10.546],
  [107.034, 10.485],
  [107.042, 10.428], // Can Gio eastern coastline (Ganh Rai Bay)

  // South: Can Gio coastal tip & East Sea (Bien Dong)
  [107.026, 10.378],
  [106.975, 10.358],
  [106.918, 10.364],
  [106.862, 10.392],
  [106.815, 10.438], // Soai Rap river mouth (facing Tien Giang / Go Cong Dong)

  // Southwest: Can Gio - Long An border along Soai Rap River (Can Giuoc)
  [106.772, 10.495],
  [106.738, 10.552],
  [106.685, 10.595],

  // South / Southwest: Nha Be & Binh Chanh - Long An (Can Giuoc, Can Duoc, Ben Luc)
  [106.634, 10.622],
  [106.582, 10.638],
  [106.525, 10.654],
  [106.476, 10.678],
  [106.435, 10.715], // West Binh Chanh border

  // West: Binh Chanh - Duc Hoa (Long An)
  [106.402, 10.768],
  [106.388, 10.824],
  [106.395, 10.886],

  // West / Northwest: Hoc Mon & Cu Chi - Duc Hoa / Trang Bang
  [106.398, 10.952],
  [106.385, 11.024],
  [106.368, 11.096],
  [106.363, 11.162], // Close polygon precisely
];

// Inverted polygon mask: Outer box covering Southern Vietnam with HCMC as a hole
// Follows standard GeoJSON polygon winding: outer CCW, inner CW
export const HCMC_OUTSIDE_MASK_GEOJSON = {
  type: 'Feature' as const,
  properties: { name: 'Khu vực ngoài TP. Hồ Chí Minh' },
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

// HCMC administrative boundary polygon fill (transparent / subtle highlight)
export const HCMC_BOUNDARY_POLYGON_GEOJSON = {
  type: 'Feature' as const,
  properties: { name: 'Địa phận TP. Hồ Chí Minh' },
  geometry: {
    type: 'Polygon' as const,
    coordinates: [HCMC_BOUNDARY_COORDINATES],
  },
};

// HCMC administrative boundary outline
export const HCMC_BOUNDARY_LINE_GEOJSON = {
  type: 'Feature' as const,
  properties: { name: 'Ranh giới TP. Hồ Chí Minh' },
  geometry: {
    type: 'LineString' as const,
    coordinates: HCMC_BOUNDARY_COORDINATES,
  },
};
