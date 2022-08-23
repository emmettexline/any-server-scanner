/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three';
import React, { useImperativeHandle, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		Cube: THREE.Mesh;
		Cube001: THREE.Mesh;
		Cube002: THREE.Mesh;
		Cube003: THREE.Mesh;
		Cube004: THREE.Mesh;
		Cube005: THREE.Mesh;
	};
	materials: {};
};

// FIX: Fix types here
// @ts-ignore
const SlimModel = (props: JSX.IntrinsicElements['group'], ref) => {
	const { nodes, materials } = useGLTF('/models/slim.glb') as GLTFResult;
	const bodyRef = useRef<THREE.Group>(null!);
	const headRef = useRef<THREE.Mesh>(null!);
	useImperativeHandle(ref, () => ({
		moveBody: (x: number) => {
			bodyRef.current.rotation.y = x / 100;
		},
		moveHead: (y: number) => {
			headRef.current.rotation.x = -y / 200;
		},
	}));
	return (
		<group ref={bodyRef} {...props} dispose={null}>
			{/* Right leg */}
			<mesh
				geometry={nodes.Cube.geometry}
				position={[-0.1, 0.4, -0.04]}
				scale={[2.18, 2.31, 0.67]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* Left leg */}
			<mesh
				geometry={nodes.Cube001.geometry}
				position={[0.15, 0.4, -0.04]}
				scale={[2.18, 2.31, 0.67]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* Torso */}
			<mesh
				geometry={nodes.Cube002.geometry}
				position={[0.02, 1.15, -0.04]}
				scale={[4.36, 2.31, 0.67]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* Right arm */}
			<mesh
				geometry={nodes.Cube003.geometry}
				position={[-0.323, 1.15, -0.04]}
				scale={[1.64, 2.31, 0.67]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* Left arm*/}
			<mesh
				geometry={nodes.Cube004.geometry}
				position={[0.365, 1.15, -0.04]}
				scale={[1.64, 2.31, 0.67]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
			{/* Head */}
			<mesh
				ref={headRef}
				geometry={nodes.Cube005.geometry}
				position={[0.02, 1.78, -0.04]}
				scale={[4.36, 1.54, 1.34]}
			>
				<meshStandardMaterial color='hotpink' />
			</mesh>
		</group>
	);
};

export default React.forwardRef(SlimModel);

useGLTF.preload('/models/slim.glb');
