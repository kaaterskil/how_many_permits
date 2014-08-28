(function(){
  var resultsHelper = function(){
    var _questions = [];

    function addQuestion(step, response){
      _questions.push({ step: step, response: response });
    }

    function rewindTo(step){
      // Can't use indexOf() because we don't have the response
      var offset = -1, len = _questions.length;
      for(var i = 0; i < len; i++) {
        if(_questions[i].title === step.title) {
          offset = i;
          break;
        }
      }
      if(offset > -1) {
        _questions = _questions.slice(0, offset);
        return true;
      }
      return false;
    }

    function getQuestionnaire() {
      var result = [];
      _questions.map(function(question){
        result.push(question);
      });
      return result;
    }

    function getResults(){
      var results = {},
      len = _questions.length,
      text = '';

      for(var i = 0; i < len; i++){
        var question = _questions[i],
        permits = question.response.requiredPermits();

        permits.map(function(permit){
          if(typeof results[permit] === 'undefined'){
            results[permit] = [];
          }
          var result = [
            'Question ' + i + ': ' + question.step.text(),
            'Response: ' + question.response.radioBtnText(),
            'Checklist: ' + question.response.resultText(),
            'Resources: ' + question.response.resultResource()
          ];
          results[permit].push(result);
        });
      }
      return results;
    }

    function hasQuestion(stepId){
      var len = _questions.length;
      for(var i = 0; i < len; i += 1) {
        if(stepId === _questions[i].step.id()) {
          return true;
        }
      }
      return false;
    }

    return {
      addQuestion: addQuestion,
      getQuestionnaire: getQuestionnaire,
      getResults: getResults,
      hasQuestion: hasQuestion,
      rewindTo: rewindTo
    }
  }

  var app = angular.module('ISDApp.resultsHelper');
  app.service('resultsHelper', resultsHelper);
})();
