var github = new OAuth2('github', {
  client_id: 'a6b7b7f807a5c49b2751',
  client_secret: '635eebc7b21017812d34b93c41c9dead7c2188e8',
  api_scope: 'gist'
});

$(document).ready(function() {
  $('#authorize').on('click', function() {
    console.log("Calling authorized on github");
    github.authorize(checkAuthorized);
  });

  function checkAuthorized() {
    console.log('checkAuthorized');
    if (github.hasAccessToken()) {
      $('#status').text('authorized');
    } else {
      $('#status').text('Not Authorized x2');
    }
  }

  checkAuthorized();
});