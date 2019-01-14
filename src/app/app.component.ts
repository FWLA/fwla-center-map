import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, LatLng, Map, Layer, marker } from 'leaflet';
import { SettingsService } from './services/settings.service';
import { YellowIcon, GreenIcon, HomeIcon } from './icons/icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Map options
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(0, 0)
  };
  layers: Layer[] = [];

  // General fields
  home: LatLng;
  map: Map;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getHome().subscribe(coords => {
      this.home = latLng(coords.latitude, coords.longitude);
      this.layers.push(marker(this.home, {
        icon: HomeIcon
      }));
      if (this.map) {
        this.map.panTo(this.home);
      }
    });
  }

  onMapReady(map: Map) {
    this.map = map;
    if (this.home) {
      this.map.panTo(this.home);
    }
  }
}
