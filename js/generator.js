(function () {
  const GATEWAYS = [
    "https://ipfs.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://gateway.pinata.cloud/ipfs/"
  ];
  const traits = {
    background: [
      { name: "Mint Green", cid: "bafkreigndanezt3yf3rlgoehh4wnhasloqso6x2tddku6qtqki6rcc2mt4" },
      { name: "Pale Lime", cid: "bafkreifi5ntqmzl6mmq6c52d2pc3vfbfilkhdw4g6vqmkdsnqcbnpww7lq" },
      { name: "Rose Punk", cid: "bafkreie5x6u5u4mt4xjdctu36humogfjhyrgdg6dueaffgvzvielabl6nm" }
    ],
    body: [
      { name: "Normal", cid: "bafkreib6zjykxl2qzn5ljeezwn4lpnd4m3c3qgeibmpwpoxejf44bkhunq" }
    ],
    ear: [
      { name: "Golden", cid: "bafkreig6uvom4cwwfwo6k5akwqmgtnzfvtjugak43wzxy6v3e4m2nr7ogu" },
      { name: "Belle of Asia", cid: "bafkreidbzbjgy4d6iihzaujencesrfdwf7fs6f65gnxwqgx3kstfepgk4y" }
    ],
    eyes: [
      { name: "Neutral", cid: "bafkreihmlxwju4egc2eiiyupuqiwuoth2vst4kxxqluncb4mmzr7eqnksy" },
      { name: "Shocked", cid: "bafkreigv32mmrtmjqkkgdifmbvusls26bi72etjz36pc2kcs2uvmtgadgq" }
    ],
    extra: [
      { name: "None", cid: null },
      { name: "Night Specs", cid: "bafkreidmoymytmes2y2f3qx5gv63wsiogrjqvcbtdnnef74dw7vafi53ky" },
      { name: "Reading", cid: "bafkreicaedz6y6roqxnzahmod7geafa6ccklw5id5jdfesdezqfvzgluua" },
      { name: "Emerald Optic", cid: "bafkreib64ht25jr6feos6g35iw553qzmbgyihe7dkeyvwouqm4pw2aqpce" }
    ],
    head: [
      { name: "None", cid: null },
      { name: "Bandana", cid: "bafkreiftbb53qtpfxpprwh36nksi2k7qvv7lr2cfcbupcmrslbpju6i32y" },
      { name: "Fedora", cid: "bafkreif3vqw2emcbshxayyhshtmpdg6vtzawzttqlwydbtvyes63f76nxi" },
      { name: "Base Cap", cid: "bafkreigam3dr6t6tzs4bgxxpqa52r5sj7fme33pnopjgbanumrxl2xfm2y" }
    ]
  };
  const order = ["background", "body", "ear", "eyes", "extra", "head"];
  const labels = { background: "Background", body: "Body", ear: "Ears", eyes: "Eyes", extra: "Eye extra", head: "Head" };
  const pick = {};
  order.forEach(function (k) { pick[k] = traits[k][0]; });

  function url(cid, gi) {
    return GATEWAYS[gi || 0] + cid;
  }
  function loadImage(cid) {
    return new Promise(function (resolve) {
      if (!cid) return resolve(null);
      let i = 0;
      function tryLoad() {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () { resolve(img); };
        img.onerror = function () {
          i += 1;
          if (i < GATEWAYS.length) tryLoad();
          else resolve(null);
        };
        img.src = url(cid, i);
      }
      tryLoad();
    });
  }
  async function draw() {
    const canvas = document.getElementById("moe-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let n = 0; n < order.length; n++) {
      const t = pick[order[n]];
      if (!t || !t.cid) continue;
      const img = await loadImage(t.cid);
      if (img) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }
  function renderUI() {
    const box = document.getElementById("moe-traits");
    if (!box) return;
    box.innerHTML = "";
    order.forEach(function (key) {
      const wrap = document.createElement("div");
      wrap.className = "trait-row";
      wrap.innerHTML = "<strong>" + labels[key] + "</strong>";
      traits[key].forEach(function (t) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "trait-btn" + (pick[key] === t ? " on" : "");
        b.textContent = t.name;
        b.addEventListener("click", function () {
          pick[key] = t;
          renderUI();
          draw();
        });
        wrap.appendChild(b);
      });
      box.appendChild(wrap);
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("moe-canvas")) return;
    renderUI();
    draw();
    const dl = document.getElementById("moe-download");
    if (dl) dl.addEventListener("click", function () {
      const canvas = document.getElementById("moe-canvas");
      const a = document.createElement("a");
      a.download = "bald-moe-preview.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  });
})();
