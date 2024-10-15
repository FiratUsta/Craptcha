# Craptcha

### A crappy CAPTCHA implementation for LaurieWired 2024 Halloween Programming Challenge

#### Instructions

For live demo, see the GitHub page [here](https://).

To run it locally (why would you even want to do that) you can't just download and launch from index.html, you'll get a CORS error. You need to actually host it. VSCode liveserver extensions work.

For Laurie: The stuff you'd probably be interested in is in `scripts/craptcha.js`

#### Explanations

Prepare for one horrible CAPTCHA implementation. This monster is not only an abomination of programming, but also psychology and statistics. I will explain as I go.

The initial idea is simple, the basic implementation of CAPTCHA is to present a challenge to the user that's easy for humans but hard for bots. Though even today CAPTCHA sucks at catching bots because bots are catching up to humans-even surpassing them in some regards-when it comes to the tasks presented, so why don't we turn it on its head? We'll present challenges that are hard for humans but easy for machines, if our user fails sufficiently we can determine that they're, in fact, a human.

Easy, we just show a difficult mathematical operation or something, or a very complex maze, hard for humans and easy for bots. Though there' a problem, we do want the user to be able to actually *submit* an answer to the challenge because otherwise the bot would just wait to imitate a human.

So, we need a challenge that's easy for humans to do, but to get wrong, while the bots should be able to do it and get it right. There's one thing that immediately comes to mind; Randomization. We humans suck at producing random sequences, while machines are good at it (yeah yeah, true random psuedo-random etc. I know, they're much better than us though).

CRAPTCHA is built on this idea, and presents the user with four randomization challenges. Then it looks at the results to see if they're likely to be machine generated or human inputted in order to determine the botness of a user. Before we move on to the challenges though, CRAPTCHA is built on the following assumptions:

1. An organization smart enough to build an AGI in 2038 isn't dumb enough to put it in a humanoid body, thus bot/AI users are assumed to be interfacing with the challenges directly and not through keyboards/mice.
2. Both AI and human users are engaging with the challenge earnestly, it's easy for a human to knowingly fail this test but we assume that the human user *wants* to pass the challenge because they want to get to the content locked behind.
3. All users are assumed to have US keyboard layouts (code could be expanded to work well with different layouts but, hey, time constraints)

With that being said, essentially CRAPTCHA presents some challenges, scores the user on these challenges and if the total score is above a threshold, assumes the user is a bot.

##### 1) The Coin Flip Challenge

Challenge: User is asked to input a string of 7 coin flips as a combination of the letters "h" and "t" for heads and tails respectively.

Idea: According to one psychology or whatever paper (will add source later if I remember to do so), when asked to do this humans tend to avoid certain patterns as "they don't look random", especially triples such as "hhh" or "ttt" appear 9% less than they should compared to results that are actually randomly generated.

Calculation: The user starts with 0 points, and gets 9 points if their input contains a triple. They get an additional 9 point added to their score for each letter repeating above a triple, for example "thhhtth" would get 9 points while "thhhhth" would get 18 and so on.

Horror: First of all the paper was pretty old I think so likely outdated lol, also adding 9 more points for each repeating letter after the triple is not how statistics work at all but hey. Getting this as a string is also probably not doing this challenge any favors, in fact this challenge is the reason for most false positives.

Improvement Ideas: First of all this would work much better with a new study with a larger sample size and that shows the result for each pattern. Secondly, I feel like this would work much much better if I displayed 7 little coin icons that the user clicks on to change between heads and tails and the prompt was changed to "Make random looking sequence of coin flips.".

##### 2) The Random Number Picking Challenge

Challenge: User is asked to pick a random number between 0-10 on a slider, the slider initially rests at 5.

Idea: People pick some numbers more than others when asked to pick a "random" number. Some numbers (like 7 and 17) are generally considered lucky and are picked more, some others (like 0, 5 and 10) are seen as not "random enough" and are picked less. So if we find statistics about which numbers are picked at what percentage, we can compare that against our user's pick.

Calculation: I found some statistics (will add source later if I remember) on Reddit (lmao) that asked IIRC 1000 uni students to pick a random number. In a truly random pick, each number has the same chance of getting picked, so we assign a score to each number by deducting the random pick chancehuman picking numbe from the human statistics. For example, for numbers 1-10 each number normally should have a 10% chance of being picked, but let's say our number is picked by people 5% of the time. If our user picks this number, the user's score increases by 5 because the user is 5% less likely to be a human. Similarly if the number is picked 15% of the time by people, the user's score decreases by 5% because they're more likely to be a human.

Horror: Again, this is not how any of this works. This is not only not sound statistically, it's also a horror because different cultures have different "lucky numbers" and may have different statistics on random picks. Some 1000 uni students from America is really not a good sample for this.

Improvement Ideas: I don't even know man.

##### 3) The Key Smashing Challenge

Challenge: User is asked twice to smash their keyboard using both hands to generate a random string with a length of at least 15 characters. A progress bar is presented that fills to 100% at 15 characters.

Idea: No sources for this one, but the idea is really simple. People's hands usually rest on certain parts of the keyboard. We assume, if the user is asked to smash their keyboard with both hands the resulting string should have roughly equal amounts of chars from the left side of the keyboard and the right side. A bot doesn't interface with the computer through a keyboard, so their keys will be truly random and it's less likely to be weighed equally when it comes to the sides on the keyboard. Another assumption is that people will use the same set of keys repeatedly, or at least use some keys more than others as they are closer to their hands natural resting position on the keyboard (see the sksksksk meme), while a computer will generate a more equally distributed output.

Calculation: This is done twice in order to do two calculations, but I haven't had the time to implement both. Below are two different calculations, but only the first one is implemented in code:

1. Keyboard keys are divided into left and right keys, the inputted string is compared against these to determine the ratio of left to right keys. User's score increases by the amount they divert from a 50/50 split by adding the absolute of 50 substracted from the left key percentage.
2. Amounts of each char present in the string are counted, and users score is increased by how much this diverts from an equal distribution between keys. I don't know how much this would increase their score and how, because this is not implemented.

Horror: This is literally just a random idea I had and it has no basis in any kind of research, though it's surprisingly accurate.

Improvement Ideas: Implement the second calculation method.

##### 4) Final score and threshold

For the final score, all scores from the previous challenges are totalled and compared against the threshold. If the total score is higher than the threshold, the user is assumed to be a bot. The threshold is 20 points, because that was the average score of the test bot before adding the second key smashing challenge. The idea is that, adding the second key smashing challenge shouldn't increase the scores of humans by that much, but increase bot average significantly. Now, it catches 75% of bots in test runs (check `testBot.js` for test details).

False positives? Hell yeah, I didn't have the chance to test this on a lot of people but all 1 of 3 people I've tested it on failed the first time, though they did pass the second time.

Should you use this? NO lol.

How could this be improved? I guess if you *really* like it you could also get statistical data from users you're confident are humans and update your scoring algorithm to reflect these new statistics.
