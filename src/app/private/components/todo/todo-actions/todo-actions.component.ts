import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-actions',
  templateUrl: './todo-actions.component.html',
  styleUrls: ['./todo-actions.component.scss'],
})
export class TodoActionsComponent {
  isTimerActive: boolean = false
  constructor() {}

  startPomodoro(){
    if(this.isTimerActive) return
    this.isTimerActive = true
  }
  showAnalytics() {
    console.log('Analytics Data');
  }

  stopPomodoro(){
    this.isTimerActive = false
  }
}
