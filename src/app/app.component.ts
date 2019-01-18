import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, LatLng, Map, Layer, marker, LayerGroup } from 'leaflet';
import { SettingsService } from './services/settings.service';
import { coloredIcon } from './icons/icons';
import { Coordinate } from './model/Coordinate';
import { LayerService } from './services/layer.service';
import { Feature } from './model/Feature';

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
  layersControl = {
    overlays: {
    }
  };

  // General fields
  home: LatLng;
  map: Map;

  constructor(
    private settingsService: SettingsService,
    private layerService: LayerService
  ) { }

  ngOnInit() {
    this.settingsService.getHome().subscribe(coords => {
      this.home = latLng(coords.latitude, coords.longitude);
      if (this.map) {
        this.map.panTo(this.home);
      }
    });

    this.initializeLayers();
  }

  onMapReady(map: Map) {
    this.map = map;
    if (this.home) {
      this.map.panTo(this.home);
    }
  }

  private initializeLayers() {
    this.layerService.getLayers().subscribe(layers => {
      layers.forEach(layer => {
        const layerGroup = new LayerGroup();
        layerGroup.addEventListener('add', () => {
          this.layerService.getFeatures(layer.id).subscribe(features => {
            features.forEach(feature => {
              const m = marker(this.toLatLng(feature.coordinate), {
                icon: coloredIcon(feature.color)
              });
              m.bindPopup(this.getPopup(feature));
              layerGroup.addLayer(m);
            });
          });
        });
        layerGroup.addEventListener('remove', () => {
          layerGroup.clearLayers();
        });
        this.layersControl.overlays[layer.name] = layerGroup;
      });
    });
  }

  private getPopup(feature: Feature): string {
    let popup = `
    <div class="marker-popup">
      <h1>${feature.name}</h1>
      <p class="address">
        ${feature.address.street}<br />
        ${feature.address.zip} ${feature.address.town}
      </p>
      `;
    if (feature.text) {
      popup += `
      <p class="text">
        ${feature.text}
      </p>
      `;
    }
    popup += `
    </div>
    `;

    return popup;
  }

  private toLatLng(coords: Coordinate): LatLng {
    return latLng(coords.latitude, coords.longitude);
  }
}
