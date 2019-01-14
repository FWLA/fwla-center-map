import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Coordinate } from '../model/coordinate';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getHome(): Observable<Coordinate> {
    if (isDevMode()) {
      const coord: Coordinate = {
        latitude: 49.591640,
        longitude: 8.480848
      };
      return of(coord);
    }
    return this.http.get<Coordinate>('/api/v1/settings/home');
  }
}
