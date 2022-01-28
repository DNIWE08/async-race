import { getData } from '../../services/api';
import BaseComponent from '../../shared/base-component';

export default class Nav extends BaseComponent {
  public currentPage: number = 1;

  private totalCars: number = 0;

  public nextBtn: BaseComponent;

  public prevBtn: BaseComponent;

  public current: BaseComponent;

  private total: BaseComponent;

  private pageName: BaseComponent;

  private pagesCount: number = 1;

  private limit: number;

  constructor(limit: number) {
    super(null, 'nav', ['page-nav']);
    this.limit = limit;

    this.pageName = new BaseComponent(this.element, 'h2', ['current-page-name']);
    this.pageName.element.textContent = limit === 7 ? 'Garage' : 'Winners';

    this.current = new BaseComponent(this.element, 'p', ['current-page']);
    this.total = new BaseComponent(this.element, 'p', ['total-cars']);

    this.prevBtn = new BaseComponent(this.element, 'button', ['prev-page', 'nav-btn', 'disable'], 'prev');
    this.prevBtn.element.onclick = () => {
      this.prevPage();
    };
    this.nextBtn = new BaseComponent(this.element, 'button', ['next-page', 'nav-btn'], 'next');
    this.nextBtn.element.onclick = () => {
      this.nextPage();
    };
  }

  public async getData(path: string) {
    const cars = await getData(path);
    const count = Number(cars.count);
    this.totalCars = count;
    this.pagesCount = Math.ceil(this.totalCars / this.limit);
    this.current.element.textContent = `Page № ${this.currentPage.toString()} (${this.pagesCount})`;
    this.total.element.textContent = `Total cars ${count}`;
    this.currentPage < this.pagesCount
      ? this.nextBtn.element.classList.remove('disable')
      : this.nextBtn.element.classList.add('disable');
  }

  public nextPage() {
    this.currentPage += 1;
    this.prevBtn.element.classList.remove('disable');
  }

  public prevPage() {
    this.currentPage -= 1;
    if (this.currentPage - 1 === 0) this.prevBtn.element.classList.add('disable');
    if (this.pagesCount > 1) this.nextBtn.element.classList.remove('disable');
  }
}
