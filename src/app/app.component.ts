import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { coloredIcon } from './icons/icons';
import { Coordinate } from './model/Coordinate';
import { Feature } from './model/Feature';
import { LayerService } from './services/layer.service';
import { SettingsService } from './services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  // Map options
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: L.latLng(0, 0)
  };
  layers: L.Layer[] = [];
  layersControl = {
    overlays: {
    }
  };

  // General fields
  home: L.LatLng;
  map: L.Map;

  constructor(
    private settingsService: SettingsService,
    private layerService: LayerService
  ) { }

  ngOnInit() {
    this.settingsService.getHome().subscribe(coords => {
      this.home = L.latLng(coords.latitude, coords.longitude);
      if (this.map) {
        this.map.panTo(this.home);
      }
    });

    this.initializeLayers();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    map.addControl(new L.Control.Scale());
    if (this.home) {
      this.map.panTo(this.home);
    }
  }

  private initializeLayers() {
    this.layerService.getLayers().subscribe(layerGroups => {
      layerGroups.forEach(layerGroup => {
        layerGroup.layers.forEach(layer => {
          const leafletLayerGroup = new L.LayerGroup();
          leafletLayerGroup.addEventListener('add', () => {
            this.layerService.getFeatures(layer.id).subscribe(features => {
              features.forEach(feature => {
                const m = L.marker(this.latLng(feature.coordinate), {
                  icon: coloredIcon(feature.color)
                });
                m.bindPopup(this.getPopup(feature));
                leafletLayerGroup.addLayer(m);
              });
            });
          });
          leafletLayerGroup.addEventListener('remove', () => {
            leafletLayerGroup.clearLayers();
          });
          this.layersControl.overlays[layer.name] = leafletLayerGroup;
        });
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

  private latLng(coords: Coordinate): L.LatLng {
    return L.latLng(coords.latitude, coords.longitude);
  }
}
