export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface RoomPortal {
  id: string; // Portal ID
  targetRoomId: string;
  position: Vector3; // Center of the portal
  rotation: Vector3; // Euler angles
  dimensions: { width: number; height: number }; // Doorway size
}

export interface RoomGeometry {
  width: number;
  height: number;
  depth: number;
  position?: Vector3;
}

export interface RoomConfig {
  id: string;
  name: string;
  geometry: RoomGeometry;
  gravity: Vector3;
  dominantColor: string;
  ambientSound?: string;
  portals: RoomPortal[];
  content?: Record<string, any>;
  hasCeiling?: boolean;
}
