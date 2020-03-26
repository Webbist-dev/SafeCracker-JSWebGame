var canvas = document.getElementById("background");
var ctx = canvas.getContext("2d");


var bigBG = new Image();
var smallSafe = new Image();
var smallSafeOpen = new Image();
var smallSafeBG = new Image();

var safeDialSupport = new Image();
var safeDialClear = new Image();
var safeDialRed= new Image();
var safeDialGreen = new Image();


bigBG.src = "res/background_safe_minigame.png";
smallSafe.src = "res/safe_minigame.png";
smallSafeOpen.src = "res/safe_open_minigame.png";
smallSafeBG.src = "res/screen_safe_background.png";

safeDialSupport.src = "res/support_safe_dial_minigame.png";

bigBG.onload = () => {
	//Resize canvas to fit background image
	canvas.width = bigBG.width;
	canvas.height = bigBG.height;	
  	
  	ctx.drawImage(bigBG, 0, 0);
}

smallSafe.onload = () => {
	SetUpSafeDoors();
}

smallSafeOpen.onload = () => {
	//OpenSafeDoor(1);
	//Doesn't need to be used ASAP after loading
}

safeDialSupport.onload = () => {
	setUpDialSupport();
	//Load these after the support image
	safeDialClear.src = "res/safe_dial_clear.png";
	safeDialRed.src = "res/safe_dial_red.png";
	safeDialGreen.src = "res/safe_dial_green.png";

		safeDialClear.onload = () => {
		setUpDial(0);
	}
}

//Small safe object
function SmallSafeObj(image, safeDoor, safeInternal,  prize, x, y, revealed) {
	this.image = image;
	this.insideImg = safeDoor;
	this.safeInternal = safeInternal;
	this.prize = prize;

	this.x = x;
	this.y = y;
	
	this.revealed = revealed;

	this.draw = function(){
  		ctx.drawImage(image, x, y);
	}

	this.revealInside = function(){
  		ctx.drawImage(safeDoor, x - 40, y - 26);
  		ctx.drawImage(safeInternal, x + 25, y + 17, 112, 103);

	}
}

var smallSafeArray = [];

function SetUpSafeDoors(){
	var x = 0;
	var y = 40;
	var safeCount = 0;
	for (var i = 0; i < 3; i++) {
		x = 50;
		y += 140;
		for (var j = 0; j < 3; j++) {
			smallSafeArray.push(new SmallSafeObj(smallSafe, smallSafeOpen, smallSafeBG, 0, x, y, false));
			smallSafeArray[safeCount].draw();
			writeToTextSafe(safeCount + 1, x + smallSafe.width/2, y + smallSafe.height/2);
			x += 175;
			safeCount += 1;
		}
	}
	console.log("safecount: " + safeCount);
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

	this.revealInside = function(){
  		ctx.drawImage(safeDoor, x - 40, y - 26);
  		ctx.drawImage(safeInternal, x + 25, y + 17, 112, 103);

	}
}

function setUpDial(dialIndex){

	var offset = 0;

	switch (dialIndex) {
		case 0:
  			ctx.drawImage(safeDialClear, 592, 258);
		break;
		case 1:
  			ctx.drawImage(safeDialRed, 592, 258);
		break;
		case 2:
  			ctx.drawImage(safeDialGreen, 592, 258);
		break;
	}


	//ctx.drawImage(safeDialsImage,0 + offset, 0, safeDialSize,safeDialSize, safeDialX, safeDialY, safeDialSize, safeDialSize);

	//ctx.drawImage(clearDial,0 + offset, 0);

}

var spinTarget = 2;
var angle = 0;
var spinSpeed = 50;


function rotateDial(amount, target){

	angle = 1;

	spinTarget = target;

	spinLength = 10;

	spinAnim();

}

function spinAnim(){
		drawRotatedImage(safeDialClear, 592 + (safeDialClear.width/2), 
			258 + (safeDialClear.height/2), angle);

    angle += 1;

    if (angle !== spinTarget) {
     	requestAnimationFrame(spinAnim);
    }

    console.log("angle: " + angle);
}

var TO_RADIANS = Math.PI / 180; 
console.log("animate TO_RADIANS: " + TO_RADIANS);

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