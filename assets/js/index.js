let username = '';
let difficulty = '';
let inGame = false;
let userScore = 0;
let scoreDiff = 0;
let beforeNextGame = 0;

const getRandomInt = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;

const getRandomFloat = (start, end) => Math.random() * (end - start) + start;

const Cube = class {
  constructor(parent) {
    this.parent = parent;

    this.el = document.createElement('div');
    this.el.setAttribute('id', 'cube');

    this.parent.appendChild(this.el);
    switch (difficulty) {
      case 'easy':
        this.el.style.background = 'var(--accent-purple)';
        break;
      case 'bonus':
        this.el.style.background = 'var(--accent-purple)';
        break;
      case 'normal':
        this.el.style.background = 'var(--accent-blue)';
        break;
      case 'hard':
        this.el.style.background = 'var(--accent-red)';
        break;
      default:
        break;
    }

    this.isDown = false;

    this.offsetX = 0;
    this.offsetY = 0;

    this.posX = 0;
    this.posY = 0;

    this.el.onmousedown = (ev) => { this.onMouseDown(ev); };

    this.timeTable = {};
    this.startTime = false;
    this.stop = false;
  }

  onMouseDown(event) {
    if (this.stop) return;

    this.isDown = true;
    this.offsetX = this.el.offsetLeft - event.clientX;
    this.offsetY = this.el.offsetTop - event.clientY;

    if (this.animationID === 1 || this.animationID === 4) {
      this.moveCount = 1;
    } else if (this.animationID === 2 || this.animationID === 3) {
      this.moveCount = 9;
    }
    this.startTime = true;
  }

  updatePos() {
    if (this.posX < 0) {
      this.posX = 0;
    }

    if (this.posY < 0) {
      this.posY = 0;
    }

    if (this.posX + this.el.clientWidth > this.parent.clientWidth) {
      this.posX = this.parent.clientWidth - this.el.clientWidth;
    }

    if (this.posY + this.el.clientHeight > this.parent.clientHeight) {
      this.posY = this.parent.clientHeight - this.el.clientHeight;
    }

    const pX = (this.posX / this.parent.clientWidth) * 100;
    const pY = (this.posY / this.parent.clientHeight) * 100;

    if (this.animationID === 1 || this.animationID === 2) {
      this.el.style.left = `${pX}%`;
      this.checkDiff(pX + 4);
    } else if (this.animationID === 3 || this.animationID === 4) {
      this.el.style.top = `${pY}%`;
      this.checkDiff(pY + 4);
    }
  }

  checkDiff(pNew) {
    const d = 92 / 10;
    const distance = d * this.moveCount + 4;

    if (this.startTime) {
      this.timeStart = Date.now();
      this.startTime = false;
    }

    if (this.animationID === 1 || this.animationID === 4) {
      if (pNew >= distance - 0.1) {
        const timeEnd = Date.now();

        this.timeTable[10 * this.moveCount] = timeEnd - this.timeStart;
        this.timeStart = timeEnd;
        this.moveCount += 1;

        console.log(this.timeTable);
        console.log(pNew);
        console.log(distance);
      }
    } else if (this.animationID === 2 || this.animationID === 3) {
      if (pNew <= distance + 0.1) {
        const timeEnd = Date.now();

        this.timeTable[10 * (this.moveCount + 1)] = timeEnd - this.timeStart;
        this.timeStart = timeEnd;
        this.moveCount -= 1;

        console.log(this.timeTable);
        console.log(pNew);
        console.log(distance);
      }
    }
  }

  setAnimationId(animationID) {
    this.animationID = animationID;

    switch (this.animationID) {
      case 1:
        this.el.classList.add('cube-left');
        break;
      case 2:
        this.el.classList.add('cube-right');
        break;
      case 3:
        this.el.classList.add('cube-bottom');
        break;
      case 4:
        this.el.classList.add('cube-top');
        break;
      default:
        break;
    }
  }

  animate(animationCode, timeAnswer) {
    this.el.style.animationDuration = `${timeAnswer}s`;
    this.el.style.animationName = `cube-${difficulty}-${animationCode}`;
    if (this.animationID === 2 || this.animationID === 3) {
      this.el.style.animationDirection = 'reverse';
    }
  }
};

