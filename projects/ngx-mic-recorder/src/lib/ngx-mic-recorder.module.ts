import { NgModule } from '@angular/core';
import {
  NgxMicRecorderComponent,
  NgxMicStartStopTemplate,
  NgxPauseResumeTemplate,
} from './ngx-mic-recorder.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    NgxMicRecorderComponent,
    NgxMicStartStopTemplate,
    NgxPauseResumeTemplate,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxMicRecorderComponent,
    NgxMicStartStopTemplate,
    NgxPauseResumeTemplate,
  ]
})
export class NgxMicRecorderModule { }
