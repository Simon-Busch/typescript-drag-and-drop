//Project type
enum ProjectStatus {
	Active,
	Finished
}
class Project {
	// declaring var directly this way in the constructor is faster
	constructor(
		public id: string,
		public title: string,
		public description: string,
		public people: number,
		public status: ProjectStatus
	) {}
}

type Listener = (items: Project[]) => void;

//Project state management

class ProjectState {
	private listeners: Listener[] = [];
	private projects: Project[] = [];
	private static instance: ProjectState;

	private constructor() {}

	static getInstance() {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new ProjectState();
		return this.instance;
	}

	addListener(listenerFn: Listener) {
		this.listeners.push(listenerFn);
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
		for (const listenerFn of this.listeners) {
			// slice to only return a copy of the array and not the original array
			listenerFn(this.projects.slice());
		}
	}
}

// create a singleton to make sure we only have 1 object always the same.
const projectsState = ProjectState.getInstance();

//autobind decorator
function autobind(_: any, _2: string, description: PropertyDescriptor) {
	const originalMethod = description.value;
	const adjDescription: PropertyDescriptor = {
		configurable: true,
		get() {
			const boundFn = originalMethod.bind(this);
			return boundFn;
		}
	};
	return adjDescription;
}

// validation
interface Validatable {
	value: string | number;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
}

function validate(validatableInput: Validatable) {
	let isValid = true;
	if (validatableInput.required) {
		isValid = isValid && validatableInput.value.toString().trim().length !== 0;
	}

	if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
	}

	if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
		isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
	}

	if (validatableInput.min != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value >= validatableInput.min;
	}

	if (validatableInput.max != null && typeof validatableInput.value === 'number') {
		isValid = isValid && validatableInput.value <= validatableInput.max;
	}

	return isValid;
}

// project list class
class ProjectList {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	element: HTMLElement;
	assignedProject: Project[];

	constructor(private type: 'active' | 'finished') {
		this.templateElement = document.getElementById('project-list') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;
		this.assignedProject = [];
		//render in the DOM
		const importedHTMLContent = document.importNode(this.templateElement.content, true);
		this.element = importedHTMLContent.firstElementChild as HTMLElement;
		this.element.id = `${this.type}-projects`;

		projectsState.addListener((projects: Project[]) => {
			this.assignedProject = projects;
			this.renderProjects();
		});

		this.attach();
		this.renderContent();
	}

	private renderProjects() {
		const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
		for (const projItem of this.assignedProject) {
			// prokItem = {  id: Math.random().toString(), title: title, description: description,  people: numberOfPeople }
			const listItem = document.createElement('li');
			listItem.textContent = projItem.title;
			listEl.appendChild(listItem);
		}
	}

	private renderContent() {
		const listId = `${this.type}-projects-list`;
		this.element.querySelector('ul')!.id = listId;
		this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
	}

	private attach() {
		this.hostElement.insertAdjacentElement('beforeend', this.element);
	}
}

//project Input class
class ProjectInput {
	templateElement: HTMLTemplateElement; // from "dom" in lib  - config
	hostElement: HTMLDivElement;
	element: HTMLFormElement;
	titleInputElement: HTMLInputElement;
	descriptionInputElement: HTMLInputElement;
	peopleInputElement: HTMLInputElement;

	constructor() {
		this.templateElement = document.getElementById('project-input') as HTMLTemplateElement;
		this.hostElement = document.getElementById('app') as HTMLDivElement;

		//render in the DOM
		const importedHTMLContent = document.importNode(this.templateElement.content, true); // true is for deep clone
		this.element = importedHTMLContent.firstElementChild as HTMLFormElement;
		this.element.id = 'user-input';

		this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
		this.configure();
		this.attach();
	}

	private gatherUserInput(): [string, string, number] | void {
		// void to handle the error -> no tupple returned
		const enteredTitle = this.titleInputElement.value;
		const enteredDescript = this.descriptionInputElement.value;
		const enteredPeople = this.peopleInputElement.value;

		const titleValidatable: Validatable = {
			value: enteredTitle,
			required: true
		};

		const descriptionValidatable: Validatable = {
			value: enteredDescript,
			required: true,
			minLength: 5
		};

		const peopleValidatable: Validatable = {
			value: +enteredPeople,
			required: true,
			min: 1,
			max: 10
		};

		//check if one fail
		if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
			alert('invalid input, please try again');
			return;
		} else {
			return [ enteredTitle, enteredDescript, +enteredPeople ];
		}
	}

	private clearInputs() {
		this.titleInputElement.value = '';
		this.descriptionInputElement.value = '';
		this.peopleInputElement.value = '';
	}

	@autobind // call the decorator
	private submitHandler(event: Event) {
		event.preventDefault();
		const userInput = this.gatherUserInput();
		if (Array.isArray(userInput)) {
			const [ title, description, people ] = userInput;
			projectsState.addProject(title, description, people);
			this.clearInputs();
		}
	}

	private configure() {
		this.element.addEventListener('submit', this.submitHandler);
		// important to bind to refer to the class
	}

	private attach() {
		this.hostElement.insertAdjacentElement('afterbegin', this.element);
	}
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
