(function(){
  var response = function(){

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
      id : function(){
        return this.get('id');
      },

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
        return this.get('branch_step');
      },

      setBranchStep : function(step){
        this.set('branch_step', step);
      },

      getNextStep : function(){
        return this.get('next_step');
      },

      setNextStep : function(step){
        this.set('next_step', step);
      },

      execute : function(){
        if(this.mustBranch()) {
          return this.getBranchStep();
        } else {
          return this.getNextStep();
        }
      }
    };

    Response.apiResponseTransform = function(jsonData, steps){
      if(angular.isArray(jsonData)) {
        var result = {};
        jsonData.forEach(function(obj){
          result[obj.title] = Response.build(obj, steps);
        });
        return result;
      }
      return Response.build(obj, steps);
    };

    Response.build = function(obj, steps){
      var props = {
        id: obj.id,
        title: obj.title,
        text: obj.text,
        required_permits: obj.required_permit.split(/\s*;\s*/),
        result_text: obj.result_text,
        result_resources: obj.result_resources,
        check_box_text: obj.check_box_text,
        must_branch: obj.must_branch
      }
      var response = new Response(props);

      if(obj.next_step_id) {
        response.setNextStep(steps[obj.next_step_id]);
      }
      if(obj.branch_step_id) {
        response.setBranchStep(steps[obj.branch_step_id]);
      }

      steps[obj.step_id].addResponse(response);
      return response;
    };

    return Response;
  }

  var module = angular.module('ISDApp.response');
  module.factory('Response', response);
})();
