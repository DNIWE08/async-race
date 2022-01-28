import BaseComponent from '../../shared/base-component';
import CAR_PICTURE from '../../shared/car-picture';

export default class WinnerCar extends BaseComponent {
  car: BaseComponent;

  carName: BaseComponent;

  carWins: BaseComponent;

  carBestTime: BaseComponent;

  listIndex: BaseComponent;

  constructor(
    parentElement: HTMLElement,
    carName: string,
    carWins: number,
    carBestTime: number,
    carColor: string,
    listIndex: number
  ) {
    super(parentElement, 'div', ['winner-car']);
    this.listIndex = new BaseComponent(this.element, 'p', ['list-index'], `${listIndex}`);
    this.carName = new BaseComponent(this.element, 'p', ['car-name'], `${carName}`);
    this.carWins = new BaseComponent(this.element, 'p', ['car-wins'], `${carWins}`);
    this.carBestTime = new BaseComponent(this.element, 'p', ['car-time'], `${carBestTime}`);
    this.car = new BaseComponent(this.element, 'div', ['winner-car', 'small']);
    this.car.element.innerHTML = CAR_PICTURE;
    this.car.element.style.fill = carColor;
  }
}
