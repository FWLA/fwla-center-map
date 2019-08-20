import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LayerControl } from '../layer-control/LayerControl';
import { SettingsService } from '../services/settings.service';

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
    if (this.home) {
      this.map.panTo(this.home);
    }
  }
}
