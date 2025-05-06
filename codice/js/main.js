let CONFIG = null; // Config globale

async function caricaConfig() {
  try {
    let backendUrl = localStorage.getItem("backend_url");

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("backend")) {
      backendUrl = queryParams.get("backend");
      localStorage.setItem("backend_url", backendUrl);
    }

    if (!backendUrl) throw new Error("❌ Nessun backend specificato via ?backend=");

    console.log("🌐 Chiamo backend:", backendUrl);

    const configRes = await fetch(`${backendUrl}?azione=config`);
    if (!configRes.ok) throw new Error("❌ Config non trovato dal backend");

    CONFIG = await configRes.json();

    console.log("✅ CONFIG ricevuto:", CONFIG);
    document.getElementById("contenuto-dinamico").innerHTML = "<p style='color:green;'>✅ Config caricato con successo</p>";
  } catch (err) {
    console.error("❌ Errore nel caricamento del config:", err);
    document.getElementById("contenuto-dinamico").innerHTML = "<p style='color:red;'>❌ Errore nel caricamento del config</p>";
  }
}

window.onload = () => {
  caricaConfig();
};
