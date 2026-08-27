(function () {
  const key = "basedmoer_wallet";
  function short(a) {
    return a ? a.slice(0, 6) + "…" + a.slice(-4) : "";
  }
  async function connect() {
    if (!window.ethereum) {
      alert("No wallet found. Install MetaMask or a Base-compatible wallet.");
      return;
    }
    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (acc && acc[0]) {
      localStorage.setItem(key, acc[0]);
      render();
    }
  }
  function render() {
    const addr = localStorage.getItem(key);
    document.querySelectorAll("[data-wallet-label]").forEach((el) => {
      el.textContent = addr ? short(addr) : "Connect wallet";
    });
    document.querySelectorAll("[data-holder]").forEach((el) => {
      if (addr) el.classList.remove("locked");
      else el.classList.add("locked");
    });
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-connect]")) connect();
  });
  render();
})();

function gradeQuiz(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const answers = { q1: "b", q2: "c", q3: "a", q4: "b", q5: "c" };
  let score = 0;
  let total = 0;
  Object.keys(answers).forEach((name) => {
    const picked = form.querySelector('input[name="' + name + '"]:checked');
    total += 1;
    if (picked && picked.value === answers[name]) score += 1;
  });
  const out = document.getElementById("quiz-result");
  out.textContent = "Score: " + score + " / " + total + ". This is a study check only — not a credential and not financial advice.";
}
