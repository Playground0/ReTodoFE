export interface IPanel{
    panelLinks : IPanelLink[],
    tilte?: string
}

export interface IPanelLink{
    name: string,
    link: string,
    tooltip: string
}
