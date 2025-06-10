const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { WebSocketServer } = require("ws");
const { type } = require("os");
const cards = require("./cards.json");
const mysql = require("mysql2/promise");
const { json } = require("stream/consumers");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;
const token = "8179655944:AAFlo0LestD3nO2EWYiC0iM1fSOHwMftyzU";

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const bot = new TelegramBot(token, { polling: true });

// MySQL connection setup
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Ab@596919",
  database: "bingo",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//Routes
app.get("/ping", (req, res) => {
  console.log("✅ Ping route hit");
  res.send("pong");
});

app.get("/get_user_balance", async (req, res) => {
  try {
    const { u_id } = req.query;
    console.log("User ID:", u_id);

    const balance = await get_balance_of_specific_user(u_id);
    console.log("From the endpoint:", balance);
    console.log(u_id, ":: ", balance);

    res.json({ balance }); // ✅ send balance in JSON format
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ error: "Internal Server Error" }); // ✅ handle errors
  }
});

const onlinePlayers = new Set(); // Store connected clients

// Stake 5 variables
let players_5 = [];
let players_5_map = new Map(); // username → card number
let players_5_set = new Set(); // all taken card numbers
let active_game_5 = false;
let numbers_5 = [];
let drawn_numbers_5 = [];
let counter_5 = 0;
let current_drawn_number_5 = 0;
let timer_interval_5 = null;
let call_interval_5 = null;
let line_making_array_5 = [];

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
let line_making_array_10 = [];

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
let line_making_array_20 = [];

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
let line_making_array_50 = [];

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
let line_making_array_100 = [];

// Stake 500 variables
let players_500 = [];
let players_500_map = new Map(); // username → card number
let players_500_set = new Set(); // all taken card numbers
let active_game_500 = false;
let numbers_500 = [];
let drawn_numbers_500 = [];
let counter_500 = 0;
let current_drawn_number_500 = 0;
let timer_interval_500 = null;
let call_interval_500 = null;
let line_making_array_500 = [];

// Stake 1000 variables
let players_1000 = [];
let players_1000_map = new Map(); // username → card number
let players_1000_set = new Set(); // all taken card numbers
let active_game_1000 = false;
let numbers_1000 = [];
let drawn_numbers_1000 = [];
let counter_1000 = 0;
let current_drawn_number_1000 = 0;
let timer_interval_1000 = null;
let call_interval_1000 = null;
let line_making_array_1000 = [];

wss.on("connection", function connection(ws) {
  onlinePlayers.add(ws);

  ws.send(
    JSON.stringify({
      type: "refresh_players",
      players_5_set: Array.from(players_5_set),
      players_10_set: Array.from(players_10_set),
      players_20_set: Array.from(players_20_set),
      players_50_set: Array.from(players_50_set),
      players_100_set: Array.from(players_100_set),
      players_500_set: Array.from(players_500_set),
      players_1000_set: Array.from(players_1000_set),
    })
  );
  console.log("selected number: ", players_10_set);

  ws.on("message", async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "init" && data.username) {
        ws.username = data.username;
        let balance = await get_balance_of_specific_user(data.username).catch(
          console.error
        );
        ws.send(
          JSON.stringify({
            type: "infos",
            cards,
            active_game_5,
            active_game_10,
            active_game_20,
            active_game_50,
            active_game_100,
            active_game_500,
            active_game_1000,
            balance,
          })
        );
        console.log("User connected:", ws.username);
      }
      // game 5 messages
      else if (data.type === "selection_card_5") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_5_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_5_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_5_set.delete(currentCard);
        }

        // Assign new card
        players_5_map.set(username, newCard);
        players_5_set.add(newCard);

        broadcast({
          type: "new_card_selected_5",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_5_map);
        console.log(players_5_set);
      } else if (data.type === "entering_game_5") {
        console.log(data.username);
        if (!active_game_5) {
          if (players_5_map.has(data.username)) {
            const number = players_5_map.get(data.username);
            players_5.push({
              username: data.username,
              number,
              active: true,
            });
            decrease_balance_of_user_when_start_game(data.username, 5).catch(
              console.error
            );
            console.log("Started players", players_5);
          }
        }
      } else if (data.type === "bingo_5") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_5(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_5 = players_5.find((p) => p.username === u);
          if (user_blocked_5) {
            user_blocked_5.active = false;
          }

          broadcast({
            type: "block_player_5",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(5, players_5.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(5, u);
          if (active_game_5) {
            active_game_5 = false;

            broadcast({
              type: "bingo_5",
              u,
              html,
              players_5,
              active_game_5,
              balance,
            });
            game_end_5();
          }
        }
      }

      // Game 10 messages
      else if (data.type === "selection_card_10") {
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
            decrease_balance_of_user_when_start_game(data.username, 10).catch(
              console.error
            );
            console.log("Started players", players_10);
          }
        }
      } else if (data.type === "bingo_10") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_10(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_10 = players_10.find((p) => p.username === u);
          if (user_blocked_10) {
            user_blocked_10.active = false;
          }

          broadcast({
            type: "block_player_10",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(10, players_10.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(10, u);
          if (active_game_10) {
            active_game_10 = false;

            broadcast({
              type: "bingo_10",
              u,
              html,
              players_10,
              active_game_10,
              balance,
            });
            game_end_10();
          }
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
            decrease_balance_of_user_when_start_game(data.username, 20).catch(
              console.error
            );
            console.log("Started players", players_20);
          }
        }
      } else if (data.type === "bingo_20") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_20(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_20 = players_20.find((p) => p.username === u);
          if (user_blocked_20) {
            user_blocked_20.active = false;
          }

          broadcast({
            type: "block_player_20",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(20, players_20.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(20, u);
          if (active_game_20) {
            active_game_20 = false;

            broadcast({
              type: "bingo_20",
              u,
              html,
              players_20,
              active_game_20,
              balance,
            });
            game_end_20();
          }
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
            decrease_balance_of_user_when_start_game(data.username, 50).catch(
              console.error
            );
            console.log("Started players", players_50);
          }
        }
      } else if (data.type === "bingo_50") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_50(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_50 = players_50.find((p) => p.username === u);
          if (user_blocked_50) {
            user_blocked_50.active = false;
          }

          broadcast({
            type: "block_player_50",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(50, players_50.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(50, u);
          if (active_game_50) {
            active_game_50 = false;

            broadcast({
              type: "bingo_50",
              u,
              html,
              players_50,
              active_game_50,
              balance,
            });
            game_end_50();
          }
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
            decrease_balance_of_user_when_start_game(data.username, 100).catch(
              console.error
            );
            console.log("Started players", players_100);
          }
        }
      } else if (data.type === "bingo_100") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_100(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_100 = players_100.find((p) => p.username === u);
          if (user_blocked_100) {
            user_blocked_100.active = false;
          }

          broadcast({
            type: "block_player_100",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(100, players_100.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(100, u);
          if (active_game_100) {
            active_game_100 = false;

            broadcast({
              type: "bingo_100",
              u,
              html,
              players_100,
              active_game_100,
              balance,
            });
            game_end_100();
          }
        }
      }

      // game 500 socket messages
      else if (data.type === "selection_card_500") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_500_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_500_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_500_set.delete(currentCard);
        }

        // Assign new card
        players_500_map.set(username, newCard);
        players_500_set.add(newCard);

        broadcast({
          type: "new_card_selected_500",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_500_map);
        console.log(players_500_set);
      } else if (data.type === "entering_game_500") {
        console.log(data.username);
        if (!active_game_500) {
          if (players_500_map.has(data.username)) {
            const number = players_500_map.get(data.username);
            players_500.push({
              username: data.username,
              number,
              active: true,
            });
            decrease_balance_of_user_when_start_game(data.username, 500).catch(
              console.error
            );
            console.log("Started players", players_500);
          }
        }
      } else if (data.type === "bingo_500") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_500(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_500 = players_500.find((p) => p.username === u);
          if (user_blocked_500) {
            user_blocked_500.active = false;
          }

          broadcast({
            type: "block_player_500",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(500, players_500.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(500, u);
          if (active_game_500) {
            active_game_500 = false;

            broadcast({
              type: "bingo_500",
              u,
              html,
              players_500,
              active_game_500,
              balance,
            });
            game_end_500();
          }
        }
      }



      // game 1000 socket messages
      else if (data.type === "selection_card_1000") {
        const username = ws.username;
        const newCard = data.card_number;

        if (!username || newCard === undefined) return;

        const currentCard = players_1000_map.get(username);

        // If same card is sent again, ignore
        if (currentCard === newCard) {
          console.log(
            `${username} reselected the same card ${newCard}, ignored.`
          );
          return;
        }

        // If new card is already taken by another user
        if (players_1000_set.has(newCard)) {
          console.log(
            `Card ${newCard} is already taken. ${username} cannot select it.`
          );
          return;
        }

        // Free the old card if it exists
        if (currentCard !== undefined) {
          players_1000_set.delete(currentCard);
        }

        // Assign new card
        players_1000_map.set(username, newCard);
        players_1000_set.add(newCard);

        broadcast({
          type: "new_card_selected_1000",
          username,
          current_card: currentCard,
          new_card: newCard,
        });

        console.log(`User ${username} selected card ${newCard}`);
        console.log(players_1000_map);
        console.log(players_1000_set);
      } else if (data.type === "entering_game_1000") {
        console.log(data.username);
        if (!active_game_1000) {
          if (players_1000_map.has(data.username)) {
            const number = players_1000_map.get(data.username);
            players_1000.push({
              username: data.username,
              number,
              active: true,
            });
            decrease_balance_of_user_when_start_game(data.username, 1000).catch(
              console.error
            );
            console.log("Started players", players_1000);
          }
        }
      } else if (data.type === "bingo_1000") {
        let u = data.username;
        let n = data.number;

        let html = await return_winner_html_1000(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );

          let user_blocked_1000 = players_1000.find((p) => p.username === u);
          if (user_blocked_1000) {
            user_blocked_1000.active = false;
          }

          broadcast({
            type: "block_player_1000",
            u,
            balance,
          });
          return;
        } else {
          let win_amount = calculate_win_amount(1000, players_1000.length);

          console.log("WInning amount: ", win_amount);
          let balance = await update_balance_of_winner(u, win_amount).catch(
            console.error
          );

          await update_winner_on_games(1000, u);
          if (active_game_1000) {
            active_game_1000 = false;

            broadcast({
              type: "bingo_1000",
              u,
              html,
              players_1000,
              active_game_1000,
              balance,
            });
            game_end_1000();
          }
        }
      }



    } catch (err) {
      console.error("Failed to parse message:", message, err.message);
    }
  });

  ws.on("close", () => {
    let u = ws.username;
    let n_5 = players_5_map.get(u);
    let n_10 = players_10_map.get(u);
    let n_20 = players_20_map.get(u);
    let n_50 = players_50_map.get(u);
    let n_100 = players_100_map.get(u);
    let n_500 = players_500_map.get(u);
    let n_1000 = players_1000_map.get(u);
    onlinePlayers.delete(ws);

    // 5
    players_5_set.delete(players_5_map.get(u));
    players_5_map.delete(u);
    let user_leaving_5 = players_5.find((p) => p.username === u);
    if (user_leaving_5) {
      user_leaving_5.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_5",
      number: n_5,
    });

    //10
    players_10_set.delete(players_10_map.get(u));
    players_10_map.delete(u);
    let user_leaving_10 = players_10.find((p) => p.username === u);
    if (user_leaving_10) {
      user_leaving_10.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_10",
      number: n_10,
    });

    //20
    players_20_set.delete(players_20_map.get(u));
    players_20_map.delete(u);
    let user_leaving_20 = players_20.find((p) => p.username === u);
    if (user_leaving_20) {
      user_leaving_20.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_20",
      number: n_20,
    });

    //50
    players_50_set.delete(players_50_map.get(u));
    players_50_map.delete(u);
    let user_leaving_50 = players_50.find((p) => p.username === u);
    if (user_leaving_50) {
      user_leaving_50.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_50",
      number: n_50,
    });

    //100
    players_100_set.delete(players_100_map.get(u));
    players_100_map.delete(u);
    let user_leaving_100 = players_100.find((p) => p.username === u);
    if (user_leaving_100) {
      user_leaving_100.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_100",
      number: n_100,
    });

    //500
    players_500_set.delete(players_500_map.get(u));
    players_500_map.delete(u);
    let user_leaving_500 = players_500.find((p) => p.username === u);
    if (user_leaving_500) {
      user_leaving_500.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_500",
      number: n_500,
    });

    //1000
    players_1000_set.delete(players_1000_map.get(u));
    players_1000_map.delete(u);
    let user_leaving_1000 = players_1000.find((p) => p.username === u);
    if (user_leaving_1000) {
      user_leaving_1000.active = false;
    }
    broadcast({
      type: "remove_card_on_leave_1000",
      number: n_1000,
    });
    console.log("WebSocket connection closed");
  });
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

