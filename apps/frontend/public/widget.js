// public/widget.js
(function () {
  var scriptEl = document.currentScript;
  if (!scriptEl) return;

  var origin = new URL(scriptEl.src).origin;

  var theme = scriptEl.dataset.theme || "light";

  var container = document.createElement("div");
  container.style.width = "100%";
  scriptEl.insertAdjacentElement("afterend", container);

  var iframe = document.createElement("iframe");
  iframe.src = origin + "/special?theme=" + encodeURIComponent(theme);
  iframe.title = "My Widget";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.style.border = "0";
  iframe.style.width = "100%";
  iframe.style.height = "0px";

  iframe.setAttribute("sandbox", "allow-scripts allow-forms allow-same-origin");
  container.appendChild(iframe);

  // Resize + event handling from the child
  function onMessage(event) {
    console.log("inside on message");

    // Only accept messages from our own origin
    if (event.origin !== origin) return;
    var data = event.data || {};
    if (data.type === "EMBED_SIZE" && typeof data.height === "number") {
      iframe.style.height = data.height + "px";
    } else if (data.type === "EMBED_EVENT") {
      console.log("inside on message 2");
      // Re-dispatch as a DOM CustomEvent so host pages can hook in
      container.dispatchEvent(new CustomEvent("my-widget", { detail: data }));
    }
  }
  window.addEventListener("message", onMessage);

  // Optional simple API
  window.MyWidget = window.MyWidget || {
    on: function (handler) {
      container.addEventListener("my-widget", handler);
    },
  };
})();
