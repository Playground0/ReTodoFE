export enum TaskActions{
    Add = 'add',
    Update = 'update',
    Delete = 'delete',
    Complete = 'complete',
    Undo = 'Undo'
}

export enum ListActions{
    Add = 'add',
    Update = 'update',
    Delete = 'delete',
    Archive = 'archive',
    Hide = 'hide',
    Undo = 'undo'
}

export enum DefaultPanels{
    Today = 'today',
    Upcoming = 'upcoming',
    Inbox = 'inbox',
    Search = 'search',
}

export enum SnackBarAction{
    TaskDeleted = 'Task Deleted',
    TaskArchived = 'Task Archived',
    TaskCompleted = 'Task Completed',
}

export enum SnackBarListAction{
    ListDeleted = 'List Deleted',
    ListArchived = 'List Archived',
    ListHidden = 'List Hidden'
}