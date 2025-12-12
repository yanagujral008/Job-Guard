import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import gsap from 'gsap';

interface Particle {
  x: number;
  y: number;
  z: number;
  xSpeed: number;
  ySpeed: number;
  zSpeed: number;
  size: number;
  color: THREE.Color;
  mesh: THREE.Mesh;
}

interface ThreeBackgroundProps {
  // Add any props your component needs
}

const ThreeBackground: React.FC<ThreeBackgroundProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const clockRef = useRef(new THREE.Clock());

  // Create particle geometry and material
  const createParticle = useCallback((scene: THREE.Scene) => {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(`hsl(${Math.random() * 60 + 200}, 70%, 60%)`),
      transparent: true,
      opacity: 0.8,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position in a sphere
    const radius = 10 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    mesh.position.set(x, y, z);
    
    const particle: Particle = {
      x, y, z,
      xSpeed: (Math.random() - 0.5) * 0.02,
      ySpeed: (Math.random() - 0.5) * 0.02,
      zSpeed: (Math.random() - 0.5) * 0.02,
      size: 0.1 + Math.random() * 0.2,
      color: new THREE.Color(`hsl(${Math.random() * 60 + 200}, 70%, 60%)`),
      mesh
    };
    
    scene.add(mesh);
    return particle;
  }, []);

  // Handle mouse move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouseRef.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    };
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !composerRef.current) return;
    
    cameraRef.current.aspect = window.innerWidth / window.innerHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    composerRef.current.setSize(window.innerWidth, window.innerHeight);
  }, []);

  useEffect(() => {
    if (!mountRef.current || isMounted) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    
    // Set renderer properties
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    
    // Add renderer to DOM
    mountRef.current.appendChild(renderer.domElement);
    
    // Setup post-processing
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(fxaaPass);
    
    // Camera position
    camera.position.z = 15;
    
    // Create particles
    const particles: Particle[] = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(scene));
    }
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clockRef.current.getDelta();
      const time = clockRef.current.getElapsedTime();
      
      // Update particles
      particles.forEach((particle, i) => {
        // Move particles
        particle.x += particle.xSpeed;
        particle.y += particle.ySpeed;
        particle.z += particle.zSpeed;
        
        // Bounce off walls
        const radius = 15;
        const distance = Math.sqrt(
          particle.x * particle.x + 
          particle.y * particle.y + 
          particle.z * particle.z
        );
        
        if (distance > radius) {
          // Normalize and invert direction
          const factor = radius / distance * 0.8;
          particle.x *= factor;
          particle.y *= factor;
          particle.z *= factor;
          
          // Reverse speed
          particle.xSpeed *= -1;
          particle.ySpeed *= -1;
          particle.zSpeed *= -1;
        }
        
        // Update mesh position
        particle.mesh.position.set(particle.x, particle.y, particle.z);
        
        // Pulsing effect
        const scale = 0.8 + Math.sin(time * 0.5 + i) * 0.2;
        particle.mesh.scale.set(scale, scale, scale);
        
        // Color change over time
        if (Math.random() < 0.01) {
          (particle.mesh.material as THREE.MeshBasicMaterial).color.lerp(
            new THREE.Color(`hsl(${Math.random() * 60 + 200}, 70%, 60%)`),
            0.1
          );
        }
      });
      
      // Rotate camera slightly based on mouse position
      if (cameraRef.current) {
        cameraRef.current.rotation.x += (mouseRef.current.y * 0.5 - cameraRef.current.rotation.x) * 0.02;
        cameraRef.current.rotation.y += (mouseRef.current.x * 0.5 - cameraRef.current.rotation.y) * 0.02;
      }
      
      // Render scene with post-processing
      composer.render();
    };
    
    // Set refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    composerRef.current = composer;
    particlesRef.current = particles;
    
    // Start animation
    animate();
    setIsMounted(true);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of all geometries and materials
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else if (mesh.material) {
            (mesh.material as THREE.Material).dispose();
          }
        }
      });
      
      if (renderer) renderer.dispose();
      if (composer) composer.dispose();
    };
  }, [isMounted, createParticle, handleMouseMove, handleResize]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        overflow: 'hidden',
        opacity: 0.5,
        background: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
      }} 
    />
  );
};

export default ThreeBackground;
