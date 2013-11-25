// Created by: Matt Gowie
// Sunday, November 24th 2013

var github = new OAuth2('github', {
  client_id: 'a6b7b7f807a5c49b2751',
  client_secret: '635eebc7b21017812d34b93c41c9dead7c2188e8',
  api_scope: 'gist'
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "CoffeeBreak");
  port.onMessage.addListener(function(message) {
    github.authorize(function() {
      console.log("GitHub Authorized: ", github.hasAccessToken());
      if (message['content'] && github.hasAccessToken()) {
        postNewGist(message['content'], port);
      }
    });
  });
});

// Constructs the newGistUrl w/ the Oauth access token and posts the given gistJSON
// to api.github.com/gists
var postNewGist = function(gistJSON, port) {
  var newGistUrl  = 'https://api.github.com/gists?access_token=' + github.getAccessToken();
  $.ajax({
    url: newGistUrl,
    type: 'POST',
    data: JSON.stringify(gistJSON),
    success: function(response) {
      port.postMessage({ status: 'success' });
      chrome.tabs.create({ url: response['html_url'], active: true });
    },
    error: function(response) {
      port.postMessage({ status: 'failure' });
      console.log('Error: failed to create gist, response: ', response);
    }
  });
}

