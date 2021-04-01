$(document).ready(function(){
   // console.log('stop');
    var faqNextButton = $("#faq_btn_next");
      var faqSearchInput = $('#faq_search');
 // var faqAccordionInput = $(".faq_accordion");
  var faqAccordionInput = $("#faq_accordion");
  var faqSubAccordionInput = $("#faq_subaccordion");

  // faqAccordian = faqAccordionInput.accordion({
  //   heightStyle: "content",
  //   collapsible: false,
  //   active: false,
  //   create: function(event, ui) {
  //     $('#faq_loading').hide();
  //     faqAccordionInput.show();
  //   }
  // });

  // faqSubAccordian = faqSubAccordionInput.accordion({
  //   heightStyle: "content",
  //   collapsible: true,
  //   active: false
  // });

  $("#faq_search").keyup(function(){
   var bla = $('#faq_search').val().toString().toLowerCase();

   if (jQuery.trim(bla)=='') {
     $("#faq_accordion div.ui-accordion-content").attr('filter-key','').hide(); 
     return true;
   }
   $( "#faq_accordion ul li" ).each(function(){
    console.log('key');
        var htxt=$(this).text().toString().toLowerCase();   
      var ulIndex=$(this).parent().index('ul');
        if (htxt.indexOf(bla) > -1) {
            $(this).show();
            //$('#subaccordion-'+ulIndex).attr('filter-key',bla).show();
            $('#acc li').attr('filter-key',bla).show();
        } else {
            $(this).hide();
            if ($('#subaccordion-'+ulIndex).attr('filter-key')!=bla)
            $('#subaccordion-'+ulIndex).hide();
        }
    });
  });
});

function collaps(){
    
    $(".ui-accordion-header").removeClass("ui-accordion-header-active ui-state-active");
        $(".ui-accordion-content").removeClass("ui-accordion-content-active");
        $(".ui-accordion-header-icon").removeClass("ui-icon-triangle-1-s");
        $(".ui-accordion-header-icon").addClass("ui-icon-triangle-1-e");
        $(".ui-accordion-content").css("display", "none");
}