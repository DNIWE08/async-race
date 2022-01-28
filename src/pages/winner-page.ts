import Nav from '../components/navigation/nav';
import WinnerCar from '../components/winner/winner';
import { getAllCars, getData, getSortedWinners } from '../services/api';
import { path, WINNERS_LIMIT } from '../services/api-config';
import BaseComponent from '../shared/base-component';
import { IUpdateCar, IWinner, SortedType } from '../shared/interfaces';
import Page from '../shared/page';

export class Winner extends Page {
  nav: Nav;

  winnerCars: WinnerCar[];

  winnerList: BaseComponent;

  winnerListOptions: BaseComponent;

  currentSort: SortedType;

  constructor(parentElement: HTMLElement | null) {
    super(parentElement, ['winner-view']);
    this.winnerCars = [];
    this.nav = new Nav(WINNERS_LIMIT);
    this.nav.render(this.element);

    this.currentSort = {
      by: 'null',
      direction: 'ASC',
    };

    this.winnerList = new BaseComponent(this.element, 'div', ['winner-list']);
    this.winnerListOptions = new BaseComponent(this.winnerList.element, 'div', ['winner-car', 'options']);

    let sortWins = true;
    let sortTime = true;

    const listIndex = new BaseComponent(this.winnerListOptions.element, 'p', ['list-index'], `№`);
    listIndex.element.onclick = () => {
      this.currentSort = {
        by: 'null',
        direction: 'ASC',
      };
      this.renderCars();
    };

    const carName = new BaseComponent(this.winnerListOptions.element, 'p', ['car-name'], `Car name`);
    const carWins = new BaseComponent(this.winnerListOptions.element, 'p', ['car-wins', 'max'], `Car wins`);
    carWins.element.onclick = () => {
      this.toggleSortClass(carWins, sortWins);
      this.currentSort = {
        by: 'wins',
        direction: sortWins ? 'DESC' : 'ASC',
      };
      this.renderCars();
      sortWins = !sortWins;
    };

    const carBestTime = new BaseComponent(this.winnerListOptions.element, 'p', ['car-time', 'max'], `Best time`);
    carBestTime.element.onclick = () => {
      this.toggleSortClass(carBestTime, sortTime);
      this.currentSort = {
        by: 'time',
        direction: sortTime ? 'ASC' : 'DESC',
      };
      this.renderCars();
      sortTime = !sortTime;
    };

    const car = new BaseComponent(this.winnerListOptions.element, 'div', [], 'Car');

    this.nav.getData(path.WINNERS);

    this.nav.nextBtn.element.onclick = () => {
      this.clear();
      this.nav.nextPage();
      this.renderCars();
      this.nav.getData(path.WINNERS);
    };

    this.nav.prevBtn.element.onclick = () => {
      this.clear();
      this.nav.prevPage();
      this.renderCars();
      this.nav.getData(path.WINNERS);
    };
  }

  toggleSortClass(el: BaseComponent, param: boolean) {
    if (param) {
      el.element.classList.remove('min');
      el.element.classList.add('max');
    } else {
      el.element.classList.remove('max');
      el.element.classList.add('min');
    }
  }

  async sortByParams() {
    this.clear();
    const res = await getSortedWinners(this.nav.currentPage, 'wins', 'DESC');
  }

  private async getCars() {
    // const cars = await getData(path.WINNERS, this.nav.currentPage, WINNERS_LIMIT);

    const cars = await getSortedWinners(this.nav.currentPage, this.currentSort.by, this.currentSort.direction);
    return cars;
  }

  public async renderCars() {
    this.clear();
    const getCars = await this.getCars();
    const getGarageCars = await getAllCars();
    getCars.cars.forEach((car: IWinner, index: number) => {
      const currentCar = getGarageCars.find((el: IUpdateCar) => car.id === el.id);
      if (currentCar)
        this.winnerCars.push(
          new WinnerCar(
            this.winnerList.element,
            currentCar.name,
            car.wins,
            car.time,
            currentCar.color,
            this.nav.currentPage * 10 - 10 + index + 1
          )
        );
    });
    await this.nav.getData(path.WINNERS);
  }

  private clear() {
    this.winnerCars.forEach((el) => {
      el.destroy();
    });
    this.winnerCars = [];
  }
}

const winner = new Winner(null);

export default winner;
