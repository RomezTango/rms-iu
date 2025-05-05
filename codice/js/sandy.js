window.addEventListener("DOMContentLoaded", () => {
    const campo = document.getElementById("telefono");
    const risultato = document.getElementById("risultato");
  
    // 🔒 All'inizio blocca il campo
    campo.setAttribute("readonly", true);
    campo.classList.add("readonly");
  
    // 👆 Doppio clic → seleziona se sbloccato
    campo.addEventListener("dblclick", () => {
      console.log("🟡 Doppio clic rilevato");
  
      if (!campo.hasAttribute("readonly")) {
        console.log("✅ Campo NON è readonly");
      } else {
        console.warn("🚫 Campo è ANCORA readonly!");
      }
  
      if (!campo.hasAttribute("readonly") && campo.type === "text" && campo.value.length > 0) {
        requestAnimationFrame(() => {
          campo.focus();
          campo.setSelectionRange(0, campo.value.length);
          console.log("🎯 Selezione attivata su telefono");
        });
      } else {
        console.log("ℹ️ Condizione non soddisfatta");
      }
    });
  
    // ✏️ Bottone Modifica
    document.getElementById("modifica-btn").addEventListener("click", () => {
      campo.removeAttribute("readonly");
      campo.classList.remove("readonly");
      document.getElementById("salva-btn").style.display = "inline-block";
      document.getElementById("modifica-btn").style.display = "none";
      console.log("🟢 Campo sbloccato");
    });
  
    // 💾 Bottone Salva
    document.getElementById("salva-btn").addEventListener("click", () => {
      if (!confirm("⚠️ Confermi il salvataggio?")) return;
  
      const valore = campo.value.trim();
      console.log("📤 Valore da salvare:", valore);
  
      // Simula un salvataggio con log
      setTimeout(() => {
        risultato.textContent = `✅ Salvato: ${valore}`;
        campo.setAttribute("readonly", true);
        campo.classList.add("readonly");
        document.getElementById("salva-btn").style.display = "none";
        document.getElementById("modifica-btn").style.display = "inline-block";
      }, 300);
    });
  });
  