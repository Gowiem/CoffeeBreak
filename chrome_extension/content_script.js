// Created by: Matt Gowie
// Sunday, November 24th 2013

var $spinner, 
    $convertButton,
    port = chrome.runtime.connect({name: "CoffeeBreak"});

// Create the convert button, append it to the dom, and setup the click event
$(document).ready(function() {
  $spinner = $('<img></img>').attr('id', 'coffee-break-spinner')
                             .attr('src', chrome.extension.getURL('images/spinner.gif'));
  $convertButton = $('<a></a>').addClass('minibutton empty-icon')
                               .attr('id', 'coffee-break-convert')
                               .text('Convert CoffeeScript')


  var $actionsContainer = $('#files .actions');  
  $actionsContainer.append($convertButton);

  $('#coffee-break-convert').on('click', function() {
    startLoadingAnimation();
    retrieveRawCoffee();
  });
});

// Grabs the currentUrl, converts it to a raw.github url, and then uses
// that to retrieve the formatted raw CoffeeScript w/o all that html junk.
var retrieveRawCoffee = function() {
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
      alert("Sorry, CoffeeBreak failed to retrieve the source of this file. Please try again later.");
    }
  });
}

// Post the given CoffeScript to the coffee break server for conversion to js.
// If successful then create a new Gist object and send it to bg.js where
// it will be posted to api.github.com. If it failed, then blow up loudly.
var postCoffeeToServer = function(rawCoffee) {
  $.ajax({
    url: 'http://coffee-break-server.herokuapp.com/',
    type: 'POST',
    data: { 'content': rawCoffee },
    success: function(response) {
      // response is the converted coffeescript => js or js => coffeescript string
      var gistJSON = constructGistJSON(response);
      sendGistToBackground(gistJSON);
    },
    error: function(response) {
      alert("Sorry, an error occured during the conversion request. Please try again later.");
    }
  });
}

// Creates the JSON object which api.github.com/posts expects from the given
// convertedScript string.
var constructGistJSON = function(convertedScript) {
  // Grab the current filename from the dom and strip .coffee for the new filename
  var filename = $('.file-navigation .final-path').html(),
      newFilename = filename.replace(/(\w*)\..*/, '$1.js'),
      files = {};
  files[newFilename] = { 'content': convertedScript };
  return {
    'description': filename + ' => ' + newFilename + ' conversion by CoffeeBreak',
    'public': true,
    'files' : files
  }
}

var sendGistToBackground = function(gistJSON) {
  port.onMessage.addListener(function(message) {
    stopLoadingAnimation();
    if (message['status'] === 'failure') {
      alert('Sorry, CoffeeBreak failed to create the converted gist. Please try again later.');
    }
  });
  port.postMessage({ content: gistJSON });
}

var startLoadingAnimation = function() {
  $convertButton.text('Converting CoffeeScript')
                .append($spinner);
}

var stopLoadingAnimation = function() {
  // TIL $.text clears html elements too...
  $convertButton.attr('disabled', 'true')
                .addClass('disabled')
                .unbind('click')
                .text('CoffeeScript Coverted');
}

