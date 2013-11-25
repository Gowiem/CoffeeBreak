// Created by: Matt Gowie
// Sunday, November 24th 2013

var $spinner, $convertButton;

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
      console.log("Error - response: ", response);
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
      var newGist = new Gist(response);
      sendGistToBackground(newGist);
    },
    error: function(response) {
      alert("Sorry, an error occured during the conversion request. Please try again later.");
    }
  });
}

var sendGistToBackground = function(newGist) {
  chrome.runtime.sendMessage({ content: newGist.toJSON() }, function(response) {
    console.log("Response from sendGistToBg - response: ", response);
    stopLoadingAnimation();
  });
}

var startLoadingAnimation = function() {
  $convertButton.text('Converting CoffeeScript').append($spinner);
}

var stopLoadingAnimation = function() {
  // TIL $.text clears html elements too...
  $convertButton.attr('disabled', true).text('CoffeeScript Coverted');
}

function Gist(content) {

  // Grab the current filename from the dom and strip .coffee for the new filename
  this.filename = $('.file-navigation .final-path').html();
  this.newFilename = this.filename.replace(/(\w*)\..*/, '$1.js');

  var constructFiles = function(newFilename, content) {
    var files = {};
    files[newFilename] = { 'content': content };
    return files;
  }

  this.files = constructFiles(this.newFilename, content);

  this.description = this.filename + ' => ' + this.newFilename + ' conversion by CoffeeBreak';
  this.public = true;
  this.content = content;

  this.toJSON = function() {
    return {
      'description': this.description,
      'public': true,
      'files' : this.files
    }
  }
}

