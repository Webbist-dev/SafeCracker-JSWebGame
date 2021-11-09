//Store reference to game canvas and top text canvas
const canvas = document.getElementById('background');
let ctx = canvas.getContext("2d");
//top text canvas for writing game text on to
const ttcanvas = document.getElementById('topText');
let ttctx = ttcanvas.getContext("2d");
//For storing reference to current state
let currentState = "setup"; //setup, ready, spinning, awarding, tallying
//The text to show when the game is ready to play
let currentTopText = "";
let startText = "Match 3 symbols to win! CLICK THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION";
let resetText = "Please wait while next round is being setup, thank you :)";
let awardText = "Congratulations! You won a prize! :D";
let numberOfSafesToOpen = 4; //How many safes the player can open
let smallSafeArray = []; //The array of all safe objects
let spinBtnObj; //Spin button object
let screenSafeObj; //The screen above the dial
let firstSpin, secondSpin = false; //Vars to track how many times the dial has spun
let prizes = []; //Array for random prizes to be stored
let multipliers = []; //Array for random multipliers to be stored
let safeScreenNumbers = ["-", "-", "-", "-"]; //Text to display on screenSafeObj
let openSafes = []; //Array to store which safes have been opened
let randomSafes = []; //Array of random safes that the player can open
let timeToWaitBeforeReset = 3000;//Time to wait before resetting the game
let numberOfMatchingSafes = 0;
//The weight of the prizes can be set here to increase or decrease
//the probability of a certain prize being selected
let prizeWeights = '11111123AB';

let clickLoc = {
    x: undefined,
    y: undefined
};
let scale = {
    x: undefined,
    y: undefined
};
let currentAngle = 720; //Starting angle is high so the dial can spin left or right
let finalTargetAngle = 0; //var for the angle when the dial should stop
let extraSpin = 160; //Extra dial spin offset(40deg is the difference between the numbers)
let spinSpeed = 5; //Speed at which to spin the dial
let targetAngle = 0; //Var to store the temporary target angle
let finishedSpinning = false; //Var to check if dial finished spinning
let bigWinAchieved = false; //Var to check if a big win is achieved
//Vars for all the assets to be loaded
let bigBG = new Image();
let smallSafe = new Image();
let smallSafeOpen = new Image();
let smallSafeBG = new Image();
let safeDialSupport = new Image();
let safeDialClear = new Image();
let safeDialRed = new Image();
let safeDialGreen = new Image();
let spinButton = new Image();
let screenSafeBG = new Image();
let screenSafeRed = new Image();
let screenSafeGreen = new Image();
let coinsImage = new Image();
let diamondsImage = new Image();
let goldImage = new Image();
let notesImage = new Image();
let ringImage = new Image();
//Asset source location
bigBG.src = "res/background_safe_minigame.png";
smallSafe.src = "res/safe_minigame.png";
smallSafeOpen.src = "res/safe_open_minigame.png";
smallSafeBG.src = "res/screen_safe_background.png";
safeDialSupport.src = "res/support_safe_dial_minigame.png";
safeDialClear.src = "res/safe_dial_clear.png";
safeDialRed.src = "res/safe_dial_red.png";
safeDialGreen.src = "res/safe_dial_green.png";
spinButton.src = "res/text_spin_safe_dial_minigame.png";
screenSafeBG.src = "res/screen_safe_background.png";
screenSafeRed.src = "res/screen_safe_minigame.png";
screenSafeGreen.src = "res/screen_safe_win.png";
coinsImage.src = "res/coins.png";
goldImage.src = "res/gold.png";
diamondsImage.src = "res/diamond.png";
notesImage.src = "res/notes.png";
ringImage.src = "res/ring.png";
//Load all asset vars to an array
let imagesArray = [
    bigBG, smallSafe, smallSafeOpen, smallSafeBG,
    safeDialSupport, safeDialClear, safeDialRed,
    safeDialGreen, spinButton, screenSafeBG,
    screenSafeRed, screenSafeGreen, coinsImage,
    diamondsImage, goldImage, notesImage, ringImage
];
//Next load all assets and call allLoaded() when all assets are loaded
let imageCount = imagesArray.length;
let imagesLoaded = 0;
for (let i = 0; i < imageCount; i++) {
    imagesArray[i].onload = function () {
        imagesLoaded++;
        if (imagesLoaded == imageCount) {
            allLoaded();
            console.log("Images Loaded");
        } else {
            console.log("Still Loading Images");
        }
    };
}
function allLoaded() {
    //set the width and height of the 2 canvas to match the background image
    canvas.width = bigBG.width;
    canvas.height = bigBG.height;
    //console.log("w: " + canvas.width )
    ttcanvas.width = bigBG.width;
    ttcanvas.height = bigBG.height;
    //.log("ttw: " + ttcanvas.width )
    //Start drawing the images
    drawBG();
    SetUpSafeDoors();
    setUpDialSupport();
    setUpDial();
    setUpSpinButton();
    setupSafeScreen();
    writeToSafeScreen();
    //Select the safes and prizes
    //This is done before the game starts
    preSelcetSafes();
    preSelcetPrizes();
    currentState = 'ready';
    currentTopText = startText;
    wrapText(currentTopText);
    console.log('All loaded run');
}
//Draw the bg image
function drawBG() {
    ctx.drawImage(bigBG, 0, 0);
}

