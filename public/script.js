const tg = window.Telegram.WebApp;

// Telegram user info
const userID = tg.initDataUnsafe?.user;
// const userID = "353008986";
// alert(userID.id);
// console.log(userID);
let username = null;

if (userID) {
  username = userID.id.toString();
  // alert(typeof username);
} else {
  username = "7052392258";
}

// document.getElementById("playButton").addEventListener("click", () => {
//   loadAndPlayAudio("https://abogida.duckdns.org/assets/start.m4a", "start");
// });
window.addEventListener("load", () => {
  preloadAllAudios();
});

// Socket
// const socket = new WebSocket("ws://192.168.1.5:3000");
const socket = new WebSocket("wss://abogida.duckdns.org/");
// const socket = new WebSocket("ws://192.168.0.5:3000");

// Later get from db
// let username = "353008986";
//   localStorage.removeItem('username')
//   localStorage.setItem('username','7052392258')
// let username = localStorage.getItem("username") || "7094056144";
// if(localStorage.getItem('username')){
// username = localStorage.getItem('username');
// }else{
//   localStorage.setItem('username', '7094056144')
//   username = 7094056144;
// }
//   alert(username,': from local storage')
// let username = "7094056144" || localStorage.getItem('username');
console.log("username", username);
let real_balance = null;
let bonus_balance = null;

// Global
let cards = null;

// Global container
const blocked_modal = document.querySelector(".blocked_modal");

// Game 5 container
const registery_5 = document.querySelector(".registery_5");
const game_5 = document.querySelector(".game_5");
const winner_5 = document.querySelector(".winner_5");
const playing_cartela_container_5 = document.querySelector(
  ".playing_cartela_section_5"
);
const counter_5 = document.querySelector(".counter_5");
const voice_5 = document.querySelector('.voice_5')


// Game 10 containers
const registery_10 = document.querySelector(".registery_10");
const game_10 = document.querySelector(".game_10");
const winner_10 = document.querySelector(".winner_10");
const playing_cartela_container_10 = document.querySelector(
  ".playing_cartela_section_10"
);
const counter_10 = document.querySelector(".counter_10");
const voice_10 = document.querySelector('.voice_10')



// Game 20 containers
const registery_20 = document.querySelector(".registery_20");
const game_20 = document.querySelector(".game_20");
const winner_20 = document.querySelector(".winner_20");
const playing_cartela_container_20 = document.querySelector(
  ".playing_cartela_section_20"
);
const counter_20 = document.querySelector(".counter_20");
const voice_20 = document.querySelector('.voice_20')


// Game 50 containers
const registery_50 = document.querySelector(".registery_50");
const game_50 = document.querySelector(".game_50");
const winner_50 = document.querySelector(".winner_50");
const playing_cartela_container_50 = document.querySelector(
  ".playing_cartela_section_50"
);
const counter_50 = document.querySelector(".counter_50");
const voice_50 = document.querySelector('.voice_50')


// Game 100 containers
const registery_100 = document.querySelector(".registery_100");
const game_100 = document.querySelector(".game_100");
const winner_100 = document.querySelector(".winner_100");
const playing_cartela_container_100 = document.querySelector(
  ".playing_cartela_section_100"
);
const counter_100 = document.querySelector(".counter_100");
const voice_100 = document.querySelector('.voice_100')


// Game 500 containers
const registery_500 = document.querySelector(".registery_500");
const game_500 = document.querySelector(".game_500");
const winner_500 = document.querySelector(".winner_500");
const playing_cartela_container_500 = document.querySelector(
  ".playing_cartela_section_500"
);
const counter_500 = document.querySelector(".counter_500");
const voice_500 = document.querySelector('.voice_500')


// Game 1000 containers
const registery_1000 = document.querySelector(".registery_1000");
const game_1000 = document.querySelector(".game_1000");
const winner_1000 = document.querySelector(".winner_1000");
const playing_cartela_container_1000 = document.querySelector(
  ".playing_cartela_section_1000"
);
const counter_1000 = document.querySelector(".counter_1000");
const voice_1000 = document.querySelector('.voice_1000')


// Game 5 variables
let selected_card_5 = null;
let active_game_5 = true;
let is_eligible_5 = false;
let is_mute_5 = false;

// Game 10 variables
let selected_card_10 = null;
let active_game_10 = true;
let is_eligible_10 = false;
let is_mute_10 = false;

// Game 20 variables
let selected_card_20 = null;
let active_game_20 = true;
let is_eligible_20 = false;
let is_mute_20 = false;

// Game 50 variables
let selected_card_50 = null;
let active_game_50 = true;
let is_eligible_50 = false;
let is_mute_50 = false;

// Game 100 variables
let selected_card_100 = null;
let active_game_100 = true;
let is_eligible_100 = false;
let is_mute_100 = false;

// Game 500 variables
let selected_card_500 = null;
let active_game_500 = true;
let is_eligible_500 = false;
let is_mute_500 = false;

