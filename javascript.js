var canvas = document.getElementById("background");
var ctx = canvas.getContext("2d");

var currentState = "setup"; //setup, ready, spinning, awarding,

var smallSafeArray = [];

var firstSpin, secondSpin = false;

var openSafes = [];
var randomSafes = [];
var randomSafeNumber = 0;

var clickLoc = {
	x: undefined,
	y: undefined
}
var scale = {
	x: undefined,
	y: undefined
}

var currentAngle = 720;
var extraSpin = 160;
var spinSpeed = 4;

var targetAngle = 0;

var finishedSpinning = false;

var bigWinAchieved = false;

var bigBG = new Image();
var smallSafe = new Image();
var smallSafeOpen = new Image();
var smallSafeBG = new Image();

var safeDialSupport = new Image();
var safeDialClear = new Image();
var safeDialRed= new Image();
var safeDialGreen = new Image();

var coinsImage = new Image();
var diamondsImage = new Image();
var goldImage = new Image();
var notesImage = new Image();
var ringImage = new Image();

var spinButton = new Image();

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


var imagesArray = [
	bigBG,	smallSafe,	smallSafeOpen,	smallSafeBG,	
	safeDialSupport,	safeDialClear,	safeDialRed,
	safeDialGreen,	spinButton ,coinsImage, diamondsImage, 
	goldImage, notesImage, ringImage
];

var imageCount = imagesArray.length;
var imagesLoaded = 0;

for(var i=0; i<imageCount; i++){
    imagesArray[i].onload = function(){
        imagesLoaded++;
        if(imagesLoaded == imageCount){
            allLoaded();
            console.log("Loaded");
        }
    }
}