// Game 5 funs
function timer_5(seconds = 15) {
  let count = seconds;

  timer_interval_5 = setInterval(() => {
    broadcast({ type: "timer_5", value: count, players: players_5.length });
    count--;

    if (count < 0) {
      if (players_5.length > 0) {
        new_game({ players: players_5.length, stake: 5 });
        clearInterval(timer_interval_5);
        active_game_5 = true;
        broadcast({
          type: "game_started_5",
          players_5,
          active_game_5,
        });
        numbers_5 = generated_numbers_5();
        call_interval_5 = setInterval(broadcast_numbers_5, 2500);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_5() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_5() {
  // console.log("Numbers:", numbers);
  if (counter_5 < numbers_5.length) {
    current_drawn_number_5 = numbers_5[counter_5];
    counter_5++;
    drawn_numbers_5.push(current_drawn_number_5);
    broadcast({
      type: "numbers_being_called_5",
      current_drawn_number_5,
      counter_5,
      players_5,
    });
  } else {
    counter_5 = 0;
    clearInterval(call_interval_5);
    timer_5();
    active_game_5 = false;
    players_5_map.clear();
    players_5_set.clear();
    numbers_5 = [];
    drawn_numbers_5 = [];
    broadcast({
      type: "all_numbers_called_5",
      active_game_5,
      players_5,
    });
    players_5 = [];
  }
}

async function return_winner_html_5(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_5,
    u,
    line_making_array_5,
    "playing_cartela_number_5",
    5,
    current_drawn_number_5
  );
  if (html) {
    return html;
  } else {
    return null;
  }
}

function game_end_5() {
  counter_5 = 0;
  clearInterval(call_interval_5);
  timer_5();
  players_5_map.clear();
  players_5_set.clear();
  drawn_numbers_5 = [];
  numbers_5 = [];
  players_5 = [];
}

// Game 10 funs
function timer_10(seconds = 15) {
  let count = seconds;

  timer_interval_10 = setInterval(() => {
    broadcast({ type: "timer_10", value: count, players: players_10.length });
    count--;

    if (count < 0) {
      if (players_10.length > 0) {
        new_game({ players: players_10.length, stake: 10 });
        clearInterval(timer_interval_10);
        active_game_10 = true;
        broadcast({
          type: "game_started_10",
          players_10,
          active_game_10,
        });
        numbers_10 = generated_numbers_10();
        call_interval_10 = setInterval(broadcast_numbers_10, 2500);
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

async function return_winner_html_10(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_10,
    u,
    line_making_array_10,
    "playing_cartela_number_10",
    10,
    current_drawn_number_10
  );
  if (html) {
    return html;
  } else {
    return null;
  }
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
        new_game({ players: players_20.length, stake: 20 });
        clearInterval(timer_interval_20);
        active_game_20 = true;
        broadcast({
          type: "game_started_20",
          players_20,
          active_game_20,
        });
        numbers_20 = generated_numbers_20();
        call_interval_20 = setInterval(broadcast_numbers_20, 2500);
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

async function return_winner_html_20(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_20,
    u,
    line_making_array_20,
    "playing_cartela_number_20",
    20,
    current_drawn_number_20
  );
  if (html) {
    return html;
  } else {
    return null;
  }
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
        new_game({ players: players_50.length, stake: 50 });
        clearInterval(timer_interval_50);
        active_game_50 = true;
        broadcast({
          type: "game_started_50",
          players_50,
          active_game_50,
        });
        numbers_50 = generated_numbers_50();
        call_interval_50 = setInterval(broadcast_numbers_50, 2500);
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

async function return_winner_html_50(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_50,
    u,
    line_making_array_50,
    "playing_cartela_number_50",
    50,
    current_drawn_number_50
  );
  if (html) {
    return html;
  } else {
    return null;
  }
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
        new_game({ players: players_100.length, stake: 100 });

        clearInterval(timer_interval_100);
        active_game_100 = true;
        broadcast({
          type: "game_started_100",
          players_100,
          active_game_100,
        });
        numbers_100 = generated_numbers_100();
        call_interval_100 = setInterval(broadcast_numbers_100, 2500);
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

async function return_winner_html_100(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_100,
    u,
    line_making_array_100,
    "playing_cartela_number_100",
    100,
    current_drawn_number_100
  );
  if (html) {
    return html;
  } else {
    return null;
  }
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

// Game 500 funs
function timer_500(seconds = 15) {
  let count = seconds;
  timer_interval_500 = setInterval(() => {
    broadcast({ type: "timer_500", value: count, players: players_500.length });
    count--;

    if (count < 0) {
      if (players_500.length > 0) {
        new_game({ players: players_500.length, stake: 500 });

        clearInterval(timer_interval_500);
        active_game_500 = true;
        broadcast({
          type: "game_started_500",
          players_500,
          active_game_500,
        });
        numbers_500 = generated_numbers_500();
        call_interval_500 = setInterval(broadcast_numbers_500, 2500);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_500() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_500() {
  // console.log("Numbers:", numbers);
  if (counter_500 < numbers_500.length) {
    current_drawn_number_500 = numbers_500[counter_500];
    counter_500++;
    drawn_numbers_500.push(current_drawn_number_500);
    broadcast({
      type: "numbers_being_called_500",
      current_drawn_number_500,
      counter_500,
      players_500,
    });
  } else {
    counter_500 = 0;
    clearInterval(call_interval_500);
    timer_500();
    active_game_500 = false;
    players_500_map.clear();
    players_500_set.clear();
    numbers_500 = [];
    drawn_numbers_500 = [];
    broadcast({
      type: "all_numbers_called_500",
      active_game_500,
      players_500,
    });
    players_500 = [];
  }
}

async function return_winner_html_500(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_500,
    u,
    line_making_array_500,
    "playing_cartela_number_500",
    500,
    current_drawn_number_500
  );
  if (html) {
    return html;
  } else {
    return null;
  }
}

function game_end_500() {
  counter_500 = 0;
  clearInterval(call_interval_500);
  timer_500();
  players_500_map.clear();
  players_500_set.clear();
  drawn_numbers_500 = [];
  numbers_500 = [];
  players_500 = [];
}

// Game 1000 funs
function timer_1000(seconds = 15) {
  let count = seconds;
  timer_interval_1000 = setInterval(() => {
    broadcast({
      type: "timer_1000",
      value: count,
      players: players_1000.length,
    });
    count--;

    if (count < 0) {
      if (players_1000.length > 0) {
        new_game({ players: players_1000.length, stake: 1000 });

        clearInterval(timer_interval_1000);
        active_game_1000 = true;
        broadcast({
          type: "game_started_1000",
          players_1000,
          active_game_1000,
        });
        numbers_1000 = generated_numbers_1000();
        call_interval_1000 = setInterval(broadcast_numbers_1000, 2500);
      } else {
        count = seconds;
      }
    }
  }, 1000);
}

function generated_numbers_1000() {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function broadcast_numbers_1000() {
  // console.log("Numbers:", numbers);
  if (counter_1000 < numbers_1000.length) {
    current_drawn_number_1000 = numbers_1000[counter_1000];
    counter_1000++;
    drawn_numbers_1000.push(current_drawn_number_1000);
    broadcast({
      type: "numbers_being_called_1000",
      current_drawn_number_1000,
      counter_1000,
      players_1000,
    });
  } else {
    counter_1000 = 0;
    clearInterval(call_interval_1000);
    timer_1000();
    active_game_1000 = false;
    players_1000_map.clear();
    players_1000_set.clear();
    numbers_1000 = [];
    drawn_numbers_1000 = [];
    broadcast({
      type: "all_numbers_called_1000",
      active_game_1000,
      players_1000,
    });
    players_1000 = [];
  }
}

async function return_winner_html_1000(c, u) {
  let html = await win_checking_logic(
    c,
    drawn_numbers_1000,
    u,
    line_making_array_1000,
    "playing_cartela_number_1000",
    1000,
    current_drawn_number_1000
  );
  if (html) {
    return html;
  } else {
    return null;
  }
}

function game_end_1000() {
  counter_1000 = 0;
  clearInterval(call_interval_1000);
  timer_1000();
  players_1000_map.clear();
  players_1000_set.clear();
  drawn_numbers_1000 = [];
  numbers_1000 = [];
  players_1000 = [];
}

timer_5();
timer_10();
timer_20();
timer_50();
timer_100();
timer_500();
timer_1000();

// DB functions

//Transactions db
async function new_transaction(transaction) {
  try {
    const sql = `
      INSERT INTO transactions (
        txn_id,
        user_id,
        amount,
        method,
        status
      ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      transaction.txn_id,
      transaction.user_id,
      transaction.amount,
      transaction.method,
      transaction.status,
    ];

    await pool.query(sql, values);
    console.log("✅ Transaction inserted successfully");
  } catch (err) {
    console.error("❌ Error inserting transaction:", err.message);
    throw err;
  }
}

// lets user txn_id later
async function successful_transaction(user_id, txn_id) {
  try {
    // Step 1: Update the latest "pending" transaction to "success"
    const [updateResult] = await pool.query(
      `
      UPDATE transactions
      SET status = 'success'
      WHERE user_id = ? AND txn_id = ? AND status = 'pending'
      `,
      [user_id, txn_id]
    );

    if (updateResult.affectedRows === 0) {
      throw new Error("No pending transaction found to update.");
    }

    // Step 2: Get the amount from the latest successful transaction
    const [rows] = await pool.query(
      `
      SELECT amount FROM transactions
      WHERE user_id = ? AND txn_id = ?
      
      `,
      [user_id, txn_id]
    );

    if (rows.length === 0) {
      throw new Error("No successful transaction found.");
    }

    const depositAmount = rows[0].amount;

    // Step 3: Call update_balance_when_user_deposit with the amount
    await update_balance_when_user_deposit(user_id, depositAmount);
    console.log("✅ Transaction status updated and balance credited.");
  } catch (err) {
    console.error(
      "❌ Error in mark_transaction_success_and_update_balance:",
      err.message
    );
    throw err;
  }
}

// Games db
async function new_game(game) {
  try {
    const sql = `
      INSERT INTO games (players, stake, winner)
      VALUES (?, ?, 0)
    `;

    const values = [
      game.players, // e.g. 5
      game.stake,
      // e.g. "2025-06-01T21:00:00.000Z"
    ];

    const [result] = await pool.query(sql, values);
    console.log(`✅ Game inserted with ID: ${result.insertId}`);
    return result.insertId;
  } catch (err) {
    console.error("❌ Error inserting game:", err.message);
    throw err;
  }
}

// update_balance_of_winner("3098623771", 100).catch(console.error);

// General funs
function calculate_win_amount(stake, players) {
  return stake * 0.8 * players;
}

async function win_checking_logic(
  card,
  d,
  u,
  lineMakingArray,
  game_class,
  stake,
  current
) {
  let line1 = [card.b1, card.b2, card.b3, card.b4, card.b5];
  let line2 = [card.i1, card.i2, card.i3, card.i4, card.i5];
  let line3 = [card.n1, card.n2, card.n4, card.n5];
  let line4 = [card.g1, card.g2, card.g3, card.g4, card.g5];
  let line5 = [card.o1, card.o2, card.o3, card.o4, card.o5];
  let line6 = [card.b1, card.i1, card.n1, card.g1, card.o1];
  let line7 = [card.b2, card.i2, card.n2, card.g2, card.o2];
  let line8 = [card.b3, card.i3, card.g3, card.o3];
  let line9 = [card.b4, card.i4, card.n4, card.g4, card.o4];
  let line10 = [card.b5, card.i5, card.n5, card.g5, card.o5];
  let line11 = [card.b1, card.i2, card.g4, card.o5];
  let line12 = [card.b5, card.i4, card.g2, card.o1];
  let line13 = [card.b1, card.b5, card.o1, card.o5];

  const allLines = [
    line1,
    line2,
    line3,
    line4,
    line5,
    line6,
    line7,
    line8,
    line9,
    line10,
    line11,
    line12,
    line13,
  ];

  allLines.forEach((l) => {
    if (l.every((element) => d.includes(element))) {
      // lineMakingArray.push([...l]);
      for (let i = 0; i < l.length; i++) {
        lineMakingArray.push(l[i]);
      }
    }
  });

  if (lineMakingArray.length > 0 && lineMakingArray.includes(current)) {
    console.log("Line making numbers: ", lineMakingArray);
    let html = "";
    let first_name = (await get_first_name_user(u)) || u;
    html += `<!-- BINGO Header -->
      <div
        class="bg-gradient-to-br from-gray-900 via-gray-600 to-gray-700 opacity-90 w-[80%] h-[70%] max-h-[300] p-2 flex flex-col justify-center items-center overflow-auto rounded-lg"
      >
        <div class="flex items-center gap-1">
          <img src="./assets/icons/win.png" class="w-12" />${first_name} won!!! 🎉🎉🎉
        </div>
        <div
          class="w-[100%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-10px] opacity-100"
        >
          <div
            class="w-[20%] h-8 bg-gray-300 text-black text-lg font-bold flex justify-center items-center rounded-lg"
            style="margin: 0px auto 5px"
          >
            ${card.id}
          </div>

          <!-- Headers -->
          <div class="grid grid-cols-5 text-center font-bold text-xl mb-2">
            <div>B</div>
            <div>I</div>
            <div>N</div>
            <div>G</div>
            <div>O</div>
          </div>
          <div class="grid grid-cols-5 gap-1 text-center text-lg">`;

    const getClass = (value) => {
      if (value == current)
        return `bg-gray-700 rounded-full border border-[5px] border-green-400 py-2 w-12 h-12 flex justify-center items-center ${game_class} box-border`;
      if (lineMakingArray.includes(value))
        return `bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 flex justify-center items-center ${game_class} box-border`;

      if (d.includes(value))
        return `bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center ${game_class} box-border`;
      return `bg-gray-700 rounded py-2 w-12 h-12 flex justify-center items-center ${game_class} box-border`;
    };

    html += `
<div class="${getClass(card.b1)}" id="b1">${card.b1}</div>
<div class="${getClass(card.i1)}" id="i1">${card.i1}</div>
<div class="${getClass(card.n1)}" id="n1">${card.n1}</div>
<div class="${getClass(card.g1)}" id="g1">${card.g1}</div>
<div class="${getClass(card.o1)}" id="o1">${card.o1}</div>

<div class="${getClass(card.b2)}" id="b2">${card.b2}</div>
<div class="${getClass(card.i2)}" id="i2">${card.i2}</div>
<div class="${getClass(card.n2)}" id="n2">${card.n2}</div>
<div class="${getClass(card.g2)}" id="g2">${card.g2}</div>
<div class="${getClass(card.o2)}" id="o2">${card.o2}</div>

<div class="${getClass(card.b3)}" id="b3">${card.b3}</div>
<div class="${getClass(card.i3)}" id="i3">${card.i3}</div>
<div class="bg-gray-700 rounded-full border border-[5px] border-orange-400 py-2 w-12 h-12 box-border flex justify-center items-center" id="free">⭐</div>
<div class="${getClass(card.g3)}" id="g3">${card.g3}</div>
<div class="${getClass(card.o3)}" id="o3">${card.o3}</div>

<div class="${getClass(card.b4)}" id="b4">${card.b4}</div>
<div class="${getClass(card.i4)}" id="i4">${card.i4}</div>
<div class="${getClass(card.n4)}" id="n3">${card.n4}</div>
<div class="${getClass(card.g4)}" id="g4">${card.g4}</div>
<div class="${getClass(card.o4)}" id="o4">${card.o4}</div>

<div class="${getClass(card.b5)}" id="b5">${card.b5}</div>
<div class="${getClass(card.i5)}" id="i5">${card.i5}</div>
<div class="${getClass(card.n5)}" id="n4">${card.n5}</div>
<div class="${getClass(card.g5)}" id="g5">${card.g5}</div>
<div class="${getClass(card.o5)}" id="o5">${card.o5}</div>
</div>
</div>
<div class="flex items-center justify-center bg-orange-500 text-white mx-auto w-[150px] mt-2 py-2 continue_game_${stake} rounded-lg" >
          Continue
        </div>
</div>
`;
    return html;
  } else {
    return null;
  }
}

async function decrease_balance_of_user_when_start_game(user_id, stake) {
  try {
    // Step 1: Get user's balance and bonus
    const [rows] = await pool.query(
      `SELECT balance, bonus FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    let { balance, bonus } = rows[0];
    let newBonus = bonus;
    let newBalance = balance;

    if (bonus >= stake) {
      newBonus -= stake;
    } else if (bonus === 0) {
      if (balance < stake) {
        throw new Error("Insufficient balance");
      }
      newBalance -= stake;
    } else {
      const remainingStake = stake - bonus;
      if (balance < remainingStake) {
        throw new Error("Insufficient balance");
      }
      newBonus = 0;
      newBalance -= remainingStake;
    }

    // Step 2: Update the user's balance and bonus
    await pool.query(
      `UPDATE users SET balance = ?, bonus = ? WHERE user_id = ?`,
      [newBalance, newBonus, user_id]
    );

    console.log(
      `✅ Updated: New bonus = ${newBonus}, New balance = ${newBalance}`
    );
    return { bonus: newBonus, balance: newBalance };
  } catch (err) {
    console.error("❌ Error:", err.message);
    throw err;
  }
}

async function update_balance_of_winner(user_id, win_amount) {
  try {
    // Step 1: Get the current balance and bonus
    const [rows] = await pool.query(
      `SELECT balance, bonus FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const currentBalance = rows[0].balance;
    const currentBonus = rows[0].bonus;
    const newBalance = currentBalance + win_amount;

    // Step 2: Update the balance
    await pool.query(`UPDATE users SET balance = ? WHERE user_id = ?`, [
      newBalance,
      user_id,
    ]);

    const data = {
      balance: newBalance,
      bonus: currentBonus, // fixed this line
    };

    console.log(
      `✅ Updated: User ${user_id} new balance is ${data.balance}, bonus is ${data.bonus}`
    );
    return data;
  } catch (err) {
    console.error("❌ Error updating winner's balance:", err.message);
    throw err;
  }
}

async function update_winner_on_games(stake, winner) {
  try {
    await pool.query(
      `UPDATE games SET winner = ? WHERE id = (SELECT id FROM (SELECT id FROM games WHERE stake = ? ORDER BY id DESC LIMIT 1) AS latest);`,
      [winner, stake]
    );
    console.log("Winner Updated");
  } catch (err) {
    console.error(err);
  }
}

function generate_transaction_id() {
  return uuidv4().replace(/-/g, "").slice(0, 10);
}

function message_delete_function(u_id, m_id) {
  bot.deleteMessage(u_id, m_id);
}

// Conversation states
const receive_amount_telebirr = {};
const receive_phone_number_for_telebirr = {};
const phone_number_for_telebirr = {};
const w_receive_amount_telebirr = {};
// Bot
bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
  const u_id = msg.from.id.toString();
  const c_id = msg.chat.id;
  console.log("Telegram ID: ", u_id);

  const exists = await check_if_user_exists(u_id);

  if (exists) {
    creating_keyboard_buttons(c_id, false);
  } else {
    const referrer_id = match[1];
    if (referrer_id && referrer_id !== u_id) {
      create_referrer_data(u_id, referrer_id);
    }
    send_phone_number_request(c_id);
  }
});

bot.on("contact", (msg) => {
  const u_id = msg.from.id.toString();
  const username = msg.from.username || "";
  const first_name = msg.from.first_name;
  const phone_number = msg.contact.phone_number;
  const c_id = msg.chat.id;

  const new_user_crenditials = {
    user_id: u_id,
    first_name,
    username,
    phone_number,
    balance: 0,
    bonus: 10,
    played_games: 0,
    won_games: 0,
  };

  create_new_user(new_user_crenditials, c_id);
  reward_the_referrer(u_id);
});

// Messages
bot.on("message", async (msg) => {
  const u_id = msg.from.id.toString();
  const c_id = msg.chat.id;
  const text = msg.text;
  // const m_id = query.message.message_id;

  switch (text) {
    case "▶️ Play":
      turn_off_converstation_states(u_id);
      bot.sendMessage(c_id, "Good luck 🤞", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "▶️ Play",
                web_app: {
                  url: `https://abogida.duckdns.org/`,
                },
              },
            ],
          ],
        },
      });
      break;
    case "💰 Balance":
      turn_off_converstation_states(u_id);

      get_balance_user(c_id, u_id);
      break;
    case "👥 Invite":
      turn_off_converstation_states(u_id);

      get_invite_link(c_id, u_id);
      break;
    case "🔁 Transactions":
      turn_off_converstation_states(u_id);

      get_transactions_by_user(c_id, u_id);

      break;
    case "🕙 Last 10 games":
      turn_off_converstation_states(u_id);

      get_last_10_games_for_user(c_id);
      break;
    case "📞 Contact":
      turn_off_converstation_states(u_id);

      bot.sendMessage(c_id, `Admins: \n\n@aben59\n`, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Join channel",
                url: "https://t.me/chapa_bingo",
              },
            ],
          ],
        },
      });
      break;
    case "📋 Rules":
      turn_off_converstation_states(u_id);

      send_rules(c_id);
      break;
    case "📥 Deposit":
      turn_off_converstation_states(u_id);

      deposit_first_step(c_id);
      break;
    case "📤 Withdraw":
      turn_off_converstation_states(u_id);

      start_withdrwal_process(u_id);
      break;
  }

  // Converstation states

  // 1. telebirr amount
  if (receive_amount_telebirr[u_id]) {
    if (/^\d+$/.test(text.trim())) {
      if (parseInt(text) >= 10) {
        turn_off_converstation_states(u_id);
        const phone_number = phone_number_for_telebirr[u_id];
        d_third_step_telebirr(c_id, phone_number, text, u_id);
      } else {
        bot.sendMessage(c_id, "Minimum amount is *Br. 10.* Please try again.", {
          parse_mode: "Markdown",
        });
      }
    } else {
      bot.sendMessage(c_id, "Invalid character found. Please try again.", {
        parse_mode: "Markdown",
      });
    }
  }

  // 2. using another number to deposit for telebirr
  if (receive_phone_number_for_telebirr[u_id]) {
    if (/^\d{10}$/.test(text)) {
      turn_off_converstation_states(u_id);
      bot.sendMessage(c_id, `Received number: ${text}.`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Continue`,
                callback_data: `keep_telebirr_phone_number_${text}`,
              },
            ],
          ],
        },
      });
    } else {
      bot.sendMessage(
        c_id,
        "Invalid phone number. Please try again.\n\nUse 09******** format."
      );
    }
  }

  // 3. Withdraw using telebirr receving amount
  if (w_receive_amount_telebirr[u_id]) {
    w_receive_amount_telebirr[u_id] = false;
    if (/^\d+$/.test(text.trim())) {
      if (parseInt(text) >= 50 && parseInt(text) <= 1000) {
        let balance = await get_balance_of_specific_user(u_id).catch(
          console.error
        );
        let real_balance = balance[0].balance;
        if (parseInt(text) > real_balance) {
          bot.sendMessage(c_id, "Not enough balance to withdraw.", {
            parse_mode: "Markdown",
          });
        } else {
          w_third_step_telebirr(u_id, text);
        }
      } else {
        bot.sendMessage(c_id, "Minimum amount is *Br. 50.* Please try again.", {
          parse_mode: "Markdown",
        });
      }
    } else {
      bot.sendMessage(c_id, "Invalid character found. Please try again.", {
        parse_mode: "Markdown",
      });
    }
  }
});

// Call back
bot.on("callback_query", async (query) => {
  const c_id = query.message.chat.id;
  const data = query.data;
  const m_id = query.message.message_id;
  let u_id = query.from.id.toString();

  switch (true) {
    case data === "deposit":
      message_delete_function(u_id, m_id);
      deposit_first_step(c_id);
      break;
    case data === "withdraw":
      message_delete_function(u_id, m_id);
      start_withdrwal_process(u_id);
      break;
    case data === "d_first_step_telebirr":
      message_delete_function(u_id, m_id);
      d_first_step_telebirr(c_id, u_id);
      break;
    case data === "d_first_step_cbe":
      bot.sendMessage(
        c_id,
        "CBE not working at the moment. Please use TELEBIRR until it is fixed."
      );
      break;
    case data.startsWith("keep_telebirr_phone_number_"):
      message_delete_function(u_id, m_id);
      const telebirr_number = data.replace("keep_telebirr_phone_number_", "");
      d_second_step_telebirr(telebirr_number, u_id);
      break;
    case data === "change_telebirr_phone_number":
      message_delete_function(u_id, m_id);
      turn_off_converstation_states(u_id);
      receive_phone_number_for_telebirr[u_id] = true;
      bot.sendMessage(
        c_id,
        `Send the phone number you want to send from... \n\n⚠️ Must be in format 09********`
      );
      break;
    case data.startsWith("confirm_payment_telebirr_"):
      message_delete_function(u_id, m_id);

      const confirm_data_telebirr = data.replace(
        "confirm_payment_telebirr_",
        ""
      );
      const [
        confirm_phone_number_telebirr,
        confirm_amount_telebirr,
        confirm_u_id_telebirr,
        confirm_txn_id_telebirr,
      ] = confirm_data_telebirr.split("_");

      let f_name = await get_first_name_user(confirm_u_id_telebirr);
      d_fourth_step_telebirr(
        f_name,
        confirm_phone_number_telebirr,
        confirm_amount_telebirr,
        confirm_u_id_telebirr,
        confirm_txn_id_telebirr
      );

      break;
    case data.startsWith("approve_payment_transaction_"):
      message_delete_function(u_id, m_id);
      const c_data_telebirr = data.replace("approve_payment_transaction_", "");
      const [c_u_id_telebirr, c_amount_telebirr, c_txn_id_telebirr] =
        c_data_telebirr.split("_");
      console.log(c_u_id_telebirr, c_amount_telebirr);
      await update_bonus_when_user_deposit(
        c_u_id_telebirr,
        parseInt(c_amount_telebirr)
      ).then(async () => {
        await update_successful_deposit(c_txn_id_telebirr);
        bot.sendMessage(c_u_id_telebirr, "Deposit Successful.").then(() => {
          get_balance_user(c_u_id_telebirr, c_u_id_telebirr);
        });
      });
      break;
    case data === "w_first_step_telebirr":
      message_delete_function(u_id, m_id);
      w_first_step_telebirr(u_id);
      break;
    case data === "w_first_step_cbe":
      bot.sendMessage(
        c_id,
        "CBE not working at the moment. Please use TELEBIRR until it is fixed."
      );
      break;
    case data === "w_second_step_telebirr":
      message_delete_function(u_id, m_id);
      w_second_step_telebirr(u_id);
      break;
    case data.startsWith("approve_withdrawal_telebirr_"):
      message_delete_function(u_id, m_id);
      const w_data_telebirr = data.replace("approve_withdrawal_telebirr_", "");
      const [w_txn_id_telebirr, w_amount_telebirr, w_u_id_telebirr] =
        w_data_telebirr.split("_");
      await update_balance_when_user_withdraw(
        w_u_id_telebirr,
        parseInt(w_amount_telebirr)
      ).then(async () => {
        await update_successful_deposit(w_txn_id_telebirr);
        bot.sendMessage(w_u_id_telebirr, "Withdraw Successful.").then(() => {
          get_balance_user(w_u_id_telebirr, w_u_id_telebirr);
        });
      });
      break;
  }
});

// Bot functions
function get_invite_link(c_id, u_id) {
  bot.sendMessage(
    c_id,
    `
🎉 *Invite & Earn with Chapa Bingo!*

Share the fun and earn * Br. 3 * for every friend who starts the bot using your link!

🔗 [Click to Join](https://t.me/chapa_bingo_bot?start=${u_id})

Bring your family and friends to *play, win,* and *enjoy Bingo together!*
  `,
    { parse_mode: "Markdown" }
  );
}

function send_rules(c_id) {
  bot.sendMessage(
    c_id,
    `
    ህግ እና ደንቦች\n\nየ ጨ ዋ ታ   ህ ጎ ች\n\n1️⃣ ወደ ቻፓ ቢንጎ ሲቀላቀሉ የመጫወቻ 10 ነጥብ ከኛ ስጦታ ያገኛሉ:: \n\`\`\` ⚠️በዚ የመጫወቻ ነጥብ ተጫውተው ያሸነፉትን ብር ለማውጣት ቢያንስ ከ100 ብር በላይ መሆን ይኖረበታል::\`\`\`\n\n 2️⃣ ጨዋታ ለመጀመር ካረቴላ ከመረጡ በኋላ ጨዋታው ከመጀመሩም በፊት ሆነ ከጀመረ በኋላ አቋርጠው ቢወጡ እንደተጫወት ተቆጥሮ የመጫወቻው መጠን ገንዘብ ከነበረዎት ገንዘብ ላይ ተቆራጭ ይሆናል::\n\n3️⃣ ጨዋታ ሲጀመር የመጫወቻ ኳሶች በ5 ሰከንድ ልዩነት መጠራት ይጀምራሉ:: በዚ 5 ሰከንድ ውስጥ በተጠራው ቁጥር አሸናፊ ሁኖ የ ቢንጎ በተን ቀድሞ የተጫነ ሰው አሸናፊ ይሆናል::\n\`\`\` ℹ️ ሁለት ወይም ከዛ በላይ ተጫዋቾች እኩል ቢንጎ ካሉ ሲይሰተም ለሁሉም እኩል ያከፋፍላል::\`\`\` \`\`\` ⚠️በተጠራው ቁጥር ሳያሸንፍ ቢንጎ ያለ ተጫዋች ከጨዋታው ይወገዳል::\`\`\`\n\n የገቢ ገንዘብ መጠን:\n\`\`\` ዝቅተኛ : 50 ብር \nከፍተኛ : ገደብ የለውም\`\`\`\n\nገንዘብ ለማውጣት ይህንን ያሟሉ\n\nማውጣት የሚችሉት: \n \`\`\` ትንሹ የገንዘብ መጠን : 50 ብር \nከፈተኛ የገንዘብ መጠን በቀን : 1000 ብር \`\`\`\n\n አዲስ ሰው ወደ ቦቱ እንዲቀላቀል ሲያደርጉ :
5 ብር ሰዎቹ ለተቀላቀሉበት በነጥብ መልክ ይሰጥዎታል:: ከመጀመሪያ ዲፓዚት ደሞ 10% በነጥብ መልክ ያገኛሉ::

    
    `,
    { parse_mode: "Markdown" }
  );
}

async function get_balance_user(c_id, u_id) {
  let balance = await get_balance_of_specific_user(u_id).catch(console.error);
  let real_balance = balance[0].balance;
  let bonus = balance[0].bonus;
  bot.sendMessage(
    c_id,
    `\`\`\` 💰 Withdrawable Balance : Br. ${real_balance} \n 🎁 Non-Withdrawable balance : Br. ${bonus} \`\`\``,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📥 Deposit",
              callback_data: "deposit",
            },
            {
              text: "📤 Withdraw",
              callback_data: "withdraw",
            },
          ],
        ],
      },
    }
  );
}

// Bot transactions
async function get_transactions_by_user(c_id, user_id) {
  const [rows] = await pool.query(
    `SELECT * FROM transactions WHERE user_id = ${user_id} and status = 'success'`
  );
  let transactions = rows;
  if (transactions.length > 0) {
    console.log(transactions);

    bot.sendMessage(c_id, create_transactions_table(transactions), {
      parse_mode: "Markdown",
    });

    console.log(create_transactions_table(transactions));
  } else {
    bot.sendMessage(
      c_id,
      `\`\`\`\ 0 transactions of deposit or withdrwal found. \`\`\``,
      {
        parse_mode: "Markdown",
      }
    );
  }
  // console.log(transactions);
  return rows;
}

function create_transactions_table(transactions) {
  if (transactions.length === 0) return "No transactions found.";

  const userId = transactions[0].user_id; // Assuming all transactions are for same user

  const headers = ["Type", "Method", "Amount"];

  const rows = transactions.map((txn) => [
    txn.type == "d" ? "Deposit" : "Withdraw",
    txn.method,
    `Br. ${txn.amount}`,
  ]);

  const columnWidths = headers.map((_, colIndex) =>
    Math.max(
      headers[colIndex].length,
      ...rows.map((row) => row[colIndex].length)
    )
  );

  const drawLine = (left, middle, right) =>
    left + columnWidths.map((w) => "─".repeat(w + 2)).join(middle) + right;

  const drawRow = (cells) =>
    "│" +
    cells
      .map((cell, i) => ` ${cell.toString().padEnd(columnWidths[i])} `)
      .join("│") +
    "│";

  const top = drawLine("┌", "┬", "┐");
  const sep = drawLine("├", "┼", "┤");
  const bottom = drawLine("└", "┴", "┘");

  const headerRow = drawRow(headers);
  const body = rows.map(drawRow).join("\n");

  // const total = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  // const totalRow = drawRow(["Total", "", `Br. ${total}`]);

  const table =
    `User ID: ${userId}\n\n` +
    `${transactions.length} transactions found.\n\n` +
    top +
    "\n" +
    headerRow +
    "\n" +
    sep +
    "\n" +
    body +
    "\n" +
    // sep +
    // "\n" +
    // totalRow +
    // "\n" +
    bottom;

  return "```\n" + table + "\n```";
}

async function create_a_transaction(u_id, amount, type, method, txn_id) {
  try {
    const sql = `
        INSERT INTO transactions (
          txn_id,
          user_id,
          amount,
          type,
          method,
          status
        ) VALUES (?,?,?,?,?,?)
      `;

    await pool.query(sql, [txn_id, u_id, amount, type, method, "pending"]);

    console.log("Created transaction successfully");
  } catch (err) {
    console.error(err);
    console.log("Fail creating transaction");
  }
}

async function update_successful_deposit(txn_id) {
  try {
    await pool.query(
      `UPDATE transactions SET status = 'success' WHERE txn_id = ?`,
      [txn_id]
    );
    console.log("Transaction Updated");
  } catch (err) {
    console.error(err);
  }
}

// Bot games
async function get_last_10_games_for_user(c_id) {
  const [rows] = await pool.query(
    `SELECT * FROM games ORDER BY id DESC LIMIT 10`
  );
  bot.sendMessage(c_id, create_games_table(rows), {
    parse_mode: "Markdown",
  });
  console.log(create_games_table(rows));
}

function create_games_table(games) {
  const headers = ["ID", "P", "Stake", "Winning", "Winner"];

  const rows = games.map((game) => [
    game.id.toString(),
    game.players.toString(),
    `Br. ${game.stake.toFixed(0)}`,
    `Br. ${(game.stake * game.players * 0.8).toFixed(0)}`,
    game.winner && game.winner !== "0" ? game.winner : "-",
  ]);

  const columnWidths = headers.map((_, i) =>
    Math.max(headers[i].length, ...rows.map((row) => row[i].length))
  );

  const drawLine = (left, middle, right) =>
    left + columnWidths.map((w) => "─".repeat(w + 2)).join(middle) + right;

  const drawRow = (cells) =>
    "│" +
    cells.map((cell, i) => ` ${cell.padEnd(columnWidths[i])} `).join("│") +
    "│";

  const top = drawLine("┌", "┬", "┐");
  const sep = drawLine("├", "┼", "┤");
  const bottom = drawLine("└", "┴", "┘");

  const table =
    top +
    "\n" +
    drawRow(headers) +
    "\n" +
    sep +
    "\n" +
    rows.map(drawRow).join("\n") +
    "\n" +
    bottom;

  return "```\n" + table + "\n```";
}

// Bot users
async function create_new_user(user, c_id) {
  const [rows] = await pool.query(
    "SELECT user_id FROM users WHERE user_id = ?",
    [user.user_id]
  );
  if (rows.length === 0) {
    try {
      const sql = `
      INSERT INTO users (
        user_id,
        first_name,
        username,
        phone_number,
        balance,
        bonus,
        played_games,
        won_games
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        user.user_id,
        user.first_name,
        user.username,
        user.phone_number,
        user.balance,
        user.bonus,
        user.played_games,
        user.won_games,
      ];

      await pool.query(sql, values);

      bot
        .sendMessage(
          c_id,
          `Welcome to *Chapa! Bingo*.\n\n\`\`\`You have received  Br. 10. \`\`\`  \`\`\`ENJOY!!!\`\`\``,
          {
            parse_mode: "Markdown",
            reply_markup: {
              remove_keyboard: true,
            },
          }
        )
        .then(() => {
          creating_keyboard_buttons(c_id, true);
        });
    } catch (err) {
      console.error("❌ Error inserting user:", err.message);
      throw err;
    }
  }
}

