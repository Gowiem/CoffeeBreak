// Created by: Matt Gowie
// Sunday, November 24th 2013

var actionsContainer = $('#files .actions'),
    convertButton = $('<a></a>').addClass('minibutton empty-icon')
                                .attr('id', 'coffee-break-convert')
                                .text('Convert CoffeeScript'),
    serverUrl = 'http://coffee-break-server.herokuapp.com/';

actionsContainer.append(convertButton);


var github = new OAuth2('github', {
  client_id: 'a6b7b7f807a5c49b2751',
  client_secret: '635eebc7b21017812d34b93c41c9dead7c2188e8',
  api_scope: 'gist'
});

$('#coffee-break-convert').on('click', function() {
  var currentUrl = $(location).attr('href'),
      rawUrl = currentUrl.replace(/^(.*\/)blob\/(.*)$/, '$1$2')
                         .replace(/^https:\/\/.*(github.com.*)$/, 'https://raw.$1');
  $.ajax({
    url: rawUrl,
    type: 'GET',
    success: function(response) {
      postCoffeeToServer(response);
    },
    error: function(response) {
      console.log("Error - response: ", response);
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
      createGistWithCompiledJs(response);
    },
    error: function(response) {
      console.log("Error - response: ", response);
    }
  });
}

var createGistWithCompiledJs(compiled) {
  github.authorize(function() {
    console.log("GitHub authorized callback");
  });
  console.log("github is authorized: ", github.hasAccessToken());
}

