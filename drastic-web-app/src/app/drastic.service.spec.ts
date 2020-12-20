import { TestBed } from '@angular/core/testing';

import { DrasticService } from './drastic.service';

describe('DrasticService', () => {
  let service: DrasticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrasticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
