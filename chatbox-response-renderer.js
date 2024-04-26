let chatbox = document.getElementById("chatbox");
let button =  document.getElementById("button");

chatbox.setAttribute("style", "height:" + (chatbox.scrollHeight) + "px;overflow-y:hidden;");
chatbox.addEventListener("input", resizeBox, false);

function resizeBox() {
  chatbox.style.height = 'auto';
  chatbox.style.height = (chatbox.scrollHeight) + "px";
}

function submitMessage() {
  chatbox.value = "";
  resizeBox();

  window.electronAPI.submitMessage("response", null);
}

button.onclick = function() {
  submitMessage();
}

var response; 
var fpsInterval = 1000 / 30;
var currentFrame;
var elapsed;
var then;
var i = 0;
var stopTyping = false;

function typeWriter(timeStamp) {
  currentFrame = window.performance.now();
  elapsed = currentFrame - then;

  if (stopTyping) {
    return;
  }

  if (elapsed > fpsInterval) {
    then = currentFrame - (elapsed % fpsInterval);
    chatbox.value += response.charAt(i);
    i++;
    resizeBox();
  }

  if (i < response.length) {
    requestAnimationFrame(typeWriter);
  }
};

window.electronAPI.onReceiveMessage((message) => {
  stopTyping = true;
  i = 0;

  response = message;
  chatbox.value = "";

  resizeBox();

  then = window.performance.now();

  stopTyping = false;
  requestAnimationFrame(typeWriter);
})