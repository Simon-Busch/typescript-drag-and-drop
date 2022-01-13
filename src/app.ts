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
  return adjDescription
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
    this.element.id = "user-input";

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    this.configure();
    this.attach();
	}

  @autobind // call the decorator
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputElement.value);
    console.log(this.descriptionInputElement.value);
    console.log(this.peopleInputElement.value);
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