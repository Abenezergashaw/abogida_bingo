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

        let html = return_winner_html_10(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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
        let html = return_winner_html_20(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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
        let html = return_winner_html_50(cards[n - 1], u);
        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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
        let html = return_winner_html_100(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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
        let html = return_winner_html_500(cards[n - 1], u);

        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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
        let html = return_winner_html_1000(cards[n - 1], u);
        if (!html) {
          console.log(u + "Blocked");
          let balance = await update_balance_of_winner(u, 0).catch(
            console.error
          );
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

app.use(express.static("public")); // or your frontend path

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
