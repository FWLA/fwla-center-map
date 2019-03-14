import { FeatureType } from '../model/FeatureType';
import { PointFeature } from '../model/PointFeature';
import { coordinateSample } from './CoordinateSample';

export const pointFeatureSample: PointFeature = {
  id: 'featureId',
  color: 'red',
  coordinate: coordinateSample,
  tooltip: 'feature',
  type: FeatureType.POINT
};
