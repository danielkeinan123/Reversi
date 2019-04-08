

let gameTable = document.querySelector(".gameTable");
let newGame = document.querySelector("#new");
let forfit = document.querySelector("#forfit");

let gameStarted = false;

const TABLE_SIZE = 10;
let blackTurn = true;
let cells = [];
let d = new Date();

let statistics ={
	howManyTurns : 0,
	startTime    : d.getTime(),
	timePassed   : 0,
	avgTimeForPlayerMove : 0,
	numberOfTimesBlackReachedTwoCircles : 0,
	numberOfTimesWhiteReachedTwoCircles : 0,
	whiteScore : 2,
	blackScore : 2
};

const whoWon = {
	NoOne : 0,
	White : 1,
	Black : 2
};

const movesOnTheTable = {
    addToColAndRow:		1,
    subToColAndRow:		2,
    addToColSubToRow:	3,
    subToColAddToRow:	4
};

function min (a,b){
	if(a>b){
		return b;
	}
	else{
		return a;
	}
}
function max(a,b){
	if(a>b){
		return a;
	}
	else{
		return b;
	}
}

for (var i = 0; i < TABLE_SIZE; i++) {
		var row = gameTable.insertRow(i);
		cells[i]= [];
		for (var j = 0; j < TABLE_SIZE; j++) {
			var col = row.insertCell(j);
			col.classList.add("cell");
			col.addEventListener("click", function(){
				clickCell(this);
			});
			cells[i][j] = col;
			initCellDiv(col,i,j);
			
		}
}
setValidCells();
function initCellDiv(cell,i,j){
	var circleDiv = document.createElement("DIV");
	if((i === 4 & j === 4) | (i === 5 & j === 5)){
		circleDiv.classList.add("circle");
		cell.appendChild(circleDiv);
		circleDiv.classList.add("blackCircle");
	}
	else if((i === 5 & j === 4) | (i === 4 & j === 5)){
		circleDiv.classList.add("circle");
		cell.appendChild(circleDiv);
		circleDiv.classList.add("whiteCircle");
	}
}

function nearAFullCell(i,j){
	var ans1 = false;
	if(i === 0 && j === 0){
		ans1 = cells[i][j+1].hasChildNodes() ||
		cells[i+1][j].hasChildNodes() ||  cells[i+1][j+1].hasChildNodes();
	}
	else if(i === 0 && j === 9){
		ans1 =  cells[i][j-1].hasChildNodes() || cells[i+1][j-1].hasChildNodes() ||
		cells[i+1][j].hasChildNodes();
	}
	else if(i === 9 && j === 9){
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
			cells[i][j-1].hasChildNodes();
	}
	else if(i === 9 && j === 0){
		ans1 = cells[i-1][j].hasChildNodes() ||
		cells[i-1][j+1].hasChildNodes() || cells[i][j+1].hasChildNodes();
	}
	else if(i === 0){
		ans1 = cells[i][j-1].hasChildNodes() ||
			 cells[i][j+1].hasChildNodes() ||  cells[i+1][j-1].hasChildNodes() ||
			 cells[i+1][j].hasChildNodes() ||  cells[i+1][j-1].hasChildNodes();
	}
	else if(i === 9){
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
		cells[i-1][j+1].hasChildNodes() ||  cells[i][j-1].hasChildNodes() ||
		cells[i][j+1].hasChildNodes();
	}
	else if (j === 0){
		ans1 = cells[i-1][j].hasChildNodes() ||
			 cells[i-1][j+1].hasChildNodes() ||
			 cells[i][j+1].hasChildNodes() || cells[i+1][j+1].hasChildNodes();
			 cells[i+1][j].hasChildNodes();
	}
	else if(j === 9){
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
			cells[i][j-1].hasChildNodes() ||
			cells[i+1][j-1].hasChildNodes() ||
			cells[i+1][j].hasChildNodes();
	}
	else{
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
			 cells[i-1][j+1].hasChildNodes() ||  cells[i][j-1].hasChildNodes() ||
			 cells[i][j+1].hasChildNodes() ||  cells[i+1][j-1].hasChildNodes() ||
			 cells[i+1][j].hasChildNodes() ||  cells[i+1][j+1].hasChildNodes();
	}

	return ans1;
}

function setValidCells(){
	for(var i = 0; i < TABLE_SIZE; i++) {
		for(var j = 0; j < TABLE_SIZE; j++){
			if(!(cells[i][j].hasChildNodes())){
				if(nearAFullCell(i,j) === true){
					cells[i][j].classList.add("validCell");
					cells[i][j].classList.remove("invalidCell");
				}
				else{
					cells[i][j].classList.add("invalidCell");
					cells[i][j].classList.remove("validCell");
				}
			}
		}	
	}
}


