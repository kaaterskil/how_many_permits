(function($){
  var roadMap = function(resultsHelper){
    var _store = []
    _roadMap = [];

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

    function getStep(id){
      var len = _roadMap.length;
      for(var i = 0; i < len; i += 1) {
        if(_roadMap[i].id() === id) {
          return _roadMap[i];
        }
      }
      return undefined;
    }

    function computeGutter(width) {
      var numBoxes = _store.length;
      return (width - (numBoxes * 20)) / (numBoxes + 1);
    }

    function createStepBox(step, left) {
      var stepBox = document.createElement('div');
      $(stepBox).addClass('road-map-box');
      $(stepBox).attr({
        id: 'roadMap' + step.id()
      })
      .data('id', step.id())
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

    function rewind(id){
      if(!resultsHelper.hasQuestion(id)) {
        alert("Sorry but you can't skip ahead");
      } else if(confirm("Would you like to rewind back to this question?")){
        var step = getStep(id);
        resultsHelper.rewindTo(step);
        getScope().reset(step.title(), true);
      }
    }

    //---------- Public functions ----------//

    function initialize(index, store, stepTitle){
      setStore(index, store, stepTitle);

      var mapWidth = $('#road-map').innerWidth(),
      mapTop = $('#road-map').position().top,
      numSteps = _roadMap.length,
      gutterWidth = computeGutter(mapWidth),
      left = gutterWidth < 0 ? 0 : gutterWidth,
      startLeft = mapWidth - left - 20;

      for(var i = 0; i < numSteps; i += 1) {
        var stepBox = createStepBox(_roadMap[i], startLeft);
        $('#road-map').append($(stepBox));

        var description = createStepBoxDescription(_roadMap[i], left);
        $('#road-map').append($(description));

        $(stepBox).velocity({ left: left }, { duration: 500 });

        left += 20 + gutterWidth;
      }
    }

    function highlightStepBox(step) {
      $('.road-map-box').css('border', 'none');
      $('#roadMap' + step.id()).css({
        'border-color': "#000000",
        'border-weight': '1px',
        'border-style': 'solid'
      });
    }

    return {
      highlightStepBox: highlightStepBox,
      initialize: initialize
    }
  }

  var module = angular.module('ISDApp.roadMap');
  module.service('roadMap', roadMap);
})(jQuery);
