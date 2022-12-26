import {
  AfterViewInit,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgxMicRecorderService } from './ngx-mic-recorder.service';
import { AudioVisualizationOptions, AudioVisualizationType, AudioVisualizer } from './utils/audio-visualizer';
import { Subscription } from 'rxjs';

type StartStopTemplateContext = { $implicit: boolean, toggle: Function, start: Function, stop: Function};

type PauseResumeTemplateContext = {
  $implicit: boolean,
  isPaused: boolean,
  toggle: Function,
  resume: Function,
  pause: Function,
  recordingState: RecordingState,
  recordingTime: string
};

@Directive({
  selector: '[ngx-mic-start-and-stop]'
})
export class NgxMicStartStopTemplate {
  constructor(public templateRef: TemplateRef<StartStopTemplateContext>) {
  }
}

@Directive({
  selector: '[ngx-mic-pause-and-resume]'
})
export class NgxPauseResumeTemplate {
  constructor(public templateRef: TemplateRef<PauseResumeTemplateContext>) {}
}

@Component({
  selector: 'ngx-mic-recorder',
  templateUrl: './ngx-mic-recorder.component.html',
  styleUrls: ['./ngx-mic-recorder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NgxMicRecorderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @ContentChild(NgxMicStartStopTemplate) startStopTemplateRef?: NgxMicStartStopTemplate;
  @ContentChild(NgxPauseResumeTemplate) pauseResumeTemplateRef?: NgxPauseResumeTemplate;
  @Input() showVisualization = true;
  @Input() visualizationType?: AudioVisualizationType;
  @Input() visualizationOptions?: Omit<AudioVisualizationOptions, 'canvas'>;
  @Output() getAsMp3 = new EventEmitter<{ data: Blob, url: string}>();
  @Output() getAsBlob = new EventEmitter<Blob>();
  @Output() afterStartRecording = new EventEmitter<void>();
  @Output() afterStopRecording = new EventEmitter<Blob>();
  @Output() onPauseRecording = new EventEmitter<void>();
  @Output() onResumeRecording = new EventEmitter<void>();

  private _subscription?: Subscription;

  constructor(public ngxMicRecorderService: NgxMicRecorderService) { }

  ngOnInit(): void {
    this._subscription = this.ngxMicRecorderService.recordedBlobAsMp3$.subscribe(
      (data) => {
        this.getAsMp3.emit({data, url: URL.createObjectURL(data)})
      }
    )
    this._subscription.add(
      this.ngxMicRecorderService.recordedBlob$.subscribe((data) => this.getAsBlob.emit(data!))
    )

    this.ngxMicRecorderService.setRecordingEvents({
      afterStartRecording: () => this.afterStartRecording.emit(),
      afterStopRecording: (blob) => this.afterStopRecording.emit(blob),
      onPause: () => this.onPauseRecording.emit(),
      onResume: () => this.onResumeRecording.emit(),
    })
  }

  ngAfterViewInit(): void {
    AudioVisualizer.visualize(this.visualizationType, {
      canvas: this.canvas.nativeElement,
      ...this.visualizationOptions
    })
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  public getStartStopTemplateContext($implicit: boolean): StartStopTemplateContext {
    return {
      $implicit,
      toggle: this.ngxMicRecorderService.toggleStartStop,
      start: this.ngxMicRecorderService.startRecording,
      stop: this.ngxMicRecorderService.stopRecording
    }
  }


  public getPauseResumeTemplateContext($implicit: boolean, isPaused: boolean, recordingTime: string, recordingState: RecordingState): PauseResumeTemplateContext {
    return {
      $implicit,
      isPaused,
      recordingState,
      recordingTime,
      toggle: this.ngxMicRecorderService.togglePauseAndResume,
      pause: this.ngxMicRecorderService.pause,
      resume: this.ngxMicRecorderService.resume
    }
  }
}
