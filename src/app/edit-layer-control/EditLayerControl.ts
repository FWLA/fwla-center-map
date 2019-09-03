import * as L from 'leaflet';
import { NgElement, WithProperties } from '@angular/elements';
import { EditLayerControlComponent } from './edit-layer-control.component';

export class EditLayerControl extends L.Control {

  private editLayerControlElement: NgElement & WithProperties<EditLayerControlComponent>;

  constructor(options?: L.ControlOptions) {
    super(options);
  }

  onAdd(map: L.Map): HTMLElement {
    this.editLayerControlElement = document.createElement('edit-layer-control') as any;
    return this.editLayerControlElement;
  }
}
