import CarTest from '../components/car/car';
import panel from '../components/control-panel/control-panel';
import Nav from '../components/navigation/nav';
import { createCar, getData } from '../services/api';
import { GARAGE_LIMIT, path } from '../services/api-config';
import BaseComponent from '../shared/base-component';
import { generateRandomColor, generateRandomName } from '../shared/functions';
import { IUpdateCar } from '../shared/interfaces';
import Page from '../shared/page';

interface ICar {
  name: string;
  color: string;
  id: number;
}

interface IGarage {
  renderCars: (page: number) => void;
}

export class Garage extends Page implements IGarage {
  public cars: Array<CarTest>;

  private nav: Nav;

  carsWrapper: BaseComponent;

  constructor(parentElement: HTMLElement | null) {
    super(parentElement, ['garage-view']);
    this.nav = new Nav(GARAGE_LIMIT);
    panel.render(this.element);
    this.nav.render(this.element);
    this.nav.getData(path.GARAGE);

    this.carsWrapper = new BaseComponent(this.element, 'div', ['garage-cars-wrapper']);

    this.nav.nextBtn.element.onclick = () => {
      this.clear();
      this.nav.nextPage();
      this.renderCars();
    };

    this.nav.prevBtn.element.onclick = () => {
      this.clear();
      this.nav.prevPage();
      this.renderCars();
    };

    this.cars = [];
  }

  public async generateCars() {
    const carsArray = Array.from({ length: 100 }, () => ({ name: generateRandomName(), color: generateRandomColor() }));
    carsArray.forEach((car) => {
      createCar(car);
    });
    await this.renderCars();
  }

  private async getCars() {
    const cars = await getData(path.GARAGE, this.nav.currentPage, GARAGE_LIMIT);
    return cars;
  }

  public async renderCars() {
    panel.toggleActive(panel.backAllBtn, panel.raceAllBtn);
    this.clear();
    const getCars = await this.getCars();
    getCars.cars.forEach((car: IUpdateCar) => {
      this.cars.push(new CarTest(this.carsWrapper.element, car.color, car.name, car.id));
    });
    await this.nav.getData(path.GARAGE);
  }

  private clear() {
    this.cars.forEach((el) => {
      el.element.style.opacity = '0';
      el.element.ontransitionend = () => {
        el.element.style.display = 'none';
        el.destroy();
      };
    });
    this.cars = [];
  }
}

const garage = new Garage(null);

export default garage;