function allLoaded(){
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

function drawBG(){
  	ctx.drawImage(bigBG, 0, 0);
}

//Small safe object
function SmallSafeObj(arrPos, image, safeDoor, safeInternal,  prize, x, y, revealed) {
	this.arrPos = arrPos;

	this.image = image;
	this.insideImg = safeDoor;
	this.safeInternal = safeInternal;
	this.prize = prize;

	this.x = x;
	this.y = y;
	
	this.revealed = revealed;

	var animTime = 0;
	var scaleFactor = 0.1;
	var scaleW = 200 * scaleFactor;
	var scaleH = 164 * scaleFactor;
	this.draw = function(){
  		ctx.drawImage(image, x, y);
	}

	this.revealInside = function(){
		this.revealed = true;
  		ctx.drawImage(safeDoor, x - 40, y - 26);
  		ctx.drawImage(safeInternal, x + 25, y + 17, 112, 103);
  		
  		ctx.drawImage(this.prize,0,0, this.prize.width/2, this.prize.height, x - 30, y - 17,this.prize.width/2, this.prize.height);
  		
  		animTime = 0;

	}

}
function SpinButtonObj(image, x, y, width, height, hide) {
	this.image = image;

	this.x = x;
	this.y = y;
	
	this.width = width;
	this.height = height;
	this.hide = hide;

	this.draw = function(){
		if (!this.hide) {
	  		ctx.drawImage(this.image, x, y);
		}
	}
}

function SetUpSafeDoors(){
	smallSafeArray = []
	var x = 0;
	var y = 40;
	var safeCount = 0;
	for (var i = 0; i < 3; i++) {
		x = 50;
		y += 140;
		for (var j = 0; j < 3; j++) {
			smallSafeArray.push(new SmallSafeObj(safeCount, smallSafe, smallSafeOpen, smallSafeBG, 0, x, y, false));
			smallSafeArray[safeCount].draw();
			writeToTextSafe(safeCount + 1, x + smallSafe.width/2, y + smallSafe.height/2);
			x += 175;
			safeCount += 1;
		}
	}
}

function writeToTextSafe(value, xPos, yPos){
	ctx.font = '54px TitanOne';
	ctx.fillStyle = 'white';
	ctx.textBaseline = 'middle';
	ctx.textAlign = "center";
	ctx.fillText  (value, xPos+8, yPos+6);
}

function openSafe(safeNumber){
	smallSafeArray[safeNumber-1].revealInside();
}
//Move dials canvas to dials location

function setUpDialSupport(){
	ctx.drawImage(safeDialSupport, 580, 222);
}
var safeDialX = 590;
var safeDialY = 260;

var safeDialSize = 275;

//Small safe object
function DialObj(image, x, y, active) {
	this.image = image;

	this.x = x;
	this.y = y;
	
	this.active = active;

	this.draw = function(){
  		ctx.drawImage(image, x, y);
	}

}

function setUpDial(dialIndex){
  	ctx.drawImage(safeDialClear, 592, 258);
}

function setUpSpinButton(){
	spinBtnObj = new SpinButtonObj(spinButton, 692, 358, spinButton.width, spinButton.height, false)
  	spinBtnObj.draw();
}

function rotateDial(target){

	spinSpeed = 4;

	targetAngle = target;
	finalTargetAngle = target;

	firstSpin = false;
	secondSpin = false;

    //console.log("targetAngle: " + targetAngle);

	spinAnim();
}
function checkReset(){

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

function spinAnim(){
		currentState = 'spinning';

		drawRotatedImage(safeDialClear, 592 + (safeDialClear.width/2), 
			258 + (safeDialClear.height/2), currentAngle);

	if (currentAngle < targetAngle) {
    	currentAngle += spinSpeed;
	} else if (currentAngle > targetAngle) {
    	currentAngle -= spinSpeed;
	}


	if (!firstSpin && !secondSpin && currentAngle === targetAngle) {

		firstSpin = true;
		targetAngle -= extraSpin;
	    spinSpeed = spinSpeed/2;
	} else if (firstSpin && !secondSpin && currentAngle === targetAngle ) {

		secondSpin = true;
		targetAngle += extraSpin/2;
	    spinSpeed = spinSpeed/2;
	    targetAngle = finalTargetAngle;
	}

    if (currentAngle !== targetAngle) {
     	requestAnimationFrame(spinAnim);
    } else {

		openSafe(openSafes[openSafes.length -1]);

		//Spinning state or ready state?
		if (openSafes.length == 3) {
			currentState = 'setup';
			checkReset();
		} else {
		setTimeout(() => {  
			console.log(" full reset time: ");
			currentState = 'ready';
			checkReset();
		}, 1000);

		}

    }
}

var TO_RADIANS = Math.PI / 180; 
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
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}

function spinRandomly(){
	var newTarget = Math.random() * 360 + 1;;
	console.log('newTarget');

}

window.addEventListener('mousedown', 
	function(event) {//anonymous fucntion with even argument
		//console.log(event);//See the values in the event
        var rect = canvas.getBoundingClientRect();
        scale.x = canvas.width / rect.width;    // relationship bitmap vs. element for X
        scale.y = canvas.height / rect.height;  // relationship bitmap vs. element for Y


	    clickLoc.x = (event.clientX - rect.left) * scale.x;   // scale mouse coordinates after they have
	    clickLoc.y = (event.clientY - rect.top) * scale.y;    // been adjusted to be relative to element
		
		if (clickLoc.x > spinBtnObj.x && clickLoc.x < spinBtnObj.x + spinButton.width) {
			if (clickLoc.y > spinBtnObj.y && clickLoc.y < spinBtnObj.y + spinButton.height){
				console.log('spinBtnObj');

				if (currentState == 'ready') {

					var spinToAngle = randomSafes[openSafes.length] * 40;
					console.log("spinToAngle: " + spinToAngle);
					openSafes.push(getSafeNumber(randomSafes[openSafes.length]));
					rotateDial(spinToAngle);
				}
			}
		}
	});

function preSelcetSafes(){
	randomSafes =[];
	openSafes =[];
	for (var i = 0; i < 3; i++) {
		//This value is random, 
		var x = Math.floor(Math.random() * 9) + 1;
			
			var n = randomSafes.includes(x);
			//console.log("n: " + n);

			if (!n) {
				randomSafes.push(x);
				//console.log("added");
			} else {
				i -= 1;
				//console.log("Dupe");
			}
		}
		console.log("Random numbers: " + randomSafes);

}

var prizes = [];
function preSelcetPrizes(){
	prizes = [];
	// var prizeWeights = '11122233AB';
	var prizeWeights = '112233AABB';
	for (var i = 0; i < 9; i++) {
    var x = prizeWeights[Math.floor(Math.random() * 10)];
		prizes.push(x);

		switch(x) {

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

function getSafeNumber(number){
	//Because the 0 position of the dial is number 2,
	//I am using the below offsets, to convert from the random number.
	
	switch(number) {
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

































