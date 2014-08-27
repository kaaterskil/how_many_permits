(function($){
  var roadMap = function(){
    var _store = [];

    //---------- Private functions ----------//

    function setStore(store) {
      _store = [];
      store.map(function(step){
        if(step.category() !== 'Information') {
          _store.push(step);
        }
      });
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

    //---------- Public functions ----------//

    function initialize(store){
      setStore(store);

      var mapWidth = $('#road-map').innerWidth(),
      mapTop = $('#road-map').position().top,
      numSteps = _store.length,
      gutterWidth = computeGutter(mapWidth),
      left = gutterWidth < 0 ? 0 : gutterWidth,
      startLeft = mapWidth - left - 20;

      for(var i = (numSteps - 1); i >= 0; i -= 1) {
        var stepBox = createStepBox(_store[i], startLeft);
        $('#road-map').append($(stepBox));

        var description = createStepBoxDescription(_store[i], left);
        $('#road-map').append($(description));

        $(stepBox).velocity({ left: left }, { duration: 500 });

        left += 20 + gutterWidth;
      }
    }

    return {
      initialize: initialize
    }
  }

  var module = angular.module('ISDApp.roadMap');
  module.service('roadMap', roadMap);
})(jQuery);
