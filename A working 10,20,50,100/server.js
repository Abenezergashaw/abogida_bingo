const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws");
const { type } = require("os");
const cards = require("./cards.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const onlinePlayers = new Set(); // Store connected clients

// Stake 10 variables
let players_10 = [];
let players_10_map = new Map(); // username → card number
let players_10_set = new Set(); // all taken card numbers
let active_game_10 = false;
let numbers_10 = [];
let drawn_numbers_10 = [];
let counter_10 = 0;
let current_drawn_number_10 = 0;
let timer_interval_10 = null;
let call_interval_10 = null;

// Stake 20 variables
let players_20 = [];
let players_20_map = new Map(); // username → card number
let players_20_set = new Set(); // all taken card numbers
let active_game_20 = false;
let numbers_20 = [];
let drawn_numbers_20 = [];
let counter_20 = 0;
let current_drawn_number_20 = 0;
let timer_interval_20 = null;
let call_interval_20 = null;

// Stake 50 variables
let players_50 = [];
let players_50_map = new Map(); // username → card number
let players_50_set = new Set(); // all taken card numbers
let active_game_50 = false;
let numbers_50 = [];
let drawn_numbers_50 = [];
let counter_50 = 0;
let current_drawn_number_50 = 0;
let timer_interval_50 = null;
let call_interval_50 = null;

// Stake 100 variables
let players_100 = [];
let players_100_map = new Map(); // username → card number
let players_100_set = new Set(); // all taken card numbers
let active_game_100 = false;
let numbers_100 = [];
let drawn_numbers_100 = [];
let counter_100 = 0;
let current_drawn_number_100 = 0;
let timer_interval_100 = null;
let call_interval_100 = null;

wss.on("connection", (ws) => {
  onlinePlayers.add(ws);

  ws.send(
    JSON.stringify({
      type: "refresh_players",
      players_10_set: Array.from(players_10_set),
      players_20_set: Array.from(players_20_set),
      players_50_set: Array.from(players_50_set),
      players_100_set: Array.from(players_100_set),
    })
  );
  console.log("selected number: ", players_10_set);

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "init" && data.username) {
        ws.username = data.username;
        ws.send(
          JSON.stringify({
            type: "infos",
            cards,
            active_game_10,
            active_game_20,
            active_game_50,
            active_game_100,
          })
        );
        console.log("User connected:", ws.username);
      } else if (data.type === "selection_card_10") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_10_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_10_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_10_set.delete(currentCard);
        }

        // Assign new card
        players_10_map.set(username, newCard);
        players_10_set.add(newCard);

        broadcast({
          type: "new_card_selected_10",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_10_map);
        console.log(players_10_set);
      } else if (data.type === "entering_game_10") {
        console.log(data.username);
        if (!active_game_10) {
          if (players_10_map.has(data.username)) {
            const number = players_10_map.get(data.username);
            players_10.push({
              username: data.username,
              number,
              active: true,
            });
            console.log("Started players", players_10);
          }
        }
      } else if (data.type === "bingo_10") {
        let u = data.username;
        let n = data.number;
        let html = return_winner_html_10(cards[n - 1], u);
        if (active_game_10) {
          active_game_10 = false;

          broadcast({
            type: "bingo_10",
            u,
            html,
            players_10,
            active_game_10,
          });
          game_end_10();
        }
      }

      // game 20 socket messages
      else if (data.type === "selection_card_20") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_20_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_20_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_20_set.delete(currentCard);
        }

        // Assign new card
        players_20_map.set(username, newCard);
        players_20_set.add(newCard);

        broadcast({
          type: "new_card_selected_20",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_20_map);
        console.log(players_20_set);
      } else if (data.type === "entering_game_20") {
        console.log(data.username);
        if (!active_game_20) {
          if (players_20_map.has(data.username)) {
            const number = players_20_map.get(data.username);
            players_20.push({
              username: data.username,
              number,
              active: true,
            });
            console.log("Started players", players_20);
          }
        }
      } else if (data.type === "bingo_20") {
        let u = data.username;
        let n = data.number;
        let html = return_winner_html_20(cards[n - 1], u);
        if (active_game_20) {
          active_game_20 = false;

          broadcast({
            type: "bingo_20",
            u,
            html,
            players_20,
            active_game_20,
          });
          game_end_20();
        }
      }

 // game 50 socket messages
      else if (data.type === "selection_card_50") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_50_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_50_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_50_set.delete(currentCard);
        }

        // Assign new card
        players_50_map.set(username, newCard);
        players_50_set.add(newCard);

        broadcast({
          type: "new_card_selected_50",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_50_map);
        console.log(players_50_set);
      } else if (data.type === "entering_game_50") {
        console.log(data.username);
        if (!active_game_50) {
          if (players_50_map.has(data.username)) {
            const number = players_50_map.get(data.username);
            players_50.push({
              username: data.username,
              number,
              active: true,
            });
            console.log("Started players", players_50);
          }
        }
      } else if (data.type === "bingo_50") {
        let u = data.username;
        let n = data.number;
        let html = return_winner_html_50(cards[n - 1], u);
        if (active_game_50) {
          active_game_50 = false;

          broadcast({
            type: "bingo_50",
            u,
            html,
            players_50,
            active_game_50,
          });
          game_end_50();
        }
      }

