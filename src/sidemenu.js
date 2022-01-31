// toggle menu
$('.btn_menu').on('click', () => {
  // side.classList.toggle('open-menu')
  $('.side').stop(true).animate({'width': 'toggle'});
});

// trigger color filtering
 $('input:checkbox').change(filterchange);

 // color filtering function
 function filterchange(){
   let visible = [];
   // data variables
   let color = '';
   let rarity = '';
   let types = '';
   let types_front = [];
   let types_back = [];

   $('.card_div').each(function(i, o){
     color = $(o).children('a').attr('data-c_color').replace(/,/g, '');
     rarity = $(o).children('a').attr('data-c_rarity');
     visible = [false, false, true]; // initialize visibility
     // check color
     if ($('.colorcheck-multi').prop("checked")==true){
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==true){
           visible[0] = true;
           break;
         }
       }
     }else{ // not showing multicolored unless all colors are included
       visible[0] = true;
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==false){
           visible[0] = false;
           break;
         }
       }
     }
     // check types
     types_front = $(o).children('[data-c_face=front]').attr('data-c_types').split(',');
     if ($(o).children('[data-c_face=back]').length && $('.typecheck-multi').prop('checked')==true) { // transform cards
       types_back = $(o).children('[data-c_face=back]').attr('data-c_types').split(',');
       Array.prototype.push.apply(types_front, types_back);
     }
     console.log(types_front);
     for (let i = 0; i < types_front.length; i++){
       if ($('.'+types_front[i]).prop('checked')==true){
         visible[1] = true; // by default visible[1] is false and only in this case it becomes true
         break;
       }
     }
     // check rarity
     // if ($('.'+rarity).prop('checked')==false){
     visible[2] = $('.'+rarity).prop('checked');
     // }
     // result
     if (visible.every(value => value==true)){
       $(o).show();
     } else {
       $(o).hide();
     }
   })
 }
