// Canvas Setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let startBtn = document.getElementById("start-btn");
let pauseBtn = document.getElementById("pause-btn");
let restartBtn = document.getElementById("restart-btn");

let animationId;
let gameRunning = false;

startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    loop();
  }
});

pauseBtn.addEventListener("click", () => {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});

restartBtn.addEventListener("click", () => {
  document.location.reload();
});

window.addEventListener("load", draw);

// Game Variables
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let paddleHeight = 80;
let paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let paddleSpeed = 10;

let leftPlayerScore = 0;
let rightPlayerScore = 0;
const maxScore = 10;

// Input Handlers
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
  if (e.key === "w") wPressed = true;
  if (e.key === "s") sPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
  if (e.key === "w") wPressed = false;
  if (e.key === "s") sPressed = false;
});

function update() {
  if (upPressed && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
  if (downPressed && rightPaddleY + paddleHeight < canvas.height) rightPaddleY += paddleSpeed;
  if (wPressed && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (sPressed && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += paddleSpeed;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX - ballRadius < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX < 0) {
    rightPlayerScore++;
    reset();
  } else if (ballX > canvas.width) {
    leftPlayerScore++;
    reset();
  }

  if (leftPlayerScore === maxScore) {
    playerWin("Left Player");
  } else if (rightPlayerScore === maxScore) {
    playerWin("Right Player");
  }
}

function playerWin(player) {
  $("#message").text("Congratulations! " + player + " wins!");
  $("#message-modal").modal("show");
  reset();
}

function reset() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = Math.random() * 10 - 5;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#FFF";
  ctx.font = "15px Arial";

  // Midline
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
  ctx.closePath();

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  // Left Paddle
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);

  // Right Paddle
  ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

  // Scores
  ctx.fillText("Score: " + leftPlayerScore, 10, 20);
  ctx.fillText("Score: " + rightPlayerScore, canvas.width - 100, 20);
}

function loop() {
  update();
  draw();
  animationId = requestAnimationFrame(loop);
}

$("#message-modal-close").on("click", () => {
  document.location.reload();
});
