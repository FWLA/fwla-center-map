import { Address } from './Address';
import { Coordinate } from './Coordinate';

export class Feature {
  name: string;
  text: string;
  address: Address;
  color: string;
  coordinate: Coordinate;
}
