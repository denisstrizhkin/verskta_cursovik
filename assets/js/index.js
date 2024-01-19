let username = '';
let difficulty = '';
let inGame = false;
let userScore = 0;
let beforeNextGame = 0;

const getRandomInt = (start, end) => Math.floor(Math.random() * (end - start + 1)) + start;

const getRandomFloat = (start, end) => Math.random() * (end - start) + start;

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
    <table id="score-table">
      <tr>
        <th>Пользователь</th>
        <th>Очки</th>
      </tr>
    </table>
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;

  const table = document.getElementById('score-table');
  const scores = getScores();
  scores.forEach((entry) => {
    console.log(entry);
    const row = document.createElement('tr');

    const col1 = document.createElement('td');
    col1.innerHTML = entry.user;
    row.appendChild(col1);

    const col2 = document.createElement('td');
    col2.innerHTML = entry.score.toString();
    row.appendChild(col2);

    table.appendChild(row);
  });
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

  btn.onclick = () => {
    const val = input.value;
    const re = /^[a-zA-Z0-9]+$/;
    if (val.match(re) === null) {
      console.log('bad username');
      return;
    }
    console.log('username ok');
    username = val;

    difficulty = 'easy';
    inGame = true;
    userScore = 0;
    beforeNextGame = getRandomInt(3, 5);
    window.location.hash = 'game';
  };
};

const displayGame = (parent) => {
  const el = parent;

  const cube = document.createElement('div');
  cube.setAttribute('id', 'cube');

  let diffcultyStr = '';
  switch (difficulty) {
    case 'easy':
      diffcultyStr = 'Легкий';
      cube.style.background = 'var(--accent-purple)';
      break;
    case 'normal':
      diffcultyStr = 'Обычный';
      cube.style.background = 'var(--accent-blue)';
      break;
    case 'hard':
      diffcultyStr = 'Сложный';
      cube.style.background = 'var(--accent-red)';
      break;
    default:
      break;
  }

  el.innerHTML = `
    <h2>Уровень: ${diffcultyStr} | Очки: ${userScore}</h2>
    <p>Угадайте за какое время (секунд) куб пройдет свой путь</p>
    <div id="game-container"></div>
    <a>
      <button id="btn-watch" class="btn-menu">Посмотреть</button>
    </a>
    <input type="text" id="time"></input>
    <a>
      <button id="btn-answer" class="btn-menu">Ввести ответ</button>
    </a>
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;

  const container = document.getElementById('game-container');
  const input = document.getElementById('time');
  const btnWatch = document.getElementById('btn-watch');
  const btnAnswer = document.getElementById('btn-answer');

  container.appendChild(cube);

  const timeAnswer = getRandomFloat(2, 4);
  // const animationID = getRandomInt(1, 4);
  const animationID = 3;
  beforeNextGame = 0;

  switch (animationID) {
    case 1:
      cube.classList.add('cube-left');
      break;
    case 2:
      cube.classList.add('cube-right');
      break;
    case 3:
      cube.classList.add('cube-bottom');
      break;
    case 4:
      cube.classList.add('cube-top');
      break;
    default:
      break;
  }

  btnWatch.onclick = () => {
    cube.style.animationDuration = `${timeAnswer}s`;
    cube.style.animationName = `cube-${difficulty}-${Math.floor((animationID + 1) / 2)}`;
    if (animationID === 2 || animationID === 3) {
      cube.style.animationDirection = 'reverse';
    }

    btnWatch.style.opacity = 0;
  };

  btnAnswer.onclick = () => {
    const val = input.value;
    const time = parseFloat(val);

    if (Number.isNaN(time)) {
      console.log('bad time');
      return;
    }
    console.log('time ok');
    const score = timeAnswer - time;
    console.log(score);
    userScore += score;

    if (beforeNextGame === 0) {
      beforeNextGame = getRandomInt(3, 5);
      switch (difficulty) {
        case 'easy':
          difficulty = 'normal';
          showPage('game');
          break;
        case 'normal':
          difficulty = 'hard';
          showPage('game');
          break;
        case 'hard':
          inGame = false;
          saveScore();
          window.location.hash = 'score';
          break;
        default:
          break;
      }
    }
    beforeNextGame -= 1;
    showPage('game');

    // window.location.hash = 'game';
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
