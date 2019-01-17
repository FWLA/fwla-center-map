import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Layer } from '../model/Layer';
import { Observable, of } from 'rxjs';
import { Feature } from '../model/Feature';
import { layerSample } from '../samples/LayerSample';
import { featureSample } from '../samples/FeatureSample';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  constructor(private http: HttpClient) { }

  getLayers(): Observable<Layer[]> {
    if (isDevMode()) {
      return of([layerSample]);
    }
    return this.http.get<Layer[]>('/api/v1/geo/layers');
  }

  getFeatures(layerId: string): Observable<Feature[]> {
    if (isDevMode()) {
      return of([featureSample]);
    }
    return this.http.get<Feature[]>('/api/v1/geo/layers/' + layerId);
  }
}
