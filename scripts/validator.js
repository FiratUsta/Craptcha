class Validator{
    constructor(fieldUsername, fieldPassword, fieldMessage, buttonLogin, craptcha){
        this.usernameField = fieldUsername;
        this.passwordField = fieldPassword;
        this.messageField = fieldMessage;
        this.loginButton = buttonLogin;
        this.craptcha = craptcha;

        this.loginAttempts = 0;

        this.usernameField.oninput = () => {this.validate()};
        this.usernameField.addEventListener("keyup", (event) => {
            if (event.key === "Enter"){
                this.passwordField.focus();
            }
        })
        this.passwordField.oninput = () => {this.validate()};
        this.passwordField.addEventListener("keyup", (event) => {
            if (event.key === "Enter"){
                this.attemptLogin();
            }
        })
        this.loginButton.onclick = () => {this.attemptLogin()};
    }

    validate(){
        if(this.loginAttempts === 0){
            if(this.usernameField.value !== "" && this.passwordField.value !== ""){
                this.loginButton.disabled = false;
            }else{
                this.loginButton.disabled = true;
            }
        }
    }

    attemptLogin(){
        if(!this.loginButton.disabled){
            this.messageField.innerText = "";
            // Super secure username and password checker
            if(this.usernameField.value === "AzureDiamond" && this.passwordField.value === "hunter2"){
                this.craptcha.show();
                this.loginButton.disabled = true;
                this.loginAttempts++;
            }else{
                this.messageField.innerText = "Invalid username/password!";
            }
        }
    }
}

export{Validator}