import { Validator } from "./scripts/validator.js";
import { Craptcha } from "./scripts/craptcha.js";
import { TestBot } from "./scripts/testBot.js";

const craptcha = new Craptcha(document.getElementById("craptcha"));

const validator = new Validator(document.getElementById("username"), 
                                document.getElementById("password"),
                                document.getElementById("message"),
                                document.getElementById("loginButton"),
                                craptcha);

const testBot = new TestBot(craptcha);

//testBot.runTests(1000000);