function setCellsToNewColor(cell, newColor, oldColor){
	setToColor = false;
	foundMatch = false;
	rowIndex = cell.parentElement.rowIndex;
	colIndex = cell.cellIndex;
	function bigger(i,to){
		return i > to;
	}
	function smaller(i,to){
		return i < to;
	}
	findCellsToChangeInRow(bigger,TABLE_SIZE-1, colIndex ,false,rowIndex,newColor,oldColor);
	findCellsToChangeInRow(smaller,0, colIndex , true,rowIndex,newColor,oldColor);	
	findCellsToChangeInColum(bigger, TABLE_SIZE-1, rowIndex, false, colIndex, newColor, oldColor);
	findCellsToChangeInColum(smaller, 0, rowIndex, true, colIndex,newColor, oldColor);
	//down vertical
	i = max(0,rowIndex-colIndex);
	j = max(0,colIndex-rowIndex);
	to = colIndex;
	findCellsToChangeInVertical(smaller, j, to, movesOnTheTable.addToColAndRow, i, newColor, oldColor);
	i = min(TABLE_SIZE-1,(rowIndex+((TABLE_SIZE-1)-colIndex)));
	j = min(TABLE_SIZE-1,(colIndex+((TABLE_SIZE-1)-rowIndex)));
	findCellsToChangeInVertical(bigger, j, to, movesOnTheTable.subToColAndRow, i, newColor, oldColor);
	//up verticl
	i = max(0,(rowIndex-((TABLE_SIZE-1)-colIndex)));
	j = min(TABLE_SIZE-1,colIndex+rowIndex);
	findCellsToChangeInVertical(bigger, j, to, movesOnTheTable.subToColAddToRow, i, newColor, oldColor);
	i = min(TABLE_SIZE-1,colIndex+rowIndex);
	j = max(0,(colIndex-((TABLE_SIZE-1)-rowIndex)));
	findCellsToChangeInVertical(smaller, j, to, movesOnTheTable.addToColSubToRow, i, newColor, oldColor);

}


function findCellsToChangeInRow(comper, i,to , add ,rowIndex,newColor,oldColor){
	var foundMatch = false;
	var setToColor = false;
	while(comper(i,to)){
		if(cells[rowIndex][i].hasChildNodes()){
			if (cells[rowIndex][i].childNodes[0].classList.contains(newColor) && !foundMatch){
				setToColor = true;
				foundMatch = true;
			}
			if(setToColor){
				cells[rowIndex][i].childNodes[0].classList.add(newColor);
				cells[rowIndex][i].childNodes[0].classList.remove(oldColor)
			}
		}
		if(add){
			i = i+1;
		}
		else{
			i = i-1;
		}
	}
}

function findCellsToChangeInColum(comper, j,to , add ,colIndex,newColor,oldColor){
	var foundMatch = false;
	var setToColor = false;
	while(comper(j,to)){
		if(cells[j][colIndex].hasChildNodes()){
			if (cells[j][colIndex].childNodes[0].classList.contains(newColor) && !foundMatch){
				setToColor = true;
				foundMatch = true;
			}
			if(setToColor){
				cells[j][colIndex].childNodes[0].classList.add(newColor);
				cells[j][colIndex].childNodes[0].classList.remove(oldColor)
			}
		}
		if(add){
			j = j+1;
		}
		else{
			j = j-1;
		}
	}
}

function findCellsToChangeInVertical(comper, j,to , nextMove ,i,newColor,oldColor){
	var foundMatch = false;
	var setToColor = false;
	//console.log("befor while "+j+" "+to);
	while(comper(j,to)){
		//console.log("in while i="+i+" j="+j+" to="+to);
		if(cells[i][j].hasChildNodes()){
			if (cells[i][j].childNodes[0].classList.contains(newColor) && !foundMatch){
				setToColor = true;
				foundMatch = true;
			}
			if(setToColor){
				cells[i][j].childNodes[0].classList.add(newColor);
				cells[i][j].childNodes[0].classList.remove(oldColor)
			}
		}
		switch (nextMove){
			case 1:
				j = j+1;
				i = i+1;
				break;
			case 2:
				j = j-1;
				i = i-1;
				break;
			case 3:
				j = j+1;
				i = i-1;
				break;
			case 4:
				j = j-1;
				i = i+1;
				break;
		}
	}
}

