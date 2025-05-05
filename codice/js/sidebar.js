/* =========================================================
   🔧 Sidebar dinamica RMS – Versione aggiornata
   ✅ Include toggle visivo dei sottomenu
   ✅ Supporta voce singola e gruppi
   ✅ Compatibile con stile e struttura CSS
========================================================= */

// 🔠 Dati menu
const menuData = [
  {
    titolo: "🏠 Dashboard",
    pagina: "dashboard"
  },
  {
    titolo: "💰 Gestione Pagamenti",
    sottosezioni: [
      { nome: "💸 Pagamenti", pagina: "pagamenti" },
      { nome: "📈💸 Stato Pagamenti", pagina: "Statopagamenti" },
      { nome: "📄 Ricevute", pagina: "ricevute" }
    ]
  },
  {
    titolo: "🧑‍🤝‍🧑 Gestione Soci",
    sottosezioni: [
      { nome: "✏️ Modifica Dati Socio", pagina: "modifica-socio" },
      { nome: "📍 Ricerca per Sede", pagina: "ricerca-soci" },
      { nome: "💳 Filtra per Pagamento", pagina: "filtro-pagamenti" },
      { nome: "📘 Libro Soci", pagina: "libro-soci" }
    ]
  },
  {
    titolo: "📊 Contabilità",
    sottosezioni: [
      { nome: "📝 Prima Nota", pagina: "Prima-nota" },
      { nome: "📊 Bilancio", pagina: "Bilancio" },
      { nome: "📈 Bilancio Preventivo", pagina: "bilancio-preventivo" }
    ]
  },
  {
    titolo: "🎫 Tessere ACSI",
    pagina: "tessere"
  },
  {
    titolo: "⚙️ Personalizzazione",
    sottosezioni: [
      { nome: "📋 Anagrafica ASD", pagina: "anagrafica-asd" },
      { nome: "🖼️ Gestione Loghi", pagina: "gestione-loghi" },
      { nome: "💶 Quote associative", pagina: "quote-associative" },
      { nome: "📊 Piano dei conti", pagina: "Piano-Dei_Conti" },
      { nome: "📝 Testi Personalizzati", pagina: "personalizza-testi" },
      { nome: "🎫 Inserimento Tessere", pagina: "inserimento-tessere" }
    ]
  },
  {
    titolo: "📘 Guida",
    pagina: "guida"
  },
  {
    titolo: "👤 Autori & Contatti",
    pagina: "autori"
  }
];

// 🔁 Crea dinamicamente la sidebar
function generaSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = ''; // Pulisce contenuto esistente

  menuData.forEach(item => {
    // Se ha sottosezioni → gruppo con toggle
    if (item.sottosezioni) {
      const group = document.createElement('div');
      group.className = 'menu-group';

      const mainBtn = document.createElement('button');
      mainBtn.className = 'menu-btn';
      mainBtn.innerHTML = `${item.titolo} <span class="arrow">▶</span>`;
      mainBtn.onclick = () => toggleSubmenu(mainBtn); // Toggle su clic

      const submenu = document.createElement('div');
      submenu.className = 'submenu';

      item.sottosezioni.forEach(sub => {
        const subBtn = document.createElement('button');
        subBtn.textContent = sub.nome;
        subBtn.onclick = () => caricaPagina(sub.pagina); // Carica pagina
        submenu.appendChild(subBtn);
      });

      group.appendChild(mainBtn);
      group.appendChild(submenu);
      sidebar.appendChild(group);
    } else {
      // Voce singola
      const btn = document.createElement('button');
      btn.className = 'menu-btn';
      btn.textContent = item.titolo;
      btn.onclick = () => caricaPagina(item.pagina);
      sidebar.appendChild(btn);
    }
  });
}

// ⏬ Espande o chiude il gruppo del sottomenu
function toggleSubmenu(button) {
  const group = button.parentElement; // Prende il contenitore padre
  group.classList.toggle('open');     // Aggiunge o rimuove la classe .open

  // 🔁 Cambia la freccina ▶ / ▼
  const arrow = button.querySelector('.arrow');
  arrow.textContent = group.classList.contains('open') ? '▼' : '▶';
}

// 🚀 Esecuzione automatica all'avvio
document.addEventListener('DOMContentLoaded', () => {
  generaSidebar();
});
