// Created by: Matt Gowie
// Sunday, November 24th 2013

var github = new OAuth2('github', {
  client_id: 'a6b7b7f807a5c49b2751',
  client_secret: '635eebc7b21017812d34b93c41c9dead7c2188e8',
  api_scope: 'gist'
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    github.authorize(function() {
      console.log("GitHub authorized callback");
    });
    console.log('request: ', request, " - Github is authorized: ", github.hasAccessToken());

    if (request) {
      sendResponse({ content: "shred" });
    }
  }
);