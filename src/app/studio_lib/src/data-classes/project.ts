export interface IProject{
    id: string;
    public: boolean;
    name: string;
    owners: string[];
}

export class Project{
    id: string;
    public: boolean;
    name: string;
    owners: string[];

    constructor(){
        this.id = 'default';
        this.name = 'defaultname';
        this.owners = [];
        this.public = true;
    }
}
