const signupDiv = document.querySelector("[data-signup-div]");
const signup = document.querySelector("[data-signup]");
const login = document.querySelector("[data-login]");
const chatList =document.querySelector("[data-chat-list]");

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
    }else{
        nameError.innerText = "";
    }
  } else {
    nameError.innerText = "This field is required";
    validation = false;
  }

  if (password) {
    if (password.length < 6) {
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

  const rawData = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  });
  if(rawData.ok){
    const data = await rawData.json();
    if(data.status === "success"){
        chatList.classList.remove('hidden')
        signupDiv.classList.add('hidden')
    }
  }
};

const doLogin =async ()=>{
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
    if (password.length < 6) {
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
  const rawData = await fetch('/login',{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({email,password})
  })
  if(rawData.ok){
    const data = await rawData.json();
    if(data.status === "success"){
        chatList.classList.remove('hidden')
        signupDiv.classList.add('hidden')
    }
  }

}
