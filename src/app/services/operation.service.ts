import { Injectable, isDevMode } from '@angular/core';
import { Operation } from '../model/operation';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  private devOperation: Operation = {
    id: '123456',
    code: 'F-2',
    time: '2019-01-01',
    training: false,
    location: {
      street: 'Musterstraße 123',
      town: 'Musterstadt',
      coordinate: {
        latitude: 49.597198,
        longitude: 8.456707
      }
    }
  };

  constructor(private http: HttpClient) { }

  getOperations(): Observable<Operation[]> {
    if (isDevMode()) {
      return of([this.devOperation]);
    }
    return this.http.get<Operation[]>('/api/v1/operations');
  }
}
