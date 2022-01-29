function jsonToCards(cardJson){
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

    const articleElement = document.createElement('article');
    const h2Element = document.createElement('h2');
    const p1Element = document.createElement('p');
    const p2Element = document.createElement('p');
    const hrefImgElement = document.createElement('a');
    const img1Element = document.createElement('img');

    h2Element.textContent = card.name;
    p1Element.textContent = 'manaCost: ' + card.manaCost;
    p2Element.textContent = 'type: ' + card.type;
    hrefImgElement.href = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    hrefImgElement.dataset.lightbox="abc";
    img1Element.src = 'https://api.scryfall.com/cards/' + card.identifiers.scryfallId + '?format=image&face=front';
    img1Element.width = 100; // 横サイズ（px）

    articleElement.appendChild(h2Element);
    articleElement.appendChild(p1Element);
    articleElement.appendChild(p2Element);
    articleElement.appendChild(hrefImgElement);
    hrefImgElement.appendChild(img1Element);

    section.appendChild(articleElement);
    console.log(i)

  }

}
