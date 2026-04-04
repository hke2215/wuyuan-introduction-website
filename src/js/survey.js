(function () {
  "use strict";

  var form = document.getElementById("surveyForm");

  var progressFill = document.getElementById("progressFill");
  var totalQuestions = 10;

  function updateProgress() {
    var answered = 0;
    for (var i = 1; i <= totalQuestions; i++) {
      if (form.querySelector('input[name="q' + i + '"]:checked')) {
        answered++;
      }
    }
    var pct = Math.round((answered / totalQuestions) * 100);
    if (progressFill) progressFill.style.width = pct + "%";
  }

  if (form) {
    form.addEventListener("change", updateProgress);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var answers = {};
      var allAnswered = true;
      for (var i = 1; i <= totalQuestions; i++) {
        var selected = form.querySelector('input[name="q' + i + '"]:checked');
        if (selected) {
          answers["q" + i] = parseInt(selected.value);
        } else {
          allAnswered = false;
        }
      }

      if (!allAnswered) {
        for (var j = 1; j <= totalQuestions; j++) {
          if (!form.querySelector('input[name="q' + j + '"]:checked')) {
            var q = form.querySelector('[data-q="' + j + '"]');
            if (q) q.scrollIntoView({ behavior: "smooth", block: "center" });
            break;
          }
        }
        return;
      }

      try {
        var STORAGE_KEY = "user_questionnaire";
        var data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        if (!data.surveyResults) data.surveyResults = [];
        data.surveyResults.push({
          answers: answers,
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (ex) {}

      form.style.display = "none";
      var success = document.getElementById("surveySuccess");
      if (success) success.classList.add("active");
      if (progressFill) progressFill.style.width = "100%";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
