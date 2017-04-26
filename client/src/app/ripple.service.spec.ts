import { TestBed, inject } from '@angular/core/testing';

import { RippleService } from './ripple.service';

describe('RippleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RippleService]
    });
  });

  it('should ...', inject([RippleService], (service: RippleService) => {
    expect(service).toBeTruthy();
  }));
});
