export enum AuthPageType{
    Login = 'login',
    Register = 'register',
    ResetPassword = 'reset password',
    LoginMessage= 'Get going!',
    RegisterMessage = 'Tell us about you!',
    ResetPasswordMessage = 'Save it!'
}

export interface ILoginUser{
    email: string,
    password: string
}

export interface ICreateUser{
    username: string,
    email: string,
    password: string,
    fullname?:string,
    phone?:string,
    age?:string,
    profilepicture?:string,
    userRole:string,
}

export interface ILogoutUser{
    email: string
}

export interface IUser{
    email: string,
    id: string,
    userRole: string,
    username: string,
}

export interface IUserAPI extends IUser{
    sessionToken?: string,
}