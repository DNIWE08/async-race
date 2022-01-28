import { createCar, createWinner, getWinners, updateCar, updateWinner } from '../../services/api';
import { IUpdateCar, IWinner, IUpadateWinner } from '../../shared/interfaces';
import BaseComponent from '../../shared/base-component';
import CarTest from '../car/car';
import garage from '../../pages/garage-page';
import winner from '../../pages/winner-page';

class CreatePanel extends BaseComponent {
  private nameInput: BaseComponent;

  private colorInput: BaseComponent;

  private createBtn: BaseComponent;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', ['panel-create', 'panel-wrapper']);
    this.nameInput = new BaseComponent(this.element, 'input', ['name-input']);
    (this.nameInput.element as HTMLInputElement).type = 'text';

    this.colorInput = new BaseComponent(this.element, 'input', ['color-input']);
    (this.colorInput.element as HTMLInputElement).type = 'color';

    this.createBtn = new BaseComponent(this.element, 'button', ['create-btn'], 'create');
    this.createBtn.element.onclick = () => {
      this.createCar();
    };
  }

  private async createCar() {
    const name = (this.nameInput.element as HTMLInputElement).value;
    const color = (this.colorInput.element as HTMLInputElement).value;
    if (name.length <= 0 && color === '#000000') {
      const popup = new BaseComponent(garage.element, 'div', ['winner-popup']);
      const winnerInfoTime = new BaseComponent(
        popup.element,
        'p',
        ['winner-popup-info'],
        'Enter name and select color ...'
      );
      const confirm = new BaseComponent(popup.element, 'button', ['winner-popup-btn'], 'Confirm');
      confirm.element.addEventListener('click', () => popup.destroy(), { once: true });
      setTimeout(() => {
        popup.destroy();
      }, 5000);
      return false;
    }
    const newCar = await createCar({ name, color });
    garage.renderCars();
    (this.nameInput.element as HTMLInputElement).value = '';
    (this.colorInput.element as HTMLInputElement).value = '#000000';

    return newCar;
  }
}

class UpdatePanel extends BaseComponent {
  public nameInput: BaseComponent;

  public colorInput: BaseComponent;

  private createBtn: BaseComponent;

  public currentCar: IUpdateCar = { id: 0, name: '', color: '' };

  public isUpdate: boolean;

  constructor(parentElement: HTMLElement) {
    super(parentElement, 'div', ['panel-update', 'disable', 'panel-wrapper']);
    this.isUpdate = false;
    this.nameInput = new BaseComponent(this.element, 'input', ['name-input']);
    (this.nameInput.element as HTMLInputElement).type = 'text';

    this.colorInput = new BaseComponent(this.element, 'input', ['color-input']);
    (this.colorInput.element as HTMLInputElement).type = 'color';

    this.createBtn = new BaseComponent(this.element, 'button', ['create-btn'], 'update');
    this.createBtn.element.onclick = () => {
      panel.toggleActive(this, null);
      this.updateCar();
    };
  }

  private async updateCar() {
    if (!this.isUpdate) {
      const popup = new BaseComponent(garage.element, 'div', ['winner-popup']);
      const winnerInfoTime = new BaseComponent(popup.element, 'p', ['winner-popup-info'], 'Select car to update ...');
      const confirm = new BaseComponent(popup.element, 'button', ['winner-popup-btn'], 'Confirm');
      confirm.element.addEventListener('click', () => popup.destroy(), { once: true });
      setTimeout(() => {
        popup.destroy();
      }, 5000);
      return false;
    }
    this.currentCar.name = (this.nameInput.element as HTMLInputElement).value;
    this.currentCar.color = (this.colorInput.element as HTMLInputElement).value;
    await updateCar(this.currentCar.id, this.currentCar);
    garage.cars.forEach((el: CarTest) => {
      if (el.carId === this.currentCar.id) {
        el.carName = this.currentCar.name;
        el.name.element.textContent = this.currentCar.name;
        el.carColor = this.currentCar.color;
        el.car.element.style.fill = this.currentCar.color;
      }
    });
    this.resetValues();
    winner.renderCars();

    return garage.cars;
  }

