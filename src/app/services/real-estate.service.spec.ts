import { TestBed } from '@angular/core/testing';

import { RealEstateService } from './real-estate.service';

describe('RealEstateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealEstateService = TestBed.get(RealEstateService);
    expect(service).toBeTruthy();
  });
});
