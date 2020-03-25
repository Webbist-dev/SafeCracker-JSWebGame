var canvas = document.getElementById("background");
var ctx = canvas.getContext("2d");


var bigBG = new Image();
var smallSafe = new Image();
var smallSafeOpen = new Image();
var smallSafeBG = new Image();

var safeDialSupport = new Image();
var safeDialsImage = new Image();

var safeDialClear = new Image();
var safeDialLose = new Image();
var safeDialWin = new Image();


bigBG.src = "res/background_safe_minigame.png";
smallSafe.src = "res/safe_minigame.png";
smallSafeOpen.src = "res/safe_open_minigame.png";
smallSafeBG.src = "res/screen_safe_background.png";

safeDialSupport.src = "res/support_safe_dial_minigame.png";
safeDialsImage.src = "res/safe_dial_minigame.png";

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
}
safeDialsImage.onload = () => {
	setUpDial("clear");
}
//Circle object
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

function setUpDialSupport(){
	ctx.drawImage(safeDialSupport, 580, 222);
}
var asda = new Image();
var safeDialX = 590;
var safeDialY = 260;

var safeDialSize = 275;

function setUpDial(dialIndex){

	var offset = 0;
	switch (dialIndex) {
		case "clear":
			offset = 0;
		break;
		case "lose":
			offset = safeDialSize * 1;
		break;
		case "win":
			offset = safeDialSize * 2;
		break;
	}
	
	ctx.drawImage(safeDialsImage,0 + offset, 0, safeDialSize,safeDialSize, safeDialX, safeDialY, safeDialSize, safeDialSize);
}
	var spinTime = 10;

function rotateDial(){

	drawRotatedImage(safeDialsImage, safeDialX, safeDialY, spinTime);

	spinTime += 10;

	console.log("animate frame: " + spinTime);

	requestAnimationFrame(rotateDial);


}

var TO_RADIANS = Math.PI/180; 
function drawRotatedImage(image, x, y, angle) { 
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
 
	// move to the middle of where we want to draw our image
	ctx.translate(x, y);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}