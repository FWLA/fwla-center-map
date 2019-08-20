import { Layer } from './Layer';
import { LayerGroupCategory } from './LayerGroupCategory';

export class LayerGroup {
  name: string;
  category: LayerGroupCategory;
  layers: Layer[];
}
