// Photo gallery: folders open a popup panel; photos enlarge inside the panel.
(function () {
  "use strict";

  function setupPanel(panel) {
    var closeBtn = panel.querySelector(".gallery-close");
    var grid = panel.querySelector(".gallery-grid");
    var viewer = panel.querySelector(".gallery-viewer");
    var thumbs = Array.prototype.slice.call(panel.querySelectorAll(".gallery-thumb"));
    var index = 0;

    closeBtn.addEventListener("click", function () {
      panel.close();
    });

    // Clicking the dimmed area outside the panel closes it.
    panel.addEventListener("click", function (e) {
      if (e.target === panel) panel.close();
    });

    if (!viewer || thumbs.length === 0) return;

    var img = viewer.querySelector(".gallery-viewer-img");
    var cap = viewer.querySelector(".gallery-viewer-cap");
    var pos = viewer.querySelector(".gallery-viewer-pos");
    var single = thumbs.length < 2;
    viewer.querySelector(".gallery-prev").hidden = single;
    viewer.querySelector(".gallery-next").hidden = single;

    function showPhoto(n) {
      index = (n + thumbs.length) % thumbs.length;
      var t = thumbs[index];
      img.src = t.getAttribute("data-src");
      img.alt = t.getAttribute("data-caption") || "";
      cap.textContent = t.getAttribute("data-caption") || "";
      pos.textContent = index + 1 + " / " + thumbs.length;
      grid.hidden = true;
      viewer.hidden = false;
      viewer.querySelector(".gallery-back").focus();
    }

    function showGrid() {
      viewer.hidden = true;
      grid.hidden = false;
      if (thumbs[index]) thumbs[index].focus();
    }

    thumbs.forEach(function (t, n) {
      t.addEventListener("click", function () {
        showPhoto(n);
      });
    });
    viewer.querySelector(".gallery-prev").addEventListener("click", function () {
      showPhoto(index - 1);
    });
    viewer.querySelector(".gallery-next").addEventListener("click", function () {
      showPhoto(index + 1);
    });
    viewer.querySelector(".gallery-back").addEventListener("click", showGrid);

    panel.addEventListener("keydown", function (e) {
      if (viewer.hidden) return;
      if (e.key === "ArrowLeft") showPhoto(index - 1);
      if (e.key === "ArrowRight") showPhoto(index + 1);
    });

    // Always reopen on the grid view.
    panel.addEventListener("close", function () {
      viewer.hidden = true;
      grid.hidden = false;
    });
  }

  document.querySelectorAll(".gallery-panel").forEach(setupPanel);

  document.querySelectorAll(".folder-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var panel = document.getElementById("gallery-" + card.getAttribute("data-folder"));
      if (panel && typeof panel.showModal === "function") panel.showModal();
    });
  });

  // Links like /gallery/#gallery-rss-2026 open that folder directly.
  if (location.hash) {
    var linked = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (linked && linked.classList.contains("gallery-panel") && typeof linked.showModal === "function") {
      linked.showModal();
    }
  }
})();
