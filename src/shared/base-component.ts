interface IBaseComponent {
  destroy: () => void;
}

export default class BaseComponent implements IBaseComponent {
  element: HTMLElement;

  constructor(
    parentElement: HTMLElement | null,
    tagName: string = 'div',
    classes: string[] = [],
    textContent: string = ''
  ) {
    const element = document.createElement(tagName);
    element.classList.add(...classes);
    element.textContent = textContent;
    this.element = element;
    if (parentElement) parentElement.append(this.element);
  }

  render(parent: HTMLElement) {
    parent.append(this.element);
  }

  destroy(): void {
    this.element.remove();
  }
}
