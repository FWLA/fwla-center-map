import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { Observable, of } from 'rxjs';
import { FeatureDetails } from '../model/FeatureDetails';
import { LayerGroup } from '../model/LayerGroup';
import { featureCollectionSample } from '../samples/FeatureCollectionSample';
import { featureDetailsSample } from '../samples/FeatureDetailsSample';
import { layerGroupSample } from '../samples/LayerGroupSample';
import { isProxy } from '../util/IsProxy';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor(private http: HttpClient) { }

  getLayers(): Observable<LayerGroup[]> {
    if (isDevMode() && !isProxy()) {
      return of([layerGroupSample]);
    }
    return this.http.get<LayerGroup[]>('/api/v2/geo/layers');
  }

  getFeatures(layerId: string): Observable<FeatureCollection> {
    if (isDevMode() && !isProxy()) {
      return of(featureCollectionSample);
    }
    return this.http.get<FeatureCollection>('/api/v2/geo/layers/' + layerId);
  }

  updateLayer(layerId: string, geojson: FeatureCollection): Observable<FeatureCollection> {
    if (isDevMode() && !isProxy()) {
      return of(featureCollectionSample);
    }
    return this.http.patch<FeatureCollection>('/api/v2/geo/layers/' + layerId, geojson);
  }

  getFeatureDetails(layerId: string, featureId: string): Observable<FeatureDetails> {
    if (isDevMode() && !isProxy()) {
      return of(featureDetailsSample);
    }
    return this.http.get<FeatureDetails>('/api/v2/geo/layers/' + layerId + '/' + featureId);
  }
}
