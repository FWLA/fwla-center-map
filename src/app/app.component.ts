import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, LatLng, Map, Layer, marker, LayerGroup, Control } from 'leaflet';
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
    map.addControl(new Control.Scale());
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

    const street = feature.address.street || '';
    let zip = feature.address.zip || '';
    if (zip.length > 0) {
      zip = zip + ' ';
    }
    let district = feature.address.district || '';
    if (district.length > 0) {
      district = ' - ' + district;
    }
    const town = feature.address.town || '';

    let popup = `
    <div class="marker-popup">
      <h1>${feature.name}</h1>
      <p class="address">
        ${street}<br />
        ${zip}${town}${district}
      </p>
      `;
    if (feature.text && !(feature.name === feature.text)) {
      popup += `
      <p class="text">
        ${feature.text}
      </p>
      `;
    }
    popup += `
      <p class="coordinates">
        (${feature.coordinate.latitude}; ${feature.coordinate.longitude})
      </p>
    </div>
    `;

    return popup;
  }

  private toLatLng(coords: Coordinate): LatLng {
    return latLng(coords.latitude, coords.longitude);
  }
}
