import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FeatureDetails } from '../model/FeatureDetails';
import { LayerGroup } from '../model/LayerGroup';
import { PointFeature } from '../model/PointFeature';
import { featureDetailsSample } from '../samples/FeatureDetailsSample';
import { pointFeatureSample } from '../samples/FeatureSample';
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
    return this.http.get<LayerGroup[]>('/api/v1/geo/layers');
  }

  getFeatures(layerId: string): Observable<PointFeature[]> {
    if (isDevMode() && !isProxy()) {
      return of([pointFeatureSample]);
    }
    return this.http.get<PointFeature[]>('/api/v1/geo/layers/' + layerId);
  }

  getFeatureDetails(layerId: string, featureId: string): Observable<FeatureDetails> {
    if (isDevMode() && !isProxy()) {
      return of(featureDetailsSample);
    }
    return this.http.get<FeatureDetails>('/api/v1/geo/layers/' + layerId + '/' + featureId);
  }
}
