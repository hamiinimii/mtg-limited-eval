// when starting drag
function dragstart(event){
  event.dataTransfer.setData("text", event.target.id);
}

// drop
function drop(event, tab){
  const dragged_id = event.dataTransfer.getData("text");
  const drag_elm = document.getElementById(dragged_id);

  // save tier data (refer to json2cards.js)
  if (tab=='tiers') {
    // drop
    event.currentTarget.appendChild(drag_elm);
    // save tier
    console.log(cards_tier);
    cards_tier[current_set][dragged_id] = event.currentTarget.id.slice(-1);
    drag_elm.dataset.tier = cards_tier[current_set][dragged_id];
    saveTier(cards_tier);
  } else if (tab=='combat') {
    // drop to combatter
    const div_combatter = document.getElementById('card_combatter');
    div_combatter.appendChild(drag_elm);
    // reset keywords and do combat
    resetKwAndPT();
    let combatter = prepareCombat(dragged_id);
    doCombat(combatter);
  }
  event.preventDefault(); // cancel drop event in order to avoid error


  styleCheck();
}

// if dragged element is over dropped element
function dragover(event){
  event.preventDefault();
}
