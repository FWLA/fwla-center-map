import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Coordinate } from '../model/Coordinate';
import { coordinateSample } from '../samples/CoordinateSample';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getHome(): Observable<Coordinate> {
    if (isDevMode()) {
      return of(coordinateSample);
    }
    return this.http.get<Coordinate>('/api/v1/settings/home');
  }
}
