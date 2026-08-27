(function () {
  const NFT = "0x5CafB7C0181fEd5b6d62AA331699989861c27AE7";
  const BASE = "0x2105";
  const KEY = "basedmoer_wallet";
  const HOLD = "basedmoer_holder";

  function short(a) {
    return a ? a.slice(0, 6) + "…" + a.slice(-4) : "";
  }
  function padAddr(a) {
    return a.toLowerCase().replace("0x", "").padStart(64, "0");
  }
  async function ensureBase(eth) {
    const chain = await eth.request({ method: "eth_chainId" });
    if (chain === BASE) return;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE }] });
    } catch (e) {
      if (e && e.code === 4902) {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: BASE,
            chainName: "Base",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://mainnet.base.org"],
            blockExplorerUrls: ["https://basescan.org"]
          }]
        });
      } else {
        throw e;
      }
    }
  }
  async function balanceOf(eth, owner) {
    const data = "0x70a08231" + padAddr(owner);
    const raw = await eth.request({
      method: "eth_call",
      params: [{ to: NFT, data: data }, "latest"]
    });
    return parseInt(raw, 16) || 0;
  }
  function apply(addr, holder) {
    document.querySelectorAll("[data-wallet-label]").forEach(function (el) {
      el.textContent = addr ? short(addr) : "Connect wallet";
    });
    document.querySelectorAll(".gated-link").forEach(function (el) {
      el.hidden = !holder;
    });
    document.body.classList.toggle("is-holder", !!holder);
    document.body.classList.toggle("is-connected", !!addr);
    const gate = document.getElementById("holder-gate");
    if (gate) gate.hidden = !!holder;
  }
  async function refresh(request) {
    if (!window.ethereum) {
      apply(null, false);
      return;
    }
    const eth = window.ethereum;
    let acc = [];
    try {
      acc = await eth.request({ method: request ? "eth_requestAccounts" : "eth_accounts" });
    } catch (e) {
      apply(null, false);
      return;
    }
    const addr = acc && acc[0] ? acc[0] : null;
    if (!addr) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(HOLD);
      apply(null, false);
      return;
    }
    localStorage.setItem(KEY, addr);
    try {
      await ensureBase(eth);
      const n = await balanceOf(eth, addr);
      const holder = n > 0;
      localStorage.setItem(HOLD, holder ? "1" : "0");
      apply(addr, holder);
    } catch (e) {
      apply(addr, false);
    }
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-connect]")) refresh(true);
  });
  if (window.ethereum) {
    window.ethereum.on && window.ethereum.on("accountsChanged", function () { refresh(false); });
    window.ethereum.on && window.ethereum.on("chainChanged", function () { refresh(false); });
  }
  const cached = localStorage.getItem(KEY);
  apply(cached, localStorage.getItem(HOLD) === "1");
  refresh(false);
})();
