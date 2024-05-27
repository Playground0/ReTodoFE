import { IUserAPI } from "src/app/core/model/auth-page.model";

export interface IAPIData {
  Action: string;
  Code: number;
  Data: unknown | IUserAPI | any ;
  ErrorMessage: unknown;
  Message: string;
  Status: string;
}

export const enum APIStatusMessage{
    Success = 'success',
    Error = 'error'
}