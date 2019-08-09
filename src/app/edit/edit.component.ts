import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { DefaultIcon } from '../icons/icons';
import { LayerService } from '../services/layer.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  private featureGroup = new L.FeatureGroup();

  // Map options
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: L.latLng(0, 0)
  };
  layers: L.Layer[] = [this.featureGroup];

  // General fields
  home: L.LatLng;
  map: L.Map;
  layerId: string;

  private drawOptions: L.Control.DrawConstructorOptions = {
    position: 'topright',
    draw: {
      marker: {
        icon: DefaultIcon
      },
      circle: false,
      rectangle: false,
      circlemarker: false
    },
    edit: {
      featureGroup: this.featureGroup,
    }
  };

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private layerService: LayerService
  ) { }

  ngOnInit() {
    this.settingsService.getHome().subscribe(coords => {
      this.home = L.latLng(coords.latitude, coords.longitude);
      if (this.map) {
        this.map.panTo(this.home);
      }
    });

    this.route.params.subscribe(params => {
      this.layerId = params['id'];
      this.layerService.getFeatures(this.layerId).subscribe(featureCollection => {
        if (featureCollection && featureCollection.features && featureCollection.features.length > 0) {
          featureCollection.features.forEach(feature => {
            L.geoJSON(feature).getLayers().forEach(layer => {
              this.featureGroup.addLayer(layer);
            });
          });
        }
      });
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;
    map.addControl(new L.Control.Scale());
    map.addControl(new L.Control.Draw(this.drawOptions));
    if (this.home) {
      this.map.panTo(this.home);
    }

    map.on(L.Draw.Event.CREATED, e => {
      // var type = (<L.DrawEvents.Created> e).layerType;
      var layer = (<L.DrawEvents.Created> e).layer;

      /*
      var geoJsonLayer: GeoJsonLayer<any>;
      switch(type) {
        case 'marker':
          geoJsonLayer = new GeoJsonMarker(<L.Marker> layer);
          break;
        case 'polyline':
          geoJsonLayer = new GeoJsonPolyline(<L.Polyline> layer);
          break;
        case 'polygon':
          geoJsonLayer = new GeoJsonPolygon(<L.Polygon> layer);
          break;
        default:
          console.error("Unknown layer type.", type);
          break;
      }
      */

      this.featureGroup.addLayer(layer);

      this.updateBackend();
    });

    map.on(L.Draw.Event.EDITED, e => {
      this.updateBackend();
    });

    map.on(L.Draw.Event.DELETED, e => {
      var layers = (<L.DrawEvents.Deleted> e).layers;
      layers.getLayers().forEach(layer => this.featureGroup.removeLayer(layer));
      this.updateBackend();
    });
  }

  private updateBackend() {
    var featureCollection: any = this.featureGroup.toGeoJSON();
    this.layerService.updateLayer(this.layerId, featureCollection).subscribe(fc => {
      console.log(fc);
    });
  }
}
