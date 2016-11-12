$(document).ready(function(){

    $('[data-toggle=tooltip]').hover(function(){
        // on mouseenter
        $(this).tooltip();        
        
   }, function(){
        // on mouseleave
        
    });
})