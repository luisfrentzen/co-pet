let chatbox = document.getElementById("chatbox");
let button =  document.getElementById("button");

chatbox.setAttribute("style", "height:" + (chatbox.scrollHeight) + "px;overflow-y:hidden;");
chatbox.addEventListener("input", resizeBox, false);

function resizeBox() {
  chatbox.style.height = 'auto';
  chatbox.style.height = (chatbox.scrollHeight) + "px";
}

function submitMessage() {
  const message = chatbox.value;
  chatbox.value = "";
  resizeBox();

  window.electronAPI.submitMessage("input", message);
}

button.onclick = function() {
  submitMessage();
}

function submitOnEnter(event) {
  if (event.which === 13 && !event.shiftKey) {
    if (!event.repeat) {
      submitMessage();
    }

    event.preventDefault();
  }
}

document.getElementById("chatbox").addEventListener("keydown", submitOnEnter);
