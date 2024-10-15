import { FormValidator } from "./scripts/validator.js";
import { Craptcha } from "./scripts/craptcha.js";
import { TestBot } from "./scripts/testBot.js";

const validator = new FormValidator();
const craptcha = new Craptcha();

// Testing
//const testBot = new TestBot(craptcha);
//testBot.runTests(1000000);