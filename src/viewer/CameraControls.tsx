import React, {useEffect, useMemo, useRef} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {MOUSE, PerspectiveCamera, Vector3} from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {WORLD_LANDMARKS} from '../world/current';
import {boundsFor, fitView, SCHOOL_VIEWS} from './navigation.ts';
import type {SchoolView} from './navigation.ts';

export type FocusRequest = {id: string | null; sequence: number; schoolView: SchoolView};
export const CameraControls: React.FC<{focus: FocusRequest; onReady: () => void; onBounds: (text: string) => void}> = ({focus, onReady, onBounds}) => {
  const {camera, gl, scene, invalidate} = useThree();
  const controls = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl]);
  const tween = useRef<{start: number; from: Vector3; fromTarget: Vector3; position: Vector3; target: Vector3} | null>(null);
  const booted = useRef(false);
  useEffect(() => {
    controls.enableDamping = true;
    controls.dampingFactor = .12;
    controls.rotateSpeed = .65;
    controls.panSpeed = .8;
    controls.zoomSpeed = .85;
    controls.minDistance = .65;
    controls.maxDistance = 650;
    controls.maxPolarAngle = Math.PI * .97;
    controls.screenSpacePanning = true;
    controls.mouseButtons = {LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN};
    const change = () => invalidate();
    const start = () => {tween.current = null;};
    controls.addEventListener('change', change);
    controls.addEventListener('start', start);
    return () => {controls.removeEventListener('change', change); controls.removeEventListener('start', start); controls.dispose();};
  }, [controls, invalidate]);
  useEffect(() => {
    const landmark = WORLD_LANDMARKS.find(a => a.id === focus.id);
    const box = boundsFor(scene, landmark?.sceneNames ?? ['post-ep005-world']);
    if (box.isEmpty() || !(camera instanceof PerspectiveCamera)) return;
    const pose = fitView(box, camera);
    if (focus.id === 'school' && focus.schoolView !== 'campus') {
      const view = SCHOOL_VIEWS[focus.schoolView];
      pose.target.set(...view.target);
      pose.position.copy(pose.target).add(new Vector3(...view.offset));
    }
    const size = box.getSize(new Vector3());
    onBounds(`${size.x.toFixed(1)} × ${size.y.toFixed(1)} × ${size.z.toFixed(1)} unit`);
    if (!booted.current) {
      camera.position.copy(pose.position); controls.target.copy(pose.target); controls.update();
      booted.current = true; onReady();
    } else tween.current = {start: performance.now(), from: camera.position.clone(), fromTarget: controls.target.clone(), ...pose};
    invalidate();
  }, [focus, camera, controls, scene, invalidate, onReady, onBounds]);
  useFrame(() => {
    const t = tween.current;
    if (t) {
      const progress = Math.min(1, (performance.now() - t.start) / 650), ease = 1 - (1 - progress) ** 3;
      camera.position.lerpVectors(t.from, t.position, ease);
      controls.target.lerpVectors(t.fromTarget, t.target, ease);
      if (progress >= 1) tween.current = null;
      else invalidate();
    }
    controls.update();
  });
  return null;
};
