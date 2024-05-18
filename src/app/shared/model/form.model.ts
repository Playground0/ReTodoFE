export interface IFormControlBody{
    controlLabel: string,
    controlName: string,
    controlType: string,
    controlValidation?: unknown
}

export interface ICustomFormBody{
    controls: IFormControlBody[],
    formName: string,
    btnNames: string[]
}