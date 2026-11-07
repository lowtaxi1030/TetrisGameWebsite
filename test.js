const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// px
canvas.width = 400;
canvas.height = 400;

/*基本語法
語法	          功能
ctx.fillStyle	  設定填充顏色
ctx.strokeStyle	  設定邊框顏色
ctx.lineWidth	  設定邊框粗細
ctx.fillRect()	  繪製實心矩形
ctx.strokeRect()  繪製矩形邊框
ctx.clearRect()	  清除指定區域
ctx.arc()	      繪製圓弧與圓形
*/

/*畫筆語法
語法	       意義
beginPath()	   開始新的路徑
moveTo()	   移動畫筆，不留下痕跡
lineTo()	   畫線到指定座標
stroke()	   真正將線條畫出來
closePath()    將路徑封閉，並畫出最後一條線
*/

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

let scale = 1;
let dir = 1;
let rectAngle = 0;

// 繪製圖形
ctx.strokeStyle = "#ff96d3";
ctx.lineWidth = 5;
ctx.fillStyle = "#96ffe6";

function draw() {
  scale += 0.01 * dir;

  // 清除畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(scale, scale);

  ctx.save();
  ctx.fillStyle = "#209820";
  rotateShape([100, 150], [[25, 75], [150, 75]], (Math.PI / 180) * (rectAngle * 0.8));
  ctx.restore();

  ctx.beginPath();
  ctx.arc(200, 300, 25, 0, Math.PI * 2);
  ctx.stroke();

  rotateRect(150, 120, 100, 50, (Math.PI / 180) * rectAngle);
  ctx.restore();
  if (scale > 1.3 || scale < 0.8) {
    dir *= -1;
  }
  rectAngle += scale * 2;

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
