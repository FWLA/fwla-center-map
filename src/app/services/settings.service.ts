import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Coordinate } from '../model/coordinate';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private devHome: Coordinate = {
    latitude: 49.591640,
    longitude: 8.480848
  };

  constructor(private http: HttpClient) { }

  getHome(): Observable<Coordinate> {
    if (isDevMode()) {
      return of(this.devHome);
    }
    return this.http.get<Coordinate>('/api/v1/settings/home');
  }
}
