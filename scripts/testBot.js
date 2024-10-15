class TestBot{
    constructor(craptcha){
        this.craptcha = craptcha;
    }

    runTest(){
        const answers = []

        let firstAnswer = "";
        for(let i=0;i<7;i++){
            if(Math.random() < 0.5){
                firstAnswer += "h";
            }else{
                firstAnswer += "t";
            }
        }

        let thirdAnswer = '';
        let fourthAnswer = '';
        const characters = 'qwertasdfgyxcvbzuiopühjklönm,.1234567890';
        for(let i=0;i<15;i++){
            thirdAnswer += characters.charAt(Math.floor(Math.random() * characters.length))
            fourthAnswer += characters.charAt(Math.floor(Math.random() * characters.length))
        }

        answers.push(firstAnswer);
        answers.push((Math.floor(Math.random() * (Math.floor(10) - Math.ceil(0) + 1)) + Math.ceil(0)));
        answers.push(thirdAnswer);
        answers.push(fourthAnswer)

    
        return this.craptcha.checkResults(answers);
    }

    runTests(cycles){
        console.log("Running " + cycles + " tests...")
        let first = 0;
        let second = 0;
        let third = 0;
        let fourth = 0;
        let overall = 0;
        let highestOverall = 0;
        let highestResults;
        let caught = 0;
        for(let i=0;i<cycles;i++){
            const results = this.runTest();
            first += results["Coin Flip Challenge"];
            second += results["Random Number Challenge"];
            third += results["First Keysmash Challenge"];
            fourth += results["Second Keysmash Challenge"];
            overall += results["Total Score"];
            if(results["Total Score"] > highestOverall){
                highestOverall = results["Total Score"];
                highestResults = results;
            };
            if(results["Is A Bot?"]){
                caught++;
            }
        }
        console.log("----- TEST RESULTS BEGIN -----");
        console.log("First challenge score average: " + (first / cycles));
        console.log("Second challenge score average: " + (second / cycles));
        console.log("Third challenge score average: " + (third / cycles));
        console.log("Fourth challenge score average: " + (fourth / cycles));
        console.log("Overall score average: " + (overall / cycles));
        console.log("Highest overall score: " + highestOverall);
        console.log("Results for the highest score:");
        console.log(highestResults)
        console.log("Caught in: " + caught + " runs (" + ((caught/cycles) * 100) + "%)");
        console.log("------ TEST RESULTS END ------");
    }
}

export{TestBot}