if (!localStorage.getItem("allUsers")) {
  const defaultUsers = {
    "CHESS_MAGNUS01": {
      id: "CHESS_MAGNUS01",
      username: "Magnus_Carlsen",
      email: "magnus@chess.com",
      password: "password123",
      country: "🇳🇴",
      elo: 2834,
      streak: 15,
      wins: 380,
      losses: 95,
      draws: 67,
      gamesPlayed: 542,
      profile: { title: "Campeón Mundial", league: "Diamante" }
    },
    "CHESS_DING001": {
      id: "CHESS_DING001",
      username: "Ding_Liren",
      email: "ding@chess.com",
      password: "password123",
      country: "🇨🇳",
      elo: 2816,
      streak: 11,
      wins: 320,
      losses: 120,
      draws: 49,
      gamesPlayed: 489,
      profile: { title: "Gran Maestro", league: "Diamante" }
    },
    "CHESS_ARJUN01": {
      id: "CHESS_ARJUN01",
      username: "Erigaisi_Arjun",
      email: "arjun@chess.com",
      password: "password123",
      country: "🇮🇳",
      elo: 2802,
      streak: 12,
      wins: 310,
      losses: 100,
      draws: 46,
      gamesPlayed: 456,
      profile: { title: "Gran Maestro", league: "Platino" }
    }
  };
  localStorage.setItem("allUsers", JSON.stringify(defaultUsers));
}

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

switchToRegister.addEventListener("click", () => {
  loginForm.classList.remove("active");
  registerForm.classList.add("active");
});

switchToLogin.addEventListener("click", () => {
  registerForm.classList.remove("active");
  loginForm.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");
  let userFound = null;

  for (const key in allUsers) {
    const u = allUsers[key];
    if (u.email === email && u.password === password) {
      userFound = u;
      break;
    }
  }

  if (!userFound) {
    alert("❌ Correo o contraseña incorrectos");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(userFound));
  localStorage.setItem("isLoggedIn", "true");

  alert(`✅ Bienvenido ${userFound.username}`);
  window.location.href = "index.html";
});

registerBtn.addEventListener("click", () => {
  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("registerPasswordConfirm").value.trim();
  const country = document.getElementById("registerCountry").value;
  const accepted = document.getElementById("registerTerms").checked;

  if (!username || !email || !password || !confirmPassword || !country) {
    alert("❌ Completa todos los campos");
    return;
  }
  if (password.length < 8) {
    alert("❌ La contraseña debe tener al menos 8 caracteres");
    return;
  }
  if (password !== confirmPassword) {
    alert("❌ Las contraseñas no coinciden");
    return;
  }
  if (!accepted) {
    alert("❌ Debes aceptar los términos");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("❌ El correo no es válido");
    return;
  }

  const allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");

  for (const key in allUsers) {
    const u = allUsers[key];
    if (u.email === email) {
      alert("❌ Este correo ya está registrado");
      return;
    }
    if (u.username.toLowerCase() === username.toLowerCase()) {
      alert("❌ Este usuario ya existe");
      return;
    }
  }

  const countryFlags = {
    pe: "🇵🇪",
    mx: "🇲🇽",
    ar: "🇦🇷",
    co: "🇨🇴",
    es: "🇪🇸",
    us: "🇺🇸",
    br: "🇧🇷",
    cl: "🇨🇱"
  };

  const newUser = {
    id: `CHESS_${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    username,
    email,
    password,
    country: countryFlags[country] || "🌍",
    elo: 1000,
    streak: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    gamesPlayed: 0,
    profile: { title: "Novato", league: "Plata" }
  };

  allUsers[newUser.id] = newUser;
  localStorage.setItem("allUsers", JSON.stringify(allUsers));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  localStorage.setItem("isLoggedIn", "true");

  alert(`✅ Cuenta creada: ${newUser.username}`);
  window.location.href = "index.html";
});
