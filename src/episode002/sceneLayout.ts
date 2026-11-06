/** Geometri/penempatan Episode 002: tidak mengubah Episode 001. */

/** Radius EP001 = 3; awal EP002 sebelumnya 4.8; baru 11.7 => ~5.94x luas. */
export const ISLAND_EXPANDED_SCALE = 3.9;
export const HOUSE_SCALE = 1.65;
export const FIELD_SCALE = 1.9;

/** Menghadap kamera sama seperti FACE_CAMERA di src/timeline.ts (PI/4). */
const FACING = Math.PI / 4;
export const HOUSE_SPOT = {position: [-5.0, 0, -1.0] as [number, number, number], rotationY: FACING};
export const FIELD_SPOT = {position: [4.9, 0, -2.6] as [number, number, number], rotationY: FACING};