async function check_if_user_exists(u_id) {
  const [rows] = await pool.query(
    "SELECT 1 FROM users WHERE user_id = ? LIMIT 1",
    [u_id]
  );
  return rows.length > 0;
}

async function get_all_users() {
  const [rows] = await pool.query("SELECT * FROM users");
  console.log(JSON.stringify(rows, null, 2)); // pretty-print
  return rows;
}

async function get_details_of_a_users(user_id) {
  const [rows] = await pool.query("SELECT * FROM users where user_id =?", [
    user_id,
  ]);
  console.log(JSON.stringify(rows, null, 2)); // pretty-print
  return rows;
}

async function get_balance_of_specific_user(user_id) {
  const [rows] = await pool.query(
    `SELECT balance,bonus FROM users where user_id = ${user_id}`
  );
  console.log(JSON.stringify(rows)); // pretty-print
  return rows;
}

async function update_balance_when_user_deposit(user_id, amount) {
  try {
    // Step 1: Get the current balance
    const [rows] = await pool.query(
      `SELECT balance FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const currentBalance = rows[0].balance;
    const newBalance = currentBalance + amount;

    // Step 2: Update the balance
    await pool.query(`UPDATE users SET balance = ? WHERE user_id = ?`, [
      newBalance,
      user_id,
    ]);

    console.log(`✅ Updated: User ${user_id} new balance is ${newBalance}`);
    return newBalance;
  } catch (err) {
    console.error("❌ Error updating winner's balance:", err.message);
    throw err;
  }
}

async function update_balance_when_user_withdraw(user_id, amount) {
  try {
    // Step 1: Get the current balance
    const [rows] = await pool.query(
      `SELECT balance FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const currentBalance = rows[0].balance;
    const newBalance = currentBalance - amount;

    // Step 2: Update the balance
    await pool.query(`UPDATE users SET balance = ? WHERE user_id = ?`, [
      newBalance,
      user_id,
    ]);

    console.log(`✅ Updated: User ${user_id} new balance is ${newBalance}`);
    return newBalance;
  } catch (err) {
    console.error("❌ Error updating winner's balance:", err.message);
    throw err;
  }
}

async function update_bonus_when_user_deposit(user_id, amount) {
  try {
    // Step 1: Get the current balance
    const [rows] = await pool.query(
      `SELECT bonus FROM users WHERE user_id = ?`,
      [user_id]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    const currentBonus = rows[0].bonus;
    const newBonus = currentBonus + amount;

    // Step 2: Update the balance
    await pool.query(`UPDATE users SET bonus = ? WHERE user_id = ?`, [
      newBonus,
      user_id,
    ]);

    console.log(`✅ Updated: User ${user_id} new balance is ${newBonus}`);
    return newBonus;
  } catch (err) {
    console.error("❌ Error updating winner's balance:", err.message);
    throw err;
  }
}

function creating_keyboard_buttons(c_id, new_user) {
  const user_keyboard_buttons = {
    reply_markup: {
      keyboard: [
        ["▶️ Play", "📋 Rules"],
        ["💰 Balance"],
        ["📥 Deposit", "📤 Withdraw"],
        ["🔁 Transactions"],
        ["👥 Invite", "📞 Contact"],
        ["🕙 Last 10 games"],
      ],
      resize_keyboard: true,
      one_time_keyboard: false, // keep keyboard open
    },
  };
  if (!new_user) {
    bot.sendMessage(
      c_id,
      "👋 Welcome back to Chapa! Choose an option:",
      user_keyboard_buttons
    );
  } else {
    bot.sendMessage(c_id, "👋", user_keyboard_buttons);
  }
}

function send_phone_number_request(c_id) {
  bot.sendMessage(
    c_id,
    "To start the app, 📱 Please share your phone number first: ",
    {
      reply_markup: {
        keyboard: [[{ text: "Send Phone Number", request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
}

async function get_first_name_user(u_id) {
  const [rows] = await pool.query(
    "SELECT first_name FROM users WHERE user_id = ? LIMIT 1",
    [u_id]
  );
  return rows.length > 0 ? rows[0].first_name : null;
}

async function get_phone_number_user(u_id) {
  const [rows] = await pool.query(
    "SELECT phone_number FROM users WHERE user_id = ? LIMIT 1",
    [u_id]
  );
  return rows.length > 0 ? rows[0].phone_number : null;
}

async function create_referrer_data(u_id, r_id) {
  try {
    const sql = `
        INSERT INTO referrals (
          user_id,
          referrer_id
        ) VALUES ( ?, ?)
      `;

    await pool.query(sql, [u_id, r_id]);

    console.log(u_id, "||", r_id);
  } catch (err) {
    console.log("Failed");
  }
}

async function reward_the_referrer(u_id) {
  const [rows] = await pool.query(
    `SELECT referrer_id FROM referrals where user_id = ${u_id}`
  );
  console.log("Rowsssss: ", rows);
  if (rows.length > 0) {
    let r_id = rows[0].referrer_id.toString();

    try {
      // Step 1: Get the current balance and bonus
      const [rows2] = await pool.query(
        `SELECT bonus FROM users WHERE user_id = ?`,
        [r_id]
      );

      if (rows2.length === 0) {
        throw new Error("User not found");
      }

      const currentBalance = rows2[0].bonus;
      const newBalance = currentBalance + 3;

      // Step 2: Update the balance
      await pool.query(`UPDATE users SET bonus = ? WHERE user_id = ?`, [
        newBalance,
        r_id,
      ]);

      let balance = await get_balance_of_specific_user(r_id).catch(
        console.error
      );
      let real_balance = balance[0].balance;
      let bonus = balance[0].bonus;
      bot.sendMessage(
        r_id,
        `You have received Br. 3 from your invite. \n\`\`\` 💰 Withdrawable Balance : Br. ${real_balance} \n 🎁 Non-Withdrawable balance : Br. ${bonus} \`\`\``,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "▶️ Play",
                  web_app: {
                    url: `https://abogida.duckdns.org/`,
                  },
                },
              ],
            ],
          },
        }
      );
    } catch (err) {
      console.error("❌ Error updating winner's balance:", err.message);
      throw err;
    }
    // return rows;
  }
}

function deposit_first_step(c_id) {
  bot.sendMessage(
    c_id,
    `Choose method of payment: \`\`\` Telebirr Recommended     \`\`\``,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Telebirr ",
              callback_data: "d_first_step_telebirr",
            },
            {
              text: "CBE",
              callback_data: "d_first_step_cbe",
            },
          ],
        ],
      },
    }
  );
}

