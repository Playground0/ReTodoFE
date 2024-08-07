import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-actions',
  templateUrl: './todo-actions.component.html',
  styleUrls: ['./todo-actions.component.scss']
})
export class TodoActionsComponent {

  startPomodoro(){
    console.log('Start Pomodoro')
  }

  showAnalytics(){
    console.log('Analytics Data')
  }
}
