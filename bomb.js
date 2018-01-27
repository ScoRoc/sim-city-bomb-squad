console.log("javascript running");

var totalTime = 3000;
var timeRemaining = 0;
var gameOver = false;
var wiresToCut = [];
var successSong = null;

var wiresCut = {
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
};

var delay = null;
var timer = null;

var checkForWin = function() {
  return wiresToCut.length > 0 ? false : true;
};

var detonate = function() {
  endGame(false);
};

var endGame = function(win) {
  gameOver = true;
  clearTimeout(delay);
  clearInterval(timer);
  if (win) {
    //we won!!
    console.log('we saved the city!');
    var yay = document.getElementById('yay');
    yay.addEventListener('ended', function() {
      successSong.play();
    });
    yay.play();
    document.querySelector('.timerBox p').style.color = 'green';
  } else {
    //we lost
    console.log('everyones dead gj');
    document.getElementById('explode').play();
    document.body.classList.remove('unexploded');
    document.body.classList.add('exploded');
  }
};

var cutWire = function () {
  if (!wiresCut[this.id] && !gameOver) {
    //do wire cut stuff and game checking here
    document.getElementById('buzz').play();
    this.src = "img/cut-" + this.id + "-wire.png";
    wiresCut[this.id] = true;
    var wireIndex = wiresToCut.indexOf(this.id);
    if (wireIndex > -1) {
      //this is where good cut logic goes
      console.log(this.id + " was correct/good cut!");
      wiresToCut.splice(wireIndex, 1);
      if (checkForWin()) {
        endGame(true);
      }
    } else {
      //this is where bad cut logic goes
      delay = setTimeout(detonate, 750);
    }
  }
};

var reset = function () {
  gameOver = false;
  var wireImages = document.getElementsByClassName('imageBox')[0].children;
  for (var i = 0; i < wireImages.length; i++) {
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
  }
  //reset background
  document.body.classList.add("unexploded");
  document.body.classList.remove("exploded");
  document.querySelector(".timerBox p").style.color = "red";

  clearTimeout(delay);
  clearInterval(timer);

  successSong.pause();
  successSong.currentTime = 0;

  for (color in wiresCut) {
    wiresCut[color] = false;
  }
  initGame();
};

var updateClock = function() {
  timeRemaining--;
  var sec = 0;
  var hundredths = 0;

  if (timeRemaining >= 0) {
    seconds = Math.floor(timeRemaining / 100);
    hundredths = timeRemaining - (seconds * 100);
  } else {
    endGame(false);
  }
  var secondsString = seconds >= 10 ? seconds.toString() : "0" + seconds.toString();
  var hundredthsString = hundredths >= 10 ? hundredths.toString() : "0" + hundredths.toString();
  document.querySelector(".timerBox p").textContent = "0:00:" + secondsString + ":" + hundredthsString;
};

var initGame = function() {
  timeRemaining = totalTime;
  var allColors = Object.keys(wiresCut);

  wiresToCut = allColors.filter(function() {
    var rand = Math.random();
    if (rand > 0.5) {
      return true;
    } else {
      return false;
    }
  });

  console.log(wiresToCut);
  timer = setInterval(updateClock, 10);

};

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('blue').addEventListener('click', cutWire);
  document.getElementById('green').addEventListener('click', cutWire);
  document.getElementById('red').addEventListener('click', cutWire);
  document.getElementById('white').addEventListener('click', cutWire);
  document.getElementById('yellow').addEventListener('click', cutWire);
  successSong = document.getElementById('success');
  document.getElementById('reset').addEventListener('click', reset);
  initGame();
});

//Cut wires
//  swapping img
//  is wire cut?
//  start setTimeout for 750ms
//Reset
//  decide on new wires to cut
//  Math.random()
//  put background img to city
//Lose
//  swap in explosion background img
//  stop the clock
//isBombExploded?
//Win
//  stop clock
//  stop timeout before bomb blows up