function SetUpSafeDoors() {
    smallSafeArray = [];
    let x = 0;
    let y = 40;
    let safeCount = 0;
    //Nested for loop to create the 9 safes at regular intervals
    for (let i = 0; i < 3; i++) {
        x = 50;
        y += 140;
        for (let j = 0; j < 3; j++) {
            //Create safe objects and save them in the small safe array
            smallSafeArray.push(new SmallSafeObj(safeCount, smallSafe, smallSafeOpen, smallSafeBG, 0, 0, x, y, false));
            smallSafeArray[safeCount].draw();
            writeToTextSafe("door", safeCount + 1, x + smallSafe.width / 2, y + smallSafe.height / 2);
            x += 175;
            safeCount += 1;
        }
    }
}
//Small safe object
function SmallSafeObj(arrPos, image, safeDoor, safeInternal, prize, prizeValue, x, y, revealed) {
    this.arrPos = arrPos;
    this.img = image;
    this.insideImg = safeDoor;
    this.safeInternal = safeInternal;
    this.prize = prize;
    this.prizeValue = prizeValue;
    this.x = x;
    this.y = y;
    this.revealed = revealed;
    //Draw function in the object
    this.draw = function () {
        ctx.drawImage(this.img, x, y);
    };
    //Draw the images that show the inside of the safe
    this.revealInside = function () {
        this.revealed = true;
        ctx.drawImage(safeDoor, x - 40, y - 26);
        ctx.drawImage(safeInternal, x + 25, y + 17, 112, 103);
        //Draw the prize and the multiplier text
        ctx.drawImage(this.prize, 0, 0, this.prize.width / 2, this.prize.height, x - 30, y - 17, this.prize.width / 2, this.prize.height);
        writeToTextSafe("multiplier", "X" + this.multiplier, x + smallSafe.width / 2 - 10, y + smallSafe.height / 2 + 25);
    };
}

//Draw the dial bg
function setUpDialSupport() {
    ctx.drawImage(safeDialSupport, 580, 272);
}

function SpinButtonObj(image, x, y, width, height, hide) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hide = hide;
    //Draw the image of the object
    this.draw = function () {
        if (!this.hide) {
            ctx.drawImage(this.image, x, y);
        }
    };
}
function ScreenSafeObj(bgImg, redImg, greenImg, x, y, width, height) {
    this.bgImg = bgImg;
    this.redImg = redImg;
    this.greenImg = greenImg;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.drawBG = function () {
        ctx.drawImage(this.bgImg, x, y);
    };
    this.drawRed = function () {
        ctx.drawImage(this.redImg, x - 24, y);
    };
    this.drawGreen = function () {
        ctx.drawImage(this.greenImg, x - 2, y);
    };
}

