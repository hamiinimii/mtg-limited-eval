// when starting drag
function dragstart(event){
  event.dataTransfer.setData("text", event.target.id);
}

// drop
function drop(event, tab){
  let dragged_id = event.dataTransfer.getData("text");
  let drag_elm = document.getElementById(dragged_id);
  console.log(tab);
  event.currentTarget.appendChild(drag_elm);
  event.preventDefault(); // cancel drop event in order to avoid error

  // save tier data (refer to json2cards.js)
  if (tab=='tiers'){
    cards_tier[dragged_id] = event.currentTarget.id.slice(-1);
    drag_elm.dataset.tier = cards_tier[dragged_id];
    saveTier(cards_tier);
  }

  styleCheck();
}

// if dragged element is over dropped element
function dragover(event){
  event.preventDefault();
}
