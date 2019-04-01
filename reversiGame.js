
var gameTable = document.querySelector(".gameTable");
var newGame = document.querySelector("#new");
var tableSize = 10;
var blackTurn = true;
var cells = [];

for (var i = 0; i < tableSize; i++) {
		var row = gameTable.insertRow(i);
		cells[i]= [];
		for (var j = 0; j < tableSize; j++) {
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
	for(var i = 0; i < tableSize; i++) {
		for(var j = 0; j < tableSize; j++){
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

function clickCell(cell){
	if(cell.classList.contains("validCell")){
		var newDiv = document.createElement("DIV");
		newDiv.classList.add("circle");
		cell.appendChild(newDiv);
		if (blackTurn){
			newDiv.classList.add("blackCircle");
		}
		else{
			newDiv.classList.add("whiteCircle");
		}
		blackTurn = !blackTurn;
		cell.classList.remove("validCell");
		setValidCells();
	}
}

function createNewGame(){
	var cellChild;
	for (var i = 0; i < tableSize ; i++) {
		for(var j = 0; j < tableSize; j++){
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

