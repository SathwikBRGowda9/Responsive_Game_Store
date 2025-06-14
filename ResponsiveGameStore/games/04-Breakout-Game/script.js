const rulesButton = document.getElementById("rules-btn");
const closeButton = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const screenWidth = window.innerWidth;
  canvas.width = screenWidth > 800 ? 800 : screenWidth * 0.96;
  canvas.height = canvas.width * 0.75;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const color = getComputedStyle(document.documentElement).getPropertyValue("--button-color");
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-color");

let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  w: 80,
  h: 10,
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  speed: 8,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];
function createBricks() {
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
      const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, ...brickInfo };
    }
  }
}
createBricks();

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = secondaryColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = '20px "Balsamiq Sans"';
  ctx.fillStyle = "#000";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? color : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.w > canvas.width) paddle.x = canvas.width - paddle.w;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) ball.dx *= -1;
  if (ball.y - ball.size < 0) ball.dy *= -1;

  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColumnCount) === 0) showAllBricks();
}

function showAllBricks() {
  bricks.forEach(column => column.forEach(brick => (brick.visible = true)));
}

function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
  else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
}

function keyUp(e) {
  if (["Right", "ArrowRight", "Left", "ArrowLeft"].includes(e.key)) paddle.dx = 0;
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

document.getElementById("left-btn").addEventListener("touchstart", () => paddle.dx = -paddle.speed);
document.getElementById("left-btn").addEventListener("touchend", () => paddle.dx = 0);
document.getElementById("right-btn").addEventListener("touchstart", () => paddle.dx = paddle.speed);
document.getElementById("right-btn").addEventListener("touchend", () => paddle.dx = 0);

rulesButton.addEventListener("click", () => rules.classList.add("show"));
closeButton.addEventListener("click", () => rules.classList.remove("show"));

function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}
update();
