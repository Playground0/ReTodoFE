import { ITask } from './task';

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
  action: string;
  data: ITaskUI | ITask | string;
}
