import { ScanPoint, Protocol } from '../types';
import { calculateDistance } from '../utils/distanceCalculator';

const ORIGIN: { x: number; y: number } = { x: 0, y: 0 };
const MAX_ATTACK_DISTANCE = 100;

// Strategy pattern for protocols
interface ProtocolStrategy {
  filter: (points: ScanPoint[]) => ScanPoint[];
  sort: (points: ScanPoint[]) => ScanPoint[];
}

const protocolStrategies: Record<Protocol, ProtocolStrategy> = {
  'closest-enemies': {
    filter: (points) => points,
    sort: (points) => 
      [...points].sort((a, b) => 
        calculateDistance(ORIGIN, a.coordinates) - calculateDistance(ORIGIN, b.coordinates)
      )
  },
  'furthest-enemies': {
    filter: (points) => points,
    sort: (points) => 
      [...points].sort((a, b) => 
        calculateDistance(ORIGIN, b.coordinates) - calculateDistance(ORIGIN, a.coordinates)
      )
  },
  'assist-allies': {
    filter: (points) => points.filter(point => point.allies !== undefined && point.allies > 0),
    sort: (points) => points
  },
  'avoid-crossfire': {
    filter: (points) => points.filter(point => point.allies === undefined || point.allies === 0),
    sort: (points) => points
  },
  'prioritize-mech': {
    filter: (points) => {
      const mechPoints = points.filter(point => point.enemies.type === 'mech');
      return mechPoints.length > 0 ? mechPoints : points;
    },
    sort: (points) => points
  },
  'avoid-mech': {
    filter: (points) => points.filter(point => point.enemies.type !== 'mech'),
    sort: (points) => points
  }
};

export const processProtocols = (points: ScanPoint[], protocols: Protocol[]): ScanPoint[] => {
    // Filter out targets that are too far
    let validPoints = points.filter(point => 
      calculateDistance(ORIGIN, point.coordinates) <= MAX_ATTACK_DISTANCE
    );
  
    // Apply each protocol sequentially
    for (const protocol of protocols) {
      const strategy = protocolStrategies[protocol];
      // Apply filter
      validPoints = strategy.filter(validPoints);
      
      // If no points left after filtering, we can stop
      if (validPoints.length === 0) {
        break;
      }
    }
    
    // Apply sorting from protocols that affect order
    // Giving priority to distance-based protocols
    if (protocols.includes('closest-enemies')) {
      validPoints = protocolStrategies['closest-enemies'].sort(validPoints);
    } else if (protocols.includes('furthest-enemies')) {
      validPoints = protocolStrategies['furthest-enemies'].sort(validPoints);
    }
    
    return validPoints;
  }
