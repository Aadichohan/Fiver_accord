/*jshint esversion: 6 */
/*globals $:true, */

var faqAccordian;
var faqSubAccordian;

var faqNextButton;
var faqSearchInput;

$(document).ready(function() {
  faqNextButton = $("#faq_btn_next");
  faqSearchInput = $('#faq_search');
 // var faqAccordionInput = $(".faq_accordion");
  var faqAccordionInput = $("#acc");
  var faqSubAccordionInput = $("#faq_subaccordion");

  faqAccordian = faqAccordionInput.accordion({
    heightStyle: "content",
    collapsible: false,
    active: false,
    create: function(event, ui) {
      $('#faq_loading').hide();
      faqAccordionInput.show();
    }
  });

  faqSubAccordian = faqSubAccordionInput.accordion({
    heightStyle: "content",
    collapsible: true,
    active: false
  });

  faqSearchInput.on('change keyup paste click', function() {
    console.log('script');
    faqSearch();
  });

  faqNextButton.on('click', function() {
    var new_skip_index = parseInt(faqNextButton.attr('data')) + 1;
    faqNextButton.attr('data', new_skip_index);
    faqSearch();
  });

});

function faqSearch() {
  $('.faq_highlight').contents().unwrap();

  var faq_term = faqSearchInput.val().toLowerCase();
  var accord_num = 0;
  var match_found = false;
  var top_accord_id = 0;
  var last_top_accord_id = 0;
  var title = '';
  var content = '';
  var skip_count = 0;
  var skip_index = parseInt(faqNextButton.attr('data'));
  const faq_term_length = faq_term.length >= 3;
console.log('faq_term '+faq_term);
  if (faq_term_length) {

    $('.faq_subaccordion h3').each(function() {

      var h3 = $(this);
      // strip the icon tag
      title = h3.html().replace(/<[^>]+>/gim, '').toLowerCase();
      const title_includes_term = title.indexOf(faq_term) != -1;
      console.log('h3 '+title_includes_term);

      if (title_includes_term) {

        top_accord_id = parseInt(h3.parent().attr('id').split("_")[1]);
        const not_top_accordion = last_top_accord_id != top_accord_id;

        if (not_top_accordion) {
          last_top_accord_id = top_accord_id;
          accord_num = 0;
        }
        const not_skippable = skip_index != skip_count;

        if (not_skippable) {
          skip_count++;
        } else {
          var regex = new RegExp('(' + faq_term + ')', 'ig');
          h3.html(h3.html().replace(regex, '<span class="faq_highlight">$1</span>'));

          var params = [{
              elem: faqAccordian,
              option: "active",
              optionValue: top_accord_id

            },
            {
              elem: h3.parent(),
              option: "active",
              optionValue: accord_num
            }
          ];

          updateAccordion(params);

          match_found = true;
          return false;
        }
      } else {
        top_accord_id = parseInt(h3.parent().attr('id').split("_")[1]);

        const not_top_accordion = last_top_accord_id != top_accord_id;

        if (not_top_accordion) {
          last_top_accord_id = top_accord_id;
          accord_num = 0;
        }

        content = h3.parent().find('>div').html().replace(/<[^>]+>/gim, '').toLowerCase();
        const content_includes_term = content.indexOf(faq_term) != -1;

        if (content_includes_term) {
          const not_skippable = skip_index != skip_count;

          if (not_skippable) {
            skip_count++;
          } else {
            var regex = new RegExp('(' + faq_term + ')', 'ig');
            h3.parent().find('>div').html(content.replace(regex, '<span class="faq_highlight">$1</span>'));
      // console.log('else h3 ',h3.parent());
            var params = [{
              elem: faqAccordian,
              option: "active",
              optionValue: top_accord_id
            }
            , {
              elem: h3.parent(),
              option: "active",
              optionValue: accord_num
            }
            ];

           // updateAccordion(params);

            match_found = true;
            return false;
          }
        }
      }

      accord_num = accord_num + 1;
    });
  }

  // No match close both accordions
  if (match_found == false) {

    var params = [{
      elem: faqAccordian,
      option: "active",
      optionValue: false
    }, {
      elem: faqSubAccordian,
      option: "active",
      optionValue: false
    }];

    updateAccordion(params);

    faqNextButton.attr('data', 0);
    faqNextButton.hide();
  } else {
    faqNextButton.show();
  }
}

function updateAccordion(params) {

  for (var i = 0; i < params.length; i++) {
    var elem = params[i].elem;
    var option = params[i].option;
    var optionValue = params[i].optionValue;

    elem.accordion("option", option, optionValue);
  }

}