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
          if(permit === '') {
            permit = 'No Action Required';
          }
          if(typeof results[permit] === 'undefined'){
            results[permit] = { permit: permit, items: [] };
          }
          var result = {
            question: 'Question ' + (i + 1) + ': ' + question.step.text(),
            response: 'Response: ' + question.response.radioBtnText(),
            checklist: 'Checklist: ' + question.response.resultText(),
            resources: 'Resources: ' + question.response.resultResource()
          };
          results[permit].items.push(result);
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

    function toString(){
      var str = '',
      results = getResults();
      for(permit in results) {
        str += '<div class="results-permit-container">\n'
        str += '\t<div class="results-permit">' + permit.toUpperCase() + '</div>\n';
        results[permit].forEach(function(result){
          str += '\t<div class="results-question">\n';
          result.forEach(function(item){
            str += '\t\t<p class="results-item">' + item + '</p>\n';
          });
          str += '\t</div>\n</div>\n';
        });
      }
      return str;
    }

    return {
      addQuestion: addQuestion,
      getQuestionnaire: getQuestionnaire,
      getResults: getResults,
      hasQuestion: hasQuestion,
      rewindTo: rewindTo,
      toString: toString
    }
  }

  var app = angular.module('ISDApp.resultsHelper');
  app.service('resultsHelper', resultsHelper);
})();
