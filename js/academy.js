(function () {
  const KEY = "basedmoer_academy_done";
  function done() {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; }
  }
  function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
  function mark(id) {
    const list = done();
    if (list.indexOf(id) === -1) { list.push(id); save(list); }
    render();
  }
  function render() {
    const list = done();
    const total = document.querySelectorAll("[data-lesson]").length || 6;
    const box = document.getElementById("academy-progress");
    if (box) box.textContent = list.length + " / " + total + " lessons completed";
    document.querySelectorAll("[data-lesson]").forEach(function (el) {
      const id = el.getAttribute("data-lesson");
      const tag = el.querySelector(".lesson-state");
      if (tag) tag.textContent = list.indexOf(id) !== -1 ? "COMPLETE" : "NOT COMPLETE";
    });
  }
  document.addEventListener("click", function (e) {
    const b = e.target.closest("[data-complete]");
    if (b) mark(b.getAttribute("data-complete"));
  });
  document.addEventListener("DOMContentLoaded", render);
  window.basedmoerAcademy = { mark: mark };
})();
