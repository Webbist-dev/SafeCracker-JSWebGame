const canvas = document.getElementById('background');
let ctx = canvas.getContext("2d");
let currentState = "setup"; //setup, ready, spinning, awarding, tallying
let smallSafeArray = [];
let spinBtnObj;
let firstSpin, secondSpin = false;
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
let spinSpeed = 4;
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
let coinsImage = new Image();
let diamondsImage = new Image();
let goldImage = new Image();
let notesImage = new Image();
let ringImage = new Image();
let spinButton = new Image();
bigBG.src = "res/background_safe_minigame.png";
smallSafe.src = "res/safe_minigame.png";
smallSafeOpen.src = "res/safe_open_minigame.png";
smallSafeBG.src = "res/screen_safe_background.png";
safeDialSupport.src = "res/support_safe_dial_minigame.png";
safeDialClear.src = "res/safe_dial_clear.png";
safeDialRed.src = "res/safe_dial_red.png";
safeDialGreen.src = "res/safe_dial_green.png";
spinButton.src = "res/text_spin_safe_dial_minigame.png";
coinsImage.src = "res/coins.png";
goldImage.src = "res/gold.png";
diamondsImage.src = "res/diamond.png";
notesImage.src = "res/notes.png";
ringImage.src = "res/ring.png";
let imagesArray = [
    bigBG, smallSafe, smallSafeOpen, smallSafeBG,
    safeDialSupport, safeDialClear, safeDialRed,
    safeDialGreen, spinButton, coinsImage, diamondsImage,
    goldImage, notesImage, ringImage
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
    drawBG();
    SetUpSafeDoors();
    setUpDialSupport();
    setUpDial();
    setUpSpinButton();
    preSelcetSafes();
    preSelcetPrizes();
    currentState = 'ready';
}
function drawBG() {
    ctx.drawImage(bigBG, 0, 0);
}
//Small safe object
function SmallSafeObj(arrPos, image, safeDoor, safeInternal, prize, x, y, revealed) {
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
function SetUpSafeDoors() {
    smallSafeArray = [];
    let x = 0;
    let y = 40;
    let safeCount = 0;
    for (let i = 0; i < 3; i++) {
        x = 50;
        y += 140;
        for (let j = 0; j < 3; j++) {
            smallSafeArray.push(new SmallSafeObj(safeCount, smallSafe, smallSafeOpen, smallSafeBG, 0, x, y, false));
            smallSafeArray[safeCount].draw();
            writeToTextSafe(safeCount + 1, x + smallSafe.width / 2, y + smallSafe.height / 2);
            x += 175;
            safeCount += 1;
        }
    }
}
function writeToTextSafe(value, xPos, yPos) {
    ctx.font = '54px TitanOne';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(value, xPos + 8, yPos + 6);
}
function openSafe(safeNumber) {
    smallSafeArray[safeNumber - 1].revealInside();
    console.log('smallSafeArray[safeNumber-1]: ' + smallSafeArray[safeNumber - 1]);
}
//Move dials canvas to dials location
function setUpDialSupport() {
    ctx.drawImage(safeDialSupport, 580, 222);
}
let safeDialX = 590;
let safeDialY = 260;
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
    ctx.drawImage(safeDialClear, 592, 258);
}
function setUpSpinButton() {
    spinBtnObj = new SpinButtonObj(spinButton, 692, 358, spinButton.width, spinButton.height, false);
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
    }
    if (currentAngle < targetAngle) {
        currentAngle += spinSpeed;
    }
    else if (currentAngle > targetAngle) {
        currentAngle -= spinSpeed;
    }
    if (!firstSpin && !secondSpin && currentAngle === targetAngle) {
        firstSpin = true;
        targetAngle -= extraSpin;
        spinSpeed = spinSpeed / 2;
    }
    else if (firstSpin && !secondSpin && currentAngle === targetAngle) {
        secondSpin = true;
        targetAngle += extraSpin / 2;
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
        if (openSafes.length == 3) {
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
        drawRotatedImage(safeDialClear, 592 + (safeDialClear.width / 2), 258 + (safeDialClear.height / 2), currentAngle);
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
    for (let i = 0; i < 3; i++) {
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
function preSelcetPrizes() {
    prizes = [];
    // let prizeWeights = '11122233AB';
    let prizeWeights = '112233AABB';
    for (let i = 0; i < 9; i++) {
        let x = prizeWeights[Math.floor(Math.random() * 10)];
        prizes.push(x);
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