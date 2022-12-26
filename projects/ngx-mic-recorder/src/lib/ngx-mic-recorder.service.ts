import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, switchMap } from 'rxjs';
import { MP3Encoder } from './utils/mp3-encoder';
import { AudioContext } from './utils/audio-context';

export interface RecordingEvents {
  afterStartRecording: () => void;
  afterStopRecording: (blob: Blob) => void;
  onPause: () => void;
  onResume: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NgxMicRecorderService {
  private _isRecordingSubject = new BehaviorSubject<boolean>(false);
  private _isPausedSubject = new BehaviorSubject<boolean>(false);
  private _recordingTimeSubject = new BehaviorSubject<number>(0);
  private _recordedBlobSubject = new BehaviorSubject<Blob | null>(null);
  private _recordingStateSubject = new BehaviorSubject<RecordingState>('inactive');
  private _timeInterval?: any;
  private _audioContext = new (window.AudioContext || window['webkitAudioContext'])();
  private _mic?: MediaStreamAudioSourceNode;
  private _processor?: ScriptProcessorNode;
  private _activeStream?: MediaStream;
  private _mp3Encoder = new MP3Encoder();
  private _mediaRecorder?: MediaRecorder;
  private _recordingEvents?: Partial<RecordingEvents>;

  public isRecording$ = this._isRecordingSubject.asObservable();
  public isPaused$ = this._isPausedSubject.asObservable();
  public recordingTime$ = this._recordingTimeSubject.asObservable().pipe(map(s => new Date(s * 1000).toISOString().slice(11, 19)));
  public recordedBlob$ = this._recordedBlobSubject.asObservable();
  public recordedBlobAsMp3$ = this.recordedBlob$.pipe(switchMap(() => from(this._getMp3())));
  public recordingState$ = this._recordingStateSubject.asObservable();

  private _startTimer(): void {
    this._timeInterval = setInterval(() => {
      this._recordingTimeSubject.next(this._recordingTimeSubject.getValue() + 1)
    }, 1000);
  }

  private _stopTimer(): void {
    clearInterval(this._timeInterval);
    this._timeInterval = undefined;
  }

  private _getMp3(): Promise<Blob> {
    const finalBuffer = this._mp3Encoder.finish();

    return new Promise((resolve, reject) => {
      if (finalBuffer.length === 0) {
        reject(new Error('No buffer to send'));
      } else {
        resolve(new Blob(finalBuffer, { type: 'audio/mp3' }));
        this._mp3Encoder.clearBuffer();
      }
    });
  }

  public setRecordingEvents(events: Partial<RecordingEvents>) {
    this._recordingEvents = events;
  }


  public toggleStartStop = (): void =>  {
    const isRecording = this._isRecordingSubject.getValue();

    if (isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  public startRecording = (): void =>  {
    if (this._timeInterval !== undefined) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this._activeStream = stream;
        this._isRecordingSubject.next(true);
        const recorder: MediaRecorder = new MediaRecorder(stream);
        this._mediaRecorder = recorder;
        recorder.start();
        this._startTimer();
        this._recordingStateSubject.next('recording');
        this._mic = this._audioContext.createMediaStreamSource(stream);
        this._processor = this._audioContext.createScriptProcessor(0, 1, 1);
        this._mic.connect(this._processor);
        this._processor.connect(this._audioContext.destination);

        this._processor.onaudioprocess = (event) => {
          this._mp3Encoder.encode(event.inputBuffer.getChannelData(0));
        };

        if (this._recordingEvents?.afterStartRecording) this._recordingEvents?.afterStartRecording();

        recorder.addEventListener('dataavailable', (event: BlobEvent) => {
          this._recordedBlobSubject.next(event.data);
          // if (onDataAvailable) onDataAvailable(event.data);
          recorder.stream.getTracks().forEach((t) => t.stop());
          this._mediaRecorder = undefined;
        });
        AudioContext.startAnalyze(stream);
      })
      .catch((err) => console.log(err));
  }

  public stopRecording = (): void => {
    this._mediaRecorder?.stop();
    this._stopTimer();
    this._recordingTimeSubject.next(0)
    this._isRecordingSubject.next(false);
    this._isPausedSubject.next(false);
    this._recordingStateSubject.next('inactive');
    AudioContext.resetAnalyser();
    if (this._recordingEvents?.afterStopRecording) this._recordingEvents.afterStopRecording(this._recordedBlobSubject.getValue() as Blob);

    if (this._processor && this._mic) {
      this._mic.disconnect();
      this._processor.disconnect();
      if (this._audioContext && this._audioContext.state !== 'closed') {
        this._audioContext.close();
      }
      this._processor.onaudioprocess = null;
      this._activeStream?.getAudioTracks().forEach((track) => track.stop());
    }
  }

  public togglePauseAndResume = (): void => {
    const isRecording = this._isRecordingSubject.getValue();
    if (!isRecording) return;
    const isPaused = this._isPausedSubject.getValue();
    if (isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  public resume = (): void => {
    this._isPausedSubject.next(false)
    this._mediaRecorder?.resume();
    this._recordingStateSubject.next('recording');
    AudioContext.resumeAnalyze();
    void this._audioContext.resume();
    this._startTimer();
    if (this._recordingEvents?.onResume) this._recordingEvents.onResume();
  }

  public pause = (): void => {
    this._isPausedSubject.next(true);
    this._mediaRecorder?.pause();
    this._recordingStateSubject.next('paused');
    AudioContext.pauseAnalyze();
    void this._audioContext.suspend();
    this._stopTimer();
    if (this._recordingEvents?.onPause) this._recordingEvents.onPause();
  }

}
