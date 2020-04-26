var socket = undefined;
const introForm = document.querySelector("#introForm");
const gameForm = document.querySelector("#gameForm");
const intro = document.querySelector(".intro");
const game = document.querySelector(".game");
const questionElement = document.querySelector(".question");
const hint = document.querySelector(".hint");
const leaderboradElement = document.querySelector(".leaderboard");
const footer = document.querySelector(".footer");

game.style.display = "none";

introForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(introForm);
  const name = formData.get("name");

  if (name && name.toString().trim() !== "") {
    socket = window.io();
    socket.emit("user_joined", name);
    startGame();
  }
});

gameForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(gameForm);
  const answer = formData.get("answer");

  if (answer && answer.toString().trim() !== "") {
    socket.emit("send_answer", answer);
    e.target["answer"].value = "";
  }
});

function startGame() {
  intro.style.display = "none";
  footer.style.display = "none";
  game.style.display = "";

  socket.on("send_question", question => {
    questionElement.innerText = `${question} = ?`;
  });

  socket.on("leaderBoard", leaderBoard => {
    leaderboradElement.innerHTML = `
    ${leaderBoard
      .map(
        player => `<li><strong>${player.name} : </strong>${player.points}</li>`
      )
      .join("")}`;
  });
}

// remove hint from screen
hint.addEventListener("transitionend", () => hint.remove());

setInterval(function() {
  hint.style.opacity = "0";
}, 60000);
