const body = document.querySelector('body') || document.documentElement;
body.style.overflow = 'hidden';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const image = document.getElementById("dialog");

const cornerSize = 35

function getWrappedLines(ctx, text, maxWidth) {
  var words = text.split(" ");
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
          currentLine += " " + word;
      } else {
          lines.push(currentLine);
          currentLine = word;
      }
  }
  lines.push(currentLine);
  return lines;
}

ctx.textAlign = "left";
ctx.textBaseline = "top";
ctx.font = '16px Arial';
var lineheight = 24;

function drawResponse(text) {
  var borderHeight = 0
  var borderWidth = 0 

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  var lines = text.split("\n")
  var maxWordWidth = 0;

  lines.forEach(line => {
    line.split(" ").forEach(word => {
      const wordWidth = ctx.measureText(word).width;
    
      if (wordWidth > maxWordWidth) {
        maxWordWidth = wordWidth;
      }
    })
  })

  borderWidth = maxWordWidth < 300 ? 300 : maxWordWidth

  const wrappedLines = lines.flatMap(line => getWrappedLines(ctx, line, borderWidth))

  borderHeight = lineheight * wrappedLines.length - 8

  var maxLineWidth = 0

  wrappedLines.forEach(line => {
    const lineWidth = ctx.measureText(line).width;
    
      if (lineWidth > maxLineWidth) {
        maxLineWidth = lineWidth;
      }
  })

  borderWidth = maxLineWidth

  // top left corner
  ctx.drawImage(image, 2, 2, 4, 4, 0, 0, cornerSize, cornerSize);

  // left border
  ctx.drawImage(image, 2, 5, 4, 4, 0, cornerSize, cornerSize, borderHeight);

  // bottom left corner
  ctx.drawImage(image, 2, 18, 4, 4, 0, borderHeight + cornerSize, cornerSize, cornerSize);

  // top border
  ctx.drawImage(image, 5, 2, 4, 4, cornerSize, 0, borderWidth, cornerSize);

  // bottom border
  ctx.drawImage(image, 7, 18, 4, 4, cornerSize, borderHeight + cornerSize, borderWidth, cornerSize);

  // top right corner
  ctx.drawImage(image, 18, 2, 4, 4, cornerSize + borderWidth, 0, cornerSize, cornerSize);

  // right border
  ctx.drawImage(image, 18, 5, 4, 4, cornerSize + borderWidth, cornerSize, cornerSize, borderHeight);

  // right bottom corner
  ctx.drawImage(image, 15, 15, 9, 9, cornerSize + borderWidth - (cornerSize * 3/4), cornerSize + borderHeight - (cornerSize * 3/4), cornerSize * 9/4, cornerSize * 9/4);

  ctx.fillStyle = "white";
  ctx.fillRect(cornerSize, cornerSize, cornerSize + borderWidth - (cornerSize * 3/4), cornerSize + borderHeight - (cornerSize * 3/4));

  ctx.fillStyle = "black";
  for (var i = 0; i < wrappedLines.length; i++) {
    ctx.fillText(wrappedLines[i], cornerSize, cornerSize + (i*lineheight));
  }

  const bubbleWidth = cornerSize + borderWidth - (cornerSize * 3/4) + (cornerSize * 9/4)
  const bubbleHeight = cornerSize + borderHeight - (cornerSize * 3/4) + (cornerSize * 9/4)

  window.electronAPI.submitMessage("response-size", {
    width: bubbleWidth,
    height: bubbleHeight 
  })
}


canvas.addEventListener("click", () => { window.electronAPI.submitMessage("close", null) })

window.electronAPI.onReceiveMessage((message) => {
  drawResponse(message);
})