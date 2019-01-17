import { Feature } from '../model/Feature';
import { coordinateSample } from './CoordinateSample';

export const featureSample: Feature = {
  name: 'Muster POI',
  text: 'Information',
  color: 'blue',
  address: {
    street: 'Musterstraße 14',
    town: 'Musterstadt',
    zip: '12345',
    district: null
  },
  coordinate: coordinateSample
};