function writeToTextSafe(type, value, xPos, yPos) {
    //This text is written to the game canvas as it does not need to updated
    //while the game is running, only when the safe is opened
    switch (type) {
        case "door":
            ctx.font = '54px TitanOne';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(value, xPos + 8, yPos + 6);
            break;
        case "multiplier":
            ctx.font = '62px TitanOne';
            ctx.fillStyle = 'black';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(value, xPos + 8, yPos + 6);
            ctx.font = '54px TitanOne';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(value, xPos + 8, yPos + 6);
            break;
    }
}
//THis function writes text to the top display and wraps longer texts so that it fits
function wrapText(text) {
    ttctx.clearRect(0, 0, canvas.width, canvas.height);
    //Set the starting point from which to position the text
    var x = ttcanvas.width / 2;
    var y = ttcanvas.height / 10;
    var maxWidth = 1200; //Max width of the area the text can cover
    var words = text.split(' '); //Separate the words of the text in to an array
    var line = ''; //A blank string to add text too
    var lineHeight = 40;
    ttctx.font = '30px Dimbo';
    ttctx.textBaseline = 'middle';
    ttctx.fillStyle = 'black';
    //Start to add words to test line, check the length of the string
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        //If the string is getting too long
        if (testWidth > maxWidth) {
            //Print the current string
            ttctx.fillText(line, x, y);
            //Drop down by one lineheight if there are more words to write
            if (n < words.length - 1) {
                line = words[n] + ' ';
                y += lineHeight;
            }
        }
        else {
            line = testLine;
        }
    }
    //Print the text to the display
    ttctx.fillText(line, x, y);
    //Call function to write to the small screen above the dial
    //This is done here so the small screen matches any update to the main display 
    writeToSafeScreen();
}
function writeToSafeScreen() {
    ttctx.font = '54px TitanOne';
    ttctx.fillStyle = 'white';
    ttctx.textBaseline = 'middle';
    ttctx.textAlign = "center";
    //Checks the safe screen numbers array and prints the index values
    for (let i = 0; i < safeScreenNumbers.length; i++) {
        ttctx.fillText(safeScreenNumbers[i], 640 + (i * 60), 224);
    }
}
function setupSafeScreen() {
    //Initial value for the small screen above the dial
    safeScreenNumbers = ["-", "-", "-", "-"];
    //Set up the Screen Safe object
    screenSafeObj = new ScreenSafeObj(screenSafeBG, screenSafeRed, screenSafeGreen, 600, 178, screenSafeBG.width, screenSafeBG.height);
    //The default state of the screen seems to be the bg + red, green is reserved for a win
    screenSafeObj.drawBG();
    screenSafeObj.drawRed();
    //screenSafeObj.drawGreen();
}
//Small safe object
function DialObj(image, x, y, active) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.active = active;
    this.draw = function () {
        ctx.drawImage(image, x, y);
    };
}
function setUpDial() {
    ctx.drawImage(safeDialClear, 592, 308);
}
function setUpSpinButton() {
    spinBtnObj = new SpinButtonObj(spinButton, 692, 408, spinButton.width, spinButton.height, false);
    spinBtnObj.draw();
}

