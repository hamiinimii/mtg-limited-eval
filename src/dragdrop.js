// when starting drag
function dragstart(event){
  event.dataTransfer.setData("text", event.target.id);
}

// drop
function drop(event){
  var dragged_id = event.dataTransfer.getData("text");
  var drag_elm = document.getElementById(dragged_id);
  event.currentTarget.appendChild(drag_elm);
  event.preventDefault(); // cancel drop event in order to avoid error

  // save tier data (refer to json2cards.js)
  cards_tier[dragged_id] = event.currentTarget.id.slice(-1);
  saveTier(cards_tier);

  styleCheck();
}

// if dragged element is over dropped element
function dragover(event){
  event.preventDefault();
}
