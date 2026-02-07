// ==================== TAB NAVIGATION ====================
const navBtns = document.querySelectorAll("nav button");

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    navBtns.forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".section")
      .forEach((s) => s.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("sec-" + btn.dataset.tab).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Auto-open a tab if coming back from an article page
(function () {
  const autoTab = sessionStorage.getItem("autoTab");
  if (autoTab) {
    sessionStorage.removeItem("autoTab");
    const btn = document.querySelector(
      'nav button[data-tab="' + autoTab + '"]',
    );
    if (btn) btn.click();
  }
  // Support hash-based tab switching (e.g. /#guides, /#interactive)
  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const hashMap = {
      home: "home",
      learn: "learn",
      interactive: "3d",
      quiz: "quiz",
      guides: "guides",
      tips: "tips",
    };
    const tab = hashMap[hash] || hash;
    const btn = document.querySelector('nav button[data-tab="' + tab + '"]');
    if (btn) btn.click();
  }
})();
