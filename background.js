// Created by: Matt Gowie
// Sunday, November 24th 2013

var github = new OAuth2('github', {
  client_id: 'a6b7b7f807a5c49b2751',
  client_secret: '635eebc7b21017812d34b93c41c9dead7c2188e8',
  api_scope: 'gist'
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    github.authorize();
    console.log('request: ', request, " - Github is authorized: ", github.hasAccessToken());

    if (request['content']) {
      var newGistUrl = 'https://api.github.com/gists?access_token=' + github.getAccessToken();
      $.ajax({
        url: newGistUrl,
        type: 'POST',
        data: JSON.stringify(request['content']),
        success: function(response) {
          chrome.tabs.create({ url: response['html_url'], active: true });
        },
        error: function(response) {
          console.log('Error: failed to create gist, response: ', response);
        }
      })
    }
  }
);

