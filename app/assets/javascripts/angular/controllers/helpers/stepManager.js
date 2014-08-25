(function(window, $){
  var stepManager = function(Step){
    var _store = {},
    _index = [];

    //---------- Private functions ----------//

    function initializeIndex(){
      for(step in _store){
        _index.push(_store[step]);
      }
      _index.sort(Step.compare);
    }

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

    function showBox(stepTitle, degrees){
      var stepId = '#item' + _store[stepTitle].id();

      var continueBtn = document.createElement('button');
      $(continueBtn).addClass('step-continue-btn');
      $(continueBtn).text(_store[stepTitle].continueBtnText());
      $(continueBtn).on('click', function(){
        processBox(_store[stepTitle]);
      });

      var formContainer = document.createElement('div');
      $(formContainer).addClass('step-form-container');
      $(formContainer).append($(continueBtn));
      $(stepId + ' .step-box').append($(formContainer));

      $(stepId)
      .velocity({ zIndex: 1000, rotateZ: -degrees }, { duration: 0 })
      .velocity({ scale: 2 }, { duration: 500 });
    }

    function hideBox(step, zIndexValue){
      var stepId = '#item' + step.id();
      $(stepId)
      .velocity({ zIndex: zIndexValue }, { duration: 0 })
      .velocity({ scale: 1 }, { duration: 500 });
      $(stepId).remove('.step-continue-btn');
    }

    function processBox(step){
      var nextStep;
      if(step.responses.length <= 1) {
        nextStep = step.responses()[0].getNextStep();
      }
      hideBox(step, $('#item' + nextStep.id()).css('z-index'));
      spin(nextStep.title());
    }

    //---------- Public functions ----------//

    function initializeWheel(){
      var $this = $(window),
      width = $this.width(),
      height = $this.height(),
      radius = 700,
      outerRadius = 862,
      radians = Math.PI,
      textRadians = radians,
      keys = Object.getOwnPropertyNames(_store),
      numSteps = keys.length,
      radIncrement = (Math.PI * 2) / numSteps,
      origin = {x: width / 2, y: outerRadius},
      color = randomColor(),
      step, key, category, stepContainer, stepBox, color, newX, newY, rotation;

      $('#wheel-container').css({ 'left': (origin.x - 862) + 'px' });

      // iterate through the store
      initializeIndex();
      for(var j = (numSteps - 1); j >= 0; j -= 1) {
      // for(var j = 0; j < numSteps; j += 1) {
        step = _index[j];

        // Compute top and left coordinates
        newX = Math.floor(outerRadius - 100 + (Math.sin(radians) * radius));
        newY = Math.floor(outerRadius - 162 + (Math.cos(radians) * radius));

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
        $(stepBox).append('<div class="step-category">' + step.category() + '</div>');
        $(stepBox).append('<div class="step-title">' + step.title() + '</div>');
        $(stepBox).append('<div class="step-text">' + step.text() + '</div>');
        $(stepBox).append()
        $(stepBox).css({'background': color});

        // Create and position the box container
        stepContainer = document.createElement('div');
        $(stepContainer).addClass('step-container');
        $(stepContainer).attr('id', 'item' + step.id());
        $(stepContainer).css({
          'top': newY + 'px',
          'left': newX + 'px',
          '-webkit-transform': 'rotate(' + rotation + 'deg)',
          '-moz-transform': 'rotate(' + rotation + 'deg)',
          '-o-transform': 'rotate(' + rotation + 'deg)',
          'transform': 'rotate(' + rotation + 'deg)'
        });
        $(stepContainer).append($(stepBox))
        $('#wheel').append($(stepContainer));

        // Set the step rotation
        _index[j].rotation(radians);

        // Increment the rotation for the nexxt iteration
        radians -= radIncrement;
        textRadians += radIncrement;
      }
    }

    function spin(stepTitle){
      // Set the new wheel rotation
      var radians = parseFloat(_store[stepTitle].rotation()) || Math.PI,
      degrees = radiansToDegrees(radians);

      // Now animate it, chaining other animations to the complete property
      $('#wheel').velocity({
        rotateZ: 1080 + degrees
      }, {
        duration: 1500,
        complete: function(){
          showBox(stepTitle, degrees);
        }
      });
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
