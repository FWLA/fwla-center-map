import { Component, OnInit } from '@angular/core';
import { Feature, Geometry } from 'geojson';
import * as L from 'leaflet';
import { coloredIcon } from './icons/icons';
import { Coordinate } from './model/Coordinate';
import { FeatureDetails } from './model/FeatureDetails';
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
            this.layerService.getFeatures(layer.id).subscribe(featureCollection => {
              var geoJsonLayer = L.geoJSON(featureCollection, {
                pointToLayer: (feature, latLng) => {
                  return L.marker(latLng, {
                    icon: coloredIcon(feature.properties.color)
                  });
                },
                onEachFeature: (feature, featureLayer) => {
                  featureLayer.bindPopup('Loading...');
                  featureLayer.on('click', (e) => {
                    const popup = (<L.Popup>e.target.getPopup());
                    this.layerService.getFeatureDetails(layer.id, <string> feature.id).subscribe(featureDetails => {
                      popup.setContent(this.getPopup(featureDetails, feature));
                      popup.update();
                    })
                  })
                  if (feature.properties.name) {
                    featureLayer.bindTooltip(feature.properties.name);
                  }
                }
              });
              leafletLayerGroup.addLayer(geoJsonLayer);
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

  private getPopup(featureDetails: FeatureDetails, feature?: Feature<Geometry, any>): string {

    let popup = `
    <div class="marker-popup">
      <h1>${featureDetails.name}</h1>
      `;
      if (featureDetails.address) {

        const street = featureDetails.address.street || '';
        let zip = featureDetails.address.zip || '';
        if (zip.length > 0) {
          zip = zip + ' ';
        }
        let district = featureDetails.address.district || '';
        if (district.length > 0) {
          district = ' - ' + district;
        }
        const town = featureDetails.address.town || '';

        popup += `
        <p class="address">
          ${street}<br />
          ${zip}${town}${district}
        </p>
        `;
      }
    if (featureDetails.text && !(featureDetails.name === featureDetails.text)) {
      popup += `
      <p class="text">
        ${featureDetails.text}
      </p>
      `;
    }
    if (feature.geometry.type === 'Point') {
      popup += `
        <p class="coordinates">
          (${feature.geometry.coordinates[1]}; ${feature.geometry.coordinates[0]})
        </p>
      </div>
      `;
    }

    return popup;
  }

  private latLng(coords: Coordinate): L.LatLng {
    return L.latLng(coords.latitude, coords.longitude);
  }
}
