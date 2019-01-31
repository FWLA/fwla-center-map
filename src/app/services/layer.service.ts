import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feature } from '../model/Feature';
import { LayerGroup } from '../model/LayerGroup';
import { featureSample } from '../samples/FeatureSample';
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

  getFeatures(layerId: string): Observable<Feature[]> {
    if (isDevMode() && !isProxy()) {
      return of([featureSample]);
    }
    return this.http.get<Feature[]>('/api/v1/geo/layers/' + layerId);
  }
}
