const myCanvas = document.getElementById("myCanvas");
const ctx = myCanvas.getContext("2d");

const FPS = 40;
const jump_amount = -10;
const max_fall_speed = 10;
const acceleration = 1;
const pipe_speed = -2;

let game_mode = "prestart";
let time_game_last_running;
let bottom_bar_offset = 0;
let pipes = [];

function goBack() {
  window.location.href = "games.html"; // change to your desired destination
}

function toggleModal() {
  const modal = document.getElementById("gameModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}
toggleModal();

function MySprite(img_url) {
  this.x = 0;
  this.y = 0;
  this.visible = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url || "";
  this.angle = 0;
  this.flipV = false;
  this.flipH = false;
}
MySprite.prototype.Do_Frame_Things = function () {
  ctx.save();
  ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
  ctx.rotate((this.angle * Math.PI) / 180);
  if (this.flipV) ctx.scale(1, -1);
  if (this.flipH) ctx.scale(-1, 1);
  if (this.visible)
    ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
  this.x += this.velocity_x;
  this.y += this.velocity_y;
  ctx.restore();
};

function ImagesTouching(a, b) {
  return (
    a.visible &&
    b.visible &&
    !(a.x >= b.x + b.MyImg.width ||
      a.x + a.MyImg.width <= b.x ||
      a.y >= b.y + b.MyImg.height ||
      a.y + a.MyImg.height <= b.y)
  );
}

function Got_Player_Input(event) {
  switch (game_mode) {
    case "prestart":
      game_mode = "running";
      break;
    case "running":
      bird.velocity_y = jump_amount;
      break;
    case "over":
      if (new Date() - time_game_last_running > 1000) {
        reset_game();
        game_mode = "running";
      }
      break;
  }
  event.preventDefault();
}
addEventListener("touchstart", Got_Player_Input);
addEventListener("mousedown", Got_Player_Input);
addEventListener("keydown", Got_Player_Input);

function make_bird_slow_and_fall() {
  if (bird.velocity_y < max_fall_speed) bird.velocity_y += acceleration;
  if (
    bird.y > myCanvas.height - bird.MyImg.height ||
    bird.y < -bird.MyImg.height
  ) {
    bird.velocity_y = 0;
    game_mode = "over";
  }
}

function add_pipe(x_pos, top_of_gap, gap_width) {
  const top_pipe = new MySprite(pipe_piece.src);
  top_pipe.x = x_pos;
  top_pipe.y = top_of_gap - pipe_piece.height;
  top_pipe.velocity_x = pipe_speed;
  pipes.push(top_pipe);

  const bottom_pipe = new MySprite(pipe_piece.src);
  bottom_pipe.flipV = true;
  bottom_pipe.x = x_pos;
  bottom_pipe.y = top_of_gap + gap_width;
  bottom_pipe.velocity_x = pipe_speed;
  pipes.push(bottom_pipe);
}

function make_bird_tilt_appropriately() {
  bird.angle = bird.velocity_y < 0 ? -15 : Math.min(bird.angle + 4, 70);
}

function show_the_pipes() {
  for (let pipe of pipes) pipe.Do_Frame_Things();
}

function check_for_end_game() {
  for (let pipe of pipes) {
    if (ImagesTouching(bird, pipe)) {
      game_mode = "over";
      break;
    }
  }
}

function display_intro_instructions() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Press, touch or click to start", myCanvas.width / 2, myCanvas.height / 4);
}

function display_game_over() {
  let score = 0;
  for (let pipe of pipes) if (pipe.x < bird.x) score += 0.5;

  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", myCanvas.width / 2, 100);
  ctx.fillText("Score: " + score, myCanvas.width / 2, 150);
  ctx.font = "20px Arial";
  ctx.fillText("Click, touch, or press to play again", myCanvas.width / 2, 300);
}

function display_bar_running_along_bottom() {
  if (bottom_bar_offset < -23) bottom_bar_offset = 0;
  ctx.drawImage(bottom_bar, bottom_bar_offset, myCanvas.height - bottom_bar.height);
}

function reset_game() {
  bird.y = myCanvas.height / 2;
  bird.angle = 0;
  pipes = [];
  add_all_my_pipes();
}

function add_all_my_pipes() {
  const pipe_data = [
    [500, 100, 140], [800, 50, 140], [1000, 250, 140],
    [1200, 150, 120], [1600, 100, 120], [1800, 150, 120],
    [2000, 200, 120], [2200, 250, 120], [2400, 30, 100],
    [2700, 300, 100], [3000, 100, 80], [3300, 250, 80],
    [3600, 50, 60]
  ];
  pipe_data.forEach(([x, y, gap]) => add_pipe(x, y, gap));
  const finish_line = new MySprite("http://s2js.com/img/etc/flappyend.png");
  finish_line.x = 3900;
  finish_line.velocity_x = pipe_speed;
  pipes.push(finish_line);
}

const pipe_piece = new Image();
pipe_piece.onload = add_all_my_pipes;
pipe_piece.src = "http://s2js.com/img/etc/flappypipe.png";

const bottom_bar = new Image();
bottom_bar.src = "http://s2js.com/img/etc/flappybottom.png";

const bird = new MySprite("http://s2js.com/img/etc/flappybird.png");
bird.x = myCanvas.width / 3;
bird.y = myCanvas.height / 2;

function Do_a_Frame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  bird.Do_Frame_Things();
  display_bar_running_along_bottom();

  switch (game_mode) {
    case "prestart":
      display_intro_instructions();
      break;
    case "running":
      time_game_last_running = new Date();
      bottom_bar_offset += pipe_speed;
      show_the_pipes();
      make_bird_tilt_appropriately();
      make_bird_slow_and_fall();
      check_for_end_game();
      break;
    case "over":
      make_bird_slow_and_fall();
      display_game_over();
      break;
  }
}
setInterval(Do_a_Frame, 1000 / FPS);