const getDiffcultyStr = () => {
  switch (difficulty) {
    case 'easy':
      return 'Легкий';
    case 'bonus':
      return 'Бонус';
    case 'normal':
      return 'Обычный';
    case 'hard':
      return 'Сложный';
    default:
      return '';
  }
};

const getTimeAnswer = () => {
  switch (difficulty) {
    case 'easy':
      return getRandomFloat(1, 4);
    case 'bonus':
      return getRandomInt(1, 4);
    case 'normal':
      return getRandomFloat(2, 5);
    case 'hard':
      return getRandomFloat(3, 6);
    default:
      return 0;
  }
};

const calcScore = (input, answer) => {
  const maxScore = 5;
  const diff = (answer - input) ** 2;
  if (diff === 0) {
    return maxScore;
  }

  const score = 1 / diff;
  if (score > 5) {
    return maxScore;
  }
  return score;
};

const getScores = () => {
  const scores = JSON.parse(localStorage.getItem('scores'));
  if (scores === null) {
    return [];
  }
  return scores;
};

const saveScore = () => {
  const scores = getScores();
  scores.push({ user: username, score: userScore });
  localStorage.setItem('scores', JSON.stringify(scores));
};

const quitGame = () => {
  inGame = false;
  saveScore();
  window.location.hash = 'score';
};

const displayStart = (parent) => {
  const el = parent;
  el.innerHTML = `
    <a href="#authorize">
      <button id="btn-start" class="btn-menu">Играть</button>
    </a>
    <a href="#score">
      <button id="btn-score" class="btn-menu">Таблица Рейтинга</button>
    </a>
  `;
};

const displayScore = (parent) => {
  const el = parent;
  el.innerHTML = `
    <h2>Рейтинговая Таблица</h2>
    <table>
      <tbody id="score-table">
      <tr>
        <th>Пользователь</th>
        <th>Очки</th>
      </tr>
      </tbody>
    </table>
    <a>
      <button id="btn-clear" class="btn-menu">Очистить таблицу</button>
    </a>
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;

  const table = document.getElementById('score-table');
  const scores = getScores();
  scores.sort((a, b) => b.score - a.score);

  scores.forEach((entry) => {
    const row = document.createElement('tr');

    const col1 = document.createElement('td');
    col1.innerHTML = entry.user;
    row.appendChild(col1);

    const col2 = document.createElement('td');
    col2.innerHTML = entry.score.toFixed(2);
    row.appendChild(col2);

    table.appendChild(row);
  });

  const btnClear = document.getElementById('btn-clear');
  btnClear.onclick = () => {
    localStorage.clear();
    showPage('score');
  };
};

const displayAuthorize = (parent) => {
  const el = parent;
  el.innerHTML = `
    <h2>Введите имя</h2>
    <input type="text" id="username"></input>
    <a>
      <button id="btn-username" class="btn-menu">Ок</button>
    </a>
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;

  const btn = document.getElementById('btn-username');
  const input = document.getElementById('username');

  const checkInput = (val) => {
    const re = /^[a-zA-Z0-9]+$/;
    return val.match(re) === null;
  };

  const submitInput = () => {
    if (checkInput(input.value)) {
      return;
    }
    username = input.value;

    difficulty = 'easy';
    inGame = true;
    userScore = 0;
    beforeNextGame = getRandomInt(3, 5);
    window.location.hash = 'game';
  };

  input.oninput = () => {
    if (checkInput(input.value)) {
      input.style.background = 'var(--accent-red)';
      return;
    }
    input.style.background = 'var(--accent-green)';
  };

  btn.onclick = () => {
    submitInput();
  };

  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitInput();
    }
  };
};

const chooseNextLevel = () => {
  beforeNextGame = getRandomInt(3, 5);
  switch (difficulty) {
    case 'easy':
      difficulty = 'bonus';
      showPage('game');
      break;
    case 'bonus':
      difficulty = 'normal';
      showPage('game');
      break;
    case 'normal':
      difficulty = 'hard';
      showPage('game');
      break;
    case 'hard':
      quitGame();
      break;
    default:
      break;
  }
};

const predictTimeCheckInput = (val) => {
  const time = parseFloat(val);
  return Number.isNaN(time);
};

const predictTimeCheckAnswer = (input, answer) => {
  if (predictTimeCheckInput(input.value)) {
    return;
  }
  console.log(answer);
  const score = calcScore(parseFloat(input.value), answer);
  scoreDiff = score;
  userScore += score;

  if (beforeNextGame === 0) {
    chooseNextLevel();
  } else {
    beforeNextGame -= 1;
    showPage('game');
  }
};

