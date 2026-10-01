class FriendsSystem {
  constructor() {
    this.friends = JSON.parse(localStorage.getItem("friends") || "[]");
    this.onlineUsers = JSON.parse(localStorage.getItem("onlineUsers") || "{}");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  }

  getStatus(userId) {
    const status = this.onlineUsers[userId];
    if (!status) return { status: "offline", lastSeen: Date.now() };
    return status;
  }

  getStatusText(userId) {
    const status = this.getStatus(userId);
    if (status.status === "online") return "🟢 Activo";
    const diff = Date.now() - Number(status.lastSeen || Date.now());
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `⚫ Conectado hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `⚫ Conectado hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `⚫ Conectado hace ${days} d`;
  }

  addFriend(friendId) {
    if (!friendId) return { success: false, message: "Ingresa un ID válido" };

    const currentUser = this.getCurrentUser();
    if (friendId === currentUser.id) {
      return { success: false, message: "No puedes agregarte a ti mismo" };
    }

    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");
    const friend = allUsers[friendId];

    if (!friend) {
      return { success: false, message: "No existe un usuario con ese ID" };
    }

    const existing = this.friends.find(f => f.id === friendId);
    if (existing) {
      return { success: false, message: "Ya está en tu lista de amigos" };
    }

    const data = {
      id: friend.id,
      username: friend.username,
      country: friend.country,
      elo: friend.elo,
      status: this.getStatus(friend.id).status
    };

    this.friends.push(data);
    localStorage.setItem("friends", JSON.stringify(this.friends));
    return { success: true, message: `Amigo agregado: ${friend.username}` };
  }

  getFriends() {
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "{}");
    return (JSON.parse(localStorage.getItem("friends") || "[]")).map(friend => {
      const fullUser = allUsers[friend.id];
      const status = this.getStatus(friend.id);
      return {
        ...friend,
        status: status.status,
        statusText: this.getStatusText(friend.id),
        username: fullUser ? fullUser.username : friend.username,
        country: fullUser ? fullUser.country : friend.country,
        elo: fullUser ? fullUser.elo : friend.elo
      };
    });
  }

  challengeFriend(friend) {
    return { success: true, message: `Desafío enviado a ${friend.username}` };
  }
}

const friendsSystem = new FriendsSystem();
