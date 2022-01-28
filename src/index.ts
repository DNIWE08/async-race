import './style.scss';
import garage from './pages/garage-page';
import BaseComponent from './shared/base-component';
import winner from './pages/winner-page';
import PageHeader from './components/header/header';

class App {
  constructor() {
    const header = new PageHeader();
    header.openGaragePage = () => {
      garage.show();
      winner.hide();
    };

    header.openWinnersPage = async () => {
      garage.hide();
      winner.show();
    };

    const wrapper = new BaseComponent(document.body, 'div', ['wrapper']);
    garage.render(wrapper.element);
    winner.render(wrapper.element);
    winner.hide();
  }
}

window.onload = () => {
  const app = new App();
  garage.renderCars();
  winner.renderCars();
};
