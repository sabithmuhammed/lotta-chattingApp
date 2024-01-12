const signupDiv = document.querySelector('[data-signup-div]');
const signup = document.querySelector('[data-signup]');
const login = document.querySelector('[data-login]');

const changeLogin = (value)=>{
    if(value==='signup'){
        signup.classList.remove('hidden')
        login.classList.add('hidden')
    }else if(value==='login'){
        signup.classList.add('hidden')
        login.classList.remove('hidden')
    }
}