// variables to keep track of quiz state
var currentQuestion = 0;
var time = 100;
var score = 0;
var timerId;

// variables to reference DOM elements
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

  // show questions section
  var questionsSection = document.getElementById('questions');
  questionsSection.style.display = 'block';

  // start timer
  timerId = setInterval(clockTick, 1000);

  // show starting time
  timer.textContent = time;

  getQuestion();
}

function getQuestion() {
  var currentQuestionData = questionsData[currentQuestion];

  // update title with current question
  var titleEl = document.getElementById('qtitle');
  titleEl.textContent = currentQuestionData.title;

  // clear out any old question choices
  choices.innerHTML = '';

  // loop over choices
  for (var i = 0; i < currentQuestionData.choices.length; i++) {
    var choice = currentQuestionData.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;

    // display on the page
    choices.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;

  // if the clicked element is not a choice button, do nothing.
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // check if user guessed wrong
  if (buttonEl.value !== questionsData[currentQuestion].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    // display new time on page
    timer.textContent = time;

    // Provide feedback to the user
    var feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = 'Wrong!';
  } else {
    var feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = 'Correct!';
    // increase score
    score += 10;
    scoreValue.textContent = score;
  }

  // move to next question
  currentQuestion++;

  // clear feedback message
  setTimeout(function () {
    feedbackEl.textContent = '';
  }, 1000);

  // check if we've run out of questions
  if (currentQuestion === questionsData.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // show end screen
  var endScreen = document.getElementById('theend');
  endScreen.style.display = 'block';

  // show final score
  var finalScore = document.getElementById('finalscore');
  finalScore.textContent = score;

  // hide questions section
  questions.style.display = 'none';
}

function clockTick() {
  // update time
  time--;
  timer.textContent = time;

  // check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // get value of input box
  var initials = nameInput.value.trim();

  // make sure value wasn't empty
  if (initials !== '') {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores = JSON.parse(localStorage.getItem('highscores')) || [];

    // format new score object for current user
    var newScore = {
      score: score,
      initials: initials,
    };

    // save to localstorage
    highscores.push(newScore);
    localStorage.setItem('highscores', JSON.stringify(highscores));

    // redirect to next page
    window.location.href = 'scores.html';
  }
}

submit.addEventListener('click', saveHighscore);

// user clicks button to start quiz
start.addEventListener('click', startQuiz);

// Attach event listener to choices container
choices.addEventListener('click', questionClick);

// Retrieve the highscores from local storage
var highscores = JSON.parse(localStorage.getItem('highscores')) || [];

// Clear the scoreList
scoreList.innerHTML = '';

// Iterate over the highscores and create list items to display them
for (var i = 0; i < highscores.length; i++) {
  var scoreData = highscores[i];
  var listItem = document.createElement('li');
  listItem.textContent = scoreData.initials + ' - ' + scoreData.score;
  scoreList.appendChild(listItem);
}
