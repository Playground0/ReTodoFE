import { ITask } from './task.model';

export interface IList {
  _id: string;
  listTitle: string;
  userId: string;
  sharedUsrID: string;
  creationDate: string;
  updationDate: string;
  tasks: ITask[];
  isDeleted: boolean;
  isHidden: boolean;
  isArchived: boolean;
}

export interface IListCreate {
  listTitle: string;
  userId: string;
}

export interface IListUpdate {
  listId: string;
  userId: string;
  listTitle: string;
  sharedUsrID: string;
}