const setupBonusGame = (cube) => {
  const c = cube;

  document.onmousemove = (ev) => {
    ev.preventDefault();

    if (c.isDown) {
      c.posX = ev.clientX + c.offsetX;
      c.posY = ev.clientY + c.offsetY;
      c.updatePos();
    }
  };

  document.onmouseup = () => {
    c.isDown = false;
    c.stop = true;
  };
};

const displayGame = (parent) => {
  const el = parent;

  const diffcultyStr = getDiffcultyStr();
  const timeAnswer = getTimeAnswer();

  el.innerHTML = `
    <h2>Уровень: ${diffcultyStr}</h2>
    <h3>Очки: ${userScore.toFixed(2)} (+${scoreDiff.toFixed(2)})</h3>
    ${
  difficulty === 'bonus'
    ? `<p>Перетащие кубик на другую сторону за ${timeAnswer} секунд</p>`
    : '<p>Угадайте за какое время (секунд) куб пройдет свой путь</p>'
}
    <div id="game-container">
      <div id="game"></div>
    </div>
    <a>
      <button id="btn-watch" class="btn-menu">Посмотреть</button>
    </a>
    <input type="text" id="time"></input>
    <a>
      <button id="btn-answer" class="btn-menu">Ввести ответ</button>
    </a>
    <a>
      <button id="btn-quit" class="btn-menu">Закончить игру</button>
    </a>
  `;

  const container = document.getElementById('game');
  const cube = new Cube(container);
  if (difficulty === 'bonus') {
    setupBonusGame(cube);
  }

  const input = document.getElementById('time');
  const btnWatch = document.getElementById('btn-watch');
  const btnAnswer = document.getElementById('btn-answer');

  const btnQuit = document.getElementById('btn-quit');
  btnQuit.onclick = quitGame;

  const animationID = getRandomInt(1, 4);
  cube.setAnimationId(animationID);

  // const animationID = 3;
  beforeNextGame = 0;
  const animationCode = Math.floor((animationID + 1) / 2);

  const path = document.createElement('div');
  path.classList.add('path');
  path.style.backgroundImage = `url(/assets/img/path-${difficulty}.svg)`;
  container.appendChild(path);

  if (animationCode === 2) {
    path.style.transform = 'rotate(270deg)';
  }

  input.oninput = () => {
    if (predictTimeCheckInput(input.value)) {
      input.style.background = 'var(--accent-red)';
      return;
    }
    input.style.background = 'var(--accent-green)';
  };

  btnWatch.onclick = () => {
    cube.animate(animationCode, timeAnswer);
    btnWatch.style.opacity = 0;
  };

  btnAnswer.onclick = () => {
    predictTimeCheckAnswer(input, timeAnswer);
  };

  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      predictTimeCheckAnswer(input, timeAnswer);
    }
  };
};

const display404 = (parent) => {
  const el = parent;
  el.innerHTML = `
    <h2>Страница не найдена</h2>
    <p>Извините, но запрашиваемая страница не существует.</p>
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;
};

const showPage = (pageId) => {
  const contentDiv = document.getElementById('content');
  switch (pageId) {
    case 'start':
      displayStart(contentDiv);
      break;
    case 'score':
      displayScore(contentDiv);
      break;
    case 'authorize':
      displayAuthorize(contentDiv);
      break;
    case 'game':
      if (inGame) {
        displayGame(contentDiv);
      } else {
        window.location.hash = 'authorize';
      }
      break;
    default:
      display404(contentDiv);
      break;
  }
};

const getHashName = (hash) => hash.split('#')[1];

const handleHashChange = () => {
  const theHash = window.location.hash;
  if (theHash.length === 0) {
    window.location.hash = 'start';
  }
  return getHashName(theHash);
};

window.addEventListener('hashchange', () => {
  const currentHash = handleHashChange();
  console.log(`hashchange event: ${currentHash}`);
  showPage(currentHash);
});

window.addEventListener('DOMContentLoaded', () => {
  const currentHash = handleHashChange();
  console.log(`DOMContentLoaded event: ${currentHash}`);
  if (currentHash) {
    showPage(currentHash);
  }
});
