function jsonToCards(cardJson){
  // listElement = document.createElement('ul');
  // listElement.id = 'cardlist';
  const divNotRankedElement = document.querySelector('#tier4 > div');

  // for (let i = 0; i < cardJson.length; i++) {
  for (let i = 0; i < 30; i++) {
    card = cardJson[i];
    // skip back face of double faced cards
    // if (card.keywords) {
    //   console.log(card.keywords[0]);
    // }
    if (card.layout=='transform' && !(card.manaCost)) {
      continue;
    }

    // const divCardElement = document.createElement('li');
    // let divCardElement = document.createElement('div');
    const hrefImgElement = document.createElement('a');
    const img1Element = document.createElement('img');

    // divCardElement.className = 'card_div';
    // divCardElement.id = card.identifiers.scryfallId;
    // divCardElement.draggable = 'true';
    // divCardElement.setAttribute('ondragstart', 'dragstart(event)');

    hrefImgElement.id = card.identifiers.scryfallId;
    hrefImgElement.draggable = 'true';
    hrefImgElement.setAttribute('ondragstart', 'dragstart(event)');
    // card visualization
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    hrefImgElement.dataset.lightbox = card.printings[0];
    hrefImgElement.dataset.title = card.name;

    img1Element.src = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    img1Element.width = 150;
    img1Element.id = hrefImgElement.id; // use same id to make parent draggable
    // img1Element.setAttribute('ondragstart', 'dragover(event)');
    // hidden card parameters
    hrefImgElement.dataset.c_name = card.name;
    hrefImgElement.dataset.c_manacost = card.manaCost;
    hrefImgElement.dataset.c_type = card.type;
    // pt does not refer back side now
    if (card.power) hrefImgElement.dataset.c_power = card.power;
    if (card.toughness) hrefImgElement.dataset.c_toughness = card.toughness;

    // divCardElement.appendChild(hrefImgElement);
    hrefImgElement.appendChild(img1Element);

    divNotRankedElement.appendChild(hrefImgElement);
    // console.log(i)

  }

}
