(function StepsIIFE(){
  var Steps = function(){
    var that = {};
    that.Step = Step;

    function Step(props){
      var _data = props || {};

      this.get = function(prop){
        if(typeof prop !== 'undefined') {
          return _data[prop];
        }
        return undefined;
      };

      this.set = function(prop, newValue){
        if(typeof prop !== 'undefined') {
          var oldValue = _data[prop];
          _data[prop] = newValue;
          return oldValue;
        }
        return undefined;
      };
    }

    Step.prototype = {
      title : function(){
        return this.get('title');
      },

      category : function(){
        return this.get('category');
      },

      text : function(){
        return this.get('text');
      },

      continueBtnText : function(){
        return this.get('continue_btn_text');
      },

      addResponse : function(response){
        var responses = this.get('responses');
        if(typeof responses === 'undefined') {
          responses = [response];
        } else {
          responses.push(response);
        }
      },

      responses : function(array){
        if(typeof array !== 'undefined') {
          return this.set('responses', array);
        }
        return this.get('responses');
      },

      execute : function(response){
        if(typeof response !== 'undefined') {
          return response.getNextStep();
        }
        return undefined;
      }
    };

    return that;
  }

  var steps = angular.module('ISDApp.steps', []);
  steps.factory('Steps', Steps);
})();
