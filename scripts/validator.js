import * as Elements from "./elements.js";

class FormValidator{
    constructor(){
        this.loginAttempts = 0;

        this.init();
    }

    init(){
        Elements.inputUsername.oninput = () => {this.validate()};
        Elements.inputUsername.addEventListener("keyup", (event) => {
            if (event.key === "Enter"){
                Elements.inputPassword.focus();
            }
        })
        Elements.inputPassword.oninput = () => {this.validate()};
        Elements.inputPassword.addEventListener("keyup", (event) => {
            if (event.key === "Enter"){
                this.attemptLogin();
            }
        })
        Elements.buttonLogin.onclick = () => {this.attemptLogin()};
    }

    validate(){
        if(this.loginAttempts === 0){
            if(Elements.inputUsername.value !== "" && Elements.inputPassword.value !== ""){
                Elements.buttonLogin.disabled = false;
            }else{
                Elements.buttonLogin.disabled = true;
            }
        }
    }

    attemptLogin(){
        if(!Elements.buttonLogin.disabled){
            Elements.fieldMessage.innerText = "";
            // Super secure username and password checker
            if(Elements.inputUsername.value === "AzureDiamond" && Elements.inputPassword.value === "hunter2"){
                if(this.loginAttempts === 0){
                    Elements.craptchaMain.style.display = "block";
                    Elements.buttonLogin.disabled = true;
                    this.loginAttempts++;
                }else{
                    location.href = location.href;
                }
            }else{
                Elements.fieldMessage.innerText = "Invalid username/password!";
            }
        }
    }
}

export{FormValidator}