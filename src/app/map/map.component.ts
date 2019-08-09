import { Component, OnInit } from '@angular/core';
import { FeatureDetails } from '../model/FeatureDetails';
import * as L from 'leaflet';
import { Geometry, Feature } from 'geojson';
import { SettingsService } from '../services/settings.service';
import { LayerService } from '../services/layer.service';
import { DefaultIcon, coloredIcon } from '../icons/icons';
import { Coordinate } from '../model/Coordinate';

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
                  var icon = DefaultIcon;
                  if (feature.properties.color) {
                    icon = coloredIcon(feature.properties.color);
                  }
                  return L.marker(latLng, {
                    icon: icon
                  });
                },
                onEachFeature: (feature, featureLayer) => {
                  if (feature.properties.hasDetails) {
                    featureLayer.bindPopup('Loading...');
                    featureLayer.on('click', (e) => {
                      const popup = (<L.Popup>e.target.getPopup());
                      this.layerService.getFeatureDetails(layer.id, <string> feature.id).subscribe(featureDetails => {
                        popup.setContent(this.getPopup(featureDetails, feature));
                        popup.update();
                      });
                    });
                  }
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
          var key = layer.name;
          if (layer.editable) {
            var href = '#/edit/' + layer.id;
            key += ' <a href="' + href + '">Edit</a>';
          }
          this.layersControl.overlays[key] = leafletLayerGroup;
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
          (${feature.geometry.coordinates[1].toFixed(6)}; ${feature.geometry.coordinates[0].toFixed(6)})
        </p>
      </div>
      `;
    }

    return popup;
  }
}
