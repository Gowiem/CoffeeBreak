// Created by: Matt Gowie
// Sunday, November 24th 2013

var actionsContainer = $('#files .actions'),
    convertButton = $('<a></a>').addClass('minibutton empty-icon')
                                .attr('id', 'coffee-break-convert')
                                .text('Convert CoffeeScript');

actionsContainer.append(convertButton);

$('#coffee-break-convert').on('click', function() {
  var currentUrl = $(location).attr('href'),
      rawUrl = currentUrl.replace(/^(.*\/)blob\/(.*)$/, '$1$2')
                         .replace(/^https:\/\/.*(github.com.*)$/, 'https://raw.$1');
  console.log("rawUrl: ", rawUrl);
  $.ajax({
    url: rawUrl,
    type: 'GET',
    success: function(response) {
      console.log("respose: ", response);
    },
    error: function(response) {
      console.log('error! response: ', response);
    }
  });
});