// Game 1000 variables
let selected_card_1000 = null;
let active_game_1000 = true;
let is_eligible_1000 = false;
let is_mute_1000 = false;

// real_balance || bonus_balance > 10
//   ? document.querySelector(".entry_10").classList.remove("opacity-60")
//   : document.querySelector(".entry_10").classList.add("opacity-60");

socket.addEventListener("open", () => {
  console.log("Connected to WebSocket");
  socket.send(
    JSON.stringify({
      type: "init",
      username,
    })
  );
});

socket.addEventListener("message", async (event) => {
  const data = JSON.parse(event.data);
  // console.log(data);
  if (data.type === "infos") {
    let total_balance = data.balance[0];
    console.log(total_balance);
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    update_balance();
    cards = data.cards;
    active_game_5 = data.active_game_5;
    active_game_10 = data.active_game_10;
    active_game_20 = data.active_game_20;
    active_game_50 = data.active_game_50;
    active_game_100 = data.active_game_100;
    active_game_500 = data.active_game_500;
    active_game_1000 = data.active_game_1000;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );
    if (active_game_5) {
      document.querySelector(".game_started_flag_5").classList.remove("hidden");
    }
    if (active_game_10) {
      document
        .querySelector(".game_started_flag_10")
        .classList.remove("hidden");
    }
    if (active_game_20) {
      document
        .querySelector(".game_started_flag_20")
        .classList.remove("hidden");
    }
    if (active_game_50) {
      document
        .querySelector(".game_started_flag_50")
        .classList.remove("hidden");
    }
    if (active_game_100) {
      document
        .querySelector(".game_started_flag_100")
        .classList.remove("hidden");
    }

    if (active_game_500) {
      document
        .querySelector(".game_started_flag_500")
        .classList.remove("hidden");
    }

    if (active_game_1000) {
      document
        .querySelector(".game_started_flag_1000")
        .classList.remove("hidden");
    }
  }
  if (data.type === "refresh_players") {
    console.log(data.players_5_set);
    console.log(data.players_10_set);
    console.log(data.players_20_set);
    console.log(data.players_50_set);
    console.log(data.players_100_set);
    console.log(data.players_500_set);
    console.log(data.players_1000_set);
    for (let i = 0; i < data.players_5_set.length; i++) {
      document
        .querySelector(`.card_5_${data.players_5_set[i]}`)
        .classList.add("opacity-30");
    }
    for (let i = 0; i < data.players_10_set.length; i++) {
      document
        .querySelector(`.card_10_${data.players_10_set[i]}`)
        .classList.add("opacity-30");
    }
    for (let i = 0; i < data.players_20_set.length; i++) {
      document
        .querySelector(`.card_20_${data.players_20_set[i]}`)
        .classList.add("opacity-30");
    }

    for (let i = 0; i < data.players_50_set.length; i++) {
      document
        .querySelector(`.card_50_${data.players_50_set[i]}`)
        .classList.add("opacity-30");
    }

    for (let i = 0; i < data.players_100_set.length; i++) {
      document
        .querySelector(`.card_100_${data.players_50_set[i]}`)
        .classList.add("opacity-30");
    }

    for (let i = 0; i < data.players_500_set.length; i++) {
      document
        .querySelector(`.card_500_${data.players_50_set[i]}`)
        .classList.add("opacity-30");
    }

    for (let i = 0; i < data.players_1000_set.length; i++) {
      document
        .querySelector(`.card_1000_${data.players_50_set[i]}`)
        .classList.add("opacity-30");
    }
    update_info_of_5(active_game_5, data.players_5_set.length);
    update_info_of_10(active_game_10, data.players_10_set.length);
    update_info_of_20(active_game_20, data.players_20_set.length);
    update_info_of_50(active_game_50, data.players_50_set.length);
    update_info_of_100(active_game_100, data.players_100_set.length);
    update_info_of_500(active_game_500, data.players_500_set.length);
    update_info_of_1000(active_game_1000, data.players_1000_set.length);
  }
  // Game 5 sockets
  if (data.type === "timer_5") {
    update_info_of_5(data.value, data.players);
  } else if (data.type === "new_card_selected_5") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_5_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_5 = new_card;
      console.log(selected_card_5);
    } else {
      document.querySelector(`.card_5_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_5_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_5_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_5") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_5_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_5") {
    console.log(data.players_5);
    let player = data.players_5.find((p) => p.username === username);
    active_game_5 = data.active_game_5;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_5_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_5").classList.remove("hidden");
    document.querySelector(".entry_5_status").textContent = "Active";
    document.querySelectorAll(".cards_5").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_5") {
    let player = data.players_5.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_5);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_5,
        "game_5_animate_balls",
        balls_5
      );
      if (player.active) {
        if(!is_mute_5){
        await playCachedAudio(`sound${data.current_drawn_number_5}`);
        }
      }

      counter_5.textContent = data.counter_5 + "/75";

      document
        .querySelector(`.ball_5_${data.current_drawn_number_5}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_5") {
    active_game_5 = data.active_game_5;
    let player = data.players_5.find((p) => p.username === username);
    document.querySelector(".game_started_flag_5").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_5.classList.add("hidden");
      game_5.classList.add("hidden");
    }
  } else if (data.type === "bingo_5") {
    active_game_5 = data.active_game_5;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_5.find((p) => p.username === username);
    document.querySelector(".game_started_flag_5").classList.add("hidden");

    counter_5.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_5.classList.add("hidden");
      game_5.classList.add("hidden");
      winner_5.classList.remove("hidden");
      winner_5.innerHTML = data.html;
      document
        .querySelector(".continue_game_5")
        .addEventListener("click", () => {
          winner_5.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_5").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_5").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_5_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_5") {
    if (username == data.u) {
      console.log(username, data.u);
      game_5.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }

  // Game 10 sockets
  if (data.type === "timer_10") {
    update_info_of_10(data.value, data.players);
  } else if (data.type === "new_card_selected_10") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_10_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_10 = new_card;
      console.log(selected_card_10);
    } else {
      document.querySelector(`.card_10_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_10_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_10_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_10") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_10_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_10") {
    console.log(data.players_10);
    let player = data.players_10.find((p) => p.username === username);
    active_game_10 = data.active_game_10;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_10_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_10").classList.remove("hidden");
    document.querySelector(".entry_10_status").textContent = "Active";
    document.querySelectorAll(".cards_10").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_10") {
    let player = data.players_10.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_10);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_10,
        "game_10_animate_balls",
        balls_10
      );
      if (player.active) {
        if(!is_mute_10){
        await playCachedAudio(`sound${data.current_drawn_number_10}`);
        }
      }

      counter_10.textContent = data.counter_10 + "/75";

      document
        .querySelector(`.ball_10_${data.current_drawn_number_10}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_10") {
    active_game_10 = data.active_game_10;
    let player = data.players_10.find((p) => p.username === username);
    document.querySelector(".game_started_flag_10").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_10.classList.add("hidden");
      game_10.classList.add("hidden");
    }
  } else if (data.type === "bingo_10") {
    active_game_10 = data.active_game_10;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_10.find((p) => p.username === username);
    document.querySelector(".game_started_flag_10").classList.add("hidden");

    counter_10.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_10.classList.add("hidden");
      game_10.classList.add("hidden");
      winner_10.classList.remove("hidden");
      winner_10.innerHTML = data.html;
      document
        .querySelector(".continue_game_10")
        .addEventListener("click", () => {
          winner_10.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_10").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_10").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_10_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_10") {
    if (username == data.u) {
      console.log(username, data.u);
      game_10.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }


  // Game 20 socket messages
  if (data.type === "timer_20") {
    update_info_of_20(data.value, data.players);
  } else if (data.type === "new_card_selected_20") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_20_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_20 = new_card;
      console.log(selected_card_20);
    } else {
      document.querySelector(`.card_20_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_20_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_20_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_20") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_20_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_20") {
    console.log(data.players_20);
    let player = data.players_20.find((p) => p.username === username);
    active_game_20 = data.active_game_20;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_20_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_20").classList.remove("hidden");
    document.querySelector(".entry_20_status").textContent = "Active";
    document.querySelectorAll(".cards_20").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_20") {
    let player = data.players_20.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_20);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_20,
        "game_20_animate_balls",
        balls_20
      );
      if (player.active) {
        if(!is_mute_20){
        await playCachedAudio(`sound${data.current_drawn_number_20}`);
        }
      }

      counter_20.textContent = data.counter_20 + "/75";

      document
        .querySelector(`.ball_20_${data.current_drawn_number_20}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_20") {
    active_game_20 = data.active_game_20;
    let player = data.players_20.find((p) => p.username === username);
    document.querySelector(".game_started_flag_20").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_20.classList.add("hidden");
      game_20.classList.add("hidden");
    }
  } else if (data.type === "bingo_20") {
    active_game_20 = data.active_game_20;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_20.find((p) => p.username === username);
    document.querySelector(".game_started_flag_20").classList.add("hidden");

    counter_20.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_20.classList.add("hidden");
      game_20.classList.add("hidden");
      winner_20.classList.remove("hidden");
      winner_20.innerHTML = data.html;
      document
        .querySelector(".continue_game_20")
        .addEventListener("click", () => {
          winner_20.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_20").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_20").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_20_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_20") {
    if (username == data.u) {
      console.log(username, data.u);
      game_20.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }


  // Game 50 socket messages
  if (data.type === "timer_50") {
    update_info_of_50(data.value, data.players);
  } else if (data.type === "new_card_selected_50") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_50_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_50 = new_card;
      console.log(selected_card_50);
    } else {
      document.querySelector(`.card_50_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_50_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_50_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_50") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_50_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_50") {
    console.log(data.players_50);
    let player = data.players_50.find((p) => p.username === username);
    active_game_50 = data.active_game_50;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_50_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_50").classList.remove("hidden");
    document.querySelector(".entry_50_status").textContent = "Active";
    document.querySelectorAll(".cards_50").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_50") {
    let player = data.players_50.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_50);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_50,
        "game_50_animate_balls",
        balls_50
      );
      if (player.active) {
        if(!is_mute_50){
        await playCachedAudio(`sound${data.current_drawn_number_50}`);
        }
      }

      counter_50.textContent = data.counter_50 + "/75";

      document
        .querySelector(`.ball_50_${data.current_drawn_number_50}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_50") {
    active_game_50 = data.active_game_50;
    let player = data.players_50.find((p) => p.username === username);
    document.querySelector(".game_started_flag_50").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_50.classList.add("hidden");
      game_50.classList.add("hidden");
    }
  } else if (data.type === "bingo_50") {
    active_game_50 = data.active_game_50;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_50.find((p) => p.username === username);
    document.querySelector(".game_started_flag_50").classList.add("hidden");

    counter_50.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_50.classList.add("hidden");
      game_50.classList.add("hidden");
      winner_50.classList.remove("hidden");
      winner_50.innerHTML = data.html;
      document
        .querySelector(".continue_game_50")
        .addEventListener("click", () => {
          winner_50.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_50").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_50").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_50_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_50") {
    if (username == data.u) {
      console.log(username, data.u);
      game_50.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }


  // Game 100 socket messages
  if (data.type === "timer_100") {
    update_info_of_100(data.value, data.players);
  } else if (data.type === "new_card_selected_100") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_100_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_100 = new_card;
      console.log(selected_card_100);
    } else {
      document.querySelector(`.card_100_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_100_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_100_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_100") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_100_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_100") {
    console.log(data.players_100);
    let player = data.players_100.find((p) => p.username === username);
    active_game_100 = data.active_game_100;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_100_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_100").classList.remove("hidden");
    document.querySelector(".entry_100_status").textContent = "Active";
    document.querySelectorAll(".cards_100").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_100") {
    let player = data.players_100.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_100);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_100,
        "game_100_animate_balls",
        balls_100
      );
      if (player.active) {
        if(!is_mute_100){
        await playCachedAudio(`sound${data.current_drawn_number_100}`);
        }
      }

      counter_100.textContent = data.counter_100 + "/75";

      document
        .querySelector(`.ball_100_${data.current_drawn_number_100}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_100") {
    active_game_100 = data.active_game_100;
    let player = data.players_100.find((p) => p.username === username);
    document.querySelector(".game_started_flag_100").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_100.classList.add("hidden");
      game_100.classList.add("hidden");
    }
  } else if (data.type === "bingo_100") {
    active_game_100 = data.active_game_100;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_100.find((p) => p.username === username);
    document.querySelector(".game_started_flag_100").classList.add("hidden");

    counter_100.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_100.classList.add("hidden");
      game_100.classList.add("hidden");
      winner_100.classList.remove("hidden");
      winner_100.innerHTML = data.html;
      document
        .querySelector(".continue_game_100")
        .addEventListener("click", () => {
          winner_100.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_100").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_100").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_100_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_100") {
    if (username == data.u) {
      console.log(username, data.u);
      game_100.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }


  // Game 500 socket messages
  if (data.type === "timer_500") {
    update_info_of_500(data.value, data.players);
  } else if (data.type === "new_card_selected_500") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_500_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_500 = new_card;
      console.log(selected_card_500);
    } else {
      document.querySelector(`.card_500_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_500_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_500_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_500") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_500_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_500") {
    console.log(data.players_500);
    let player = data.players_500.find((p) => p.username === username);
    active_game_500 = data.active_game_500;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_500_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_500").classList.remove("hidden");
    document.querySelector(".entry_500_status").textContent = "Active";
    document.querySelectorAll(".cards_500").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_500") {
    let player = data.players_500.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_500);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_500,
        "game_500_animate_balls",
        balls_500
      );
      if (player.active) {
        if(!is_mute_500){
        await playCachedAudio(`sound${data.current_drawn_number_500}`);
        }
      }

      counter_500.textContent = data.counter_500 + "/75";

      document
        .querySelector(`.ball_500_${data.current_drawn_number_500}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_500") {
    active_game_500 = data.active_game_500;
    let player = data.players_500.find((p) => p.username === username);
    document.querySelector(".game_started_flag_500").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_500.classList.add("hidden");
      game_500.classList.add("hidden");
    }
  } else if (data.type === "bingo_500") {
    active_game_500 = data.active_game_500;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_500.find((p) => p.username === username);
    document.querySelector(".game_started_flag_500").classList.add("hidden");

    counter_500.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_500.classList.add("hidden");
      game_500.classList.add("hidden");
      winner_500.classList.remove("hidden");
      winner_500.innerHTML = data.html;
      document
        .querySelector(".continue_game_500")
        .addEventListener("click", () => {
          winner_500.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_500").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_500").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_500_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_500") {
    if (username == data.u) {
      console.log(username, data.u);
      game_500.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }


  // Game 1000 socket messages
 if (data.type === "timer_1000") {
    update_info_of_1000(data.value, data.players);
  } else if (data.type === "new_card_selected_1000") {
    let sent_username = data.username;
    let current_card = data.current_card;
    let new_card = data.new_card;
    if (sent_username === username) {
      document
        .querySelector(`.card_1000_${new_card}`)
        .classList.add("bg-green-200", "text-gray-800");
      selected_card_1000 = new_card;
      console.log(selected_card_1000);
    } else {
      document.querySelector(`.card_1000_${new_card}`).classList.add("opacity-30");
    }
    if (current_card) {
      document
        .querySelector(`.card_1000_${current_card}`)
        .classList.remove("bg-green-200", "text-gray-800");
      document
        .querySelector(`.card_1000_${current_card}`)
        .classList.remove("opacity-30");
    }
  } else if (data.type === "remove_card_on_leave_1000") {
    let n = data.number;
    if (n) {
      document.querySelector(`.card_1000_${n}`).classList.remove("opacity-30");
    }
  } else if (data.type === "game_started_1000") {
    console.log(data.players_1000);
    let player = data.players_1000.find((p) => p.username === username);
    active_game_1000 = data.active_game_1000;
    if (player) {
      console.log(cards[player.number - 1]);
      document.querySelectorAll(".entry_1000_status").forEach((el) => {
        el.textContent = "Active";
      });
    }
    document.querySelector(".game_started_flag_1000").classList.remove("hidden");
    document.querySelector(".entry_1000_status").textContent = "Active";
    document.querySelectorAll(".cards_1000").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });
  } else if (data.type === "numbers_being_called_1000") {
    let player = data.players_1000.find((p) => p.username === username);
    if (player) {
      console.log("Number", data.current_drawn_number_1000);
      animateCalling(
        document.getElementById("call-container-5"),
        data.current_drawn_number_1000,
        "game_1000_animate_balls",
        balls_1000
      );
      if (player.active) {
        if(!is_mute_1000){
        await playCachedAudio(`sound${data.current_drawn_number_1000}`);
        }
      }

      counter_1000.textContent = data.counter_1000 + "/75";

      document
        .querySelector(`.ball_1000_${data.current_drawn_number_1000}`)
        .classList.add("bg-orange-500");
    }
  } else if (data.type === "all_numbers_called_1000") {
    active_game_1000 = data.active_game_1000;
    let player = data.players_1000.find((p) => p.username === username);
    document.querySelector(".game_started_flag_1000").classList.add("hidden");

    if (player) {
      let number = player.number;
      registery_1000.classList.add("hidden");
      game_1000.classList.add("hidden");
    }
  } else if (data.type === "bingo_1000") {
    active_game_1000 = data.active_game_1000;

    let total_balance = data.balance;
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    check_user_balance_and_decide_which_game_he_can_play(
      parseInt(real_balance) + parseInt(bonus_balance)
    );

    get_balance_of_user_when_starting_game(username);
    if (data.u == username) {
      update_balance();
    }
    let player = data.players_1000.find((p) => p.username === username);
    document.querySelector(".game_started_flag_1000").classList.add("hidden");

    counter_1000.textContent = "0/75";

    if (player && player.active) {
      let number = player.number;
      registery_1000.classList.add("hidden");
      game_1000.classList.add("hidden");
      winner_1000.classList.remove("hidden");
      winner_1000.innerHTML = data.html;
      document
        .querySelector(".continue_game_1000")
        .addEventListener("click", () => {
          winner_1000.classList.add("hidden");
          // reload_page()
        });
    }
    document.querySelectorAll(".cards_1000").forEach((c) => {
      c.classList.remove("opacity-30");
      c.classList.remove("bg-green-200", "text-gray-800");
    });

    document.querySelectorAll(".balls_1000").forEach((c) => {
      c.classList.remove("bg-orange-500");
    });

    document.querySelectorAll(".game_1000_animate_balls").forEach((c) => {
      c.remove();
    });
  } else if (data.type === "block_player_1000") {
    if (username == data.u) {
      console.log(username, data.u);
      game_1000.classList.add("hidden");
      blocked_modal.classList.remove("hidden");
      let total_balance = data.balance;
      real_balance = total_balance.balance;
      bonus_balance = total_balance.bonus;
      check_user_balance_and_decide_which_game_he_can_play(
        parseInt(real_balance) + parseInt(bonus_balance)
      );
      update_balance();
    }
  }



});

let balls_5 = [];
let balls_10 = [];
let balls_20 = [];
let balls_50 = [];
let balls_100 = [];
let balls_500 = [];
let balls_1000 = [];

function animateCalling(container, number, game, balls) {
  // Shift existing balls right
  balls.forEach((ball, i) => {
    ball.style.transform = `translateX(${(i + 1) * 40}px)`;
  });

  // Create new ball
  const newBall = document.createElement("div");
  newBall.className = `ball ball-enter absolute w-8 h-8 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 
  rounded-full left-1/2 flex justify-center items-center 
  shadow-lg shadow-orange-600/40 ring-1 ring-orange-200/40 
  transform-gpu scale-105 ${game} text-white font-bold`;
  newBall.textContent = number;
  container.appendChild(newBall);

  // Force reflow for animation
  void newBall.offsetWidth;

  // Trigger transition to active
  newBall.classList.add("ball-enter-active");

  // Add to array
  balls.unshift(newBall);

  // Limit to 5 balls
  if (balls.length > 5) {
    const removed = balls.pop();
    removed.remove();
  }
}

function update_balance() {
  document.querySelector(".balance_text").textContent =
    "💰 Br. " + real_balance;
  document.querySelector(".bonus_text").textContent = "🎁 Br. " + bonus_balance;
}

function open_registry_5() {
  if (is_eligible_5) {
    if (!active_game_5) {
      registery_5.classList.remove("hidden");
    }
  }
}
function open_registry_10() {
  if (is_eligible_10) {
    if (!active_game_10) {
      registery_10.classList.remove("hidden");
    }
  }
}
function open_registry_20() {
  if (is_eligible_20) {
    if (!active_game_20) {
      registery_20.classList.remove("hidden");
    }
  }
}
function open_registry_50() {
  if (is_eligible_50) {
    if (!active_game_50) {
      registery_50.classList.remove("hidden");
    }
  }
}
function open_registry_100() {
  if (is_eligible_100) {
    if (!active_game_100) {
      registery_100.classList.remove("hidden");
    }
  }
}
function open_registry_500() {
  if (is_eligible_500) {
    if (!active_game_500) {
      registery_500.classList.remove("hidden");
    }
  }
}
function open_registry_1000() {
  if (is_eligible_1000) {
    if (!active_game_1000) {
      registery_1000.classList.remove("hidden");
    }
  }
}

document.querySelectorAll(".cards_5").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_5",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_5 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_10").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_10",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_10 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_20").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_20",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_20 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_50").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_50",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_50 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_100").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_100",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_100 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_500").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_500",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_500 = c.textContent.trim();
  });
});

