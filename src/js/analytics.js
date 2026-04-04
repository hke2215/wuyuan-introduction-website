(function () {
  "use strict";

  var STORAGE_KEY = "user_access_analysis";

  function setAnalytics(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getAnalytics() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  var data = getAnalytics();
  var today = new Date().toISOString().slice(0, 10);

  if (!data.visitorId) {
    data.visitorId =
      "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    data.totalVisitors = (data.totalVisitors || 0) + 1;
  }

  if (!data.dailyVisits) data.dailyVisits = {};
  if (!data.dailyVisits[today]) data.dailyVisits[today] = 0;
  data.dailyVisits[today]++;

  data.pageTotalVisits = (data.pageTotalVisits || 0) + 1;

  if (!data.historyVisits) data.historyVisits = [];
  data.historyVisits.push({
    page: document.title,
    url: location.pathname,
    time: new Date().toISOString(),
    referrer: document.referrer || "(direct)",
    screenWidth: screen.width,
    screenHeight: screen.height,
    userAgent: navigator.userAgent,
  });
  if (data.historyVisits.length > 500)
    data.historyVisits = data.historyVisits.slice(-500);

  if (!data.totalBookings) data.totalBookings = 0;

  if (!data.bookings) data.bookings = [];

  if (!data.emailSubscribers) data.emailSubscribers = [];

  if (!data.feedbacks) data.feedbacks = [];

  var startTime = Date.now();
  window.addEventListener("beforeunload", function () {
    data = getAnalytics();
    if (!data.dwellTimes) data.dwellTimes = [];
    data.dwellTimes.push({
      page: location.pathname,
      seconds: Math.round((Date.now() - startTime) / 1000),
      date: today,
    });
    if (data.dwellTimes.length > 200)
      data.dwellTimes = data.dwellTimes.slice(-200);
    setAnalytics(data);
  });

  setAnalytics(data);

  window.AnalyticsModule = {
    getAnalytics: getAnalytics,
    setAnalytics: setAnalytics,
    today: today,
  };
})();
