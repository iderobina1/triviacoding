var currentQuestion = 0;
var time = 100;
var score = 0;
var timerId;

var questions = document.getElementById('questions');
var timer = document.getElementById('time');
var scoreValue = document.getElementById('scoreValue');
var choices = document.getElementById('choices');
var submit = document.getElementById('submit');
var start = document.getElementById('start');
var nameInput = document.getElementById('nameinitial');
var scoreList = document.getElementById('scoreList');

var questionsData = [
  {
    title: 'Commonly used data types DO NOT include:',
    choices: ['strings', 'booleans', 'alerts', 'numbers'],
    answer: 'alerts',
  },
  {
    title: 'The condition in an if / else statement is enclosed within ____.',
    choices: ['quotes', 'curly brackets', 'parentheses', 'square brackets'],
    answer: 'curly brackets',
  },
  {
    title: 'Arrays in JavaScript can be used to store ____.',
    choices: [
      'numbers and strings',
      'other arrays',
      'booleans',
      'all of the above',
    ],
    answer: 'all of the above',
  },
  {
    title:
      'String values must be enclosed within ____ when being assigned to variables.',
    choices: ['commas', 'curly brackets', 'quotes', 'parentheses'],
    answer: 'quotes',
  },
  {
    title:
      'A very useful tool used during development and debugging for printing content to the debugger is:',
    choices: ['JavaScript', 'terminal / bash', 'for loops', 'console.log'],
    answer: 'console.log',
  },
];

function startQuiz() {
  var startScreen = document.getElementById('screen');
  startScreen.style.display = 'none';

  var questionsSection = document.getElementById('questions');
  questionsSection.style.display = 'block';

  timerId = setInterval(clockTick, 1000);

  timer.textContent = time;

  getQuestion();
}

function getQuestion() {
  var currentQuestionData = questionsData[currentQuestion];

  var titleEl = document.getElementById('qtitle');
  titleEl.textContent = currentQuestionData.title;

  choices.innerHTML = '';

  for (var i = 0; i < currentQuestionData.choices.length; i++) {
    var choice = currentQuestionData.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    choices.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  if (!buttonEl.matches('.choice')) {
    return;
  }

  if (buttonEl.value !== questionsData[currentQuestion].answer) {
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    timer.textContent = time;

    var feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = 'Wrong!';
  } else {
    var feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = 'Correct!';
    score += 10;
    scoreValue.textContent = score;
  }

  currentQuestion++;

  setTimeout(function () {
    feedbackEl.textContent = '';
  }, 1000);

  if (currentQuestion === questionsData.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  clearInterval(timerId);

  var endScreen = document.getElementById('theend');
  endScreen.style.display = 'block';

  var finalScore = document.getElementById('finalscore');
  finalScore.textContent = score;

  questions.style.display = 'none';
}

function clockTick() {
  time--;
  timer.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore(event) {
  event.preventDefault(); 
  var initials = nameInput.value.trim();

  if (initials !== '') {
    var highscores = JSON.parse(localStorage.getItem('highscores')) || [];

    var newScore = {
      score: score,
      initials: initials,
    };

    highscores.push(newScore);
    localStorage.setItem('highscores', JSON.stringify(highscores));

    window.location.href = 'scores.html';
  }
}

submit.addEventListener('click', saveHighscore);

start.addEventListener('click', startQuiz);

choices.addEventListener('click', questionClick);

var highscores = JSON.parse(localStorage.getItem('highscores')) || [];

scoreList.innerHTML = '';

for (var i = 0; i < highscores.length; i++) {
  var scoreData = highscores[i];
  var listItem = document.createElement('li');
  listItem.textContent = scoreData.initials + ' - ' + scoreData.score;
  scoreList.appendChild(listItem);
}
