(function ResponsesIIFE(){
  var Responses = function(){
    var that = {};
    that.Response = Response;

    function Response(props){
      var _data = props || {};

      this.get = function(prop) {
        if(typeof prop !== 'undefined'){
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
      }
    }

    Response.prototype = {
      title : function(){
        return this.get('title');
      },

      text : function(){
        return this.get('text');
      },

      requiredPermits : function(){
        return this.get('required_permits');
      },

      resultText : function(){
        return this.get('result_text');
      },

      resultResource : function(){
        return this.get('result_resources');
      },

      radioBtnText : function(){
        return this.get('check_box_text');
      },

      mustBranch : function(){
        return this.get('must_branch');
      },

      getBranchStep : function(){
        return this.get('branchStep');
      },

      setBranchStep : function(step){
        this.set('branchStep', step);
      },

      getNextStep : function(){
        return this.get('nextStep');
      },

      setNextStep : function(step){
        this.set('nextStep', step);
      }
    };

    return that;
  };

  var app = angular.module('ISDApp.responses', []);
  app.factory('Responses', Responses);
})();



