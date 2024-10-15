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
                return parseInt(Elements.inputRange.value);
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
        this.keysLeft = "qwertasdfgyxcvb12345";
        this.keysRight = "zuiopühjklönm,.67890";
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
                this.displayResults();
            }else{
                this.answers.push(challenge.getAnswer());
                this.currentChallenge++;
                this.showNextChallenge();
            }
        }
    }

    // Result calculators
    coinFlipChecker(answer){
        let score = 0;
        for(let i = 3;i<8;i++){
            let substrHeads = "";
            let substrTails = "";
            for(let j=0;j<i;j++){
                substrHeads += "h";
                substrTails += "t";
            }
            if(answer.includes(substrHeads) || answer.includes(substrTails)){
                score += 9;
            }
        }
        return score;
    }

    randomNumberChecker(answer){
        switch(answer){
            case 0:
                return 9.3;
            case 1:
                return 5.6;
            case 2:
                return 1.5;
            case 3:
                return -0.7;
            case 4:
                return -0.7;
            case 5:
                return -3.3;
            case 6:
                return -0.8;
            case 7:
                return -19;
            case 8:
                return -1.8;
            case 9:
                return 3.7;
            case 10:
                return 7.1;
        }
    }

    keySmashChecker(answer){
        let lefts = 0;
        let rights = 0;
        for(let i = 0; i < answer.length; i++){
            if(this.keysLeft.includes(answer.charAt(i))){
                lefts++;
            }else if(this.keysRight.includes(answer.charAt(i))){
                rights++
            }
        }
        const percentLeft = (lefts/answer.length) * 100;
        const score = Math.abs(percentLeft - 50);
        return score;
    }

    checkResults(answers){
        const coinScore = this.coinFlipChecker(answers[0]);
        const numberScore = this.randomNumberChecker(answers[1]);
        const smashScoreFirst = this.keySmashChecker(answers[2]);
        const smashScoreSecond = this.keySmashChecker(answers[3]);
        const totalScore = coinScore + numberScore + smashScoreFirst + smashScoreSecond;

        return{
            "Coin Flip Challenge": coinScore,
            "Random Number Challenge": numberScore,
            "First Keysmash Challenge": smashScoreFirst,
            "Second Keysmash Challenge": smashScoreSecond,
            "Total Score": totalScore,
            "Is A Bot?": (totalScore > this.botThreshold)
        }
    }

    displayResults(){
        Elements.craptchaChallenge.classList.remove("visible");
        const results = this.checkResults(this.answers);
        console.log(this.answers);
        console.log(results)
        if(results["Is A Bot?"]){
            Elements.fieldMessage.innerText = "CRAPTCHA failed, please refresh the page and try again!";
        }else{
            Elements.fieldMessage.innerText = "CRAPTCHA passed, click to log in button to log in!";
            Elements.fieldMessage.style.color = "green";
            Elements.buttonLogin.disabled = false;
        }
    }
}

export{Craptcha}