/* If jQuery or modal dialogs are unavailable, retain the usable inline navigation. */
(function () {
  "use strict";
  if (!window.jQuery || typeof HTMLDialogElement === "undefined") return;

  window.jQuery(function ($) {
    const drawer = document.getElementById("navigation-drawer");
    if (!drawer || typeof drawer.showModal !== "function") return;
    const $toggle = $(".menu-toggle");
    const $close = $(".menu-close");
    let previousOverflow = "";
    let modalActive = false;
    let backdropStart = false;

    function finishClose() {
      if (!modalActive) return;
      modalActive = false;
      document.body.style.overflow = previousOverflow;
      $toggle.attr("aria-expanded", "false");
      $toggle[0].focus({ preventScroll: true });
    }

    function closeDrawer() {
      if (drawer.open) drawer.close();
      finishClose();
    }

    function outsideDrawer(event) {
      const rect = drawer.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom;
    }

    $toggle.on("click", function () {
      if (drawer.open) return;
      drawer.showModal();
      previousOverflow = document.body.style.overflow;
      modalActive = true;
      document.body.style.overflow = "hidden";
      $toggle.attr("aria-expanded", "true");
      $close[0].focus({ preventScroll: true });
    });

    $close.on("click", closeDrawer);
    $(drawer).on("cancel", function (event) {
      event.preventDefault();
      closeDrawer();
    }).on("close", finishClose).on("pointerdown", function (event) {
      backdropStart = event.target === drawer && outsideDrawer(event);
    }).on("click", function (event) {
      if (backdropStart && event.target === drawer && outsideDrawer(event)) closeDrawer();
      backdropStart = false;
    }).on("keydown", function (event) {
      if (event.key !== "Tab") return;
      // Only include visible controls: links inside closed details are excluded.
      const controls = $(drawer).find("button, summary, a[href], [tabindex]")
        .filter(function () { return !this.disabled && this.tabIndex >= 0 && this.getClientRects().length > 0; })
        .toArray();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Enhance only after all handlers are ready; CSS alone handles resizing.
    drawer.close();
    drawer.classList.add("is-enhanced");
    $close.add($toggle).prop("hidden", false);
  });
})();
