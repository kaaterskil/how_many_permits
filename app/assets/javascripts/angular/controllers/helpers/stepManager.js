(function(window, $){
  var stepManager = function(Step, roadMap){
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

    function getRandomColor(){
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

    function autoCenterWheel(){
      $('#wheel-container').css({
        left: (window.innerWidth / 2) - 862
      });
    }

    function getResponseTextHeight($stepBox, $responseText){
      var boxTop = $stepBox.offset().top,
      boxHeight = $stepBox.outerHeight(true) * 2,
      formTop = $stepBox.find('.step-form-container').offset().top,
      formHeight = $stepBox.find('.step-form-container').outerHeight(true) * 2,
      btnHeight = $stepBox.find('.step-continue-btn').outerHeight(true) * 2,
      availHeight = ((boxTop + boxHeight) - (formTop + formHeight) - btnHeight - 20) / 2,
      neededHeight = $responseText.height() * 2;
      return availHeight < neededHeight ? availHeight : neededHeight;
    }

    function getResponseTextElement($container){
      if($container.children('.step-response-text').length) {
        responseText = $container.children('.step-response-text');
      } else {
        responseText = document.createElement('div');
        $(responseText).addClass('step-response-text');
        $container.prepend($(responseText));
      }
      return responseText;
    }

    function setResponseText(step, $container, radioBtnTxt){
      var responses = step.responses(),
      responseText = getResponseTextElement($container)
      $stepBox = $('#item' + step.id());

      for(var j = 0; j < responses.length; j++) {
        var response = responses[j];
        if(response.radioBtnText() === radioBtnTxt) {
          $(responseText).html(response.text());
          $(responseText).height(
            getResponseTextHeight($('#item' + step.id()), $(responseText))
          );
          break;
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
        $(stepId + ' .step-box').append($(formContainer));

        var responseContainer = document.createElement('div');
        $(responseContainer).addClass('step-response-container');
        if(responses.length > 1) {
          $(responseContainer).addClass('hidden');
        }
        $(stepId + ' .step-box').append($(responseContainer));

        if(responses.length > 1) {
          var response, title, id, $label, $radioBtn, html;
          for(var j = 0; j < responses.length; j += 1) {
            response = responses[j];
            title = stepTitle.replace(/\s/g, '_');
            id = title + '_' + j;

            html = '<div class="step-response-btn"><label for="' + id + '">';
            html += response.radioBtnText() + '</label></div>'
            $label = $(html);
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
                setResponseText(step, $(responseContainer), $(this).val());
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

    function initializeWheel(stepTitle){
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
      color = getRandomColor(),
      step, key, category, stepContainer, stepBox, color, newX, newY, rotation;

      $('#wheel-container').css({ 'left': (origin.x - 862) });
      window.addEventListener('resize', autoCenterWheel, false);

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
          color = getRandomColor();
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
        step.color(color);

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
      roadMap.initialize(_index, _store, stepTitle);
    }

    function shrinkBox(step, nextStep){
      var stepId = '#item' + step.id(),
      zIndexValue = $('#item' + nextStep.id()).css('z-index');
      $(stepId)
      .velocity({ scale: 1 }, { duration: 500 })
      .velocity({ zIndex: zIndexValue }, { duration: 0 });
      $(stepId + ' .step-box .step-form-container').hide();
      $(stepId + ' .step-box .step-response-container').hide();
    }

    function spin(stepTitle){
      // Set the new wheel rotation
      var radians = parseFloat(_store[stepTitle].rotation()) || Math.PI,
      degrees = radiansToDegrees(radians);

      // Now animate it, chaining other animations to the complete property
      $('#wheel').velocity({
        rotateZ: (1080 + degrees)
      }, {
        duration: 1500,
        complete: function(){
          growBox(stepTitle, degrees);
        }
      });
    }

    function highlightRoadMapStep(stepTitle){
      var step = _store[stepTitle];
      roadMap.highlightStepBox(step);
    }

    function gratuitousSpin(step) {
      shrinkBox(step, step);
      spin(step.title());
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
      gratuitousSpin: gratuitousSpin,
      highlightRoadMapStep: highlightRoadMapStep,
      initializeWheel: initializeWheel,
      shrinkBox: shrinkBox,
      spin: spin,
      setStore: setStore,
    };
  };

  var module = angular.module('ISDApp.controllers');
  module.service('stepManager', stepManager);
})(window, jQuery);
