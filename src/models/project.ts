//Project type
export enum ProjectStatus {
  Active,
  Finished
}

export class Project {
  // declaring var directly this way in the constructor is faster
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

