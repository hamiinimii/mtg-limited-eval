let cards_tier = {};

function loadTier(){
  if (localStorage.tiers){
    return JSON.parse(localStorage.tiers);
  }else{
    return {};
  }
}

function saveTier(object){
  let tiers = JSON.stringify(object);
  localStorage.tiers = tiers;
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

  // load tier from localStorage
  cards_tier = loadTier();
  console.log(cards_tier);

  //store data for cards
  let backfaces = {};
  let variations_to_orig = {};

  // loop for all cards (including back face)
  for (let i = 0; i < cardJson.length; i++) {
  // for (let i = 0; i < 7; i++) {
    let card = cardJson[i];

    let divCardElement = document.createElement('div');
    const hrefImgElement = document.createElement('a');
    const img1Element = document.createElement('img');

    // restore data of variations if exist, and skip second or later variations
    if ('variations' in card && !(card.uuid in variations_to_orig)){ // first variation case
      for (let var_uuid of card.variations){
        variations_to_orig[var_uuid] = card.uuid;
      }
    }

    // skip basic lands
    if (card.supertypes=='Basic') {
      continue;
    }

    // restore data of back face of double faced cards
    let cardname = '';
    if (card.layout=='transform') {
      if (card.side === 'b') {
        backfaces[card.uuid] = {
          otherFaceIds: card.otherFaceIds,
          faceName: card.faceName,
          scryfallId: card.identifiers.scryfallId,
          types: card.types
        };
        continue;
      } else if(card.side === 'a') {
        cardname = card.faceName;
      }
    }else{
      cardname = card.name;
    }


    divCardElement.className = 'card_div';
    divCardElement.id = card.uuid;
    divCardElement.draggable = 'true';
    divCardElement.setAttribute('ondragstart', 'dragstart(event)');

    hrefImgElement.dataset.title = cardname;
    hrefImgElement.id = card.uuid; // use same id to make parent draggable
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    hrefImgElement.dataset.lightbox = `card_${card.uuid}`;
    hrefImgElement.dataset.c_face = 'front';

    img1Element.src = hrefImgElement.href;
    img1Element.alt = cardname;
    img1Element.height = 200;
    img1Element.width = 143;
    img1Element.id = card.uuid // use same id to make parent draggable

    // hidden card parameters
    hrefImgElement.dataset.c_manacost = card.manaCost;
    hrefImgElement.dataset.c_color = card.colors.length ? card.colors : ['N']; // colorless card has N
    hrefImgElement.dataset.c_rarity = card.rarity;
    hrefImgElement.dataset.c_types = card.types;
    // pt does not refer back side now
    if (card.power) hrefImgElement.dataset.c_power = card.power;
    if (card.toughness) hrefImgElement.dataset.c_toughness = card.toughness;

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
    hrefImgElement.dataset.c_types = data.types;
    hrefImgElement.dataset.c_face = 'back';
    let elm = document.getElementById(face_id);
    elm.appendChild(hrefImgElement);
  }

  for (let [var_uuid, orig_uuid] of Object.entries(variations_to_orig)) {
    $('[data-lightbox=card_'+var_uuid+']').each(function(i, o){ // append variation images
      $(o).attr('data-lightbox', 'card_'+orig_uuid);
    })
    $('.card_div#'+var_uuid).each(function(i, o){
      $(o).addClass('variation');
    })

  }

}