//Checks the current state and does some house keeping
function checkReset() {
    if (currentState == "setup") {

        currentTopText = resetText;
        wrapText(currentTopText);

        numberOfMatchingSafes = 0;

        preSelcetSafes();
        preSelcetPrizes();
        //Wait some seconds before resetting so player can see the result
        setTimeout(() => {
            allLoaded();
        }, timeToWaitBeforeReset);
    }
    else if (currentState == 'ready') {
        setUpSpinButton();
    }
    else if (currentState == 'spinning') {
    }
    else if (currentState == 'awarding') {
        //Do something to indicate any prizes won

        console.log("DO SOME AWARDING THING");
        screenSafeObj.drawGreen();

        currentTopText = awardText;
        wrapText(currentTopText);

        //Wait some seconds before checking reset
        setTimeout(() => {
            currentState = 'setup';
            checkReset();
        }, timeToWaitBeforeReset);
    }
}
//Open safe function
function openSafe(safeNumber) {
    //Opens safe at the desired index value
    //Calls the function in the object which will draw the images
    smallSafeArray[safeNumber].revealInside();
    //Change the text in the safe screen numbers array to the currently opened safe
    safeScreenNumbers[openSafes.length - 1] = "" + safeNumber;
    //Change the current top text to update the newly opened safe
    currentTopText = "SAFE " + safeNumber;
    //Call the function to display the new text
    wrapText(currentTopText);
}
function spinTheDial() {
    //Check if the game is okay to start spinning
    if (currentState == 'ready') {
        //Set the current state
        currentState = 'spinning';
        //Set the top text and display the updated text
        currentTopText = 'SPINNING';
        wrapText(currentTopText);
    }
    //If the game is in the spinning state
    if (currentState == 'spinning') {
        //Check if the current angle is greater or lower than target angle
        if (currentAngle < targetAngle) {
            //Increase the current angle by the speed
            currentAngle += spinSpeed;
        }
        else if (currentAngle > targetAngle) {
            //Decrease the current angle by the speed
            currentAngle -= spinSpeed;
        }
        //If the the first and second spin haven't been reached
        //And the current angle has now reached the target
        if (!firstSpin && !secondSpin && currentAngle === targetAngle) {
            firstSpin = true; //First spin completed
            targetAngle += extraSpin; //Increase the target angle by the extra spin amount
            spinSpeed = spinSpeed / 2; //Lower the spin speed
        }
        //If the first spin is complete and second spin haven't been reached
        //And the current angle has now reached the target
        else if (firstSpin && !secondSpin && currentAngle === targetAngle) {
            secondSpin = true; //Second spin completed
            targetAngle -= extraSpin / 2; //Decrease the target angle by the extra spin amount
            spinSpeed = spinSpeed / 2; //Lower the spin speed
            targetAngle = finalTargetAngle; //Set the target angle to the final angle
        }
        //If target angle has not been reached, call for the canvas animation frame
        if (currentAngle !== targetAngle) {
            requestAnimationFrame(drawAnimationsEtc);
        }
        else {
            //When the current angle is the target angle
            //Open the safe at the last open safe index
            openSafe(openSafes[openSafes.length - 1]);
            console.log('openSafe: ' + openSafes[openSafes.length - 1]);
            //Spinning state or ready state?
            //If the number of open safes matches the number Of Safes To Open
            if (openSafes.length == numberOfSafesToOpen) {
                //Set the state to setup
                //currentState = 'setup';

                for (var i = 0; i < openSafes.length; i++) {
                    console.log("i " + i);

                    for (var j = i + 1; j < openSafes.length; j++) {
                        console.log("j " + j);

                        if (numberOfMatchingSafes < numberOfSafesToOpen && smallSafeArray[openSafes[i]].prizeValue == smallSafeArray[openSafes[j]].prizeValue) {
                            console.log("Comparing: openSafe " + i + " with prize value: " + smallSafeArray[openSafes[i]].prizeValue + " to " + "openSafe " + j + " with prize value: " + smallSafeArray[openSafes[j]].prizeValue);
                            numberOfMatchingSafes++;
                            console.log("Matching Prizes Found: " + numberOfMatchingSafes);
						}
					}
                }

                if (numberOfMatchingSafes >= 3) {
                    currentState = 'awarding';
                } else {
                    currentState = 'setup';
                }

                //
                checkReset();
            }
            else {
                //Wait some seconds before checking reset
                setTimeout(() => {
                    currentState = 'ready';
                    checkReset();
                }, timeToWaitBeforeReset);
            }
        }
    }
}
let TO_RADIANS = Math.PI / 180;
function drawRotatedImage(image, x, y, angle) {
    // save the current co-ordinate system 
    // before we screw with it
    ctx.save();
    // move to the middle of where we want to draw our image
    ctx.translate(x, y);
    // rotate around that point, converting angle from degrees to radians 
    ctx.rotate((Math.PI / 180) * angle);
    // draw it up and to the left by half the width
    // and height of the image 
    // ctx.drawImage(image, -(image.width/2), -(image.height/2));
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    // and restore the co-ords to how they were
    ctx.restore();
}
function drawAnimationsEtc() {
    //If the state is spinning, calculate angle and draw the rotated dial
    if (currentState == 'spinning') {
        drawRotatedImage(safeDialClear, 592 + (safeDialClear.width / 2), 308 + (safeDialClear.height / 2), currentAngle);
        //Call spin the dial
        spinTheDial();
    }
    if (currentState == 'awarding') {
        //Display some animations to award prize
    }
}
window.addEventListener('mousedown', function (event) {
    //console.log(event);//See the values in the event
    let rect = canvas.getBoundingClientRect();
    scale.x = canvas.width / rect.width; // relationship bitmap vs. element for X
    scale.y = canvas.height / rect.height; // relationship bitmap vs. element for Y
    clickLoc.x = (event.clientX - rect.left) * scale.x; // scale mouse coordinates after they have
    clickLoc.y = (event.clientY - rect.top) * scale.y; // been adjusted to be relative to element
    //If the click location is inside the spin button bounds
    if (clickLoc.x > spinBtnObj.x && clickLoc.x < spinBtnObj.x + spinButton.width) {
        if (clickLoc.y > spinBtnObj.y && clickLoc.y < spinBtnObj.y + spinButton.height) {
            //Spin button clicked
            console.log('spinBtnObj');
            //If the current state is 'ready'
            if (currentState == 'ready') {
                //Get a new random angle to spin to
                let spinToAngle = randomSafes[openSafes.length] * 40;
                console.log("spinToAngle: " + spinToAngle);
                //Add the new safe to open safes array
                openSafes.push(getSafeNumber(randomSafes[openSafes.length]));
                //Call the rotate dial function with the new angle
                rotateDial(spinToAngle);
            }
        }
    }
});
function rotateDial(target) {
    spinSpeed = 4;
    targetAngle = target;
    finalTargetAngle = target;
    firstSpin = false;
    secondSpin = false;
    //console.log("targetAngle: " + targetAngle);
    spinTheDial();
}
function preSelcetSafes() {
    randomSafes = []; //Reset the array
    openSafes = []; //Reset the array
    for (let i = 0; i < numberOfSafesToOpen; i++) {
        //This value is random, 
        let x = Math.floor(Math.random() * 9) + 1;
        let anyDuplicate = false;

        //Check if random safe already selected
        for (let j = 0; j < i; j++) {
            if (randomSafes[j] == x) {
                anyDuplicate = true;
            }
        }
        if (!anyDuplicate) {
            randomSafes.push(x);
            //console.log("added");
        }
        else {
            //if duplicate is found, re choose the random value at the current i index 
            i -= 1;
            console.log("Duplicate");
        }
    }
    console.log("Random numbers: " + randomSafes);
}
function preSelcetPrizes() {
    prizes = []; //Reset the array
    multipliers = []; //Reset the array

    //For each chosen safe prize,
    for (let i = 0; i < 9; i++) {
        //Choose a random prize from the weights
        let x = prizeWeights[Math.floor(Math.random() * 10)];
        //Choose a random multiplier amount
        let y = Math.floor(Math.random() * 11 + 10);
        //Add prize to the prizes array
        prizes.push(x);

        //Add multipliers to the multipliers array
        multipliers.push(y);
        //Assign multiplier to safe
        smallSafeArray[i].multiplier = y;
        //Assign prize to safe, depending on the value
        switch (x) {
            case '1':
                smallSafeArray[i].prize = coinsImage;
                smallSafeArray[i].prize = coinsImage;
                break;
            case '2':
                smallSafeArray[i].prize = goldImage;
                break;
            case '3':
                smallSafeArray[i].prize = diamondsImage;
                break;
            case 'A':
                smallSafeArray[i].prize = notesImage;
                break;
            case 'B':
                smallSafeArray[i].prize = ringImage;
                break;
        }
    }
    console.log("Random Prizes: " + prizes);
    console.log("Random multipliers: " + multipliers);

    for (var i = 0; i < smallSafeArray.length; i++) {
        smallSafeArray[i].prizeValue = prizes[i];
    }
}
function getSafeNumber(number) {
    //Because the 0 position of the dial is number 2,
    //I am using the below offsets, to convert from the random number.
    let randomSafeNumber = 11; //
    switch (number) {
        case 1:
            randomSafeNumber = 1;
            break;
        case 2:
            randomSafeNumber = 9;
            break;
        case 3:
            randomSafeNumber = 8;
            break;
        case 4:
            randomSafeNumber = 7;
            break;
        case 5:
            randomSafeNumber = 6;
            break;
        case 6:
            randomSafeNumber = 5;
            break;
        case 7:
            randomSafeNumber = 4;
            break;
        case 8:
            randomSafeNumber = 3;
            break;
        case 9:
            randomSafeNumber = 2;
            break;
        default:
            console.log("NgetSafeNumber error: randomSafeNumber out of range");
    }
    console.log("Next Dial: " + randomSafeNumber);
    return randomSafeNumber;
}
