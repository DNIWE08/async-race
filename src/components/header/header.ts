import BaseComponent from '../../shared/base-component';

export default class PageHeader extends BaseComponent {
  headerBtns: BaseComponent[];

  openGaragePage?: () => void;

  openWinnersPage?: () => void;

  constructor() {
    super(document.body, 'div', ['header']);

    const garageBtn = new BaseComponent(this.element, 'button', ['header-btn', 'active'], 'garage');
    const winnerBtn = new BaseComponent(this.element, 'button', ['header-btn'], 'winners');
    this.headerBtns = [garageBtn, winnerBtn];
    garageBtn.element.onclick = () => {
      if (garageBtn.element.classList.contains('active')) return;
      this.clickHandler();
      garageBtn.element.classList.add('active');
      this.openGaragePage && this.openGaragePage();
    };
    winnerBtn.element.onclick = () => {
      if (winnerBtn.element.classList.contains('active')) return;
      this.clickHandler();
      winnerBtn.element.classList.add('active');
      this.openWinnersPage && this.openWinnersPage();
    };
  }

  clickHandler() {
    this.headerBtns.forEach((btn) => {
      btn.element.classList.remove('active');
    });
  }
}
