import { ITask } from '../task';
import { DefaultPanels, TaskActions } from './tasks.contanst';

export interface ITaskUI {
  taskTitle: string;
  taskDesc: string;
  taskEndDate: string;
  priority: number;
  reminder: boolean;
  isRecurring: boolean;
  occurance: string;
}

export interface IDialogData {
  panel?: DefaultPanels | undefined | string;
  action?: TaskActions;
  data: ITaskUI | ITask | string | undefined;
}
