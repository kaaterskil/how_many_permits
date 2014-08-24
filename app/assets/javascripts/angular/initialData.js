(function InitialDataIIFE(){
  var InitialData = function($http, $q, StepService, Steps, Responses){
    return function(){
      var stepData = StepService.getStepData(),
      responseData = StepService.getResponseData();

      return $q.all([stepData, responseData]).then(function(results){
        var temp = [], steps = {};

        // Instantiate step objects from the server call
        results[0].steps.forEach(function(obj){
          var props = obj.steps;
          temp[props.id] = new Steps.Step(props);
        });

        // Instantiate response objects and associate with steps
        // Note: Because of the potential recursion in the tree map between
        // steps, next steps and branch steps, we cannot return a collection
        // of responses along with the initial AJAX call for steps. This way,
        // all steps are instantiated first, and then associated with their
        // responses.
        results[1].responses.forEach(function(obj){
          var props = obj.responses,
          stepId = props.step_id;

          var response = new Responses.Response({
            id : props.id,
            title : props.title,
            text : props.text,
            required_permits : props.required_permit.split(/\s*;\s*/),
            result_text : props.result_text,
            result_resources : props.result_resources,
            check_box_text : props.check_box_text,
            must_branch : props.must_branch
          });
          response.setNextStep(temp[props.next_step_id]);
          response.setBranchStep(temp[props.branch_step_id]);

          temp[stepId].addResponse(response);
        });

        temp.forEach(function(step){
          steps[step.title()] = step;
        });

        return {
          steps : steps
        };
      });
    }
  };

  var app = angular.module('ISDApp.initialData', ['ISDApp.stepService', 'ISDApp.steps', 'ISDApp.responses']);
  app.factory('InitialData', InitialData);
})();
