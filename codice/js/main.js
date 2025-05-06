// ==============================
// 🔧 caricaConfig() – via Apps Script proxy
// ==============================
async function caricaConfig() {
  try {
    // 🔍 Recupera backend_url da query o localStorage
    let backendUrl = localStorage.getItem("backend_url");

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("backend")) {
      backendUrl = queryParams.get("backend");
      localStorage.setItem("backend_url", backendUrl);
    }

    if (!backendUrl) throw new Error("Nessun backend specificato");

    console.log("🌐 Chiamo backend per ottenere il config:", backendUrl);

    const configRes = await fetch(`${backendUrl}?azione=config`);
    if (!configRes.ok) throw new Error("Config non trovato via backend");

    CONFIG = await configRes.json();

    console.log("✅ Config caricato da backend Apps Script");
    console.log("🛠️ Dati di configurazione:", CONFIG);
  } catch (err) {
    console.error("❌ Errore nel caricamento config.json:", err);
    document.getElementById("contenuto-dinamico").innerHTML =
      "<p style='color:red;'>Errore caricamento configurazione.</p>";
  }
}