const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// px
canvas.width = 400;
canvas.height = 400;

function convertPos(pos, origin) {
  return [pos[0] - origin[0], pos[1] - origin[1]];
}

function convertPoses(poses, origin) {
  let newPoses = [];
  for (let i = 0; i < poses.length; i++) {
    newPoses.push(convertPos(poses[i], origin));
  }
  return newPoses;
}

function rotateRect(x, y, width, height, angle) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

function rotateShape(startPos, poses, angle) {
  ctx.save();
  ctx.translate(startPos[0], startPos[1]);
  ctx.rotate(angle);
  drawShape([0, 0], convertPoses(poses, startPos));
  // ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.restore();
}

function drawShape(startPos, poses) {
  ctx.beginPath();
  ctx.moveTo(startPos[0], startPos[1]);
  for (let i = 0; i < poses.length; i++) {
    let thisPos = poses[i];
    ctx.lineTo(thisPos[0], thisPos[1]);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function draw() {
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
