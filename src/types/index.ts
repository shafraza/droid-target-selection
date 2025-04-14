export interface Coordinates {
    x: number;
    y: number;
  }
  
  export interface Enemies {
    type: 'soldier' | 'mech';
    number: number;
  }
  
  export interface ScanPoint {
    coordinates: Coordinates;
    enemies: Enemies;
    allies?: number;
  }
  
  export interface RadarData {
    protocols: Protocol[];
    scan: ScanPoint[];
  }
  
  export type Protocol = 
    | 'closest-enemies'
    | 'furthest-enemies'
    | 'assist-allies'
    | 'avoid-crossfire'
    | 'prioritize-mech'
    | 'avoid-mech';