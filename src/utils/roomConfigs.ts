import { RoomConfig } from '@/types/room';

export const LOBBY_ROOM: RoomConfig = {
  id: 'lobby',
  name: 'Lobby',
  geometry: { width: 10, height: 5, depth: 10 },
  gravity: { x: 0, y: -9.8, z: 0 },
  dominantColor: '#1A1A1A',
  ambientSound: '/sounds/lobby-ambient.mp3', // Placeholder path
  portals: [
    {
      id: 'lobby-to-red',
      targetRoomId: 'red-room',
      position: { x: 0, y: 0, z: -4.9 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: { width: 2, height: 3 },
    }
  ],
  content: {
    title: 'SKS',
    subtitle: 'THE IMPOSSIBLE BUILDING',
    floorPlanAnimated: true
  }
};

export const RED_ROOM: RoomConfig = {
  id: 'red-room',
  name: 'Skills',
  geometry: { width: 15, height: 6, depth: 15 },
  gravity: { x: 0, y: -9.8, z: 0 },
  dominantColor: '#FF3D00',
  ambientSound: '/sounds/red-ambient.mp3',
  hasCeiling: false, // Infinite upward ceiling illusion
  portals: [
    {
      id: 'red-to-lobby',
      targetRoomId: 'lobby',
      position: { x: 0, y: 0, z: 7.4 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      dimensions: { width: 2, height: 3 },
    },
    {
      id: 'red-to-gallery',
      targetRoomId: 'gallery',
      position: { x: 7.4, y: 0, z: 0 },
      rotation: { x: 0, y: -Math.PI/2, z: 0 },
      dimensions: { width: 2, height: 3 },
    }
  ],
  content: {
    skills: [
      { name: 'JavaScript', proficiency: 0.9, position: {x: -7.4, y: 2, z: 0} },
      { name: 'React', proficiency: 0.8, position: {x: 0, y: 2, z: -7.4} },
      { name: 'Three.js', proficiency: 0.85, position: {x: 7.4, y: 2, z: 4} },
      { name: 'WebGL', proficiency: 0.7, position: {x: -3, y: 2, z: 7.4} },
    ]
  }
};

export const GALLERY_ROOM: RoomConfig = {
  id: 'gallery',
  name: 'Projects',
  geometry: { width: 8, height: 5, depth: 100 }, // Elongated corridor
  gravity: { x: 0, y: -9.8, z: 0 }, // Will be flipped during transition
  dominantColor: '#0A0A0A',
  ambientSound: '/sounds/gallery-ambient.mp3',
  portals: [
    {
      id: 'gallery-to-red',
      targetRoomId: 'red-room',
      position: { x: 0, y: 0, z: 49.9 },
      rotation: { x: 0, y: Math.PI, z: 0 },
      dimensions: { width: 2, height: 3 },
    }
  ],
  content: {
    projects: [
      { id: 'proj1', title: 'Neon Protocol', position: {x: -3.9, y: 2, z: 40} },
      { id: 'proj2', title: 'Void Sync', position: {x: 3.9, y: 2, z: 20} },
      { id: 'proj3', title: 'Brutal UI', position: {x: -3.9, y: 2, z: 0} },
    ]
  }
};

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  'lobby': LOBBY_ROOM,
  'red-room': RED_ROOM,
  'gallery': GALLERY_ROOM
};
