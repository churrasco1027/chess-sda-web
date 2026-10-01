const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "auth.html";
}

document.getElementById("userName").textContent = currentUser.username || "Jugador";
document.getElementById("userFlag").textContent = currentUser.country || "🌍";
document.getElementById("userStreak").textContent = `🔥 ${currentUser.streak || 0} días`;

document.querySelectorAll(".mode-select-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const panelId = btn.dataset.panel;
    document.querySelectorAll(".game-panel").forEach(panel => panel.classList.add("hidden"));
    document.getElementById(panelId).classList.remove("hidden");
  });
});

document.querySelectorAll(".close-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".game-panel").classList.add("hidden");
  });
});

const openings = [
  { name: "Apertura Italiana", description: "Desarrollo natural y control del centro.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4" },
  { name: "Defensa Siciliana", description: "Apertura agresiva para negras.", moves: "1.e4 c5" },
  { name: "Ruy López", description: "Una de las aperturas más sólidas y clásicas.", moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5" },
  { name: "Gambito de Dama", description: "Crea presión central con dinamismo.", moves: "1.d4 d5 2.c4" },
  { name: "Defensa Francesa", description: "Estructura sólida y activa.", moves: "1.e4 e6" },
  { name: "Defensa Caro-Kann", description: "Muy sólida frente a 1.e4.", moves: "1.e4 c6" },
  { name: "Apertura Inglesa", description: "Flexible y posicional.", moves: "1.c4" },
  { name: "Gambito de Rey", description: "Apertura abierta y agresiva.", moves: "1.e4 e5 2.f4" }
];

const ranking = [
  { position: 1, name: "Magnus Carlsen", elo: 2834, country: "🇳🇴", id: "CHESS_MAGNUS01" },
  { position: 2, name: "Fabiano Caruana", elo: 2816, country: "🇺🇸", id: "CHESS_FABIANO01" },
  { position: 3, name: "Arjun Erigaisi", elo: 2802, country: "🇮🇳", id: "CHESS_ARJUN01" },
  { position: 4, name: "Hikaru Nakamura", elo: 2794, country: "🇺🇸", id: "CHESS_HIKARU01" },
  { position: 5, name: "Ian Nepomniachtchi", elo: 2781, country: "🇷🇺", id: "CHESS_IAN01" },
  { position: 6, name: "Ding Liren", elo: 2816, country: "🇨🇳", id: "CHESS_DING001" },
  { position: 7, name: "Praggnanandhaa", elo: 2764, country: "🇮🇳", id: "CHESS_PRAGGA01" },
  { position: 8, name: "Wesley So", elo: 2752, country: "🇺🇸", id: "CHESS_WESLEY01" }
];

function renderOpenings(filter = "") {
  const list = document.getElementById("openingsList");
  list.innerHTML = "";
  const filtered = openings.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.description.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "opening-item";
    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <small style="color:#a9b4bf">${item.moves}</small>
      </div>
      <button class="btn secondary-btn">Ver</button>
    `;
    div.querySelector("button").addEventListener("click", () => alert(`📚 ${item.name}\n${item.moves}\n${item.description}`));
    list.appendChild(div);
  });
}

function renderRanking() {
  const list = document.getElementById("rankingList");
  list.innerHTML = "";
  ranking.forEach(player => {
    const div = document.createElement("div");
    div.className = "ranking-item";
    const medal = player.position === 1 ? "🥇" : player.position === 2 ? "🥈" : player.position === 3 ? "🥉" : "•";
    div.innerHTML = `
      <div>
        <strong>${medal} #${player.position} ${player.name}</strong>
        <div style="color:#a9b4bf">${player.country} • ${player.elo} ELO</div>
      </div>
      <button class="btn secondary-btn">Ver perfil</button>
    `;
    div.querySelector("button").addEventListener("click", () => {
      if (player.id === currentUser.id) {
        window.location.href = "profile.html";
      } else {
        window.location.href = `friend-profile.html?userId=${player.id}`;
      }
    });
    list.appendChild(div);
  });
}

function renderFriends() {
  const list = document.getElementById("friendsList");
  list.innerHTML = "";
  const friends = friendsSystem.getFriends();

  if (!friends.length) {
    list.innerHTML = "<div class='friend-item'><strong>No tienes amigos aún</strong></div>";
    return;
  }

  friends.forEach(friend => {
    const div = document.createElement("div");
    div.className = "friend-item";
    div.innerHTML = `
      <div>
        <strong>${friend.username}</strong>
        <div class="friend-status ${friend.status === "online" ? "online" : "offline"}">${friend.statusText}</div>
      </div>
      <div class="friend-actions">
        <button class="btn secondary-btn challenge-btn">Retar</button>
        <button class="btn ghost-btn profile-btn">Perfil</button>
      </div>
    `;

    div.querySelector(".challenge-btn").addEventListener("click", () => {
      alert(`⚔️ Desafío enviado a ${friend.username}`);
    });

    div.querySelector(".profile-btn").addEventListener("click", () => {
      window.location.href = `friend-profile.html?userId=${friend.id}`;
    });

    list.appendChild(div);
  });
}

document.getElementById("openingsSearchInput").addEventListener("input", (e) => renderOpenings(e.target.value));

document.getElementById("botDifficultySlider").addEventListener("input", (e) => {
  document.getElementById("botEloDisplay").textContent = `${e.target.value} ELO`;
});

document.querySelectorAll(".bot-select-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const elo = btn.closest(".bot-preset").dataset.elo;
    document.getElementById("botDifficultySlider").value = elo;
    document.getElementById("botEloDisplay").textContent = `${elo} ELO`;
  });
});

document.getElementById("startBotGameBtn").addEventListener("click", () => {
  const elo = document.getElementById("botDifficultySlider").value;
  const color = document.querySelector('input[name="botColor"]:checked').value;
  alert(`🎮 Partida contra bot iniciada: ${elo} ELO, color ${color}`);
});

document.getElementById("createOnlineGameBtn").addEventListener("click", () => {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  document.getElementById("onlineGameCode").textContent = code;
  document.getElementById("onlineGameCodeBox").classList.remove("hidden");
});

document.getElementById("copyOnlineCodeBtn").addEventListener("click", async () => {
  const code = document.getElementById("onlineGameCode").textContent;
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(code);
  }
  alert("✅ Código copiado");
});

document.getElementById("joinOnlineGameBtn").addEventListener("click", () => {
  const code = document.getElementById("joinOnlineCodeInput").value.trim();
  if (!code) {
    alert("Ingresa un código");
    return;
  }
  alert(`✅ Te unirás a la partida: ${code}`);
});

document.getElementById("addFriendBtn").addEventListener("click", () => {
  const id = document.getElementById("friendSearchInput").value.trim();
  const res = friendsSystem.addFriend(id);
  alert(res.message);
  if (res.success) {
    document.getElementById("friendSearchInput").value = "";
    renderFriends();
  }
});

document.getElementById("openProfileBtn").addEventListener("click", () => window.location.href = "profile.html");
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "auth.html";
});

renderOpenings();
renderRanking();
renderFriends();