document.querySelectorAll(".cards_1000").forEach((c) => {
  c.addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "selection_card_1000",
        card_number: c.textContent.trim(),
        username,
      })
    );
    selected_card_1000 = c.textContent.trim();
  });
});

function enter_game_5() {
  console.log("Game state: ", active_game_5);
  if (selected_card_5 !== null) {
    console.log("Seleeeetcted card: ", selected_card_5);
    if (!active_game_5) {
      socket.send(
        JSON.stringify({
          type: "entering_game_5",
          username,
        })
      );
      registery_5.classList.add("hidden");
      game_5.classList.remove("hidden");
      create_playing_cartela_5(cards[selected_card_5 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_10() {
  console.log("Game state: ", active_game_10);
  if (selected_card_10 !== null) {
    console.log("Seleeeetcted card: ", selected_card_10);
    if (!active_game_10) {
      socket.send(
        JSON.stringify({
          type: "entering_game_10",
          username,
        })
      );
      registery_10.classList.add("hidden");
      game_10.classList.remove("hidden");
      create_playing_cartela_10(cards[selected_card_10 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_20() {
  console.log("Game state: ", active_game_20);
  if (selected_card_20 !== null) {
    console.log("Seleeeetcted card: ", selected_card_20);
    if (!active_game_20) {
      socket.send(
        JSON.stringify({
          type: "entering_game_20",
          username,
        })
      );
      registery_20.classList.add("hidden");
      game_20.classList.remove("hidden");
      create_playing_cartela_20(cards[selected_card_20 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_50() {
  console.log("Game state: ", active_game_50);
  if (selected_card_50 !== null) {
    console.log("Seleeeetcted card: ", selected_card_50);
    if (!active_game_50) {
      socket.send(
        JSON.stringify({
          type: "entering_game_50",
          username,
        })
      );
      registery_50.classList.add("hidden");
      game_50.classList.remove("hidden");
      create_playing_cartela_50(cards[selected_card_50 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_100() {
  console.log("Game state: ", active_game_100);
  if (selected_card_100 !== null) {
    console.log("Seleeeetcted card: ", selected_card_100);
    if (!active_game_100) {
      socket.send(
        JSON.stringify({
          type: "entering_game_100",
          username,
        })
      );
      registery_100.classList.add("hidden");
      game_100.classList.remove("hidden");
      create_playing_cartela_100(cards[selected_card_100 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_500() {
  console.log("Game state: ", active_game_500);
  if (selected_card_500 !== null) {
    console.log("Seleeeetcted card: ", selected_card_500);
    if (!active_game_500) {
      socket.send(
        JSON.stringify({
          type: "entering_game_500",
          username,
        })
      );
      registery_500.classList.add("hidden");
      game_500.classList.remove("hidden");
      create_playing_cartela_500(cards[selected_card_500 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function enter_game_1000() {
  console.log("Game state: ", active_game_1000);
  if (selected_card_1000 !== null) {
    console.log("Seleeeetcted card: ", selected_card_1000);
    if (!active_game_1000) {
      socket.send(
        JSON.stringify({
          type: "entering_game_1000",
          username,
        })
      );
      registery_1000.classList.add("hidden");
      game_1000.classList.remove("hidden");
      create_playing_cartela_1000(cards[selected_card_1000 - 1]);
      // setTimeout(() => {
      get_balance_of_user_when_starting_game(username);
      // }, 2000);
      unlockAudio();
    }
  }
}

function update_info_of_5(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_5_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 5 * 0.8;

  document.querySelectorAll(".entry_5_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_5_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_10(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_10_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 10 * 0.8;

  document.querySelectorAll(".entry_10_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_10_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_20(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_20_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 20 * 0.8;

  document.querySelectorAll(".entry_20_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_20_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_50(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_50_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 50 * 0.8;

  document.querySelectorAll(".entry_50_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_50_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_100(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_100_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 100 * 0.8;

  document.querySelectorAll(".entry_100_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_100_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_500(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_500_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 500 * 0.8;

  document.querySelectorAll(".entry_500_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_500_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function update_info_of_1000(game_state_or_time, players) {
  let state = game_state_or_time ? "0" : game_state_or_time;
  document.querySelectorAll(".entry_1000_status").forEach((el) => {
    el.textContent = game_state_or_time + " s";
  });

  let winning = players * 1000 * 0.8;

  document.querySelectorAll(".entry_1000_players").forEach((p) => {
    p.textContent = players;
  });
  document.querySelectorAll(".entry_1000_winning").forEach((w) => {
    w.textContent = "Br. " + winning;
  });
}

function create_playing_cartela_5(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.i3}</div>
              <div class="bg-gray-100 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_5">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_5"

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_5"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_5.innerHTML = cartela;
  document.querySelector(".bingo_5").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_5",
        number: c.id,
        username,
      })
    );
  });

  document.querySelector(".refresh_5").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "refresh_5",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_5").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_10(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.i3}</div>
              <div class="bg-gray-100 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_10">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_10 "

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_10"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_10.innerHTML = cartela;
  document.querySelector(".bingo_10").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_10",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_10").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_20(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.i3}</div>
              <div class="bg-gray-200 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_20">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_20 "

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_20"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_20.innerHTML = cartela;
  document.querySelector(".bingo_20").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_20",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_20").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_50(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.i3}</div>
              <div class="bg-gray-200 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_50">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_50"

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_50"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_50.innerHTML = cartela;
  document.querySelector(".bingo_50").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_50",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_50").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_100(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.i3}</div>
              <div class="bg-gray-200 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_100">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_100"

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_100"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_100.innerHTML = cartela;
  document.querySelector(".bingo_100").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_100",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_100").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_500(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.i3}</div>
              <div class="bg-gray-200 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_500">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_500"

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_500"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_500.innerHTML = cartela;
  document.querySelector(".bingo_500").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_500",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_500").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function create_playing_cartela_1000(c) {
  let cartela = ``;
  cartela += `<div
            class="w-[80%] mx-auto bg-gray-800 text-white rounded-lg p-4 select-none text-[20px]"
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
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.b1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.i1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.n1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.g1}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.o1}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.b2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.i2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.n2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.g2}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.o2}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.b3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.i3}</div>
              <div class="bg-gray-200 text-black rounded py-2 ">FREE</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.g3}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.o3}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.b4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.i4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.n4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.g4}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.o4}</div>

              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.b5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.i5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.n5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.g5}</div>
              <div class="bg-gray-700 rounded py-2 playing_cartela_number_1000">${c.o5}</div>
            </div>
          </div>`;

  cartela += `<div
          class="mt-4  py-2 text-white font-semibold w-[90%] flex flex-col justify-center"
          style="margin: 5px auto "
        >
          <div
            class="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold w-[100%] flex justify-center bingo_1000"

          >
            BINGO
          </div>
          <div
            class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold w-[100%] flex justify-center  refresh_1000"

          >
            Refresh
          </div>
        </div>`;

  playing_cartela_container_1000.innerHTML = cartela;
  document.querySelector(".bingo_1000").addEventListener("click", () => {
    socket.send(
      JSON.stringify({
        type: "bingo_1000",
        number: c.id,
        username,
      })
    );
  });

  document.querySelectorAll(".playing_cartela_number_1000").forEach((p) => {
    p.addEventListener("click", () => {
      // p.classList.toggle("bg-gray-300");
      if (!p.classList.contains("bg-gray-100")) {
        p.classList.add("bg-gray-100", "text-black");
        p.classList.remove("bg-gray-700");
      } else {
        p.classList.remove("bg-gray-100", "text-black");
        p.classList.add("bg-gray-700");
      }
      console.log(p.textContent.trim());
    });
  });
}

function check_user_balance_and_decide_which_game_he_can_play(balance) {
  console.log("Total balance: ", balance);
  if (balance >= 5) {
    is_eligible_5 = true;
    document.querySelector(".insufficient_balance_5").classList.add("hidden");
    document.querySelector(".entry_5").classList.remove("opacity-60");
  } else {
    is_eligible_5 = false;
    document
      .querySelector(".insufficient_balance_5")
      .classList.remove("hidden");
    document.querySelector(".entry_5").classList.add("opacity-60");
  }
  if (balance >= 10) {
    is_eligible_10 = true;
    document.querySelector(".insufficient_balance_10").classList.add("hidden");
    document.querySelector(".entry_10").classList.remove("opacity-60");
  } else {
    is_eligible_10 = false;
    document
      .querySelector(".insufficient_balance_10")
      .classList.remove("hidden");
    document.querySelector(".entry_10").classList.add("opacity-60");
  }

  if (balance >= 20) {
    is_eligible_20 = true;
    document.querySelector(".insufficient_balance_20").classList.add("hidden");
    document.querySelector(".entry_20").classList.remove("opacity-60");
  } else {
    is_eligible_20 = false;
    document
      .querySelector(".insufficient_balance_20")
      .classList.remove("hidden");
    document.querySelector(".entry_20").classList.add("opacity-60");
  }

  if (balance >= 50) {
    is_eligible_50 = true;
    document.querySelector(".insufficient_balance_50").classList.add("hidden");
    document.querySelector(".entry_50").classList.remove("opacity-60");
  } else {
    is_eligible_50 = false;
    document
      .querySelector(".insufficient_balance_50")
      .classList.remove("hidden");
    document.querySelector(".entry_50").classList.add("opacity-60");
  }

  if (balance >= 100) {
    is_eligible_100 = true;
    document.querySelector(".insufficient_balance_100").classList.add("hidden");
    document.querySelector(".entry_100").classList.remove("opacity-60");
  } else {
    is_eligible_100 = false;
    document
      .querySelector(".insufficient_balance_100")
      .classList.remove("hidden");
    document.querySelector(".entry_100").classList.add("opacity-60");
  }

  if (balance >= 500) {
    is_eligible_500 = true;
    document.querySelector(".insufficient_balance_500").classList.add("hidden");
    document.querySelector(".entry_500").classList.remove("opacity-60");
  } else {
    is_eligible_500 = false;
    document
      .querySelector(".insufficient_balance_500")
      .classList.remove("hidden");
    document.querySelector(".entry_500").classList.add("opacity-60");
  }

  if (balance >= 1000) {
    is_eligible_1000 = true;
    document
      .querySelector(".insufficient_balance_1000")
      .classList.add("hidden");
    document.querySelector(".entry_1000").classList.remove("opacity-60");
  } else {
    is_eligible_1000 = false;
    document
      .querySelector(".insufficient_balance_1000")
      .classList.remove("hidden");
    document.querySelector(".entry_1000").classList.add("opacity-60");
  }
}

async function get_balance_of_user_when_starting_game(username) {
  try {
    console.log(username);
    const response = await fetch(
      `https://abogida.duckdns.org/get_user_balance?u_id=${username}`
    );
    console.log("Response status:", response.status); // 👀 check this

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    let total_balance = data.balance[0];
    real_balance = total_balance.balance;
    bonus_balance = total_balance.bonus;
    update_balance();
    check_user_balance_and_decide_which_game_he_can_play(
      real_balance + bonus_balance
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
}

get_balance_of_user_when_starting_game(username);

function reload_page() {
  location.reload();
}


voice_5.addEventListener("click", ()=>{
  if(is_mute_5){
    is_mute_5 = false
    voice_5.textContent = '🔇';
    
  }else{
    is_mute_5 = true;
    voice_5.textContent = '📢';
  }
})

voice_10.addEventListener("click", ()=>{
  if(is_mute_10){
    is_mute_10 = false
    voice_10.textContent = '🔇';
    
  }else{
    is_mute_10 = true;
    voice_10.textContent = '📢';
  }
})

voice_20.addEventListener("click", ()=>{
  if(is_mute_20){
    is_mute_20 = false
    voice_20.textContent = '🔇';
    
  }else{
    is_mute_20 = true;
    voice_20.textContent = '📢';
  }
})

voice_50.addEventListener("click", ()=>{
  if(is_mute_50){
    is_mute_50 = false
    voice_50.textContent = '🔇';
    
  }else{
    is_mute_50 = true;
    voice_50.textContent = '📢';
  }
})

voice_100.addEventListener("click", ()=>{
  if(is_mute_100){
    is_mute_100 = false
    voice_100.textContent = '🔇';
    
  }else{
    is_mute_100 = true;
    voice_100.textContent = '📢';
  }
})

voice_500.addEventListener("click", ()=>{
  if(is_mute_500){
    is_mute_500 = false
    voice_500.textContent = '🔇';
    
  }else{
    is_mute_500 = true;
    voice_500.textContent = '📢';
  }
})

voice_1000.addEventListener("click", ()=>{
  if(is_mute_1000){
    is_mute_1000 = false
    voice_1000.textContent = '🔇';
    
  }else{
    is_mute_1000 = true;
    voice_1000.textContent = '📢';
  }
})