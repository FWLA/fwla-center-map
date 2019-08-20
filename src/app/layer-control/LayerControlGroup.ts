import * as L from 'leaflet';
import { Layer } from '../model/Layer';
import { LayerGroup } from '../model/LayerGroup';

export interface LayerControlGroup {
  layerGroup: LayerGroup;
  layer: Layer;
  leafletLayerGroup: L.LayerGroup;
}
