// ==============================
// JS per la gestione globale di RMS
// ==============================

let CONFIG = null; // 🔧 Config globale
let datiAssociazione = {}; // 🔥 Dati anagrafici mappati

// ==============================
// 🔧 caricaConfig()
// Carica prima loader.json → estrae URL Web App
// Poi chiama il backend per caricare config.json dinamico
// Strategia RMS: nessun URL hardcoded nei JS, solo file pubblico modificabile
// ==============================
async function caricaConfig() {
  try {
    // 🔍 1. Recupera URL da localStorage o querystring
    let loaderUrl = localStorage.getItem("loader_url");

    // ✅ Se c'è una query string tipo ?loader=https://... salvalo
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("loader")) {
      loaderUrl = queryParams.get("loader");
      localStorage.setItem("loader_url", loaderUrl);
    }

    if (!loaderUrl) throw new Error("Nessun URL loader specificato");

    console.log("🌐 Loader URL:", loaderUrl);

    const loaderRes = await fetch(loaderUrl);
    if (!loaderRes.ok) throw new Error("Loader non trovato");
    const loader = await loaderRes.json();

    const configRes = await fetch(loader.config_url);
    if (!configRes.ok) throw new Error("Config non trovato");
    CONFIG = await configRes.json();

    console.log("✅ Config caricato da:", loader.config_url);
    console.log("🛠️ Dati di configurazione:", CONFIG);
  } catch (err) {
    console.error("❌ Errore nel caricamento config.json:", err);
    document.getElementById("contenuto-dinamico").innerHTML =
      "<p style='color:red;'>Errore caricamento configurazione.</p>";
  }
}


// ✅ Carica dinamicamente il CSS della pagina
function caricaCSS(nomeFile) {
  const id = "pagina-style";
  const esistente = document.getElementById(id);
  if (esistente) esistente.remove();

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `codice/css/${nomeFile}`;
  document.head.appendChild(link);
}

// ✅ Carica dinamicamente le pagine dal frontend
function caricaPagina(nomePagina) {
  const percorso = `codice/pages/${nomePagina}.html`;
  localStorage.setItem('paginaAttiva', nomePagina);

  fetch(percorso)
    .then(response => {
      if (!response.ok) throw new Error(`Errore nel caricamento di ${percorso}`);
      return response.text();
    })
    .then(html => {
      document.getElementById('contenuto-dinamico').innerHTML = html;
      caricaCSS(`${nomePagina}.css`);

      const script = document.createElement('script');
      script.src = `codice/js/${nomePagina}.js`; 
      script.onload = () => {
        console.log(`✅ Script js/${nomePagina}.js caricato`);
        if (typeof popolaCampi === "function") {
          console.log("▶️ popolaCampi() trovato, lo eseguo...");
          popolaCampi();
        } else {
          console.log("ℹ️ Nessuna funzione popolaCampi() da eseguire per questa pagina.");
        }
      };
      script.onerror = () => {
        console.warn(`⚠️ Script js/${nomePagina}.js non trovato`);
      };
      document.body.appendChild(script);
    })
    .catch(error => {
      document.getElementById('contenuto-dinamico').innerHTML = `<p style="color:red;">Errore: ${error}</p>`;
    });

  const sidebar = document.getElementById("sidebar");
  if (window.innerWidth <= 780 && sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  }
}

// 🔧 Inizializzazione completa all’avvio
window.onload = async () => {
  await caricaConfig();               // ← Prima cosa: carica CONFIG
  mostraDataCorrente();
  caricaDatiAssociazione();

  const paginaSalvata = localStorage.getItem('paginaAttiva');
  caricaPagina(paginaSalvata || "dashboard");
};

// Funzione per mostrare la data corrente
function mostraDataCorrente() {
  const now = new Date();
  const opzioni = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById("datetime").textContent = now.toLocaleDateString('it-IT', opzioni);
}

// Funzione per gestire la sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

// Gestione chiusura della sidebar su mobile quando si clicca fuori
document.addEventListener("click", function (event) {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");

  if (
    window.innerWidth <= 780 &&
    sidebar.classList.contains("active") &&
    !sidebar.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    sidebar.classList.remove("active");
  }
});

// Funzione per popolare i dati dell'associazione
function caricaDatiAssociazione() {
  if (!CONFIG || !CONFIG.backend_url) {
    console.error("❌ CONFIG non inizializzato");
    return;
  }

  fetch(`${CONFIG.backend_url}?azione=anagrafica`)
    .then(response => response.json())
    .then(lista => {
      datiAssociazione = {};
      lista.forEach(item => {
        datiAssociazione[item["🏷️ Campo"]] = item["✍️ Dato"];
      });

      console.log("✅ Dati Associazione mappati:", datiAssociazione);
      popolaHeaderAssociazione();
    })
    .catch(error => {
      console.error("❌ Errore caricamento dati associazione:", error);
    });
}

function popolaHeaderAssociazione() {
  document.getElementById('nome-associazione').textContent = datiAssociazione["🏷️ Nome Associazione"] || "";
  document.getElementById('indirizzo-associazione').textContent = datiAssociazione["📍 Indirizzo"] || "";
  document.getElementById('piva-associazione').textContent = "P.IVA: " + (datiAssociazione["🧾 Codice Fiscale / P.IVA"] || "");
}

// Funzione per abilitare la selezione al doppio clic sui campi
function abilitaDoppioClicSelezione(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("dblclick", () => {
    if (!el.readOnly && el.type !== "color" && el.type !== "file") {
      setTimeout(() => {
        el.focus();
        try {
          el.setSelectionRange(0, el.value.length);
        } catch (e) {
          console.warn(`setSelectionRange fallito su ${id}:`, e);
        }
      }, 0);
    }
  });
}

window.addEventListener("error", function (e) {
  console.error("🔥 ERRORE GLOBALE:", e.message);
});
