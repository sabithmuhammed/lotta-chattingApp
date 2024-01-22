let socket;
const signupDiv = document.querySelector("[data-signup-div]");
const signup = document.querySelector("[data-signup]");
const login = document.querySelector("[data-login]");
const chatList = document.querySelector("[data-chat-list]");
const chat = document.querySelector("[data-chat]");
let receiverId = "";
const changeLogin = (value) => {
  if (value === "signup") {
    signup.classList.remove("hidden");
    login.classList.add("hidden");
  } else if (value === "login") {
    signup.classList.add("hidden");
    login.classList.remove("hidden");
  }
};

const doSignup = async () => {
  const email = document.querySelector("[data-semail]").value.trim();
  const name = document.querySelector("[data-sname]").value.trim();
  const password = document.querySelector("[data-spassword]").value.trim();
  const emailError = document.querySelector("[data-error-semail]");
  const nameError = document.querySelector("[data-error-sname]");
  const passwordError = document.querySelector("[data-error-spassword]");

  let validation = true;
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validation = false;
      emailError.innerText = "Invalid email address";
    } else {
      emailError.innerText = "";
    }
  } else {
    emailError.innerText = "This field is required";
    validation = false;
  }
  if (name) {
    if (!/^[a-z ,.'-]+$/i.test(name)) {
      validation = false;
      nameError.innerText = "Invalid name";
    } else {
      nameError.innerText = "";
    }
  } else {
    nameError.innerText = "This field is required";
    validation = false;
  }

  if (password) {
    if (password.length < 6) {
      validation = false;
      passwordError.innerText = "Password must contain at least 6 characters";
    } else {
      passwordError.innerText = "";
    }
    if (password.includes(" ")) {
      validation = false;
      passwordError.innerText = "Password cannot contain spaces";
    }
  } else {
    passwordError.innerText = "This field is required";
    validation = false;
  }
  if (!validation) {
    return;
  }

  const rawData = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  });
  if (rawData.ok) {
    const data = await rawData.json();
    if (data.status === "success") {
      chatList.classList.remove("hidden");
      signupDiv.classList.add("hidden");
      doSocketConnection(data.userId);
      doSearchUsers();
    }
  } else {
    const data = await rawData.json();
    emailError.innerText = data.message;
    setTimeout(() => {
      emailError.innerText = "";
    }, 4000);
  }
};

const doLogin = async () => {
  const email = document.querySelector("[data-lemail]").value.trim();
  const password = document.querySelector("[data-lpassword]").value.trim();
  const emailError = document.querySelector("[data-error-lemail]");
  const passwordError = document.querySelector("[data-error-lpassword]");
  const loginError = document.querySelector("[data-error-login]"); // show login error in innerText of this element

  let validation = true;
  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validation = false;
      emailError.innerText = "Invalid email address";
    } else {
      emailError.innerText = "";
    }
  } else {
    emailError.innerText = "This field is required";
    validation = false;
  }

  if (password) {
    if (password.length < 1) {
      //changed for a while for easier login and logout
      validation = false;
      passwordError.innerText = "Password must contain at least 6 charecters";
    } else {
      passwordError.innerText = "";
    }
  } else {
    passwordError.innerText = "This field is required";
    validation = false;
  }
  if (!validation) {
    return;
  }
  const rawData = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (rawData.ok) {
    const data = await rawData.json();
    if (data.status === "success") {
      chatList.classList.remove("hidden");
      signupDiv.classList.add("hidden");
      doSocketConnection(data.userId);
      doSearchUsers();
    }
  } else {
    const data = await rawData.json();
    loginError.innerText = data.message;
    setTimeout(() => {
      loginError.innerText = "";
    }, 5000);
  }
};

//function for dynamic searching
async function doSearchUsers() {
  const searchInput = document.getElementById("searchInput");
  const resultsList = document.getElementById("resultsList");
  const keyToSearch = searchInput.value;

  fetchUsers();
  async function fetchUsers() {
    const response = await fetch("/searchUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyToSearch }),
    });
    const data = await response.json();
    if (data) {
      console.log(data.listedUsers);
      updateResults(data.listedUsers);
    }
  }

  function updateResults(results) {
    resultsList.innerHTML = "";

    results.forEach((result) => {
      const listItem = document.createElement("div");
      listItem.classList.add("list-container");

      listItem.setAttribute(
        "onclick",
        `openChatScreen('${result._id}','${result.name}','${result.image}')`
      );

      listItem.innerHTML = `
      <div class="pfp">
        <div class="pfp-image wh-100">
          <img src="/images/profile/${result.image}" alt="">
        </div>
        <div class="status ${
          result.is_online == 1 ? "status-active" : ""
        }" data-user="${result._id}"></div>
      </div>
      <div class="name">${result.name}</div>
      <div class="new-message"></div>
    `;

      resultsList.appendChild(listItem);
    });
  }
}

function doSocketConnection(userId) {
  socket = io("/user-namespace", {
    auth: {
      userId,
    },
  });
  const chatStatus = document.querySelector(`[data-chat-status]`);
  socket.on("userOnline", (data) => {
    const user = document.querySelector(`[data-user="${data.userId}"]`);
    user.classList.add("status-active");
    if (data.userId === receiverId) {
      chatStatus.innerText = "Online";
      chatStatus.classList.add("status-text-active");
    }
  });
  socket.on("userOffline", (data) => {
    const user = document.querySelector(`[data-user="${data.userId}"]`);
    user.classList.remove("status-active");
    if (data.userId === receiverId) {
      chatStatus.innerText = "Offline";
      chatStatus.classList.remove("status-text-active");
    }
  });
}

const openChatScreen = (id, name, pfp) => {
  receiverId = id;
  const chatHistory = document.querySelector(`[data-chat-history]`);
  document.querySelector(`[data-chat-name]`).innerText = name;
  document.querySelector(`[data-chat-pfp]`).src = "/images/profile/" + pfp;
  const status = document
    .querySelector(`[data-user="${id}"]`)
    .classList.contains("status-active");
  const chatStatus = document.querySelector(`[data-chat-status]`);
  chatStatus.innerText = status ? "Online" : "Offline";
  if (status) {
    chatStatus.classList.add("status-text-active");
  } else {
    chatStatus.classList.remove("status-text-active");
  }
  chatList.classList.add("hidden");
  chat.classList.remove("hidden");
  chatHistory.scrollTop = chatHistory.scrollHeight;
};
const closeChat = () => {
  chat.classList.add("hidden");
  chatList.classList.remove("hidden");
};

const more = document.querySelector('[data-more]')
more.addEventListener('click',()=>{
  const moreMenu = document.querySelector('[data-more-menu]')
  more.classList.toggle('more-div-active')
  moreMenu.classList.toggle('more-actions-div-active')
})