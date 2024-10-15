import * as Elements from "./elements.js";

class Challenge{
    constructor(prompt, validator, answerElement, elementsEnabled, elementsDisabled = []){
        this.prompt = prompt;
        this.validator = validator;
        this.answerElement = answerElement;
        this.elementsEnabled = elementsEnabled;
        this.elementsDisabled = elementsDisabled;
    }

    present(challengeNumber, totalChallenges){
        // Reset challenge
        Elements.inputText.value = "";
        Elements.inputRange.value = 5;
        Elements.buttonChallenge.disabled = true;
        Elements.progressBar.style.right = "100%";

        // Show & hide necessary elements
        this.elementsEnabled.forEach(element => {
            element.classList.remove("hidden");
        });
        this.elementsDisabled.forEach(element => {
            element.classList.add("hidden");
        });

        // Update labels
        Elements.challengePrompt.innerText = this.prompt;
        Elements.challengeNumber.innerText = `Challenge ${challengeNumber} of ${totalChallenges}`;
        Elements.challengeLabel.innerText = "Answer:";
    }

    getAnswer(){
        switch (this.answerElement) {
            case Elements.inputText:
                return Elements.inputText.value.toLowerCase();
            case Elements.inputRange:
                return Elements.inputRange.value;
            default:
                return null;
        }
    }
}

const coinFlips = new Challenge(
    "Please type in a random sequence of 7 coin flips.\n(eg. HHT...)",
    function(){return(Elements.inputText.value.length === 7)},
    Elements.inputText,
    [Elements.inputText],
    [Elements.inputRange, Elements.progressContainer]
)

const numberPicker = new Challenge(
    "Please pick a random number between 0 and 10 by using the slider.",
    function(){return true},
    Elements.inputRange,
    [Elements.inputRange],
    [Elements.inputText, Elements.progressContainer]
)

const keyboardMash = new Challenge(
    "Please fill the bar by mashing your keyboard randomly USING BOTH HANDS.",
    function(){return(Elements.inputText.value.length >= 15)},
    Elements.inputText,
    [Elements.inputText, Elements.progressContainer],
    [Elements.inputRange]
)

const mashRepeat = new Challenge(
    "AGAIN.",
    function(){return(Elements.inputText.value.length >= 15)},
    Elements.inputText,
    [Elements.inputText, Elements.progressContainer],
    [Elements.inputRange]
)

class Craptcha{
    constructor(){
        // Vars
        this.answers = [];
        this.currentChallenge = 0;

        // Consts
        this.botThreshold = 20;
        this.keysLeft = "qwertasdfgyxcvb";
        this.keysRight = "zuiopühjklönm,.";
        this.challenges = [coinFlips, numberPicker, keyboardMash, mashRepeat];

        this.init();
    }

    init(){
        Elements.inputCheckbox.checked = false;
        Elements.inputCheckbox.oninput = () => {
            Elements.craptchaChallenge.classList.add("visible");
            this.showNextChallenge();
        };
    }

    showNextChallenge(){
        // Get and present challenge
        const challenge = this.challenges[this.currentChallenge];
        challenge.present(this.currentChallenge + 1, this.challenges.length);

        // Update input methods to validate answer
        Elements.inputText.oninput = () => {
            const percentage = (Elements.inputText.value.length / 15) * 100;
            Elements.progressBar.style.right = 100 - percentage + "%";
            Elements.buttonChallenge.disabled = !challenge.validator();
        }

        Elements.inputRange.oninput = () => {
            Elements.challengeLabel.innerText = `Answer: ${Elements.inputRange.value}`;
            Elements.buttonChallenge.disabled = !challenge.validator();
        }

        // Update button label and function
        if(this.currentChallenge === this.challenges.length - 1){
            Elements.buttonChallenge.value = "Submit";
        }

        Elements.buttonChallenge.onclick = () => {
            if(this.currentChallenge === this.challenges.length - 1){
                this.answers.push(challenge.getAnswer());
                this.checkResults();
            }else{
                this.answers.push(challenge.getAnswer());
                this.currentChallenge++;
                this.showNextChallenge();
            }
        }
    }

    checkResults(){
        console.log("Done");
        console.log(this.answers);
    }
}

export{Craptcha}