async function d_first_step_telebirr(c_id, u_id) {
  let phone_number = await get_phone_number_user(u_id);
  bot.sendMessage(c_id, `Choose number `, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `${phone_number}`,
            callback_data: `keep_telebirr_phone_number_${phone_number}`,
          },
        ],
        [
          {
            text: "Change Number",
            callback_data: "change_telebirr_phone_number",
          },
        ],
      ],
    },
  });
}

async function d_second_step_telebirr(phone_number, u_id) {
  turn_off_converstation_states(u_id);
  receive_amount_telebirr[u_id] = true;
  phone_number_for_telebirr[u_id] = phone_number.toString();
  bot.sendMessage(
    u_id,
    `Send amount you want to deposit... \`\`\` min : Br. 10 \n max: -\`\`\` `,
    {
      parse_mode: "Markdown",
    }
  );
}

async function d_third_step_telebirr(c_id, phone_number, text, u_id) {
  let txn_id = generate_transaction_id();

  await create_a_transaction(u_id, text, "d", "telebirr", txn_id);

  bot.sendMessage(
    c_id,
    `Transaction created using ${phone_number} for amount *Br. ${text}.* \n\nPlease send the specified amount to 251934596919 via TELEBIRR.\n\n*Please use ${phone_number} to send only.* \n\n Only press confirm after payment. \n \`\`\` 5 mins\`\`\``,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Confirm payment",
              callback_data: `confirm_payment_telebirr_${phone_number}_${text}_${u_id}_${txn_id}`,
            },
          ],
        ],
      },
    }
  );
}

