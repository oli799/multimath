const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { createQuestion } = require("./helper_functions");

let players = [];
let question = createQuestion();

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", socket => {
  socket.on("user_joined", name => {
    console.log(name, "is joined to the game!");

    const player = {
      id: socket.id,
      name,
      points: 0
    };

    players.push(player);

    updateGame();
  });

  socket.on("send_answer", answer => {
    if (parseInt(answer) === question.answer) {
      question = createQuestion();
      increasePoints(socket.id);
      updateGame();
    }
  });

  socket.on("disconnect", function() {
    console.log(socket.id, "is disconnected");
    players = [...players.filter(player => player.id != socket.id)];
  });
});

function increasePoints(id) {
  players = players.map(player => {
    if (player.id === id) {
      return {
        ...player,
        points: player.points + 1
      };
    } else {
      return player;
    }
  });
}

function updateGame() {
  const leaderBoard = players.sort((a, b) => b.points - a.points).slice(0, 10);

  io.emit("send_question", question.expression);
  io.emit("leaderBoard", leaderBoard);
}

http.listen(3000, () => {
  console.log("listening on *:3000");
});
