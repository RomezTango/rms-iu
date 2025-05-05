(function () {
    // 🧩 Mappa chiavi dati → ID dei campi
    const mappaCampi = {
      "Nome Associazione": "nome",
      "Telefono": "telefono",
      "Indirizzo": "indirizzo"
    };
  
    // 🧠 Popola i campi usando i dati ricevuti
    function popolaCampiAnagrafica(dati) {
      console.log("✅ Dati ricevuti:", dati);
  
      Object.entries(mappaCampi).forEach(([chiave, id]) => {
        const el = document.getElementById(id);
        if (el && dati[chiave] !== undefined) {
          el.value = dati[chiave];
        } else {
          console.warn(`⚠️ Campo mancante o non trovato: ${chiave}`);
        }
      });
    }
  
    // 🔁 Finta chiamata dati (simula google.script.run)
    function getDatiFinti() {
      return {
        "Nome Associazione": "RomezTango ASD",
        "Telefono": "3470040167",
        "Indirizzo": "viale torpiloquio santo 1"
      };
    }
  
    // 🚀 Quando la pagina è pronta, popola
    document.addEventListener("DOMContentLoaded", () => {
      const dati = getDatiFinti(); // 👈 simula backend
      popolaCampiAnagrafica(dati);
    });
  })();
  