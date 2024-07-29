import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IPanel, IPanelLink } from 'src/app/private/model/UI/panel-info';

@Component({
  selector: 'app-todo-panel',
  templateUrl: './todo-panel.component.html',
  styleUrls: ['./todo-panel.component.scss']
})
export class TodoPanelComponent {

  @Input() panelItems! : IPanelLink[]
  @Output() action : EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router){}
  
  public sendAction(panelLink:IPanelLink){
    this.router.navigateByUrl(`/todo/${panelLink.link}`)
    this.action.emit(panelLink.name)
  }
}
