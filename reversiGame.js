
var gameTable = document.querySelector(".gameTable");
var tableSize = 10;

for (var i = 0; i < tableSize; i++) {
	var row = gameTable.insertRow(i);
	row.classList.add("row");
	for (var j = 0; j < tableSize; j++) {
		var col = row.insertCell(j);
		col.classList.add("cell");
		var circleDiv = document.createElement("DIV");
		circleDiv.classList.add("circle");
		if(i == 4 & j == 4){
			circleDiv.classList.add("blackCircle");
		}
		if(i == 5 & j == 4){
			circleDiv.classList.add("whiteCircle");
		}
		if(i == 4 & j == 5){
			circleDiv.classList.add("whiteCircle");
		}
		if(i == 5 & j == 5){
			circleDiv.classList.add("blackCircle");
		}
		
		col.appendChild(circleDiv);

	}
}