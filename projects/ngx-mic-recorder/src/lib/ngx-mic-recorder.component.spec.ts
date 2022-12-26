import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMicRecorderComponent } from './ngx-mic-recorder.component';

describe('NgxMicRecorderComponent', () => {
  let component: NgxMicRecorderComponent;
  let fixture: ComponentFixture<NgxMicRecorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxMicRecorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMicRecorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
