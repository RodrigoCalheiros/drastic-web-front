import { TestBed } from '@angular/core/testing';

import { DrasticDService } from './drastic-d.service';

describe('DrasticDService', () => {
  let service: DrasticDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrasticDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
