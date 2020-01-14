import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LayerControl } from '../layer-control/LayerControl';
import { SettingsService } from '../services/settings.service';
import '../../../node_modules/leaflet.browser.print/dist/leaflet.browser.print.min.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  // Map options
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: L.latLng(0, 0)
  };
  layers: L.Layer[] = [];

  // General fields
  home: L.LatLng;
  map: L.Map;

  constructor(
    private settingsService: SettingsService
  ) {
  }

  ngOnInit() {
    this.settingsService.getHome().subscribe(coords => {
      this.home = L.latLng(coords.latitude, coords.longitude);
      if (this.map) {
        this.map.panTo(this.home);
      }
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;
    map.addControl(new L.Control.Scale());
    map.addControl(new LayerControl({
      position: 'topright'
    }));
    L.control.browserPrint({
      title: 'Drucken',
      documentTitle: 'FWLA Center Map',
      position: 'topleft',
      printModes: [
        L.control.browserPrint.mode.custom('Bereich auswählen', 'A4')
      ]
    }).addTo(map);
    if (this.home) {
      this.map.panTo(this.home);
    }
  }
}
