let username = '';
let difficulty = '';
let inGame = false;

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
    <a href="#start">
      <button id="btn-back" class="btn-menu">Вернуться в меню</button>
    </a>
  `;
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
    window.location.hash = 'game';
  };
};

const displayGame = (parent) => {
  const el = parent;

  let diffcultyStr = '';
  switch (difficulty) {
    case 'easy':
      diffcultyStr = 'Легкий';
      break;
    case 'normal':
      diffcultyStr = 'Обычный';
      break;
    case 'hard':
      diffcultyStr = 'Сложный';
      break;
    default:
      break;
  }

  el.innerHTML = `
    <h2>Уровень сложности: ${diffcultyStr}</h2>
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

  const cube = document.createElement('div');
  cube.setAttribute('id', 'cube');
  container.appendChild(cube);

  btnWatch.onclick = () => {
    cube.style.animationDuration = '2s';
    cube.style.animationName = 'cube';
    btnWatch.style.opacity = 0;
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
