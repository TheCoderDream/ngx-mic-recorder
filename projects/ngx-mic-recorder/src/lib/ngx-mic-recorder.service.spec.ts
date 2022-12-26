import { TestBed } from '@angular/core/testing';

import { NgxMicRecorderService } from './ngx-mic-recorder.service';

describe('NgxMicRecorderService', () => {
  let service: NgxMicRecorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMicRecorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
