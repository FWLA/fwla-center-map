import { NgElement, WithProperties } from '@angular/elements';
import * as L from 'leaflet';
import { Layer } from '../model/Layer';
import { LayerControlComponent } from './layer-control.component';

interface CompositeLayer {
  layer: Layer;
  leafleLayer: L.LayerGroup;
}

export class LayerControl extends L.Control {

  private layerControlElement: NgElement & WithProperties<LayerControlComponent>;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map): HTMLElement {
    this.layerControlElement = document.createElement('layer-control') as any;
    this.layerControlElement.map = map;
    return this.layerControlElement;
  }
}
