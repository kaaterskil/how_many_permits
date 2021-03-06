(function(){
  var step = function(){
    function Step(props){
      var _data = {};
      for(prop in props) {
        _data[prop] = props[prop];
      }
      _data['responses'] = [];

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
      id : function(){
        return this.get('id');
      },

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

      color : function(color){
        if(typeof color !== 'undefined') {
          return this.set('color', color);
        }
        return this.get('color');
      },

      rotation : function(rotation){
        if(typeof rotation !== 'undefined') {
          return this.set('rotation', rotation)
        }
        return this.get('rotation');
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
          return response.execute();
        }
        return undefined;
      },

      compare : function(a, b){
        var categoryA = a.category(),
        categoryB = b.category();

        return categoryA < categoryB ? -1 : (categoryA > categoryB ? 1 : 0);
      }
    };

    Step.build = function(props){
      return new Step(props);
    }

    Step.apiResponseTransform = function(jsonData){
      if(angular.isArray(jsonData)) {
        var result = {};
        var temp = jsonData.map(Step.build);
        temp.forEach(function(step){
          result[step.id()] = step;
        });
        return result;
      }
      return Step.build(jsonData);
    };

    // Return the constructor
    return Step;
  }

  var module = angular.module('ISDApp.step');
  module.factory('Step', step);
})();
