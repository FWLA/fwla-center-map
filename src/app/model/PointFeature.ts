import { Feature } from './Feature';
import { Coordinate } from './Coordinate';

export class PointFeature extends Feature {
  color: string;
  coordinate: Coordinate;
}
