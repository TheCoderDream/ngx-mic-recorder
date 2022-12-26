<div align="center">
  <img src="https://github.com/TheCoderDream/ngx-mic-recorder/blob/main/projects/ngx-mic-recorder/misc/documentation-assets/ngx-voice-recording.gif?raw=true" alt="Angular Microphone Recorder">
  <br>
  <h1>ngx-mic-recorder</h1>
  <br>
  <a href="https://www.npmjs.org/package/ngx-toastr">
    <img src="https://badge.fury.io/js/ngx-mic-recorder.svg" alt="npm">
  </a>
  <br>
  <br>
</div>

DEMO: https://stackblitz.com/edit/angular-ivy-bdzsz1?file=src/app/app.component.html

## Features

- Audio recording visualization.
- Start, stop, pause and resume audio recording.
- Fully customizable and configurable.
- Fully documented.


## Dependencies

| ngx-mic-recorder | Angular |
|------------------|---------|
| 1.0.0            | => 12.x |

## Install

```bash
npm install ngx-mic-recorder --save
```

## Setup

**Step 1:** Import the module

```ts
import { NgxMicRecorderModule } from 'ngx-mic-recorder';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxMicRecorderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Use

```angular2html
<ngx-mic-recorder
    (getAsMp3)="saveAsMp3($event)"
></ngx-mic-recorder>
```

**With all options:**
```angular2html
<ngx-mic-recorder
    (afterStartRecording)="afterStart($event)"
    (afterStopRecording)="afterStop()"
    (onPauseRecording)="onPause()"
    (onResumeRecording)="onResume()"
    (getAsMp3)="saveAsMp3($event)"
    (getAsBlob)="saveAsBlob()"
    [showVisualization]="true"
    visualizationType="SineWave"
    [visualizationOptions]="{
        width: 300,
        height: 150,
        strokeColor: '#212121',
        backgroundColor: 'white',
    }"
></ngx-mic-recorder>
```

## Properties

| Option                  | Type                                            | Default                            | Description                                                                                                   |
|-------------------------|-------------------------------------------------|------------------------------------|---------------------------------------------------------------------------------------------------------------|
| showVisualization       | number                                          | true                               | Whether to show the visualization                                                                             |
| visualizationType             | ``SineWave``, ``FrequencyBars``, ``FrequencyCircles`` | SineWave                              | Audio Recording visualization type                                                                            |
| visualizationOptions             | object                                          | [see below](#visualization options) | Audio Recording visualization options                                                                           |

##### visualization options

```typescript
const defaultVisualizationOptions = {
  width: 300,
  height: 150,
  strokeColor: '#212121',
  backgroundColor: 'white',
}
```

## Events

| Event                | Value | Description                                          |
|----------------------|-------|------------------------------------------------------|
| afterStartRecording    | void  | After microphone start recording                     |
| afterStopRecording    | Blob  | After microphone stop recording  with recorded audio |
| onPauseRecording | void  | When microphone pauses recording                     |
| onResumeRecording | void  | When microphone resumes recording                    |
| getAsMp3                  | `{ data: Blob, url: string}`      | Get recorded audio as encoded to MP3                   |

## Template options

```angular2html
<ngx-mic-recorder
    (getAsMp3)="saveAsMp3($event)"
>
  <ng-template 
    ngx-mic-start-and-stop
    let-isRecording
    let-toggle="toggle"
    let-start="start"
    let-stop="start"
  >
    <div class="ngx-mic-recorder__start-stop" (click)="toggle()">
      <div class="ngx-mic-recorder__state">
        <span *ngIf="isRecording" class="ngx-mic-recorder__stop"></span>
        <svg *ngIf="!isRecording" class="ngx-mic-recorder__start" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
              preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325Q5 13.625 5 11h2q0 2.075 1.463 3.537Q9.925 16 12 16t3.538-1.463Q17 13.075 17 11h2q0 2.625-1.7 4.6q-1.7 1.975-4.3 2.325V21Z"></path>
        </svg>
      </div>
    </div>
  </ng-template>

  <ng-template
    ngx-mic-pause-and-resume
    let-isRecording
    let-toggle="toggle"
    let-recordingTime="recordingTime"
    let-isPaused="isPaused"
    let-recordingState="recordingState"
  >
    <ng-template [ngIf]="isRecording">
      <div class="ngx-mic-recorder__recording-time">
        {{ recordingTime }}
      </div>
      <div class="ngx-mic-recorder__toggle" (click)="toggle()">
        <span [class.blink]="!isPaused"></span>
        <p>{{ recordingState }}</p>
      </div>
    </ng-template>
  </ng-template>
</ngx-mic-recorder>
```

## NgxMicRecorderService
**Note :** You can use your own fully custom  template with the service.

## Properties

| Option                  | Type                                              | Initial value              |
|-------------------------|---------------------------------------------------|----------------------------|
| isRecording$       | ``Observable<boolean>``                           | ``Observable<false>``      |
| isPaused$       | ``Observable<boolean>``                           | ``Observable<false>``      |
| recordingTime$       | ``Observable<string>``                            | ``Observable<'00:00:00'>`` |
| recordedBlob$       | ``Observable<Blob>``                              | ``Observable<null>``       |
| recordedBlobAsMp3$       | ``Observable<Blob>``                              | ``Observable<null>``       |
| recordingState$       | ``Observable<'inactive', 'paused', 'recording'>`` | ``Observable<'inactive'>``       |


## Methods

| Name                 |
|--------------------|
| startRecording       |
| stopRecording          |
| toggleStartStop     |
| resume      |
| pause |
| togglePauseAndResume    |
| setRecordingEvents    |
