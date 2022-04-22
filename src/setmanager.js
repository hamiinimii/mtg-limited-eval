// referred from https://webparts.cman.jp/input/inputend/
let gTimer;
let set_list; // set list used grobally
let current_set = 'SNC';
// let current_tab = 'tiers';
let current_tab = 'tiers';

function selectAll(target){
  target.select();
}

function inputText(){
 // =========================================================
 //   入力の度に実行される
 //     入力完了までタイマーで実行待ちする
 //     タイマーまでに次の入力があると、再度タイマー設定
 // =========================================================
    // =============================================
    //   一定時間を待って入力完了と判断
    // =============================================
    $('input#setname').val($('input#setname').val().toUpperCase());
    if(gTimer){clearTimeout(gTimer);}
    gTimer = setTimeout(inputEnd, 700);
}

function inputEnd(){
 // =========================================================
 //   タイマー時間経過で入力完了と判断
 // =========================================================
    // var wObj	= document.getElementById("endMsg");
    // wObj.innerHTML = '入力完了と判定しました<br>入力：'+document.getElementById("inText").value;
    // wObj.className = 'defStyle endStyle';
    // let input_set = $('input#setname').val();
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
function refreshSet(set){
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

  let requestURL = 'https://mtgjson.com/api/v5/'+set+'.json';

  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function() {
    const cardJson = request.response["data"]["cards"];
    jsonToCards(cardJson);
    filterChange();
    activateDefaultTab(current_tab);

    styleCheck();
  }
}