function d_fourth_step_telebirr(
  f_name,
  confirm_phone_number_telebirr,
  confirm_amount_telebirr,
  confirm_u_id_telebirr,
  confirm_txn_id_telebirr
) {
  bot
    .sendMessage(
      "353008986",
      `User confirmed Payment \n\nUser: ${f_name} \n\nPhone Number: ${confirm_phone_number_telebirr} \n\nAmount: ${confirm_amount_telebirr}\n\nMethod: TELEBIRR \n\nUser ID: ${confirm_u_id_telebirr} \n\n⚠️ Please confirm payment from your telebirr for the deposit from the specified number and approve it.`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Approve TELEBIRR transaction",
                callback_data: `approve_payment_transaction_${confirm_u_id_telebirr}_${confirm_amount_telebirr}_${confirm_txn_id_telebirr}`,
              },
            ],
          ],
        },
      }
    )
    .then(() => {
      bot.sendMessage(
        confirm_u_id_telebirr,
        "Please wait for the transaction to be approved. "
      );
    });
}

function turn_off_converstation_states(u_id) {
  receive_amount_telebirr[u_id] = false;
  receive_phone_number_for_telebirr[u_id] = false;
}

// Withdraw functions
async function check_if_user_deposited_at_least_once(u_id) {
  try {
    const [rows] = await pool.query(
      `SELECT 1 FROM transactions WHERE user_id = ? AND status = 'success'GROUP BY user_id HAVING SUM(amount) > 50`,
      [u_id]
    );
    if (rows.length > 0) {
      return true;
    } else {
    }
  } catch (err) {
    console.error(err);
  }
}

