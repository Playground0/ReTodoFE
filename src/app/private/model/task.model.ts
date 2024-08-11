export interface ITask {
  _id: string;
  currentListId: string;
  previousListID: string;
  userId: string;
  taskTitle: string;
  creationDate: string;
  updationDate: string;
  taskStartDate: string;
  taskEndDate: string;
  taskDesc: string;
  occurance: string;
  priority: number;
  reminder: boolean;
  isRecurring: boolean;
  isCompleted: boolean;
  isDeleted: boolean;
  isArchived: boolean;
}

export interface ITaskCreate {
  currentListId: string;
  previousListID: string;
  userId: string;
  taskTitle: string;
  taskStartDate: string,
  taskEndDate: string;
  taskDesc: string;
  occurance: string;
  priority: number;
  reminder: boolean;
  isRecurring: boolean;
}

export interface ITaskUpdate {
  taskId: string;
  currentListId: string;
  previousListID: string;
  userId: string;
  taskTitle: string;
  taskStartDate: string;
  taskEndDate: string;
  taskDesc: string;
  occurance: string;
  priority: number;
  reminder: boolean;
  isRecurring: boolean;
}