  private resetInputs() {
    (this.nameInput.element as HTMLInputElement).value = '';
    (this.colorInput.element as HTMLInputElement).value = '#000000';
  }

  public resetValues() {
    this.isUpdate = false;
    this.currentCar = { id: 0, name: '', color: '' };
    this.resetInputs();
  }
}

export class ControlPanel extends BaseComponent {
  private createPanel: CreatePanel;

  public updatePanel: UpdatePanel;

  private generatePanel: BaseComponent;

  public raceAllBtn: BaseComponent;

  public backAllBtn: BaseComponent;

  private generateBtn: BaseComponent;

  constructor(parentElement: HTMLElement | null) {
    super(parentElement, 'div', ['control-panel']);
    this.createPanel = new CreatePanel(this.element);
    this.updatePanel = new UpdatePanel(this.element);
    this.generatePanel = new BaseComponent(this.element, 'div', ['generate-panel', 'panel-wrapper']);

    this.raceAllBtn = new BaseComponent(this.generatePanel.element, 'button', [], 'race');
    this.raceAllBtn.element.onclick = () => {
      this.toggleActive(this.raceAllBtn, this.backAllBtn);
      this.raceAll();
    };

    this.backAllBtn = new BaseComponent(this.generatePanel.element, 'button', ['disable'], 'back');
    this.backAllBtn.element.onclick = () => {
      this.toggleActive(this.backAllBtn, this.raceAllBtn);
      garage.cars.forEach((car: CarTest) => {
        this.toggleActive(car.backBtn, car.stratBtn);
        car.stopEngine();
      });
    };

    this.generateBtn = new BaseComponent(this.generatePanel.element, 'button', [], 'generate');
    this.generateBtn.element.onclick = () => {
      garage.generateCars();
    };
  }

  private async raceAll() {
    const raceCars: Promise<CarTest>[] = garage.cars.map(async (car) => {
      this.toggleActive(car.stratBtn, car.backBtn);
      if (car.isDrive) await car.stopEngine();
      await car.startEngine();
      return car;
    });

    const getRaceWinner = await Promise.race(raceCars);

    const newWinner: IWinner = {
      id: getRaceWinner.carId,
      wins: 1,
      time: Number((getRaceWinner.carSpeed / 1000).toFixed(2)),
    };

    const raceWinners = await getWinners();
    const checkWinner: IWinner = raceWinners.find((car: IWinner) => car.id === newWinner.id);

    if (checkWinner) {
      const bestTime = Math.min(newWinner.time, checkWinner.time);
      const currentWins = checkWinner.wins + 1;
      const updatedWinner: IUpadateWinner = { time: bestTime, wins: currentWins };
      await updateWinner(checkWinner.id, updatedWinner);
    } else {
      await createWinner(newWinner);
    }

    this.showWinnerPopup(getRaceWinner);
    winner.renderCars();
  }

  showWinnerPopup(data: CarTest) {
    const popup = new BaseComponent(garage.element, 'div', ['winner-popup']);
    const winnerInfoTime = new BaseComponent(popup.element, 'p', ['winner-popup-info']);
    winnerInfoTime.element.textContent = `${data.carName} won! His time: ${(data.carSpeed / 1000).toFixed(2)}`;
    const confirm = new BaseComponent(popup.element, 'button', ['winner-popup-btn'], 'Confirm');
    confirm.element.addEventListener('click', () => popup.destroy(), { once: true });
    setTimeout(() => {
      popup.destroy();
    }, 5000);
  }

  public toggleActive(toDisable: BaseComponent | null = null, toActive: BaseComponent | null = null) {
    toDisable?.element.classList.add('disable');
    toActive?.element.classList.remove('disable');
  }
}

const panel = new ControlPanel(null);

export default panel;
