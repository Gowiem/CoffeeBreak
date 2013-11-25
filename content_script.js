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
      postCoffeeToServer(response);
    },
    error: function(response) {
      console.log("Error - response: ", response);
    }
  });
});

var postCoffeeToServer = function(rawCoffee) {

  $.ajax({
    url: serverUrl,
    type: 'POST',
    data: { 'content': rawCoffee },
    success: function(response) {
      var newGist = new Gist(response);
      sendGistToBackground(newGist);
    },
    error: function(response) {
      console.log("Error - response: ", response);
    }
  });
}

var sendGistToBackground = function(newGist) {
  chrome.runtime.sendMessage({ content: newGist.toJSON() }, function(response) {
    console.log(response);
  });
}

function Gist(content) {

  // Grab the current filename from the dom and strip .coffee for the new filename
  this.filename = $('.file-navigation .final-path').html();
  this.newFilename = this.filename.replace(/(\w*)\..*/, '$1.js');

  var constructFiles = function(filename, content) {
    var files = {};
    files[filename] = { 'content': content };
    return files;
  }

  this.files = constructFiles(this.filename, content);

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

