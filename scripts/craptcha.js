class Craptcha{
    constructor(craptchaElement){
        // HTML elements & methods
        this.elementMain = craptchaElement;
        this.elementCheckbox = this.elementMain.querySelector("#checkBox");
        this.elementChallengeBox = this.elementMain.querySelector("#craptchaChallengeBox");
        this.elementNextButton = this.elementMain.querySelector("#challengeNext");
        this.elementAnswerBox = this.elementMain.querySelector("#answerBox");

        this.elementCheckbox.checked = false;
        this.elementCheckbox.oninput = () => {this.startValidation()};
        document.addEventListener("mousemove", (e) => {this.reduceMoveScore(e)});

        // Vars
        this.validated = false;
        this.isAndroid = false;
        this.movescore = 0;

        // Challenges
        this.answers = [];     
        this.leftyKeys = "qwertasdfgyxcvb";
        this.rightyKeys = "zuiopühjklönm,.";
    }

    show(){
        this.elementMain.style.display = "block";
    }

    startValidation(){
        if(this.elementCheckbox.checked){
            this.elementCheckbox.disabled = true;
            this.elementChallengeBox.classList.add("visible");
            this.firstChallenge();
            this.movescore = 100;
        }
    }

    firstChallenge(){
        let inputIsValid = false;
        this.elementNextButton.disabled = true;
        document.getElementById("challengeNumber").innerText = "Challenge 1 of 3";
        document.getElementById("challengePrompt").innerText = "Please type in a random sequence of 7 coin flips.\n(eg. HHT...)";
        document.getElementById("answerBox").classList.remove("hidden");
        document.getElementById("answerBox").value = "";
        document.getElementById("answerBox").oninput = () => {
            if(document.getElementById("answerBox").value.length === 7){
                inputIsValid = true;
                this.elementNextButton.disabled = false;
            }else{
                inputIsValid = false;
                this.elementNextButton.disabled = true;
            }
        }
        document.getElementById("answerBox").addEventListener("keyup", (event) => {
            if (event.key === "Enter" && inputIsValid){
                this.answers.push(document.getElementById("answerBox").value.toUpperCase())
                this.secondChallenge();
            }
        });
        this.elementNextButton.onclick = () => {
            this.answers.push(document.getElementById("answerBox").value.toUpperCase())
            this.secondChallenge();
        };
    }

    secondChallenge(){
        this.elementNextButton.disabled = true;
        document.getElementById("challengeNumber").innerText = "Challenge 2 of 3";
        document.getElementById("challengePrompt").innerText = "Please pick a random number between 0 and 10 by using the slider.";
        document.getElementById("answerBox").classList.add("hidden");
        document.getElementById("answerRange").classList.remove("hidden");
        document.getElementById("answerRange").value = 0;
        document.getElementById("answerLabel").innerText = "Answer: " + document.getElementById("answerRange").value;
        document.getElementById("answerRange").oninput = () => {
            this.elementNextButton.disabled = false;
            document.getElementById("answerLabel").innerText = "Answer: " + document.getElementById("answerRange").value;
        }
        this.elementNextButton.onclick = () => {
            this.answers.push(parseInt(document.getElementById("answerRange").value))
            this.thirdChallenge();
        };
    }

    fillBar(charAmount){
        const percentage = (charAmount / 15) * 100;
        document.getElementById("progressBar").style.right = 100 - percentage + "%";
    }

    thirdChallenge(){
        let inputIsValid = false;
        this.elementNextButton.disabled = true;
        document.getElementById("challengeNumber").innerText = "Challenge 3 of 3";
        document.getElementById("challengePrompt").innerText = "Please fill the bar by randomly typing on your keyboard USING BOTH HANDS.";
        document.getElementById("answerBox").classList.remove("hidden");
        document.getElementById("progress").classList.remove("hidden");
        document.getElementById("answerRange").classList.add("hidden");
        document.getElementById("answerLabel").classList.add("hidden");
        document.getElementById("answerBox").value = "";
        const newBox = document.getElementById("answerBox").cloneNode(true);
        document.getElementById("answerBox").parentNode.replaceChild(newBox, document.getElementById("answerBox"));
        document.getElementById("answerBox").oninput = () => {
            const chars = document.getElementById("answerBox").value.length;
            this.fillBar(chars);
            if(chars >= 15){
                inputIsValid = true;
                this.elementNextButton.disabled = false;
            }else{
                inputIsValid = false;
                this.elementNextButton.disabled = true;
            }
        }
        document.getElementById("answerBox").addEventListener("keyup", (event) => {
            if (event.key === "Enter" && inputIsValid){
                this.answers.push(document.getElementById("answerBox").value.toLowerCase())
                this.validateResults();
            }
        });
        this.elementNextButton.onclick = () => {
            this.answers.push(document.getElementById("answerBox").value.toLowerCase())
            this.validateResults();
        };
    }

    reduceMoveScore(e){
        this.movescore = Math.max(0, this.movescore-1);
    }

    validateResults(){
        document.getElementById("challengeNumber").innerText = "Validating.";
        document.getElementById("challengePrompt").classList.add("hidden");
        document.getElementById("answerBox").classList.add("hidden");
        document.getElementById("progress").classList.add("hidden");
        document.getElementById("answerRange").classList.add("hidden");
        this.elementNextButton.classList.add("hidden");
        let botScore = this.checkAnswers(this.answers);
        this.recursiveWait(0, 5, botScore);
    }

    // The next two methods are basically the main part, the other parts are basically just set dressing for presentation.
    // Prepare for *real* horror.
    checkAnswers(answers){
        // First answer bot probability
        let first = 0;
        for(let i = 3;i<8;i++){
            let substrHeads = "";
            let substrTails = "";
            for(let j=0;j<i;j++){
                substrHeads += "H";
                substrTails += "T";
            }
            if(answers[0].includes(substrHeads) || answers[0].includes(substrTails)){
                first += 9;
            }
        }

        let second = 0;
        // Second answer bot probability
        switch(answers[1]){
            case 0:
                second = 9.3;
                break;
            case 1:
                second = 5.6;
                break;
            case 2:
                second = 1.5;
                break;
            case 3:
                second = -0.7;
                break;
            case 4:
                second = -0.7;
                break;
            case 5:
                second = -3.3;
                break;
            case 6:
                second = -0.8;
                break;
            case 7:
                second = -19;
                break;
            case 8:
                second = -1.8;
                break;
            case 9:
                second = 3.7;
                break;
            case 10:
                second = 7.1;
                break;
        }


        // Third answer bot probability
        const threeLength = answers[2].length;
        let lefts = 0;
        let rights = 0;
        for(let i = 0; i < threeLength; i++){
            if(this.leftyKeys.includes(answers[2].charAt(i))){
                lefts++;
            }else if(this.rightyKeys.includes(answers[2].charAt(i))){
                rights++
            }
        }
        const percentLeft = (lefts/threeLength) * 100;
        const third = Math.abs(percentLeft - 50);

        return{
            "First": first,
            "Second": second,
            "Third": third,
            "Overall": first + second + third,
            "IsBot": ((first + second + third) > 20)
        }
    }

    recursiveWait(waited, maxWait, botScore){
        const title = document.getElementById("challengeNumber");
        switch(title.innerText){
            case "Validating.":
                title.innerText = "Validating..";
                break;
            case "Validating..":
                title.innerText = "Validating...";
                break;
            case "Validating...":
                title.innerText = "Validating.";
                break;
        }
        if(waited !== maxWait){
            const self = this;
            setTimeout(function(){
                self.recursiveWait(waited + 1, maxWait, botScore);
            }, 1000);
        }else{
            console.log(botScore);
            document.removeEventListener("mousemove", this.reduceMoveScore);
            const finalScore = Math.min(botScore["Overall"] + this.movescore);
            title.classList.add("hidden");
            document.getElementById("challengePrompt").classList.remove("hidden");
            if(finalScore > 49){
                document.getElementById("challengePrompt").innerText = "I'm " + Math.max(0, Math.floor(finalScore)) + "% sure you're a robot. GET OUT.";
            }else{
                document.getElementById("challengePrompt").innerText = "I'm " + Math.min(100, Math.floor((100 - finalScore))) + "% sure you're not a robot. Come on in.";
            }
        }
    }
}

export{Craptcha}