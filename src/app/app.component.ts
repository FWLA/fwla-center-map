import { Component, OnInit } from '@angular/core';
import { latLng, tileLayer, LatLng, Map, Layer, marker, LayerGroup } from 'leaflet';
import { SettingsService } from './services/settings.service';
import { YellowIcon, GreenIcon, HomeIcon, RealEstateIcon, RedIcon } from './icons/icons';
import { RealEstateService } from './services/real-estate.service';
import { Coordinate } from './model/coordinate';
import { OperationService } from './services/operation.service';

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
    // baseLayers: {
    //   'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    // },
    overlays: {
    }
  };

  // General fields
  home: LatLng;
  map: Map;

  constructor(
    private settingsService: SettingsService,
    private operationService: OperationService,
    private realEstateService: RealEstateService
  ) { }

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

    this.initializeOperationLayer();
    this.initializeRealEstateLayer();
  }

  onMapReady(map: Map) {
    this.map = map;
    if (this.home) {
      this.map.panTo(this.home);
    }
  }

  private initializeOperationLayer() {
    const operationLayerGroup = new LayerGroup();
    operationLayerGroup.addEventListener('add', () => {
      this.operationService.getOperations().subscribe(operations => {
        operations.forEach(operation => {
          operationLayerGroup.addLayer(marker(this.llatLng(operation.location.coordinate), {
            icon: RedIcon
          }));
        });
      });
    });
    operationLayerGroup.addEventListener('remove', () => {
      operationLayerGroup.clearLayers();
    });
    this.layersControl.overlays['Einsätze'] = operationLayerGroup;
  }

  private initializeRealEstateLayer() {
    const realEstateLayerGroup = new LayerGroup();
    realEstateLayerGroup.addEventListener('add', () => {
      this.realEstateService.getRealEstates().subscribe(realEstates => {
        realEstates.forEach(realEstate => {
          realEstateLayerGroup.addLayer(marker(this.llatLng(realEstate.address.coordinate), {
            icon: RealEstateIcon
          }));
        });
      });
    });
    realEstateLayerGroup.addEventListener('remove', () => {
      realEstateLayerGroup.clearLayers();
    });
    this.layersControl.overlays['Objekte'] = realEstateLayerGroup;
  }

  private llatLng(coords: Coordinate): LatLng {
    return latLng(coords.latitude, coords.longitude);
  }
}
