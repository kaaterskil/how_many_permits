(function(){
  var roadMap = function(resultsHelper){
    var _store = []
    _roadMap = [],
    _gutterWidth = 0;

    //---------- Private functions ----------//

    function getScope(){
      var app = document.querySelector('[ng-app=ISDApp]'),
      appScope = angular.element(app).scope();
      return appScope.$$childHead;
    }

    function setStore(storeArray, storeObject, stepTitle) {
      _store = [];
      storeArray.map(function(step){
        if(step.category() !== 'Information') {
          _store.push(step);
        }
      });

      _roadMap = [];
      var step = storeObject[stepTitle];
      while(typeof step !== 'undefined'){
        if(step.category() !== 'Information') {
          _roadMap.push(step);
        }
        var responses = step.responses();
        step = responses[0].getNextStep();
      }
    }

    function getBranch(beginningStep, branch){
      var branch = branch || [],
      step = beginningStep;
      while(typeof step !== 'undefined'){
        branch.push(step);
        var responses = step.responses();
        step = responses[0].getNextStep();
      }
      return branch;
    }

    function getStep(id){
      var len = _roadMap.length;
      for(var i = 0; i < len; i += 1) {
        if(_roadMap[i].id() === id) {
          return _roadMap[i];
        }
      }
      return undefined;
    }

    function computeGutterWidth(containerWidth) {
      var numBoxes = _store.length;
      _gutterWidth = (containerWidth - (numBoxes * 20)) / (numBoxes + 1);
    }

    function createStepBox(step, left) {
      var stepBox = document.createElement('div');
      $(stepBox).addClass('road-map-box');
      $(stepBox).attr({
        id: 'roadMap' + step.id()
      })
      .data({
        id: step.id(),
        zIndex: $(stepBox).css('z-index')
      })
      .css({
        backgroundColor: step.color(),
        left: left
      })
      .mouseenter(function(event) {
        $('#roadMapDescription' + $(event.target).data('id')).css({
          display: 'block'
        });
      })
      .mouseleave(function(event) {
        $('#roadMapDescription' + $(event.target).data('id')).css({
          display: 'none'
        });
      })
      .on('click', function(event){
        rewind(parseInt($(this).data('id')));
      });
      return stepBox;
    }

    function createStepBoxDescription(step, left){
      var description = document.createElement('div');
      $(description).addClass('road-map-box-description');
      $(description).attr({
        id: 'roadMapDescription' + step.id()
      })
      .css({
        left: left
      })
      .text(step.title());
      return description;
    }

    function reinitializeAt(step) {
      var mapWidth = $('#road-map').innerWidth(),
      mapTop = $('#road-map').position().top,
      left = $('#roadMap' + step.id()).position().left + _gutterWidth + 20,
      startLeft = mapWidth - (_gutterWidth < 0 ? 0 : _gutterWidth) - 20,
      index = _roadMap.indexOf(step) + 1,
      numSteps = _roadMap.length;

      for(var i = index; i < numSteps; i += 1) {
        var stepBox = createStepBox(_roadMap[i], startLeft);
        $('#road-map').append($(stepBox));

        var description = createStepBoxDescription(_roadMap[i], left);
        $('#road-map').append($(description));

        $(stepBox).velocity({ left: left }, { duration: 750 });
        left += 20 + _gutterWidth;
      }
    }

    function doRewind(step){
      var index = _roadMap.indexOf(step)
      left = $('#roadMap' + step.id()).position().left + _gutterWidth + 20,
      startLeft =
      len = _roadMap.length;
      for(var i = (index + 1); i < len; i += 1){
        // Remove existing step boxes as there could be unneeded branches
        $('#roadMap' + _roadMap[i].id()).remove();
        $('#roadMapDescription' + _roadMap[i].id()).remove();

        // Regenerate
        _roadMap = getBranch(step, _roadMap.slice(0, index));
        reinitializeAt(step);
      }
    }

    function rewind(id){
      if(!resultsHelper.hasQuestion(id)) {
        alert("Sorry but you can't skip ahead");
        return;
      }
      if(confirm("Would you like to rewind back to this question?")){
        var step = getStep(id);
        resultsHelper.rewindTo(step);
        doRewind(step);
        getScope().reset(step.title(), true);
      }
    }

    function shiftRoadMap(startingIndex, requiredWidth){
      var len = _roadMap.length;
      for(var i = (len - 1); i > startingIndex; i -= 1) {
        var step = _roadMap[i],
        currentLeft = $('#roadMap' + step.id()).position().left,
        newLeft = currentLeft + requiredWidth;
        $('#roadMap' + step.id()).velocity({
          left: newLeft
        }, {
          duration: 500
        });
      }
    }

    function doInsertBranch(leftStep, rightStep, branch, requiredWidth){
      var leftStepPosition = $('#roadMap' + leftStep.id()).position(),
      startLeft = leftStepPosition.left + requiredWidth,
      left = leftStepPosition.left + 20,
      len = branch.length;
      for(var i = 0; i < len; i += 1){
        var stepBox = createStepBox(branch[i], startLeft);
        $('#road-map').append($(stepBox));

        var description = createStepBoxDescription(branch[i], left);
        $('#road-map').append($(description));

        $(stepBox).velocity({ left: left }, { duration: 300 });
        left += 20 + _gutterWidth;
      }
    }

    //---------- Public functions ----------//

    function initialize(index, store, stepTitle){
      var mapWidth = $('#road-map').innerWidth(),
      mapTop = $('#road-map').position().top;

      setStore(index, store, stepTitle);
      computeGutterWidth(mapWidth);

      var left = _gutterWidth < 0 ? 0 : _gutterWidth,
      startLeft = mapWidth - left - 20,
      numSteps = _roadMap.length;

      for(var i = 0; i < numSteps; i += 1) {
        var stepBox = createStepBox(_roadMap[i], startLeft);
        $('#road-map').append($(stepBox));

        var description = createStepBoxDescription(_roadMap[i], left);
        $('#road-map').append($(description));

        $(stepBox).velocity({ left: left }, { duration: 750 });
        left += 20 + _gutterWidth;
      }
    }

    function insertBranch(currentStep, response){
      if(!response.mustBranch()) {
        return;
      }
      var index = _roadMap.indexOf(currentStep),
      nextStep = response.getBranchStep();
      if(_roadMap.indexOf(nextStep) < 0) {
        var branch = getBranch(nextStep),
        numSteps = branch.length,
        requiredWidth = numSteps * (20 + _gutterWidth),
        bumpedStep = _roadMap[index + 1];

        shiftRoadMap(index, requiredWidth);
        doInsertBranch(currentStep, bumpedStep, branch, requiredWidth);
      }
    }

    function highlightStepBox(step) {
      $('.road-map-box').each(function(i){
        $(this).css({
          'border-top': '1px solid #fff',
          'border-right': 'none',
          'border-bottom': 'none',
          'border-left': 'none',
          'z-index': $(this).data('zIndex')
        });
      });

      $('#roadMap' + step.id())
      .css({
        'border-color': "#000000",
        'border-weight': '1px',
        'border-style': 'solid',
        'z-index': 1000
      });
    }

    return {
      highlightStepBox: highlightStepBox,
      initialize: initialize,
      insertBranch: insertBranch
    }
  }

  roadMap.$inject = ['resultsHelper'];

  var module = angular.module('ISDApp.roadMap');
  module.service('roadMap', roadMap);
})();
