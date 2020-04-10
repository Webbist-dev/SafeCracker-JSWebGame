const canvas = document.getElementById('background');
let ctx = canvas.getContext("2d");
const ttcanvas = document.getElementById('topText');
let ttctx = ttcanvas.getContext("2d");
let currentState = "setup"; //setup, ready, spinning, awarding, tallying
let currentTopText = "PRESS SPIN TO PLAY!";
let numberOfSafesToOpen = 4;
let smallSafeArray = [];
let spinBtnObj;
let screenSafeObj;
let firstSpin, secondSpin = false;
let safeScreenNumbers = ["-", "-", "-", "-"];
let openSafes = [];
let randomSafes = [];
let randomSafeNumber = 0;
let clickLoc = {
    x: undefined,
    y: undefined
};
let scale = {
    x: undefined,
    y: undefined
};
let currentAngle = 720;
let finalTargetAngle = 0;
let extraSpin = 160;
let spinSpeed = 5;
let targetAngle = 0;
let finishedSpinning = false;
let bigWinAchieved = false;
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
let imagesArray = [
    bigBG, smallSafe, smallSafeOpen, smallSafeBG,
    safeDialSupport, safeDialClear, safeDialRed,
    safeDialGreen, spinButton, screenSafeBG,
    screenSafeRed, screenSafeGreen, coinsImage,
    diamondsImage, goldImage, notesImage, ringImage
];
let imageCount = imagesArray.length;
let imagesLoaded = 0;
for (let i = 0; i < imageCount; i++) {
    imagesArray[i].onload = function () {
        imagesLoaded++;
        if (imagesLoaded == imageCount) {
            allLoaded();
            console.log("Loaded");
        }
    };
}
function allLoaded() {
    //drawImages();
    canvas.width = bigBG.width;
    canvas.height = bigBG.height;
    console.log("w: " + canvas.width);
    ttcanvas.width = bigBG.width;
    ttcanvas.height = bigBG.height;
    console.log("ttw: " + ttcanvas.width);
    drawBG();
    SetUpSafeDoors();
    setUpDialSupport();
    setUpDial();
    setUpSpinButton();
    setupSafeScreen();
    writeToSafeScreen();
    preSelcetSafes();
    preSelcetPrizes();
    currentState = 'ready';
    console.log('BSBSBSBSBSBS');
    wrapText(currentTopText, ttcanvas.width / 2, ttcanvas.height / 10, ttcanvas.width + 200);
}
function drawBG() {
    ctx.drawImage(bigBG, 0, 0);
}
//Small safe object
function SmallSafeObj(arrPos, image, safeDoor, safeInternal, prize, multiplier, x, y, revealed) {
    this.arrPos = arrPos;
    this.img = image;
    this.insideImg = safeDoor;
    this.safeInternal = safeInternal;
    this.prize = prize;
    this.x = x;
    this.y = y;
    this.revealed = revealed;
    let animTime = 0;
    let scaleFactor = 0.1;
    let scaleW = 200 * scaleFactor;
    let scaleH = 164 * scaleFactor;
    this.draw = function () {
        ctx.drawImage(this.img, x, y);
    };
    this.revealInside = function () {
        this.revealed = true;
        ctx.drawImage(safeDoor, x - 40, y - 26);
        ctx.drawImage(safeInternal, x + 25, y + 17, 112, 103);
        ctx.drawImage(this.prize, 0, 0, this.prize.width / 2, this.prize.height, x - 30, y - 17, this.prize.width / 2, this.prize.height);
        writeToTextSafe("multiplier", "X" + this.multiplier, x + smallSafe.width / 2 - 10, y + smallSafe.height / 2 + 25);
        animTime = 0;
    };
}
function SpinButtonObj(image, x, y, width, height, hide) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.hide = hide;
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
function SetUpSafeDoors() {
    smallSafeArray = [];
    let x = 0;
    let y = 40;
    let safeCount = 0;
    for (let i = 0; i < 3; i++) {
        x = 50;
        y += 140;
        for (let j = 0; j < 3; j++) {
            smallSafeArray.push(new SmallSafeObj(safeCount, smallSafe, smallSafeOpen, smallSafeBG, 0, 0, x, y, false));
            smallSafeArray[safeCount].draw();
            writeToTextSafe("door", safeCount + 1, x + smallSafe.width / 2, y + smallSafe.height / 2);
            x += 175;
            safeCount += 1;
        }
    }
}
function writeToTextSafe(type, value, xPos, yPos) {
    switch (type) {
        case "door":
            ctx.font = '54px TitanOne';
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = "center";
            ctx.fillText(value, xPos + 8, yPos + 6);
            break;
        case "multiplier":
            ctx.font = '60px TitanOne';
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
function wrapText(text, x, y, maxWidth) {
    ttctx.clearRect(0, 0, canvas.width, canvas.height);
    var words = text.split(' ');
    var line = '';
    var lineHeight = 54; // a good approx for 10-18px sizes
    ttctx.font = '54px Dimbo';
    ttctx.textBaseline = 'middle';
    ttctx.fillStyle = 'black';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth) {
            //x = testWidth/2;
            ttctx.fillText(line, x, y);
            if (n < words.length - 1) {
                line = words[n] + ' ';
                y += lineHeight;
            }
            console.log("CUNT 1: " + canvas.width / 2);
            //ttctx.fillText(line, x, y);
        }
        else {
            //x = testWidth/2;
            console.log("CUNT 2: " + canvas.width / 2);
            line = testLine;
        }
    }
    ttctx.fillText(line, x, y);
    writeToSafeScreen();
}
function writeToSafeScreen() {
    ttctx.font = '54px TitanOne';
    ttctx.fillStyle = 'white';
    ttctx.textBaseline = 'middle';
    ttctx.textAlign = "center";
    for (let i = 0; i < safeScreenNumbers.length; i++) {
        ttctx.fillText(safeScreenNumbers[i], 640 + (i * 60), 224);
    }
}
function openSafe(safeNumber) {
    smallSafeArray[safeNumber - 1].revealInside();
    //writeToTextBanner("SAFE " + safeNumber, "", canvas.width/2, canvas.height/10);
    safeScreenNumbers[openSafes.length - 1] = "" + safeNumber;
    currentTopText = "SAFE " + safeNumber;
    wrapText(currentTopText, ttcanvas.width / 2, ttcanvas.height / 10, ttcanvas.width + 200);
    //writeToSafeScreen();
}
//Move dials canvas to dials location
function setupSafeScreen() {
    safeScreenNumbers = ["-", "-", "-", "-"];
    screenSafeObj = new ScreenSafeObj(screenSafeBG, screenSafeRed, screenSafeGreen, 600, 178, screenSafeBG.width, screenSafeBG.height);
    screenSafeObj.drawBG();
    screenSafeObj.drawRed();
    //screenSafeObj.drawGreen();
}
function setUpDialSupport() {
    ctx.drawImage(safeDialSupport, 580, 272);
}
let safeDialX = 590;
let safeDialY = 3100;
let safeDialSize = 275;
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
function rotateDial(target) {
    spinSpeed = 4;
    targetAngle = target;
    finalTargetAngle = target;
    firstSpin = false;
    secondSpin = false;
    //console.log("targetAngle: " + targetAngle);
    spinTheDial();
}
function checkReset() {
    if (currentState == "setup") {
        preSelcetSafes();
        preSelcetPrizes();
        setTimeout(() => {
            console.log(" full reset time: ");
            allLoaded();
        }, 2000);
    }
    if (currentState == 'ready') {
        setUpSpinButton();
    }
    if (currentState == 'spinning') {
    }
    if (currentState == 'awarding') {
    }
}
function spinTheDial() {
    //currentState = 'spinning';
    //console.log('call spinning');
    if (currentState == 'ready') {
        currentState = 'spinning';
        currentTopText = 'SPINNING';
        wrapText(currentTopText, ttcanvas.width / 2, ttcanvas.height / 10, ttcanvas.width + 200);
    }
    if (currentAngle < targetAngle) {
        currentAngle += spinSpeed;
    }
    else if (currentAngle > targetAngle) {
        currentAngle -= spinSpeed;
    }
    if (!firstSpin && !secondSpin && currentAngle === targetAngle) {
        firstSpin = true;
        targetAngle += extraSpin;
        spinSpeed = spinSpeed / 2;
    }
    else if (firstSpin && !secondSpin && currentAngle === targetAngle) {
        secondSpin = true;
        targetAngle -= extraSpin / 2;
        spinSpeed = spinSpeed / 2;
        targetAngle = finalTargetAngle;
    }
    if (currentAngle !== targetAngle) {
        // requestAnimationFrame(spinTheDial);
        requestAnimationFrame(drawAnimationsEtc);
    }
    else {
        openSafe(openSafes[openSafes.length - 1]);
        console.log('openSafes[openSafes.length -1]: ' + openSafes[openSafes.length - 1]);
        //Spinning state or ready state?
        if (openSafes.length == numberOfSafesToOpen) {
            currentState = 'setup';
            checkReset();
        }
        else {
            setTimeout(() => {
                console.log(" full reset time: ");
                currentState = 'ready';
                checkReset();
            }, 1000);
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
    // rotate around that point, converting our 
    // angle from degrees to radians 
    ctx.rotate((Math.PI / 180) * angle);
    // draw it up and to the left by half the width
    // and height of the image 
    // ctx.drawImage(image, -(image.width/2), -(image.height/2));
    ctx.drawImage(image, -(image.width / 2), -(image.height / 2));
    // and restore the co-ords to how they were when we began
    ctx.restore();
}
function spinRandomly() {
    let newTarget = Math.random() * 360 + 1;
    ;
    console.log('newTarget');
}
function drawAnimationsEtc() {
    if (currentState == 'spinning') {
        drawRotatedImage(safeDialClear, 592 + (safeDialClear.width / 2), 308 + (safeDialClear.height / 2), currentAngle);
        //console.log('draw spinning');
        spinTheDial();
    }
    if (currentState == 'awarding') {
    }
}
window.addEventListener('mousedown', function (event) {
    //console.log(event);//See the values in the event
    let rect = canvas.getBoundingClientRect();
    scale.x = canvas.width / rect.width; // relationship bitmap vs. element for X
    scale.y = canvas.height / rect.height; // relationship bitmap vs. element for Y
    clickLoc.x = (event.clientX - rect.left) * scale.x; // scale mouse coordinates after they have
    clickLoc.y = (event.clientY - rect.top) * scale.y; // been adjusted to be relative to element
    if (clickLoc.x > spinBtnObj.x && clickLoc.x < spinBtnObj.x + spinButton.width) {
        if (clickLoc.y > spinBtnObj.y && clickLoc.y < spinBtnObj.y + spinButton.height) {
            console.log('spinBtnObj');
            if (currentState == 'ready') {
                let spinToAngle = randomSafes[openSafes.length] * 40;
                console.log("spinToAngle: " + spinToAngle);
                openSafes.push(getSafeNumber(randomSafes[openSafes.length]));
                rotateDial(spinToAngle);
            }
        }
    }
});
function preSelcetSafes() {
    randomSafes = [];
    openSafes = [];
    for (let i = 0; i < numberOfSafesToOpen; i++) {
        //This value is random, 
        let x = Math.floor(Math.random() * 9) + 1;
        let anyDuplicate = false;
        //Was the intended method, however typescript won't compile with it
        //I edited the tsconfig to include es7 but it still didn't work
        //let anyDuplicates = randomSafes.includes(x);
        //console.log("n: " + n);
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
            i -= 1;
            console.log("Duplicate");
        }
    }
    console.log("Random numbers: " + randomSafes);
}
let prizes = [];
let multipliers = [];
function preSelcetPrizes() {
    prizes = [];
    multipliers = [];
    // let prizeWeights = '11122233AB';
    let prizeWeights = '112233AABB';
    for (let i = 0; i < 9; i++) {
        let x = prizeWeights[Math.floor(Math.random() * 10)];
        let y = Math.floor(Math.random() * 11 + 10);
        prizes.push(x);
        multipliers.push(y);
        smallSafeArray[i].multiplier = y;
        switch (x) {
            case '1':
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
}
function getSafeNumber(number) {
    //Because the 0 position of the dial is number 2,
    //I am using the below offsets, to convert from the random number.
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
    }
    console.log("Next Dial: " + randomSafeNumber);
    return randomSafeNumber;
}
//# sourceMappingURL=javascript.js.map