async function start_withdrwal_process(u_id) {
  if (await check_if_user_deposited_at_least_once(u_id)) {
    bot.sendMessage(
      u_id,
      `Choose method of withdrawal: \`\`\` Telebirr Recommended     \`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Telebirr ",
                callback_data: "w_first_step_telebirr",
              },
              {
                text: "CBE",
                callback_data: "w_first_step_cbe",
              },
            ],
          ],
        },
      }
    );
  } else {
    bot.sendMessage(
      u_id,
      "⚠️ You need to make a deposit of total amount * >= Br. 50 * to withdraw money.",
      {
        parse_mode: "Markdown",
      }
    );
  }
}

async function w_first_step_telebirr(u_id) {
  let phone_number = await get_phone_number_user(u_id);
  bot.sendMessage(
    u_id,
    `For now you can only use the number you registered with...${phone_number}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Continue",
              callback_data: "w_second_step_telebirr",
            },
          ],
        ],
      },
    }
  );
}

async function w_second_step_telebirr(u_id) {
  turn_off_converstation_states(u_id);

  w_receive_amount_telebirr[u_id] = true;

  bot.sendMessage(
    u_id,
    `Send amount you want to withdraw... \`\`\` min : Br. 50 \n max: Br. 1000/day\`\`\` `,
    {
      parse_mode: "Markdown",
    }
  );
}

async function w_third_step_telebirr(u_id, amount) {
  let phone_number = await get_phone_number_user(u_id);
  let f_name = await get_first_name_user(u_id);
  let txn_id = generate_transaction_id();

  await create_a_transaction(u_id, amount, "w", "telebirr", txn_id).then(() => {
    bot
      .sendMessage(
        "353008986",
        `Withdrawal request from:\n\nUser: ${f_name}\n\nPhone number: ${phone_number}\n\nAmount: ${amount}\n\nUser ID: ${u_id}`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Approve withdrawal",
                  callback_data: `approve_withdrawal_telebirr_${txn_id}_${amount}_${u_id}`,
                },
              ],
            ],
          },
        }
      )
      .then(() => {
        bot.sendMessage(u_id, "We are reviewing the transaction. Please wait.");
      });
  });
}

app.use(express.static("public")); // or your frontend path

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
