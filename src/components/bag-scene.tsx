"use client";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, RoundedBox } from "@react-three/drei";
import { CanvasTexture, SRGBColorSpace, type Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { animate, useReducedMotion } from "motion/react";
import { BAG_FINISHES, type BagFinish, type SceneLighting } from "@/lib/scene";
import { BagPoster } from "./bag-poster";
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }; static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0); const complete = useRef(false); const invalidate = useThree(state => state.invalidate);
  useFrame(() => { if (complete.current) return; if (frames.current < 2) { frames.current += 1; invalidate(); } else { complete.current = true; queueMicrotask(onReady); } });
  return null;
}
function Model({ finish, idle }: { finish: BagFinish; idle: boolean }) {
  const group = useRef<Group>(null); const invalidate = useThree(state => state.invalidate);
  const material = BAG_FINISHES.find(item => item.id === finish)!;
  const texture = useMemo(() => { const canvas = document.createElement("canvas"); canvas.width = 1024; canvas.height = 1024; const context = canvas.getContext("2d")!; context.clearRect(0, 0, 1024, 1024); context.fillStyle = material.text; context.textAlign = "center"; context.font = "bold 164px Arial"; context.fillText("V-MART", 512, 510); context.font = "25px Arial"; context.fillText("S T Y L E   I N   M O T I O N", 512, 567); const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; return result; }, [material.text]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => { if (!idle || !group.current) return; const animation = animate(-.25, .12, { duration: 3.8, repeat: 1, repeatType: "reverse", ease: "easeInOut", onUpdate: value => { if (group.current) group.current.rotation.y = value; invalidate(); } }); return () => animation.stop(); }, [idle, invalidate]);
  return <group ref={group} rotation={[.03, -.25, -.11]} position={[0, .05, 0]}><RoundedBox args={[1.65, 1.92, .65]} radius={.065} smoothness={3}><meshPhysicalMaterial color={material.color} metalness={finish === "silver" ? .85 : .56} roughness={.25} clearcoat={.95} clearcoatRoughness={.18}/></RoundedBox>{[1, -1].map(side => <mesh key={side} position={[0, 0, side * .331]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}><planeGeometry args={[1.53, 1.8]}/><meshPhysicalMaterial map={texture} transparent depthWrite={false} metalness={.2} roughness={.44} polygonOffset polygonOffsetFactor={-1}/></mesh>)}{[.205, -.205].map(z => <mesh key={z} position={[0, .92, z]}><torusGeometry args={[.44, .033, 10, 40, Math.PI]}/><meshStandardMaterial color={material.handle} metalness={.82} roughness={.24}/></mesh>)}<mesh position={[0, .965, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.42, .43]}/><meshStandardMaterial color={finish === "scarlet" ? "#64132d" : "#544646"} roughness={.7}/></mesh></group>;
}
function SceneControls({ turn, resetToken, onInteraction }: { turn: number; resetToken: number; onInteraction: () => void }) {
  const controls = useRef<OrbitControlsImpl>(null); const previousTurn = useRef(turn); const invalidate = useThree(state => state.invalidate); const reduced = useReducedMotion();
  useEffect(() => { if (!controls.current || turn === previousTurn.current) return; const difference = turn - previousTurn.current; previousTurn.current = turn; const from = controls.current.getAzimuthalAngle(); const to = from + difference * Math.PI / 6; if (reduced) { controls.current.setAzimuthalAngle(to); controls.current.update(); invalidate(); return; } const animation = animate(from, to, { duration: .45, ease: [.22, 1, .36, 1], onUpdate: value => { controls.current?.setAzimuthalAngle(value); controls.current?.update(); invalidate(); } }); return () => animation.stop(); }, [turn, reduced, invalidate]);
  useEffect(() => { if (resetToken > 0) { controls.current?.reset(); controls.current?.update(); invalidate(); } }, [resetToken, invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom={false} autoRotate={false} enableDamping={!reduced} dampingFactor={.12} rotateSpeed={.65} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.65} onStart={onInteraction}/>;
}
export default function BagScene({ expanded = false, finish = "scarlet", lighting = "studio", turn = 0, resetToken = 0, onAvailabilityChange }: { expanded?: boolean; finish?: BagFinish; lighting?: SceneLighting; turn?: number; resetToken?: number; onAvailabilityChange?: (available: boolean) => void }) {
  const reduced = useReducedMotion(); const [supported, setSupported] = useState(false); const [visible, setVisible] = useState(true); const [interacted, setInteracted] = useState(false); const [lowPower, setLowPower] = useState(true); const [sceneReady, setSceneReady] = useState(false);
  const markReady = useCallback(() => { setSceneReady(true); onAvailabilityChange?.(true); }, [onAvailabilityChange]);
  useEffect(() => { try { const test = document.createElement("canvas"); const context = test.getContext("webgl2") || test.getContext("webgl"); setSupported(!!context); if (!context) onAvailabilityChange?.(false); context?.getExtension("WEBGL_lose_context")?.loseContext(); } catch { setSupported(false); onAvailabilityChange?.(false); } setLowPower(window.innerWidth < 768 || navigator.hardwareConcurrency <= 4); const visibility = () => setVisible(!document.hidden); document.addEventListener("visibilitychange", visibility); return () => document.removeEventListener("visibilitychange", visibility); }, [onAvailabilityChange]);
  const fallback = <BagPoster finish={finish}/>;
  if (!supported) return fallback;
  const idle = !reduced && !lowPower && visible && !interacted && turn === 0 && resetToken === 0;
  return <SceneBoundary fallback={fallback}><div className="bag-canvas-wrap"><Suspense fallback={null}><Canvas role="img" style={{ visibility: sceneReady ? "visible" : "hidden" }} frameloop="demand" dpr={[1, lowPower ? 1 : 1.5]} camera={{ position: [0, .25, 5.1], fov: expanded ? 38 : 37 }} gl={{ alpha: true, antialias: !lowPower, powerPreference: "low-power" }} aria-label={`Interactive ${finish} V-Mart bag. Drag to orbit.`}><ambientLight intensity={lighting === "studio" ? .85 : .35}/><directionalLight position={[3, 5, 4]} intensity={lighting === "studio" ? 3.8 : 2.6}/><directionalLight position={[-3, 1, 2]} intensity={lighting === "studio" ? 1.6 : 3.2} color={lighting === "studio" ? "#ffe3d1" : "#ff476e"}/><Model finish={finish} idle={idle}/><Environment resolution={lowPower ? 64 : 128} frames={1}><Lightformer intensity={3.2} position={[0, 4, 3]} scale={[7, 3, 1]}/><Lightformer intensity={2.5} position={[-4, 1, 3]} rotation={[0, Math.PI / 2, 0]} scale={[3, 7, 1]}/><Lightformer intensity={2} position={[4, 1, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[3, 6, 1]}/></Environment><ContactShadows position={[0, -1.15, 0]} opacity={.35} blur={3} scale={5} far={3} resolution={128} frames={1}/><SceneControls turn={turn} resetToken={resetToken} onInteraction={() => setInteracted(true)}/><FirstFrame onReady={markReady}/></Canvas></Suspense>{!sceneReady && <div className="bag-canvas-poster" aria-hidden="true">{fallback}</div>}</div></SceneBoundary>;
}