// game 100 socket messages
      else if (data.type === "selection_card_100") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_100_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_100_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_100_set.delete(currentCard);
        }

        // Assign new card
        players_100_map.set(username, newCard);
        players_100_set.add(newCard);

        broadcast({
          type: "new_card_selected_100",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_100_map);
        console.log(players_100_set);
      } else if (data.type === "entering_game_100") {
        console.log(data.username);
        if (!active_game_100) {
          if (players_100_map.has(data.username)) {
            const number = players_100_map.get(data.username);
            players_100.push({
              username: data.username,
              number,
              active: true,
            });
            console.log("Started players", players_100);
          }
        }
      } else if (data.type === "bingo_100") {
        let u = data.username;
        let n = data.number;
        let html = return_winner_html_100(cards[n - 1], u);
        if (active_game_100) {
          active_game_100 = false;

          broadcast({
            type: "bingo_100",
            u,
            html,
            players_100,
            active_game_100,
          });
          game_end_100();
        }
      }




    } catch (err) {
      console.error("Failed to parse message:", message, err.message);
    }
  });

  ws.on("close", () => {
    let u = ws.username;
    let n = players_10_map.get(u);
    onlinePlayers.delete(ws);
    players_10_set.delete(players_10_map.get(u));
    players_10_map.delete(u);
    let user_leaving_10 = players_10.find((p) => p.username === u);
    if (user_leaving_10) {
      user_leaving_10.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_10",
      number: n,
    });
    console.log("WebSocket connection closed");
  });
});

