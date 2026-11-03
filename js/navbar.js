/* 
   Shared markup and behavior. data-site-root on #site-navigation is relative to
   the document: ./ at the site root, ../ one directory down, ../../ two down.
   All future destinations below must be relative to that configured root.
*/
(function () {
  "use strict";

  // The HTML fallback stays usable even if jQuery or this script cannot load.
  if (!window.jQuery) return;

  window.jQuery(function ($) {

    const $mount = $("#site-navigation");
    if (!$mount.length || $mount.data("initialized")) return;
    const rootValue = $mount.attr("data-site-root");
    if (!rootValue) return;

    const siteRoot = new URL(rootValue.endsWith("/") ? rootValue : rootValue + "/", document.baseURI);
    // Keep every navigation label and destination here.
    $mount.html(`
      <button class="menu-toggle icon-button" type="button" aria-label="Open navigation" aria-controls="navigation-drawer" aria-expanded="false" hidden>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <dialog id="navigation-drawer" class="navigation-drawer" aria-labelledby="navigation-title" open>
        <div class="drawer-heading">
          <p id="navigation-title">ePortfolio</p>
          <button class="menu-close icon-button" type="button" aria-label="Close navigation" aria-controls="navigation-drawer" hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>
        </div>
        <nav aria-labelledby="navigation-title">
          <a class="navigation-home" data-site-path="index.html">Home</a>
          <p class="navigation-subtitle">MIST Courses</p>
          <details><summary>IST520</summary><ul class="project-list">
            <li><a data-site-path="pages/520/evidence_based_practice.html">Evidence-Based Practice</a></li>
            <li><a data-site-path="pages/520/capstone_proposal.html">Capstone Proposal</a></li>
            <li><a data-site-path="pages/520/certificate_for_hsr.html">Certificate for HSR</a></li>
          </ul></details>
          <details><summary>IST 522</summary><ul class="project-list">
            <li><a data-site-path="pages/522/idd_frontpage.html">ID Document</a></li>
          </ul></details>
          <details><summary>IST524</summary><ul class="project-list">
            <li><a data-site-path="pages/524/id_case_study.html">ID Case Study</a></li>
            <li><a data-site-path="pages/524/ethics_scenario.html">Ethics Scenario</a></li>
            <li><a data-site-path="pages/524/course_mapping.html">Course Mapping</a></li>
            <li><a data-site-path="pages/524/term_paper.html">Term Paper</a></li>
            <li><a data-site-path="pages/524/final_exam.html">Final Exam</a></li>
          </ul></details>
        </nav>
      </dialog>`);

    function normalize(value) {
      const url = new URL(value, document.baseURI);
      url.hash = "";
      url.search = "";
      url.pathname = url.pathname.replace(/\/index\.html$/, "/");
      return url.href;
    }
    $mount.find("a[data-site-path]").each(function () {
      $(this).attr("href", new URL($(this).attr("data-site-path"), siteRoot).href);
    });
    $mount.find("a[href]").each(function () {
      if (normalize(this.href) === normalize(location.href)) $(this).attr("aria-current", "page");
    });
    const drawer = $mount.find(".navigation-drawer")[0];
    const $toggle = $mount.find(".menu-toggle");
    const $close = $mount.find(".menu-close");
    $mount.data("initialized", true);
    $(".navigation-fallback").prop("hidden", true);
    // Unknown dialog elements still render their open contents as inline navigation.
    if (typeof drawer.showModal !== "function" || typeof drawer.close !== "function") return;
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
      try { drawer.showModal(); } catch (error) {
        // A partial/broken modal implementation must still expose the navigation.
        drawer.classList.remove("is-enhanced");
        drawer.setAttribute("open", "");
        $close.add($toggle).prop("hidden", true);
        return;
      }
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
      const controls = $(drawer).find("button, summary, a[href], [tabindex]")
        .filter(function () { return !this.disabled && this.tabIndex >= 0 && this.getClientRects().length > 0; })
        .toArray();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
    drawer.close();
    drawer.classList.add("is-enhanced");
    $close.add($toggle).prop("hidden", false);
  });
})();
