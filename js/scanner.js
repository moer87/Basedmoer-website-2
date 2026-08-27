(function () {
  const API = "https://moe-ai-production.up.railway.app";
  const el = (id) => document.getElementById(id);

  function fmt(n, d) {
    if (n === null || n === undefined || n === "") return "—";
    const x = Number(n);
    if (Number.isNaN(x)) return String(n);
    return x.toLocaleString(undefined, { maximumFractionDigits: d || 8 });
  }
  function when(iso) {
    try { return new Date(iso).toLocaleString(); } catch (e) { return iso || "—"; }
  }

  async function load() {
    const status = el("engine-status");
    const err = el("engine-error");
    err.textContent = "";
    status.textContent = "LOADING";
    try {
      const [h, s, dash] = await Promise.all([
        fetch(API + "/health").then((r) => r.json()),
        fetch(API + "/stats").then((r) => r.json()),
        fetch(API + "/dashboard").then((r) => r.json())
      ]);
      const healthy = h && (h.status === "healthy" || h.ok === true);
      status.textContent = healthy ? "ONLINE" : "DEGRADED";
      const stats = (s && s.stats) || {};
      const dashb = (dash && dash.dashboard) || {};
      const summary = dashb.summary || stats;
      el("open-count").textContent = summary.open != null ? summary.open : "—";
      if (el("closed-count")) el("closed-count").textContent = summary.closed != null ? summary.closed : (stats.closed != null ? stats.closed : "—");
      if (el("net-r")) el("net-r").textContent = summary.net_r != null ? summary.net_r : (stats.net_r != null ? stats.net_r : "—");
      el("tf-label").textContent = "4H";
      el("market-label").textContent = "KRAKEN";
      el("last-update").textContent = new Date().toLocaleTimeString();
      el("activity-open").textContent = summary.open != null ? summary.open + " OPEN SETUPS" : "—";
      el("activity-refresh").textContent = new Date().toLocaleString();

      let rows = dashb.latest_open_signals || [];
      if (!rows.length && dash && dash.data) rows = dash.data;
      if (!rows.length) {
        const all = await fetch(API + "/signals").then((r) => r.json());
        rows = ((all && all.data) || []).filter((x) => String(x.status).toUpperCase() === "OPEN");
      }
      const body = el("setup-rows");
      body.innerHTML = "";
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="8">No open setups returned.</td></tr>';
        return;
      }
      rows.forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + (r.symbol || "—") + "</td>" +
          "<td>" + (r.direction || "—") + "</td>" +
          "<td>" + (r.timeframe || "—") + "</td>" +
          "<td>" + fmt(r.entry, 8) + "</td>" +
          "<td>" + fmt(r.stop_loss, 8) + "</td>" +
          "<td>" + fmt(r.take_profit, 8) + "</td>" +
          "<td>" + (r.status || "—") + "</td>" +
          "<td>" + when(r.created_at) + "</td>";
        body.appendChild(tr);
      });
    } catch (e) {
      status.textContent = "BLOCKED";
      err.textContent = "Browser could not read the API (often CORS). Data is live at " + API + "/docs — we can unlock CORS on the API next.";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const btn = el("refresh-engine");
    if (btn) btn.addEventListener("click", load);
    if (el("setup-rows")) load();
  });
})();
