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

    function getScope(){
      var app = document.querySelector('[ng-app=ISDApp]'),
      appScope = angular.element(app).scope();
      return appScope.$$childHead;
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

    function setResultText(step, $container, radioBtnTxt){
      var responses = step.responses(),
      responseText, response;

      // Select or create a new response text element
      if($container.children('.step-response-text').length) {
        responseText = $container.children('.step-response-text');
      } else {
        responseText = document.createElement('div');
        $(responseText).addClass('step-response-text');
        $container.prepend($(responseText));
      }

      // Assign the response text
      for(var j = 0; j < responses.length; j++) {
        response = responses[j];
        if(response.radioBtnText() === radioBtnTxt) {
          $(responseText).html(response.text());
        }
      }
    }

    function createOrShowBoxForm(stepTitle, stepId){
      var ctrlScope = getScope();

      if($(stepId + ' .step-box .step-form-container').length === 0){
        var step = _store[stepTitle],
        responses = step.responses(),
        formContainer = document.createElement('div');
        $(formContainer).addClass('step-form-container');

        var responseContainer = document.createElement('div');
        $(responseContainer).addClass('step-response-container');
        if(responses.length > 1) {
          $(responseContainer).addClass('hidden');
        }

        if(responses.length > 1) {
          var response, title, id, $label, $radioBtn;
          for(var j = 0; j < responses.length; j += 1) {
            response = responses[j];
            title = stepTitle.replace(/\s/g, '_');
            id = title + '_' + j;

            $label = $('<div class="step-response-btn"><label for="' + id + '">' + response.radioBtnText() + '</label></div>');
            $radioBtn = $('<input type="radio">')
            .attr({
              id: id,
              name: title,
              value: response.radioBtnText()
            })
            .data({
              step: step.id(),
              response: response.id()
            })
            .on('click', function(event){
              if($(event.target).prop('checked') === true){
                ctrlScope.execute(response);
                setResultText(step, $(responseContainer), $(this).val());
                $(responseContainer).removeClass('hidden')
              }
            });
            $label.prepend($radioBtn);
            $(formContainer).append($label);
          }
        }

        var continueBtn = document.createElement('button');
        $(continueBtn).addClass('step-continue-btn')
        .text(step.continueBtnText())
        .on('click', function(){
          ctrlScope.continue();
        });
        $(responseContainer).append($(continueBtn));

        $(formContainer).append($(responseContainer));
        $(stepId + ' .step-box').append($(formContainer));
      } else {
        $(stepId + ' .step-box .step-form-container').show();
      }
    }

    function growBox(stepTitle, degrees){
      var stepId = '#item' + _store[stepTitle].id();
      createOrShowBoxForm(stepTitle, stepId);
      $(stepId)
      .velocity({ zIndex: 1000, rotateZ: -degrees }, { duration: 0 })
      .velocity({ scale: 2 }, { duration: 500 });
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

    function shrinkBox(step, nextStep){
      var stepId = '#item' + step.id(),
      zIndexValue = $('#item' + nextStep.id()).css('z-index');
      $(stepId)
      .velocity({ scale: 1 }, { duration: 500 })
      .velocity({ zIndex: zIndexValue }, { duration: 0 });
      $(stepId + ' .step-box .step-form-container').hide();
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
          growBox(stepTitle, degrees);
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
      shrinkBox: shrinkBox,
      spin: spin,
      setStore: setStore,
    };
  };

  var module = angular.module('ISDApp.controllers');
  module.service('stepManager', stepManager);
})(window, jQuery);
