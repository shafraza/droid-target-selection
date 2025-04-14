import { Coordinates } from '../types';

export const calculateDistance = (origin: Coordinates, target: Coordinates): number => {
  return Math.sqrt(
    Math.pow(target.x - origin.x, 2) + Math.pow(target.y - origin.y, 2)
  );
};
