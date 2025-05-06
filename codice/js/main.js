let CONFIG = null;

async function caricaConfig() {
  try {
    const loaderUrl = localStorage.getItem("loader_url") || "/loader.json";

    console.log("📦 Carico loader da:", loaderUrl);

    const loaderRes = await fetch(loaderUrl);
    if (!loaderRes.ok) throw new Error("❌ Loader non trovato");
    const loader = await loaderRes.json();

    const configRes = await fetch(loader.config_url);
    if (!configRes.ok) throw new Error("❌ Config non trovato");
    CONFIG = await configRes.json();

    console.log("✅ CONFIG ricevuto:", CONFIG);
    document.getElementById("contenuto-dinamico").innerHTML =
      "<p style='color:green;'>✅ Config caricato con successo</p>";
  } catch (err) {
    console.error("❌ Errore caricamento config:", err);
    document.getElementById("contenuto-dinamico").innerHTML =
      "<p style='color:red;'>❌ Errore caricamento config.json</p>";
  }
}

window.onload = () => {
  caricaConfig();
};
