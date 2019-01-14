import { Injectable, isDevMode } from '@angular/core';
import { RealEstate } from '../model/real-estate';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {

  private devRealEstate: RealEstate = {
    id: '1',
    key: 'Building01',
    name: 'Building 1',
    information: null,
    address: {
      street: 'Musterstraße 1',
      zip: '12345',
      town: 'Musterstadt',
      district: null,
      coordinate: {
        latitude: 49.601821,
        longitude: 8.461550
      }
    }
  };

  constructor(private http: HttpClient) { }

  getRealEstates(): Observable<RealEstate[]> {
    if (isDevMode()) {
      return of([this.devRealEstate]);
    }
    return this.http.get<RealEstate[]>('/api/v1/realEstates');
  }
}
