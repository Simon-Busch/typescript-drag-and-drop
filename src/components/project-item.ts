/// <reference path="base-component.ts" />

namespace App {
  	// Project Item
	export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
		// implements call our interface
		private project: Project;

		get persons() {
			if (this.project.people === 1) {
				return '1 person';
			} else {
				return `${this.project.people} persons`;
			}
		}

		constructor(hostId: string, project: Project) {
			super('single-project', hostId, false, project.id);
			this.project = project;

			this.configure();
			this.renderContent();
		}

		@autobind
		dragStartHandler(event: DragEvent) {
			// console.log("drag start",event)
			event.dataTransfer!.setData('text/plain', this.project.id);
			event.dataTransfer!.effectAllowed = 'move';
		}

		dragEndHandler(event: DragEvent) {
			console.log('drag end', event);
		}

		configure() {
			this.element.addEventListener('dragstart', this.dragStartHandler);
			this.element.addEventListener('dragend', this.dragEndHandler);
		}

		renderContent() {
			this.element.querySelector('h2')!.textContent = this.project.title;
			this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
			this.element.querySelector('p')!.textContent = this.project.description;
		}
	}
}