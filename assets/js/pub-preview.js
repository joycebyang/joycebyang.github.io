// Publication preview lightbox: every preview (image or video) opens in the
// same fixed-size frame (letterboxed inside it) on an opaque white
// background, so small GIFs, videos and large diagrams enlarge to the same
// size and transparent diagrams stay readable.
document.addEventListener("DOMContentLoaded", function () {
  var thumbs = document.querySelectorAll(".pub-thumb img, .pub-thumb video");
  if (!thumbs.length) return;

  var overlay = document.createElement("div");
  overlay.className = "pub-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  var frame = document.createElement("div");
  frame.className = "pub-lightbox-frame";
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  function close() {
    overlay.classList.remove("is-open");
    frame.innerHTML = "";
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("scroll", close);
  }
  function onKey(e) {
    if (e.key === "Escape") close();
  }

  thumbs.forEach(function (el) {
    el.style.cursor = "zoom-in";
    el.addEventListener("click", function () {
      var big;
      if (el.tagName === "VIDEO") {
        big = document.createElement("video");
        big.muted = true;
        big.loop = true;
        big.autoplay = true;
        big.playsInline = true;
        big.src = el.currentSrc || el.getAttribute("src");
        big.currentTime = el.currentTime;
      } else {
        big = document.createElement("img");
        big.src = el.getAttribute("src");
        big.alt = el.alt || "";
      }
      frame.innerHTML = "";
      frame.appendChild(big);
      overlay.classList.add("is-open");
      document.addEventListener("keydown", onKey);
      window.addEventListener("scroll", close, { passive: true });
    });
  });
  overlay.addEventListener("click", close);
});
