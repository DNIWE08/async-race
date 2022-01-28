import BaseComponent from './base-component';

interface IPage {
  show: () => void;
  hide: () => void;
}

export default class Page extends BaseComponent implements IPage {
  constructor(parentElement: HTMLElement | null, classes: string[]) {
    super(parentElement, 'div', classes);
  }

  show() {
    this.element.classList.remove('hide');
  }

  hide() {
    this.element.classList.add('hide');
  }
}
