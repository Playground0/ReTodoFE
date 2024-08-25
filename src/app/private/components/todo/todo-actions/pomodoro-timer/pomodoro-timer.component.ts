import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pomodoro-timer',
  templateUrl: './pomodoro-timer.component.html',
  styleUrls: ['./pomodoro-timer.component.scss'],
})
export class PomodoroTimerComponent implements OnInit{
  timerValue: string = '';
  minutes: number = 0;
  seconds: number = 59;
  interval!: any;
  isTimerPaused = false;
  snackBarConfig: MatSnackBarConfig = {
    duration: 2000
  }
  @Input() isTimerActive = false;
  @Input() showTimerOptions = false;
  @Input() timerLength = 2;
  @Output() stopPomodoroEvent = new EventEmitter();

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(){
    if (this.isTimerActive) {
      this.startPomodoro(this.timerLength);
    }
  }

  startPomodoro(length: number) {
    this.timerLength = length;
    this.isTimerActive = true;
    this.showTimerOptions = false;
    this.minutes = this.timerLength - 1;
    this.startTimer();
  }

  stopPomodoro(isCompleteSession: boolean = false) {
    clearInterval(this.interval);
    this.resetTimerValues();
    this.stopPomodoroEvent.emit();
    const message = isCompleteSession ? 'Session Completed 🎉 !!' : 'Session Stopped 🛑 !!'
    this._snackBar.open(message,'',this.snackBarConfig)
  }

  pausePomodoro() {
    clearInterval(this.interval);
    this.isTimerPaused = true;
    this._snackBar.open("Session Pasued ⏸️ !!",'',this.snackBarConfig)
  }

  resumeTimer() {
    this.isTimerPaused = false;
    this.startTimer();
    this._snackBar.open("Pomodoro Resumed ▶️ !!",'',this.snackBarConfig)
  }

  startTimer() {
    this._snackBar.open("Pomodoro Started 🏃‍♂️‍➡️ !!",'',this.snackBarConfig)
    this.interval = setInterval(() => {
      if (this.seconds === 1) {
        const min = this.minutes - 1;
        if (min < 0) {
          this.stopPomodoro(true);
          return;
        }
        this.minutes = min;
        this.seconds = 59;
      }
      this.seconds = this.seconds - 1;
    }, 999);
  }

  resetTimerValues() {
    this.minutes = this.timerLength;
    this.seconds = 60;
    this.isTimerPaused = false;
    this.isTimerActive = false;
    this.interval = null;
  }
}
