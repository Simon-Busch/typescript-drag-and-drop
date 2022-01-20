import { Project, ProjectStatus } from '../models/project.js';

//Project state management
type Listener<T> = (items: T[]) => void;

class State<T> {
	// accesonly from inherited class
	protected listeners: Listener<T>[] = [];

	addListener(listenerFn: Listener<T>) {
		this.listeners.push(listenerFn);
	}
}


export class ProjectState extends State<Project> {
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {
		super();
	}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addProject(title: string, description: string, numberOfPeople: number) {
		const newProject = new Project(
			Math.random().toString(),
			title,
			description,
			numberOfPeople,
			ProjectStatus.Active
		);
		this.projects.push(newProject);
		this.updateListeners();
	}

	moveProject(projectId: string, newStatus: ProjectStatus) {
		const project = this.projects.find((prj) => prj.id === projectId);
		//project.status !== newStatus -- avoid unnecessary re-render
		if (project && project.status !== newStatus) {
			project.status = newStatus;
			this.updateListeners();
		}
	}

	private updateListeners() {
		for (const listenerFn of this.listeners) {
			// slice to only return a copy of the array and not the original array
			listenerFn(this.projects.slice());
		}
	}
}

// create a singleton to make sure we only have 1 object always the same.
export const projectState = ProjectState.getInstance();