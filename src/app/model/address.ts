import { Coordinate } from './coordinate';

export class Address {
  street: string;
  zip: string;
  town: string;
  district: string;
  coordinate?: Coordinate;
}
