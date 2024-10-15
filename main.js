import { FormValidator } from "./scripts/validator.js";
import { Craptcha } from "./scripts/craptcha.js";
import { TestBot } from "./scripts/testBot.js";

const craptcha = new Craptcha(document.getElementById("craptcha"));
const validator = new FormValidator(craptcha);
const testBot = new TestBot(craptcha);

//testBot.runTests(1000000);