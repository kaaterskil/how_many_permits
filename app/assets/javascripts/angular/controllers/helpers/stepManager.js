(function(){
  var stepManager = function(Step, roadMap){
    var _store = {},
    _index = [],
    _scale = 1.75;

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
      $('#road-map').width(window.innerWidth - 30);
    }

    function getResponse(step, radioBtnText){
      var responses = step.responses(),
      len = responses.length;
      for(var i = 0; i < len; i += 1) {
        if(responses[i].radioBtnText() === radioBtnText) {
          return responses[i];
        }
      }
      return undefined;
    }

    function getResponseTextHeight($stepBox, $responseText){
      var boxTop = $stepBox.offset().top,
      boxHeight = $stepBox.outerHeight(true) * _scale,
      formTop = $stepBox.find('.step-form-container').offset().top,
      formHeight = $stepBox.find('.step-form-container').outerHeight(true) * _scale,
      btnHeight = $stepBox.find('.step-continue-btn').outerHeight(true) * _scale,
      availHeight = ((boxTop + boxHeight) - (formTop + formHeight) - btnHeight - 20) / _scale,
      neededHeight = $responseText.height() * _scale;
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

        // Create a container for the possible responses
        var responseContainer = document.createElement('div');
        $(responseContainer).addClass('step-response-container');
        if(responses.length > 1) {
          $(responseContainer).addClass('hidden');
        }
        $(stepId + ' .step-box').append($(responseContainer));

        // Now build radio button elements for each response
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
                var response = getResponse(step, $(this).val());
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
        $(stepId + ' input').prop('checked', false);
        $(stepId + ' .step-box .step-form-container').show();
        $(stepId + ' .step-box .step-response-container').show();
      }
    }

    function growBox(stepTitle, degrees){
      var stepId = '#item' + _store[stepTitle].id();
      createOrShowBoxForm(stepTitle, stepId);
      $(stepId)
      .velocity({ zIndex: 1000, rotateZ: -degrees }, { duration: 0 })
      .velocity({ scale: _scale }, { duration: 500 });
    }

    //---------- Public functions ----------//

    function initializeWheel(stepTitle){
      var width = $(window).width(),
      height = $(window).height(),
      radius = 700,
      outerRadius = 862,
      radians = Math.PI,
      textRadians = radians,
      keys = Object.getOwnPropertyNames(_store),
      numSteps = keys.length,
      radIncrement = (Math.PI * 2) / numSteps,
      origin = {x: width / 2, y: outerRadius},
      category = '',
      step, key, stepContainer, stepBox, color, newX, newY, rotation;

      $('#wheel-container').css({ 'left': (origin.x - 862) });
      window.addEventListener('resize', autoCenterWheel, false);
      // $('#spin-me').css({
      //   right: (width / 2) > 862 ? -20 : 882 - (width / 2)
      // });

      for(var j = (numSteps - 1); j >= 0; j -= 1) {
        step = _index[j];

        // Compute top/left coordinates
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
        $(stepBox).css({ 'background': color });
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

    function branchRoadMap(step, response){
      roadMap.insertBranch(step, response);
    }

    function get(title){
      if(typeof title === 'undefined') {
        return _store;
      }
      return _store[title];
    }

    function getBumpedStep(){
      return roadMap.getBumpedStep();
    }

    function gratuitousSpin(step) {
      $('#item' + step.id()).velocity({
        scale: 1
      }, {
        duration: 500,
        complete: function(){
          spin(step.title(), true);
        }
      });
    }

    function hasBumpedStep(){
      return roadMap.hasBumpedStep();
    }

    function highlightRoadMapStep(stepTitle){
      var step = _store[stepTitle];
      roadMap.highlightStepBox(step);
    }

    function isNewBranch(response){
      return roadMap.isNewBranch(response);
    }

    function setStore(steps) {
      _store = {},
      _index = [];
      for(key in steps) {
        _store[steps[key].title()] = steps[key];
        _index.push(steps[key]);
      }
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

    function spin(stepTitle, gratuitous){
      var radians = parseFloat(_store[stepTitle].rotation()) || Math.PI,
      degrees = radiansToDegrees(radians)
      gratuitous = gratuitous || false;

      $('#wheel').velocity({
        rotateZ: gratuitous ? [(1080 + degrees), degrees] : (1080 + degrees)
      }, {
        duration: 1500,
        complete: function(){
          growBox(stepTitle, degrees);
        }
      });
    }

    return {
      branchRoadMap: branchRoadMap,
      get: get,
      getBumpedStep: getBumpedStep,
      gratuitousSpin: gratuitousSpin,
      hasBumpedStep: hasBumpedStep,
      highlightRoadMapStep: highlightRoadMapStep,
      initializeWheel: initializeWheel,
      isNewBranch: isNewBranch,
      setStore: setStore,
      shrinkBox: shrinkBox,
      spin: spin
    };
  };

  stepManager.$inject = ['Step', 'roadMap'];

  var module = angular.module('ISDApp.controllers');
  module.service('stepManager', stepManager);
})();
