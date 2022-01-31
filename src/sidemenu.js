// toggle menu
$('.btn_menu').on('click', () => {
  // side.classList.toggle('open-menu')
  $('.side').stop(true).animate({'width': 'toggle'});
});

// trigger color filtering
 $('input:checkbox').change(filterchange);
 // $('input:checkbox.colorcheck').change(colorchange);
 // $('input:checkbox.raritycheck').change(raritychange);
 // $('input:checkbox.typecheck').change(typechange);


 // color filtering function
 function filterchange(){
   let visible = false;
   let color = '';
   let rarity = '';
   let types = '';
   $('.card_div').each(function(i, o){
     color = $(o).children('a').attr('data-c_color').replace(/,/g, '');
     rarity = $(o).children('a').attr('data-c_rarity');
     visible = false;
     // check color
     if ($('.colorcheck-multi').prop("checked")==true){
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==true){
           visible = true;
           break;
         }
       }
     }else{ // not showing multicolored unless all colors are included
       visible = true;
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==false){
           visible = false;
           break;
         }
       }
     }
     // check rarity
     if ($('.'+rarity).prop('checked')==false){
       visible = false;
     }
     if (visible){
       $(o).show();
     } else {
       $(o).hide();
     }
   })
 }

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

 // type filtering function
 function typechange(){
   let visible = false;
   let types = '';
   $('.card_div').each(function(i, o){
     types = $(o).children('[data-c_face=front]').attr('data-c_types').split(',');
     console.log(types);
     for (let i = 0; i < types.length; i++){
       if ($('.'+types[i]).prop('checked')==true){
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
