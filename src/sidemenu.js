// toggle menu
$('.btn_menu').on('click', () => {
  // side.classList.toggle('open-menu')
  $('.side').stop(true).animate({'width': 'toggle'});
});

// trigger color filtering
 $('input:checkbox.colorcheck').change(colorchange);
 $('input:checkbox.raritycheck').change(raritychange);


 // color filtering function
 function colorchange(){
   let visible = false;
   let color = '';
   $('.card_div').each(function(i, o){
     color = $(o).children('a').attr('data-c_color').replace(/,/g, '');
     visible = false;
     for (let i = 0; i < color.length; i++){
       if ($('.'+color[i]).prop('checked')==true){
         $(o).show();
         visible = true;
         break;
       }
     }
     if (!visible){
       $(o).hide();
     }
   })
 }

 // rarity filtering function
 function raritychange(){
   let visible = false;
   let rarity = '';
   $('.card_div').each(function(i, o){
     rarity = $(o).children('a').attr('data-c_rarity');
     console.log(rarity);
       if ($('.'+rarity).prop('checked')==true){
         $(o).show();
       } else {
         $(o).hide();
       }
     })
 }
