import {Box3, MathUtils, Vector3} from 'three';
import type {Object3D, PerspectiveCamera} from 'three';

export function boundsFor(scene: Object3D, names: readonly string[]): Box3 {
  scene.updateMatrixWorld(true);
  const result = new Box3();
  scene.traverse(object => {
    if (object.visible && names.includes(object.name)) result.union(new Box3().setFromObject(object));
  });
  return result;
}

export function fitView(box: Box3, camera: PerspectiveCamera, direction = new Vector3(.78, .57, 1)) {
  const centre = box.getCenter(new Vector3()), radius = Math.max(.5, box.getSize(new Vector3()).length() / 2);
  const vertical = MathUtils.degToRad(camera.fov / 2), horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
  const distance = radius / Math.sin(Math.min(vertical, horizontal)) * 1.12;
  return {target: centre, position: centre.clone().add(direction.normalize().multiplyScalar(distance))};
}

export type SchoolView = 'campus' | 'ground' | 'upper' | 'corridor';
export const SCHOOL_VIEWS: Record<Exclude<SchoolView, 'campus'>, {name: string; target: readonly [number, number, number]; offset: readonly [number, number, number]}> = {
  ground: {name: 'Lantai 1 · Kelas A01', target: [-20, 1.65, -22], offset: [5.6, 4.3, 7.6]},
  upper: {name: 'Lantai 2 · Kelas A02', target: [-20, 5.2, -22], offset: [5.4, 3.8, 7.6]},
  corridor: {name: 'Foyer & koridor A', target: [-20, 1.75, -17.7], offset: [5.0, 2.8, 6.0]},
};
