async function popolaCampi() {
    const container = document.getElementById("quote-container");
    container.innerHTML = "🔄 Caricamento quote...";
  
    try {
      const res = await fetch(`${CONFIG.backend_url}?azione=prezziContributi`);
      const quote = await res.json();
  
      container.innerHTML = "";
  
      // 👀 Mostra primo valore come esempio
      if (quote.length > 0) {
        const esempio = document.createElement("p");
        esempio.innerHTML = `🧾 Prima quota trovata: <strong>${quote[0]["Tipo"]}</strong> – ${quote[0]["Importo"]} €`;
        esempio.style.marginBottom = "15px";
        esempio.style.fontStyle = "italic";
        container.appendChild(esempio);
      }
  
      quote.forEach((voce, index) => {
        const tipo = voce["Tipo"];
        const valore = voce["Importo"];
        const row = document.createElement("div");
  
        row.innerHTML = `
          <label>${tipo}:</label>
          <input type="number" id="quota-${index}" data-tipo="${tipo}" value="${valore}" />
        `;
        container.appendChild(row);
      });
    } catch (err) {
      container.innerHTML = `<span style="color:red;">❌ Errore nel caricamento: ${err.message}</span>`;
    }
  }
  