function clickCell(cell){
	if(cell.classList.contains("validCell")){

		var newDiv = document.createElement("DIV");
		newDiv.classList.add("circle");
		cell.appendChild(newDiv);
		if (blackTurn){
			newDiv.classList.add("blackCircle");
			newColorClass = "blackCircle";
			oldColorClass = "whiteCircle";
		}
		else{
			newDiv.classList.add("whiteCircle");
			newColorClass = "whiteCircle";
			oldColorClass = "blackCircle";
		}
		cell.classList.remove("validCell");
		setValidCells();
		setCellsToNewColor(cell, newColorClass, oldColorClass);
		updateStatistics();
		let winner = isThereAWinner();
		if(winner!== whoWon.NoOne){
			endGame(winner);
		}
		changeTurn()

	}
}

function changeTurn() {
	let playerTurn = document.getElementById("playerTurn");
	if (blackTurn){
		playerTurn.classList.add("whitePlayerTurn");
		playerTurn.classList.remove("blackPlayerTurn");
		document.getElementById("playerTurnText").innerHTML = "white Player Turn";
	}
	else{
		playerTurn.classList.add("blackPlayerTurn");
		playerTurn.classList.remove("whitePlayerTurn");
		document.getElementById("playerTurnText").innerHTML = "black Player Turn";
	}

	blackTurn = !blackTurn;
}


function updateScoresCount() {
	var blackCounter =0, whiteCounter =0;
	for(var i =0; i < TABLE_SIZE; i++) {
		for (var j = 0; j < TABLE_SIZE; j++) {
			if (cells[i][j].hasChildNodes()) {
				if (cells[i][j].childNodes[0].classList.contains("blackCircle")) {

					blackCounter++;
				} else if (cells[i][j].childNodes[0].classList.contains("whiteCircle")) {
					whiteCounter++;
				}
			}
		}
	}

	statistics.whiteScore = whiteCounter;
	statistics.blackScore = blackCounter;

	document.getElementById("blackPlayerScore").innerHTML = "Black Score:" + statistics.blackScore;
	document.getElementById("whitePlayerScore").innerHTML = "White Score:" + statistics.whiteScore;

}
function isThereAWinner() {
	var isFull = (statistics.whiteScore +statistics.blackScore  ===  TABLE_SIZE*TABLE_SIZE);
	var ans;

	if (isFull){
		if (statistics.whiteScore > statistics.blackScore){
			ans=  whoWon.White;
		}
		else{
			ans = whoWon.Black;
		}
	}
	else{
		if (statistics.whiteScore ===0){
			ans= whoWon.Black;
		}
		else if (statistics.blackScore ===0){
			ans =  whoWon.White;
		}
		else{
			ans =  whoWon.NoOne;
		}
	}

	return ans;

}
function endGame(winner) {
	statistics.timePassed = d.getTime() - statistics.startTime;
	statistics.avgTimeForPlayerMove = statistics.timePassed/statistics.howManyTurns;
	if(winner === whoWon.Black)
		window.alert("GAME HAS ENDED, Congratulations Black");
	else
		window.alert("GAME HAS ENDED, Congratulations White");
}

function updatePlayersTwoTimes(){
	if (statistics.whiteScore === 2){
		statistics.numberOfTimesWhiteReachedTwoCircles++;
	}
	if (statistics.blackScore === 2){
		statistics.numberOfTimesBlackReachedTwoCircles++;
	}
}

function updateStatistics(){
	updateScoresCount();
	statistics.howManyTurns ++;
	updatePlayersTwoTimes();
	document.getElementById("numOfTurns").innerHTML = statistics.howManyTurns;
	document.getElementById("timePassed").innerHTML = statistics.timePassed;
	document.getElementById("avgTimeForPlayer").innerHTML = statistics.avgTimeForPlayerMove;
	document.getElementById("numOfBlackWithTwoCircles").innerHTML = statistics.numberOfTimesBlackReachedTwoCircles;
	document.getElementById("numOfWhiteWithTwoCircles").innerHTML = statistics.numberOfTimesWhiteReachedTwoCircles;
}
function createNewGame(){
	var cellChild;
	statistics.howManyTurns = 0;
	for (var i = 0; i < TABLE_SIZE ; i++) {
		for(var j = 0; j < TABLE_SIZE; j++){
			cells[i][j].classList.remove("validCell");
			cells[i][j].classList.remove("invalidCell");
			if(cells[i][j].hasChildNodes()){
				cellChild = cells[i][j].childNodes[0];
				cells[i][j].removeChild(cellChild);
			}
			initCellDiv(cells[i][j],i,j);
		}
	}
	setValidCells();

	gameStarted = true;
}

function surrender(){
	if(gameStarted){
		if(blackTurn){
			endGame(whoWon.White);
		}
		else {
			endGame(whoWon.Black)
		}
	}
}

newGame.addEventListener("click",function(){
	createNewGame();
});

forfit.addEventListener("click",function () {
	surrender();
});