app.use((req, res) => {
  res.status(404).send("File not found");
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function broadcast(data) {
  const message = JSON.stringify(data);
  for (const onlinePlayer of onlinePlayers) {
    if (onlinePlayer.readyState === 1) {
      // 1 === WebSocket.OPEN
      onlinePlayer.send(message);
    }
  }
}

function timer_10(seconds = 15) {
  let count = seconds;

  timer_interval_10 = setInterval(() => {
    broadcast({ type: "timer_10", value: count, players: players_10.length });
    count--;

    if (count < 0) {
      if (players_10.length > 0) {
        clearInterval(timer_interval_10);
        active_game_10 = true;
        broadcast({
          type: "game_started_10",
          players_10,
          active_game_10,
        });
        numbers_10 = generated_numbers_10();
        call_interval_10 = setInterval(broadcast_numbers_10, 1000);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_10() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_10() {
  // console.log("Numbers:", numbers);
  if (counter_10 < numbers_10.length) {
    current_drawn_number_10 = numbers_10[counter_10];
    counter_10++;
    drawn_numbers_10.push(current_drawn_number_10);
    broadcast({
      type: "numbers_being_called_10",
      current_drawn_number_10,
      counter_10,
      players_10,
    });
  } else {
    counter_10 = 0;
    clearInterval(call_interval_10);
    timer_10();
    active_game_10 = false;
    players_10_map.clear();
    players_10_set.clear();
    numbers_10 = [];
    drawn_numbers_10 = [];
    broadcast({
      type: "all_numbers_called_10",
      active_game_10,
      players_10,
    });
    players_10 = [];
  }
}

function return_winner_html_10(c, u) {
  let html = `<div
        class="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-700 opacity-90 w-[80%] h-[70%] max-h-[300] p-2 flex flex-col justify-center items-center overflow-auto rounded-lg"
      >
        <div class="flex items-center gap-1">
          <img src="./assets/icons/win.png" class="w-12" />${u} won!!! 🎉🎉🎉
        </div>
        <div
          class="w-[100%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px] opacity-100"
        >
          <div
            class="w-[20%] h-8 bg-gray-300 text-black text-lg font-bold flex justify-center items-center rounded-lg"
            style="margin: 0px auto 5px"
          >
            ${c.id}
          </div>

          <!-- Headers -->
          <div class="grid grid-cols-5 text-center font-bold text-xl mb-2">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>

          <!-- Cells -->
          <div class="grid grid-cols-5 gap-1 text-center text-lg">
            <!-- 25 cells (you can fill with numbers or placeholders) -->
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.b1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.i1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.n1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.g1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.o1}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.b2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.i2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.n2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.g2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.o2}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.b3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.i3}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 box-border flex justify-center items-center"
            >
              ⭐️
            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.g3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.o3}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.b4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.i4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.n4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.g4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.o4}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.b5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.i5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.n5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.g5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_10 box-border"
            >
                          ${c.o5}

            </div>
          </div>
        </div>
        <div class="flex items-center justify-center bg-orange-500 text-white mx-auto w-[150px] mt-2 py-2 continue_game_10 rounded-lg" >
          Continue
        </div>
      </div>`;

  return html;
}

function game_end_10() {
  counter_10 = 0;
  clearInterval(call_interval_10);
  timer_10();
  players_10_map.clear();
  players_10_set.clear();
  drawn_numbers_10 = [];
  numbers_10 = [];
  players_10 = [];
}

// Game 20 funs
function timer_20(seconds = 15) {
  let count = seconds;

  timer_interval_20 = setInterval(() => {
    broadcast({ type: "timer_20", value: count, players: players_20.length });
    count--;

    if (count < 0) {
      if (players_20.length > 0) {
        clearInterval(timer_interval_20);
        active_game_20 = true;
        broadcast({
          type: "game_started_20",
          players_20,
          active_game_20,
        });
        numbers_20 = generated_numbers_20();
        call_interval_20 = setInterval(broadcast_numbers_20, 1000);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_20() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_20() {
  // console.log("Numbers:", numbers);
  if (counter_20 < numbers_20.length) {
    current_drawn_number_20 = numbers_20[counter_20];
    counter_20++;
    drawn_numbers_20.push(current_drawn_number_20);
    broadcast({
      type: "numbers_being_called_20",
      current_drawn_number_20,
      counter_20,
      players_20,
    });
  } else {
    counter_20 = 0;
    clearInterval(call_interval_20);
    timer_20();
    active_game_20 = false;
    players_20_map.clear();
    players_20_set.clear();
    numbers_20 = [];
    drawn_numbers_20 = [];
    broadcast({
      type: "all_numbers_called_20",
      active_game_20,
      players_20,
    });
    players_20 = [];
  }
}

function return_winner_html_20(c, u) {
  let html = `<div
        class="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-700 opacity-90 w-[80%] h-[70%] max-h-[300] p-2 flex flex-col justify-center items-center overflow-auto rounded-lg"
      >
        <div class="flex items-center gap-1">
          <img src="./assets/icons/win.png" class="w-12" />${u} won!!! 🎉🎉🎉
        </div>
        <div
          class="w-[100%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px] opacity-100"
        >
          <div
            class="w-[20%] h-8 bg-gray-300 text-black text-lg font-bold flex justify-center items-center rounded-lg"
            style="margin: 0px auto 5px"
          >
            ${c.id}
          </div>

          <!-- Headers -->
          <div class="grid grid-cols-5 text-center font-bold text-xl mb-2">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>

          <!-- Cells -->
          <div class="grid grid-cols-5 gap-1 text-center text-lg">
            <!-- 25 cells (you can fill with numbers or placeholders) -->
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.b1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.i1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.n1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.g1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.o1}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.b2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.i2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.n2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.g2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.o2}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.b3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.i3}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 box-border flex justify-center items-center"
            >
              ⭐️
            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.g3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.o3}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.b4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.i4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.n4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.g4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.o4}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.b5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.i5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.n5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.g5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_20 box-border"
            >
                          ${c.o5}

            </div>
          </div>
        </div>
        <div class="flex items-center justify-center bg-orange-500 text-white mx-auto w-[150px] mt-2 py-2 continue_game_20 rounded-lg" >
          Continue
        </div>
      </div>`;

  return html;
}

function game_end_20() {
  counter_20 = 0;
  clearInterval(call_interval_20);
  timer_20();
  players_20_map.clear();
  players_20_set.clear();
  drawn_numbers_20 = [];
  numbers_20 = [];
  players_20 = [];
}

// Game 50 funs
function timer_50(seconds = 15) {
  let count = seconds;

  timer_interval_50 = setInterval(() => {
    broadcast({ type: "timer_50", value: count, players: players_50.length });
    count--;

    if (count < 0) {
      if (players_50.length > 0) {
        clearInterval(timer_interval_50);
        active_game_50 = true;
        broadcast({
          type: "game_started_50",
          players_50,
          active_game_50,
        });
        numbers_50 = generated_numbers_50();
        call_interval_50 = setInterval(broadcast_numbers_50, 1000);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_50() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_50() {
  // console.log("Numbers:", numbers);
  if (counter_50 < numbers_50.length) {
    current_drawn_number_50 = numbers_50[counter_50];
    counter_50++;
    drawn_numbers_50.push(current_drawn_number_50);
    broadcast({
      type: "numbers_being_called_50",
      current_drawn_number_50,
      counter_50,
      players_50,
    });
  } else {
    counter_50 = 0;
    clearInterval(call_interval_50);
    timer_50();
    active_game_50 = false;
    players_50_map.clear();
    players_50_set.clear();
    numbers_50 = [];
    drawn_numbers_50 = [];
    broadcast({
      type: "all_numbers_called_50",
      active_game_50,
      players_50,
    });
    players_50 = [];
  }
}

function return_winner_html_50(c, u) {
  let html = `<div
        class="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-700 opacity-90 w-[80%] h-[70%] max-h-[300] p-2 flex flex-col justify-center items-center overflow-auto rounded-lg"
      >
        <div class="flex items-center gap-1">
          <img src="./assets/icons/win.png" class="w-12" />${u} won!!! 🎉🎉🎉
        </div>
        <div
          class="w-[100%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px] opacity-100"
        >
          <div
            class="w-[20%] h-8 bg-gray-300 text-black text-lg font-bold flex justify-center items-center rounded-lg"
            style="margin: 0px auto 5px"
          >
            ${c.id}
          </div>

          <!-- Headers -->
          <div class="grid grid-cols-5 text-center font-bold text-xl mb-2">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>

          <!-- Cells -->
          <div class="grid grid-cols-5 gap-1 text-center text-lg">
            <!-- 25 cells (you can fill with numbers or placeholders) -->
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.b1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.i1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.n1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.g1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.o1}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.b2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.i2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.n2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.g2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.o2}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.b3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.i3}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 box-border flex justify-center items-center"
            >
              ⭐️
            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.g3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.o3}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.b4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.i4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.n4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.g4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.o4}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.b5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.i5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.n5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.g5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_50 box-border"
            >
                          ${c.o5}

            </div>
          </div>
        </div>
        <div class="flex items-center justify-center bg-orange-500 text-white mx-auto w-[150px] mt-2 py-2 continue_game_50 rounded-lg" >
          Continue
        </div>
      </div>`;

  return html;
}

function game_end_50() {
  counter_50 = 0;
  clearInterval(call_interval_50);
  timer_50();
  players_50_map.clear();
  players_50_set.clear();
  drawn_numbers_50 = [];
  numbers_50 = [];
  players_50 = [];
}

// Game 100 funs
function timer_100(seconds = 15) {
  let count = seconds;

  timer_interval_100 = setInterval(() => {
    broadcast({ type: "timer_100", value: count, players: players_100.length });
    count--;

    if (count < 0) {
      if (players_100.length > 0) {
        clearInterval(timer_interval_100);
        active_game_100 = true;
        broadcast({
          type: "game_started_100",
          players_100,
          active_game_100,
        });
        numbers_100 = generated_numbers_100();
        call_interval_100 = setInterval(broadcast_numbers_100, 1000);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_100() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_100() {
  // console.log("Numbers:", numbers);
  if (counter_100 < numbers_100.length) {
    current_drawn_number_100 = numbers_100[counter_100];
    counter_100++;
    drawn_numbers_100.push(current_drawn_number_100);
    broadcast({
      type: "numbers_being_called_100",
      current_drawn_number_100,
      counter_100,
      players_100,
    });
  } else {
    counter_100 = 0;
    clearInterval(call_interval_100);
    timer_100();
    active_game_100 = false;
    players_100_map.clear();
    players_100_set.clear();
    numbers_100 = [];
    drawn_numbers_100 = [];
    broadcast({
      type: "all_numbers_called_100",
      active_game_100,
      players_100,
    });
    players_100 = [];
  }
}

function return_winner_html_100(c, u) {
  let html = `<div
        class="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-700 opacity-90 w-[80%] h-[70%] max-h-[300] p-2 flex flex-col justify-center items-center overflow-auto rounded-lg"
      >
        <div class="flex items-center gap-1">
          <img src="./assets/icons/win.png" class="w-12" />${u} won!!! 🎉🎉🎉
        </div>
        <div
          class="w-[100%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px] opacity-100"
        >
          <div
            class="w-[20%] h-8 bg-gray-300 text-black text-lg font-bold flex justify-center items-center rounded-lg"
            style="margin: 0px auto 5px"
          >
            ${c.id}
          </div>

          <!-- Headers -->
          <div class="grid grid-cols-5 text-center font-bold text-xl mb-2">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>

          <!-- Cells -->
          <div class="grid grid-cols-5 gap-1 text-center text-lg">
            <!-- 25 cells (you can fill with numbers or placeholders) -->
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.b1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.i1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.n1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.g1}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.o1}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.b2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.i2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.n2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.g2}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.o2}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.b3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.i3}

            </div>
            <div
              class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 box-border flex justify-center items-center"
            >
              ⭐️
            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.g3}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.o3}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.b4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.i4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.n4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.g4}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.o4}

            </div>

            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.b5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.i5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.n5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.g5}

            </div>
            <div
              class="bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center playing_cartela_number_100 box-border"
            >
                          ${c.o5}

            </div>
          </div>
        </div>
        <div class="flex items-center justify-center bg-orange-500 text-white mx-auto w-[150px] mt-2 py-2 continue_game_100 rounded-lg" >
          Continue
        </div>
      </div>`;

  return html;
}

function game_end_100() {
  counter_100 = 0;
  clearInterval(call_interval_100);
  timer_100();
  players_100_map.clear();
  players_100_set.clear();
  drawn_numbers_100 = [];
  numbers_100 = [];
  players_100 = [];
}

timer_10();
timer_20();
timer_50();
timer_100();
