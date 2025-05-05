// ==============================
// JS per la gestione dell'anagrafica RMS
// ==============================

// 🗂️ Mappa dei campi dinamici associati agli ID dei rispettivi elementi HTML
const campiMappa = {
  "👤 Presidente": "presidente",
  "📍 Indirizzo": "indirizzo",
  "📞 Telefono": "telefono",
  "🌐 Sito Web ufficiale": "sito-web",
  "🏦 IBAN": "iban",
  "💵 Metodo di pagamento 1": "pagamento1",
  "💶 Metodo di pagamento 2": "pagamento2",
  "💳 Metodo di pagamento 3": "pagamento3",
  "🪙 Metodo di pagamento 4": "pagamento4",
  "➕ Metodo di pagamento 5": "pagamento5",
  "📝 Testo Intestazione PDF": "intestazione-pdf",
  "🎨 Colore Tema": "colore-tema",
  "📄 Nome file ricevuta PDF": "file-ricevuta",
  "🧾 Layout ricevute/tessere": "layout",
  "🖼️ Logo ID 1": "logo1",
  "🖼️ Logo ID 2": "logo2",
  "🖼️ Logo ID 3": "logo3",
  "🪧 Template Tessera Fronte": "template-fronte",
  "🪧 Template Tessera Retro": "template-retro",
  "📁 Cartella immagini personalizzate": "cartella-immagini",
  "🪪 Tipo Licenza": "tipo-licenza",
  "🔐 Codice affiliazione ACSI": "codice-acsi",
  "👤 Responsabile segreteria": "segretaria",
  "👥 Organigramma": "organigramma",
  "🧠 Commento interno": "commento-interno"
};

// 🧱 Campi base non modificabili
const campiFissi = {
  "🏷️ Nome Associazione": "nome-associazione",
  "🧾 Codice Fiscale / P.IVA": "piva",
  "📧 Email": "email"
};

// 🧾 Registro dei valori iniziali dei campi per verificare le modifiche
const valoriIniziali = {};

// 🔥 Carica i dati dell'associazione da Apps Script
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

// Funzione che normalizza i valori vuoti o nulli
const normalizza = valore => {
  return (valore === undefined || valore === null || String(valore).trim() === "")
    ? "(non definito)"
    : String(valore).trim();
};

// Funzione che carica il valore nei campi
function caricaCampi() {
  // Carica i campi fissi
  for (const [etichetta, id] of Object.entries(campiFissi)) {
    const el = document.getElementById(id);
    if (el) el.value = normalizza(datiAssociazione[etichetta]);
  }

  // Carica i campi dinamici
  for (const [etichetta, id] of Object.entries(campiMappa)) {
    const el = document.getElementById(id);
    if (el) {
      const valore = normalizza(datiAssociazione[etichetta]);
      el.value = valore;
      valoriIniziali[id] = valore;
    }
  }
}

// Funzione per bloccare/modificare i campi
function toggleCampi(isModifica) {
  Object.values(campiMappa).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.readOnly = !isModifica;
      el.classList.toggle("readonly", !isModifica);
    }
  });

  document.getElementById("salva-btn").style.display = isModifica ? "inline-block" : "none";
  document.getElementById("modifica-btn").style.display = isModifica ? "none" : "inline-block";
}

// Funzione per gestire il salvataggio dei dati
document.getElementById("salva-btn").addEventListener("click", () => {
  if (!confirm("⚠️ Vuoi salvare le modifiche effettuate?")) return;

  const formData = new FormData();
  let report = "";
  let modificati = 0;

  for (const [etichetta, id] of Object.entries(campiMappa)) {
    const el = document.getElementById(id);
    if (!el) continue;

    const nuovo = el.value.trim();
    const originale = valoriIniziali[id] || "";

    if (nuovo !== originale) {
      formData.append("chiave", etichetta);
      formData.append("valore", nuovo);
      report += `${etichetta}:\n`;
      report += `da "${originale}"  > a   "${nuovo}"\n\n`;
      modificati++;
    }
  }

  if (modificati === 0) {
    document.getElementById("risultato").innerText =
      "ℹ️ Nessuna modifica rilevata. Nessun dato è stato inviato.";
    return;
  }

  fetch(CONFIG.backend_url, {
    method: "POST",
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Risposta non valida dal server");
      return res.text();
    })
    .then(text => {
      caricaCampi(); // Ricarica i campi dopo il salvataggio

      document.getElementById("risultato").innerText =
        "✅ Modifiche salvate con successo.\n\n" + report;

      toggleCampi(false);  // Disabilita i campi dopo il salvataggio
    })
    .catch(err => {
      document.getElementById("risultato").innerText =
        "❌ Errore nel salvataggio: " + err.message;
      console.error("Errore POST:", err);
    });
});

// Funzione per gestire la modifica dei campi
document.getElementById("modifica-btn").addEventListener("click", () => {
  toggleCampi(true);  // Abilita i campi per la modifica
});

// Funzione di upload del logo
const uploadInput = document.getElementById("upload-logo");
const preview = document.getElementById("preview-logo");
const logoAttuale = document.getElementById("logo-attuale");

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    const base64 = reader.result.split(',')[1];
    const formData = new FormData();
    formData.append("azione", "uploadLogo");
    formData.append("file", base64);
    formData.append("nome", file.name);
    formData.append("tipo", file.type);

    fetch(CONFIG.backend_url, {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(data => {
        if (data.success && data.url) {
          logoAttuale.src = data.url;
          logoAttuale.style.display = "block";
        } else {
          console.error("Errore nel caricamento del logo:", data.message);
        }
      })
      .catch(err => {
        console.error("Errore nella richiesta fetch:", err);
      });
  };
});

// 🎯 Abilita selezione su doppio clic
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

// 🔥 Inizializzazione della pagina
window.onload = () => {
  caricaDatiAssociazione();
  // Blocca i campi inizialmente
  toggleCampi(false);
};
