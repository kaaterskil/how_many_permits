(function(window, $){
  var stepManager = function(){
    var _store = {};


    function rotateWheel(topStep){
      var rotation = -topStep.rotation();
      $('#wheel').velocity({ rotateZ: rotation }, 1500, 'ease-in-out');
    }

    function randomColor(){
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function rotationDeg(radians){
      return (radians * 180 / Math.PI).toFixed(0) + 'deg';
    }

    function initializeWheel(){
      var $this = $(window),
      width = $this.width(),
      height = $this.height(),
      origin = {x: width / 2 + 5, y: height + 505},
      radius = 700,
      radians = 90,
      keys = Object.getOwnPropertyNames(_store),
      numElements = keys.length,
      radIncrement = (360 / numElements) * Math.PI / 180,
      startX = origin.x - 100,
      startY = origin.y - radius + 162,
      step, key, category, stepContainer, stepBox, color, newX, newY, rotation;

      $('#wheel').attr({
        'left': origin.x + 'px',
        'top': origin.y + 'px'
      });

      // iterate through the store
      for(var j = 0; j < numElements; j += 1) {
        key = keys[j];
        step = _store[key];

        newX = startX + (Math.cos(radians) * radius);
        newY = startY + (Math.sin(radians) * radius);

        if(j === 0 || category !== step.category()) {
          category = step.category();
          color = randomColor();
        }
        rotation = rotationDeg(radians);

        stepBox = document.createElement('div');
        $(stepBox).addClass('step-box');
        $(stepBox).append('<div class="step-title">' + step.title() + '</div>');
        $(stepBox).append('<div class="step-text">' + step.text() + '</div>');
        $(stepBox).css({
          'background': color,
          '-ms-transform': 'rotate(' + rotation + ')',
          '-webkit-transform': 'rotate(' + rotation + ')',
          'transform': 'rotate(' + rotation + ')'
        });

        stepContainer = document.createElement('div');
        $(stepContainer).data('id', step.id());
        $(stepContainer).addClass('step-container');
        $(stepContainer).css({
          'top': newY.toFixed(2) + 'px',
          'left': newX.toFixed(2) + 'px'
        });
        $(stepContainer).append($(stepBox))
        $('#wheel').append($(stepContainer));

        radians += radIncrement;
      }
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

    function sortedStore(comparator){
      var result = [];
      for(key in _store) {
        result.push(_store[key]);
      }
      if(comparator) {
        return result.sort(comparator);
      }
      return result;
    }

    function categoryComparator(a, b){
      return a.category() < b.category()
      ? -1 : (a.category() > b.category() ? 1 : 0)
    }

    return {
      categoryComparator: categoryComparator,
      get: get,
      setStore: setStore,
      initializeWheel: initializeWheel,
      sortedStore: sortedStore
    };
  };

  var module = angular.module('ISDApp.controllers');
  module.service('stepManager', stepManager);
})(window, jQuery);
