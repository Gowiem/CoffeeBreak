// Created by: Matt Gowie
// Sunday, November 24th 2013

var actionsContainer = $('#files .actions'),
    convertButton = $('<a></a>').addClass('minibutton empty-icon')
                                .attr('id', 'coffee-break-convert')
                                .text('Convert CoffeeScript'),
    serverUrl = 'http://coffee-break-server.herokuapp.com/';

actionsContainer.append(convertButton);

$('#coffee-break-convert').on('click', function() {
  var currentUrl = $(location).attr('href'),
      rawUrl = currentUrl.replace(/^(.*\/)blob\/(.*)$/, '$1$2')
                         .replace(/^https:\/\/.*(github.com.*)$/, 'https://raw.$1');
  $.ajax({
    url: rawUrl,
    type: 'GET',
    success: function(response) {
      console.log("respose: ", response);
      postCoffeeToServer(response);
    },
    error: function(response) {
      console.log('error! response: ', response);
    }
  });
});

var postCoffeeToServer = function(rawCoffee) {
  console.log("Posting rawCoffee to Server");
  $.ajax({
    url: serverUrl,
    type: 'POST',
    data: { 'content': rawCoffee },
    success: function(response) {
      console.log("post response: ", response);
    },
    error: function(response) {
      console.log("error post response: ", response);
    }
  })
}

