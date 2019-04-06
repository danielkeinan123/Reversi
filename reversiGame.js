

var gameTable = document.querySelector(".gameTable");
var newGame = document.querySelector("#new");
const TABLE_SIZE = 10;
var blackTurn = true;
var cells = [];

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
	if((i == 4 & j == 4) | (i == 5 & j == 5)){
		circleDiv.classList.add("circle");
		cell.appendChild(circleDiv);
		circleDiv.classList.add("blackCircle");
	}
	else if((i == 5 & j == 4) | (i == 4 & j == 5)){
		circleDiv.classList.add("circle");
		cell.appendChild(circleDiv);
		circleDiv.classList.add("whiteCircle");
	}
}

function nearAFullCell(i,j){
	var ans1 = false;
	if(i == 0 && j == 0){
		ans1 = cells[i][j+1].hasChildNodes() ||
		cells[i+1][j].hasChildNodes() ||  cells[i+1][j+1].hasChildNodes();
	}
	else if(i == 0 && j == 9){
		ans1 =  cells[i][j-1].hasChildNodes() || cells[i+1][j-1].hasChildNodes() ||
		cells[i+1][j].hasChildNodes();
	}
	else if(i == 9 && j == 9){
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
			cells[i][j-1].hasChildNodes();
	}
	else if(i == 9 && j == 0){
		ans1 = cells[i-1][j].hasChildNodes() ||
		cells[i-1][j+1].hasChildNodes() || cells[i][j+1].hasChildNodes();
	}
	else if(i == 0){
		ans1 = cells[i][j-1].hasChildNodes() ||
			 cells[i][j+1].hasChildNodes() ||  cells[i+1][j-1].hasChildNodes() ||
			 cells[i+1][j].hasChildNodes() ||  cells[i+1][j-1].hasChildNodes();
	}
	else if(i == 9){
		ans1 = cells[i-1][j-1].hasChildNodes() ||  cells[i-1][j].hasChildNodes() ||
		cells[i-1][j+1].hasChildNodes() ||  cells[i][j-1].hasChildNodes() ||
		cells[i][j+1].hasChildNodes();
	}
	else if (j == 0){
		ans1 = cells[i-1][j].hasChildNodes() ||
			 cells[i-1][j+1].hasChildNodes() ||
			 cells[i][j+1].hasChildNodes() || cells[i+1][j+1].hasChildNodes()
			 cells[i+1][j].hasChildNodes();
	}
	else if(j == 9){
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
				if(nearAFullCell(i,j) == true){
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
	findCellsToChangeInVertical(smaller, j, to, true, i, newColor, oldColor);
	i = max(TABLE_SIZE-1,(TABLE_SIZE-1)-rowIndex);
	j = min(TABLE_SIZE-1,(TABLE_SIZE-1)-colIndex);
	findCellsToChangeInVertical(bigger, j, to, false, i, newColor, oldColor);
	//up verticl
	//findCellsToChangeInVertical(comper, j, to, add, i, newColor, oldColor);
	//findCellsToChangeInVertical(comper, j, to, add, i, newColor, oldColor);

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

function findCellsToChangeInVertical(comper, j,to , add ,i,newColor,oldColor){
	var foundMatch = false;
	var setToColor = false;
	console.log("befor while "+j+" "+to);
	while(comper(j,to)){
		console.log("in while i="+i+" j="+j+" to="+to);
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
		if(add){
			j = j+1;
			i = i+1;
		}
		else{
			j = j-1;
			i = i-1;
		}
	}
}

function clickCell(cell){
	if(cell.classList.contains("validCell")){
		var newDiv = document.createElement("DIV");
		newDiv.classList.add("circle");
		cell.appendChild(newDiv);
		var colorClass = "";
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
		changeTurn()

	}
}

function changeTurn() {
	let playerTurn = document.getElementById("playerTurn");
	if (blackTurn){
		playerTurn.className = "whitePlayerTurn";
		playerTurn.innerHTML = "white Player Turn";
	}
	else{
		playerTurn.className = "blackPlayerTurn";
		playerTurn.innerHTML = "Black Player Turn";
	}

	blackTurn = !blackTurn;



}

function createNewGame(){
	var cellChild;
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
}

newGame.addEventListener("click",function(){
	createNewGame();
});

