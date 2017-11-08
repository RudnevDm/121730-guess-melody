import LoaderScreen from './loader-screen/loader-screen';
import WelcomeScreen from './welcome/welcome';
import MainResultScreen from './main-result/main-result';
import GameScreen from './game/game';
import Loader from './loader';
import {dataAdapter} from './data/answers-data-adapter';

/**
 * 
 * 
 * @export
 * @class Application
 */

export default class Application {
  static init(answersData) {
    this.answersData = answersData;
  }

  static showLoaderScreen() {
    LoaderScreen.init();
  }

  static showWelcome() {
    WelcomeScreen.init();
  }

  static showGame() {
    GameScreen.init(this.answersData);
  }

  static showMainResultScreen(answersResult) {
    MainResultScreen.init(answersResult);
  }
}

const loadAudio = (sourceSctring) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.loadeddata = resolve;
    audio.src = sourceSctring;
  });
};

const loadImage = (sourceSctring) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = sourceSctring;
  });
};

const loadAllSources = (questions) => {
  const promises = [];

  for (const question of questions) {
    if (question.src) {
      promises.push(loadAudio(question.src));
      question.answers.forEach((answer) => {
        promises.push(loadImage(answer.image.url));
      });
    } else {
      question.answers.forEach((answer) => {
        promises.push(loadAudio(answer.src));
      });
    }
  }
  return promises;
};

let loadedData = null;

Loader.loadData().
    then((gameData) => loadedData = gameData).
    then((data) => loadAllSources(data)).
    then((promiseArray) => Promise.all(promiseArray)).
    then(() => dataAdapter(loadedData)).
    then((answersData) => Application.showWelcome(answersData)).
    catch((error) => window.console.log(`Не удалось загрузить${error.target}`));
