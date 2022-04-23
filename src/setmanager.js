// referred from https://webparts.cman.jp/input/inputend/
let gTimer;
let set_list; // set list used grobally
let current_set = 'SNC';
let cards_tier = {};

function selectAll(target){
  target.select();
}

function inputText(){
    $('input#setname').val($('input#setname').val().toUpperCase());
    if(gTimer){clearTimeout(gTimer);}
    gTimer = setTimeout(inputEnd, 700);
}

function inputEnd(){
    let input_set = $('input#setname').val();
    if (Object.keys(set_list).includes(input_set)) {
      $('input#setname').removeClass('inactive');
      if (input_set != current_set){
        current_set = input_set;
        refreshSet(current_set);
      }
    }

}

// request json
function refreshSet(setname){
  let objn = {bye:{uye: '34'}};

  // validate setname
  if (!set_list) {
    set_list = {};
    let requestURL = 'https://mtgjson.com/api/v5/SetList.json';

    let request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function() {
      const setJson = request.response["data"];
      // loop for all cards (including back face)
      for (let i = 0; i < setJson.length; i++) {
        set_list[setJson[i].code] = {
          name: setJson[i].name,
          release_date: setJson[i].releaseDate
        };

      }
    }
  }

  const requestURL = 'https://mtgjson.com/api/v5/'+setname+'.json';

  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    const cardJson = request.response["data"]["cards"];
    jsonToCards(cardJson);
    filterChange();
    activateDefaultTab(current_tab);
    $('.btn_closecombatter').click();


    styleCheck();
  }
}
