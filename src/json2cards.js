let cards_tier = {};

function loadTier(){
  if (localStorage.getItem(current_set)!=null){
    return JSON.parse(localStorage.getItem(current_set));
  }else{
    return {};
  }
}

function saveTier(object){
  let tiers = JSON.stringify(object);
  localStorage.setItem(current_set, tiers);
}

function jsonToCards(cardJson){

  const tierElements = [
    document.querySelector('#area_untiered > div'),
    document.querySelector('#area_tier1 > div'),
    document.querySelector('#area_tier2 > div'),
    document.querySelector('#area_tier3 > div'),
    document.querySelector('#area_tier4 > div'),
    document.querySelector('#area_tier5 > div'),
    document.querySelector('#area_tier6 > div')
  ];

  // clear cards when set is changed
  for (let i=0; i<tierElements.length; i++){
    let elm = tierElements[i];
    while(elm.lastChild){
      elm.removeChild(elm.lastChild);
    }
  }

  // load tier from localStorage
  cards_tier = loadTier();

  //store data for cards
  let backfaces = {};
  let variations_to_orig = {};

  // loop for all cards (including back face)
  for (let i = 0; i < cardJson.length; i++) {
  // for (let i = 0; i < 6; i++) {
    let card = cardJson[i];
    let flag_var = false;

    let divCardElement = document.createElement('div');
    const hrefImgElement = document.createElement('a');
    const img1Element = document.createElement('img');

    // restore data of variations if exist, and skip second or later variations
    if ('variations' in card){
      if (!(card.uuid in variations_to_orig)){ // first variation case
        for (let var_uuid of card.variations){
          variations_to_orig[var_uuid] = card.uuid;
        }
      }else{
        flag_var = true; // other variation case, do not create card_div
      }
    }

    // skip Alchemy rebalanced cards
    if (card.name.startsWith('A-')) continue;

    // restore data of back face of double faced cards
    if (card.layout=='transform') {
      if (card.side === 'b') {
        backfaces[card.uuid] = {
          otherFaceIds: card.otherFaceIds,
          faceName: card.faceName,
          scryfallId: card.identifiers.scryfallId,
          types: card.types
        };
        if (card.power) backfaces[card.uuid]['power']=card.power;
        if (card.toughness) backfaces[card.uuid]['toughness']=card.toughness;
        continue;
      } else if(card.side === 'a') {
        hrefImgElement.dataset.title = card.faceName;
      }
    }else{
      hrefImgElement.dataset.title = card.name;
    }

    hrefImgElement.id = card.uuid; // use same id to make parent draggable
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    hrefImgElement.dataset.lightbox = `card_${card.uuid}`;
    hrefImgElement.dataset.c_face = 'front';

    if (!flag_var){ // do not register parameter if variations
      divCardElement.className = 'card_div active';
      divCardElement.id = card.uuid;
      divCardElement.draggable = 'true';
      divCardElement.setAttribute('ondragstart', 'dragstart(event)');

      img1Element.src = hrefImgElement.href;
      img1Element.width = 150;
      img1Element.id = card.uuid // use same id to make parent draggable
      // hidden card parameters
      hrefImgElement.dataset.c_manacost = card.manaCost;
      hrefImgElement.dataset.c_manavalue = card.manaValue;
      hrefImgElement.dataset.c_color = card.colors.length ? card.colors : ['N']; // colorless card has N
      hrefImgElement.dataset.c_rarity = card.rarity;
      hrefImgElement.dataset.c_types = card.types;
      // pt does not refer back side now
      if (card.power) hrefImgElement.dataset.c_power = card.power;
      if (card.toughness) hrefImgElement.dataset.c_toughness = card.toughness;
    }else{
      divCardElement.className = 'card_div_var';
    }

    divCardElement.appendChild(hrefImgElement);
    hrefImgElement.appendChild(img1Element);

    // check tier
    if (!(card.uuid in cards_tier)){
      cards_tier[card.uuid] = '0';
    }

    let tier_int = parseInt(cards_tier[card.uuid]);
    tierElements[tier_int].appendChild(divCardElement);

  }

  // make elements for backface of transform cards
  for (let [id, data] of Object.entries(backfaces)) {
    // let back_id = id;
    let face_id = data.otherFaceIds.at(0);
    const hrefImgElement = document.createElement('a');
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + data.scryfallId + '?format=image&face=back';
    hrefImgElement.dataset.lightbox = `card_${face_id}`;
    hrefImgElement.dataset.title = data.faceName;
    hrefImgElement.dataset.c_power = data.power;
    hrefImgElement.dataset.c_toughness = data.toughness;
    hrefImgElement.dataset.c_types = data.types;
    hrefImgElement.dataset.c_face = 'back';
    let elm = document.getElementById(face_id);
    elm.appendChild(hrefImgElement);
  }

  for (let [var_uuid, orig_uuid] of Object.entries(variations_to_orig)) {
    $('[data-lightbox=card_'+var_uuid+']').each(function(i, o){ // append variation images
      $(o).attr('data-lightbox', 'card_'+orig_uuid);
      $(o).removeAttr()
    })
    $('.card_div_var#'+var_uuid).each(function(i, o){
      $(o).addClass('variation');
    })

  }

}
