(function () {
  "use strict";

  var STORAGE_KEY = "user_access_analysis";

  function getAnalytics() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveAnalytics(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function updateStatsUI(data) {
    var today = todayKey();
    var el;
    el = document.getElementById("totalVisitors");
    if (el) el.textContent = data.totalVisitors || 0;
    el = document.getElementById("todayVisitors");
    if (el) el.textContent = (data.dailyVisits && data.dailyVisits[today]) || 0;
    el = document.getElementById("totalBookings");
    if (el) el.textContent = data.totalBookings || 0;
    el = document.getElementById("pageViews");
    if (el) el.textContent = data.pageTotalVisits || 0;
  }

  var analyticsData = getAnalytics();
  updateStatsUI(analyticsData);

  var bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    var dateInput = document.getElementById("date");
    if (dateInput) {
      dateInput.min = todayKey();
    }

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("name").value.trim();
      var phone = document.getElementById("phone").value.trim();
      var guests = document.getElementById("guests").value;
      var date = document.getElementById("date").value;
      var pkg = document.getElementById("package").value;

      if (!name || !phone || !guests || !date || !pkg) {
        alert("Please fill in all required fields.");
        return;
      }

      if (!/^[0-9]{11}$/.test(phone)) {
        alert("Please enter a valid 11-digit mobile phone number.");
        return;
      }

      var data = getAnalytics();
      data.totalBookings = (data.totalBookings || 0) + 1;
      if (!data.bookings) data.bookings = [];
      data.bookings.push({
        name: name,
        phone: phone.slice(0, 3) + "****" + phone.slice(7),
        email: document.getElementById("email").value || "",
        guests: guests,
        date: date,
        package: pkg,
        notes: document.getElementById("notes").value || "",
        submittedAt: new Date().toISOString(),
      });
      saveAnalytics(data);
      updateStatsUI(data);

      showToast("✅ Reservation successful! We will contact you as soon as possible.");
      bookingForm.reset();
    });
  }

  window.selectPackage = function (pkgName) {
    var select = document.getElementById("package");
    if (select) {
      var options = select.options;
      for (var i = 0; i < options.length; i++) {
        if (pkgName.indexOf(options[i].value) !== -1) {
          select.value = options[i].value;
          break;
        }
      }
    }

    var form = document.getElementById("bookingForm");
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () {
        var nameInput = document.getElementById("name");
        if (nameInput) nameInput.focus();
      }, 600);
    }
  };

  var stars = document.querySelectorAll("#starRating .star");
  var ratingInput = document.getElementById("fbRating");
  stars.forEach(function (star) {
    star.addEventListener("click", function () {
      var val = parseInt(this.getAttribute("data-value"));
      if (ratingInput) ratingInput.value = val;
      stars.forEach(function (s) {
        s.classList.toggle(
          "active",
          parseInt(s.getAttribute("data-value")) <= val,
        );
      });
    });
    star.addEventListener("mouseenter", function () {
      var val = parseInt(this.getAttribute("data-value"));
      stars.forEach(function (s) {
        s.classList.toggle(
          "active",
          parseInt(s.getAttribute("data-value")) <= val,
        );
      });
    });
  });
  var starRating = document.getElementById("starRating");
  if (starRating) {
    starRating.addEventListener("mouseleave", function () {
      var current = parseInt(ratingInput ? ratingInput.value : 0);
      stars.forEach(function (s) {
        s.classList.toggle(
          "active",
          parseInt(s.getAttribute("data-value")) <= current,
        );
      });
    });
  }

  var feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("fbName").value.trim();
      var type = document.getElementById("fbType").value;
      var message = document.getElementById("fbMessage").value.trim();
      var rating = document.getElementById("fbRating").value;
      var contact = document.getElementById("fbContact").value.trim();

      if (!name || !type || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      var data = getAnalytics();
      if (!data.feedbacks) data.feedbacks = [];
      data.feedbacks.push({
        name: name,
        contact: contact,
        type: type,
        rating: parseInt(rating),
        message: message,
        submittedAt: new Date().toISOString(),
      });
      saveAnalytics(data);

      showToast("✅ Thank you for your feedback! We will read every message carefully.");
      feedbackForm.reset();
      ratingInput.value = 0;
      stars.forEach(function (s) {
        s.classList.remove("active");
      });
    });
  }

  var exitShown = false;
  var exitModal = document.getElementById("exitModal");

  function showExitModal() {
    if (exitShown || !exitModal) return;
    if (
      document.activeElement &&
      document.activeElement.closest &&
      document.activeElement.closest(".booking-form")
    )
      return;
    exitShown = true;
    exitModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  window.closeExitModal = function () {
    if (exitModal) {
      exitModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  document.addEventListener("mouseout", function (e) {
    if (e.clientY < 5 && !exitShown) {
      showExitModal();
    }
  });

  var mobileTimer;
  if ("ontouchstart" in window) {
    mobileTimer = setTimeout(function () {
      var scrollHandler = function () {
        if (window.scrollY < 50) {
          showExitModal();
          window.removeEventListener("scroll", scrollHandler);
        }
      };
      window.addEventListener("scroll", scrollHandler, { passive: true });
    }, 60000);
  }

  var exitForm = document.getElementById("exitForm");
  if (exitForm) {
    exitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("exitEmail").value.trim();
      if (!email) return;

      var data = getAnalytics();
      if (!data.emailSubscribers) data.emailSubscribers = [];
      data.emailSubscribers.push({
        email: email,
        subscribedAt: new Date().toISOString(),
      });
      saveAnalytics(data);

      showToast("🎉 Subscription successful! The guide will be sent to your email address.");
      window.closeExitModal();
    });
  }

  function showToast(message) {
    var existing = document.querySelector(".success-toast");
    if (existing) existing.remove();

    var toast = document.createElement("div");
    toast.className = "success-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 3500);
  }

  window.addEventListener("beforeunload", function () {
    if (mobileTimer) clearTimeout(mobileTimer);
  });
})();
