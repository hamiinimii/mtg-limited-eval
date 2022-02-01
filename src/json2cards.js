let cards_tier = {};

// cookie management - reference: https://into-the-program.com/javascript-set-get-data-array-cookie/
function loadCookie(){
  let cookies = '';
  let cookie_array = new Array();
  let result = {};

  cookies = document.cookie;
  if(cookies){
    cookie_array = cookies.split(';');

    cookie_array.forEach(data => {
        data = data.split('=');
        //data[0]: Cookieの名前（例では「user」）
        //data[1]: Cookieの値（例では「json」）
        result[data[0]] = JSON.parse(data[1]);
    });
  }
  return result;
}

function saveCookie(name, object){
  let cookies = '';
  let expire = '';
  let period = '';

  //Cookieの保存名と値を指定
  cookies = name + '=' + JSON.stringify(object) + ';';

  //Cookieを保存するパスを指定
  cookies += 'path=/ ;';

  //Cookieを保存する期間を指定
  period = 30; //保存日数
  expire = new Date();
  expire.setTime(expire.getTime() + 1000 * 3600 * 24 * period);
  expire.toUTCString();
  cookies += 'expires=' + expire + ';';
  console.log(cookies);

  //Cookieを保存する
  document.cookie = cookies;
}

function jsonToCards(cardJson){
  const divNotRankedElement = document.querySelector('#area_untiered > div');

  // load tier from cookie
  cards_tier = loadCookie();

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
    if (card_id in cards_tier){
      cards_tier[card_id] = "untiered";
    }

    divNotRankedElement.appendChild(divCardElement);

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
