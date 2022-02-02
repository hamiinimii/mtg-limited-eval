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

  //store back faces of double face card
  let backfaces = {};
  let faceUuidToId = {};

  // loop for all cards (including back face)
  for (let i = 0; i < cardJson.length; i++) {
  // for (let i = 0; i < 30; i++) {
    let card = cardJson[i];

    let divCardElement = document.createElement('div');
    const hrefImgElement = document.createElement('a');
    const img1Element = document.createElement('img');

    // restore data of back face of double faced cards
    if (card.layout=='transform') {
      if (card.side === 'b') {
        backfaces[card.identifiers.scryfallId] = {
          otherFaceIds: card.otherFaceIds,
          faceName: card.faceName,
          types: card.types
        };
        continue;
      } else if(card.side === 'a') {
        faceUuidToId[card.uuid] = card.identifiers.scryfallId;
        hrefImgElement.dataset.title = card.faceName;
      }
    } else{
      hrefImgElement.dataset.title = card.name;
    }

    let card_id = card.identifiers.scryfallId;

    divCardElement.className = 'card_div';
    divCardElement.id = card_id;
    divCardElement.draggable = 'true';
    divCardElement.setAttribute('ondragstart', 'dragstart(event)');

    hrefImgElement.id = card_id; // use same id to make parent draggable
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + card_id + '?format=image&face=front';
    hrefImgElement.dataset.lightbox = `card_${card_id}`;
    hrefImgElement.dataset.c_face = 'front';

    img1Element.src = hrefImgElement.href;
    img1Element.width = 150;
    img1Element.id = card_id // use same id to make parent draggable

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
    if (!(card_id in cards_tier)){
      cards_tier[card_id] = '0';
    }

    let tier_int = parseInt(cards_tier[card_id]);
    tierElements[tier_int].appendChild(divCardElement);

  }

  // make elements for backface of transform cards
  for (let [id, data] of Object.entries(backfaces)) {
    let back_id = id;
    let face_id = faceUuidToId[data.otherFaceIds.at(0)];
    const hrefImgElement = document.createElement('a');
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + back_id + '?format=image&face=back';
    hrefImgElement.dataset.lightbox = `card_${face_id}`
    hrefImgElement.dataset.title = data.faceName;
    hrefImgElement.dataset.c_types = data.types;
    hrefImgElement.dataset.c_face = 'back';
    let elm = document.getElementById(face_id);
    elm.appendChild(hrefImgElement);
  }
}
