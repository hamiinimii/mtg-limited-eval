// when starting drag
function dragstart(event){
  console.log("dragstart");
  event.dataTransfer.setData("text", event.target.id);
}

// drop
function drop(event){
  var dragged_id = event.dataTransfer.getData("text");
  var drag_elm = document.getElementById(dragged_id);
  // console.log(dragged_id);
  // console.log(drag_elm);
  event.currentTarget.appendChild(drag_elm);
  event.preventDefault(); // cancel drop event in order to avoid error
}

// if dragged element is over dropped element
function dragover(event){
  event.preventDefault();
}
