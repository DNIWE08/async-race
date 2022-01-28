import { deleteGarageCar, deleteWinnerCar, getEngineMode, getEngine, getWinners } from '../../services/api';
import BaseComponent from '../../shared/base-component';
import panel from '../control-panel/control-panel';
import garage from '../../pages/garage-page';
import { Engine } from '../../services/api-config';
import CAR_PICTURE from '../../shared/car-picture';
import { ICar, IWinner } from '../../shared/interfaces';
import winner from '../../pages/winner-page';

export default class CarTest extends BaseComponent {
  public carColor: string;

  public carName: string;

  public carId: number;

  private controls: BaseComponent;

  public car: BaseComponent;

  public name: BaseComponent;

  private carTrack: BaseComponent;

  public backBtn: BaseComponent;

  public stratBtn: BaseComponent;

  private removeBtn: BaseComponent;

  private selectBtn: BaseComponent;

  public isDrive: boolean = false;

  public carSpeed: number = 0;

  constructor(parentElement: HTMLElement | null, carColor: string, carName: string, id: number) {
    super(parentElement, 'div', ['car-component']);
    this.element.style.display = 'flex';
    setTimeout(() => {
      this.element.style.opacity = '1';
    }, 300);
    this.carColor = carColor;
    this.carName = carName;
    this.carId = id;

    this.name = new BaseComponent(this.element, 'p', ['car-name']);
    this.name.element.textContent = this.carName;

    this.controls = new BaseComponent(this.element, 'div', ['track-controlls']);
    this.selectBtn = new BaseComponent(this.controls.element, 'button', ['track-controlls-btn', 'select'], 'select');
    this.selectBtn.element.onclick = async () => {
      panel.toggleActive(null, panel.updatePanel);
      this.selectCar();
    };

    this.removeBtn = new BaseComponent(this.controls.element, 'button', ['track-controlls-btn', 'remove'], 'remove');
    this.removeBtn.element.addEventListener(
      'click',
      () => {
        panel.updatePanel.resetValues();
        this.removeCar();
      },
      { once: true }
    );

    this.stratBtn = new BaseComponent(this.controls.element, 'button', ['track-field-btn', 'start'], 'A');
    this.stratBtn.element.onclick = () => {
      panel.toggleActive(null, panel.backAllBtn);
      this.startEngine();
    };

    this.backBtn = new BaseComponent(this.controls.element, 'button', ['track-field-btn', 'back', 'disable'], 'B');
    this.backBtn.element.onclick = async () => {
      await this.stopEngine();
    };

    this.carTrack = new BaseComponent(this.element, 'div', ['car-track']);
    this.car = new BaseComponent(this.carTrack.element, 'div', ['car', 'big']);
    this.car.element.innerHTML = CAR_PICTURE;
    this.car.element.style.fill = this.carColor;
  }

  private async removeCar() {
    deleteGarageCar(this.carId);
    this.destroy();
    const winnerCars = await getWinners();
    winnerCars.forEach(async (car: IWinner) => {
      if (car.id === this.carId) await deleteWinnerCar(this.carId);
    });
    await winner.renderCars();
    await garage.renderCars();
  }

  private selectCar() {
    panel.updatePanel.isUpdate = true;
    panel.updatePanel.currentCar.id = this.carId;
    panel.updatePanel.currentCar.name = this.carName;
    panel.updatePanel.currentCar.color = this.carColor;
    (panel.updatePanel.nameInput.element as HTMLInputElement).value = this.carName;
    (panel.updatePanel.colorInput.element as HTMLInputElement).value = this.carColor;
  }

  public async startEngine() {
    if (!this.isDrive) {
      this.isDrive = true;
      panel.toggleActive(this.stratBtn, this.backBtn);
      const raceData = await getEngineMode(this.carId, Engine.STARTED);
      if (raceData) {
        const raceTime = raceData.distance / raceData.velocity;
        this.animation(raceTime);
        await this.driveMode(raceTime);
      }
    }
  }

  private async driveMode(time: number) {
    const status = await getEngine(this.carId);
    return new Promise((res, rej) => {
      if (status === 200) {
        this.carSpeed = time;
        res(time);
      }
      if (status === 500) {
        this.car.element.style.animationPlayState = 'paused';
      }
    });
  }

  private animation(time: number) {
    this.car.element.style.animationDuration = `${time}ms`;
    this.car.element.classList.add('raceAnimation');
  }

  public async stopEngine() {
    this.isDrive = false;
    panel.toggleActive(this.backBtn, this.stratBtn);
    const raceData = await getEngineMode(this.carId, Engine.STOPPED);
    this.car.element.style.animationPlayState = 'running';
    this.car.element.classList.remove('raceAnimation');
  }
}
