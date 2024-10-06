export interface IUserDetails {
  id: string;
  username: string;
  email: string;
  fullname: string;
  age: string;
  profilePicture: string;
  userRole: string;
}

export interface IUpdateUser {
  userId: string;
  email: string;
  username: string;
  fullname?: string;
  age?: string;
  profilePicture?: string;
}
