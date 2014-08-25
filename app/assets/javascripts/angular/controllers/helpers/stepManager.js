(function(window, $){
  var stepManager = function(){
    var _store = {};

    //---------- Private functions ----------//

    function randomColor(){
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    function radiansToDegrees(radians){
      return Math.floor((radians + Math.PI) * 180 / Math.PI);
    }

    //---------- Public functions ----------//

    function initializeWheel(){
      var $this = $(window),
      width = $this.width(),
      height = $this.height(),
      radius = 700,
      radians = Math.PI,
      textRadians = radians,
      keys = Object.getOwnPropertyNames(_store),
      numSteps = keys.length,
      radIncrement = (Math.PI * 2) / numSteps,
      origin = {x: width / 2, y: 862},
      color = randomColor(),
      step, key, category, stepContainer, stepBox, color, newX, newY, rotation;

      $('#wheel').css({
        'top': (origin.y - 862) + 'px',
        'left': (origin.x - 862) + 'px'
      });

      // iterate through the store
      for(var j = (numSteps - 1); j >= 0; j -= 1) {
        key = keys[j];
        step = _store[key];

        // Compute top and left coordinates
        newX = origin.x + (Math.sin(radians) * radius) - 100;
        newY = origin.y + (Math.cos(radians) * radius) - 162;

        // Compute other attributes
        if(category !== step.category()) {
          category = step.category();
          color = randomColor();
        }
        rotation = radiansToDegrees(textRadians);

        // Create the box
        stepBox = document.createElement('div');
        $(stepBox).addClass('step-box');
        $(stepBox).data({
          'id': step.id(),
          'title': step.title()
        });
        $(stepBox).append('<div class="step-title">' + step.title() + '</div>');
        $(stepBox).append('<div class="step-text">' + step.text() + '</div>');
        $(stepBox).append('<div class="step-id">' + step.id() + '</div>');
        $(stepBox).css({
          'background': color
        });

        // Create and position the box container
        stepContainer = document.createElement('div');
        $(stepContainer).addClass('step-container');
        $(stepContainer).attr('id', 'item' + step.id());
        $(stepContainer).css({
          'top': newY.toFixed(2) + 'px',
          'left': newX.toFixed(2) + 'px',
          '-ms-transform': 'rotate(' + rotation + 'deg)',
          '-webkit-transform': 'rotate(' + rotation + 'deg)',
          'transform': 'rotate(' + rotation + 'deg)'
        });
        $(stepContainer).append($(stepBox))
        $('#wheel').append($(stepContainer));

        // Set the step rotation
        _store[key].rotation(radians);

        // Increment the rotation for the nexxt iteration
        radians -= radIncrement;
        textRadians += radIncrement;
      }
    }

    function spin(stepTitle){
      // Set the new wheel rotation
      radians = parseFloat(_store[stepTitle].rotation()) || 0,
      degrees = radiansToDegrees(radians);

      // Now spin it 3x
      $('#wheel').velocity({rotateZ: (1080 - degrees)}, 1500);
      $('#item' + _store[stepTitle].id()).css('z-index', 1000);
    }

    function get(title){
      if(typeof title === 'undefined') {
        return _store;
      }
      return _store[title];
    }

    function setStore(steps) {
      _store = {};
      for(key in steps) {
        _store[steps[key].title()] = steps[key];
      }
    }

    return {
      get: get,
      initializeWheel: initializeWheel,
      spin: spin,
      setStore: setStore,
    };
  };

  var module = angular.module('ISDApp.controllers');
  module.service('stepManager', stepManager);
})(window, jQuery);
