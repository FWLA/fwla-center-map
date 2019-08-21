import { Component, Input, OnInit } from '@angular/core';
import { Feature, Geometry } from 'geojson';
import * as L from 'leaflet';
import { coloredIcon, DefaultIcon } from '../icons/icons';
import { FeatureDetails } from '../model/FeatureDetails';
import { LayerService } from '../services/layer.service';

interface LayerType {
  id: string,
  name: string,
  editable: boolean,
  leafletLayer: L.LayerGroup
};

interface LayerGroupType {
  name: string,
  layers: LayerType[]
};

interface DataType {
  operation: LayerGroupType[];
  info: LayerGroupType[];
  archive: LayerGroupType[];
};

@Component({
  selector: 'layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss']
})
export class LayerControlComponent implements OnInit {

  @Input() map: L.Map;
  collapsed = true;
  layerData: DataType = {
    operation: [],
    info: [],
    archive: []
  };

  constructor(private layerService: LayerService) { }

  ngOnInit() {
    this.map.on('click', this.collapse, this);

    this.layerService.getLayers().subscribe(layerGroups => {
      layerGroups.forEach(layerGroup => {
        if (layerGroup.layers.length == 0) {
          return;
        }

        const lgData: LayerGroupType = {
          name: layerGroup.name,
          layers: []
        };

        switch (layerGroup.category) {
          case 'OPERATION':
            this.layerData.operation.push(lgData);
            break;
          case 'INFO':
            this.layerData.info.push(lgData);
            break;
          case 'ARCHIVE':
            this.layerData.archive.push(lgData);
            break;
        }

        lgData.layers = layerGroup.layers.map(layer => {

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
                      this.layerService.getFeatureDetails(layer.id, <string>feature.id).subscribe(featureDetails => {
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

          const layerData: LayerType = {
            id: layer.id,
            name: layer.name,
            editable: layer.editable,
            leafletLayer: leafletLayerGroup
          };

          return layerData;
        });
      })
    });
  }

  toggle(event: any, layer: LayerType) {
    if (event.target.checked) {
      this.map.addLayer(layer.leafletLayer);
    } else {
      this.map.removeLayer(layer.leafletLayer);
    }
    // keep control expanded
    this.collapsed = false;
  }

  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }

  onContainerMouseEnter() {
    if (!L.Browser.android) {
      this.expand();
    }
  }

  onContainerMouseLeave() {
    if (!L.Browser.android) {
      this.collapse();
    }
  }

  onLinkClick() {
    if (L.Browser.touch) {
      this.expand();
    }
  }

  onLinkFocus() {
    if (!L.Browser.touch) {
      this.expand();
    }
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
