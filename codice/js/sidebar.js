/* =========================================================
   📚 Come aggiungere una voce o un gruppo nel menu

   📌 VOCE SINGOLA (senza sottomenù):
   {
     titolo: "🏠 Nome Voce",    // Titolo del bottone visibile
     pagina: "nome-pagina"      // Nome della pagina che caricherà (senza .html)
   },

   📌 VOCE CON SOTTOMENU (menu a tendina):
   {
     titolo: "🧑‍🤝‍🧑 Nome Gruppo",  // Titolo principale con freccina ▶
     sottosezioni: [
       { nome: "🔹 Nome Sottovoce 1", pagina: "nome-pagina-1" },  // Prima sottovoce
       { nome: "🔹 Nome Sottovoce 2", pagina: "nome-pagina-2" },  // Seconda sottovoce
       { nome: "🔹 Nome Sottovoce 3", pagina: "nome-pagina-3" }   // Terza sottovoce (senza virgola finale se ultimo!)
     ]
   },

   📢 ATTENZIONE:
   - Ogni sottosezione è scritta come: { nome: "Nome", pagina: "nomefile" }
   - Virgola (`,`) obbligatoria tra le sottosezioni, tranne DOPO l'ultima.
   - "pagina" deve corrispondere al file dentro "Pages/" (esempio: Pages/nome-pagina.html)
   - Puoi mettere emoji o simboli nel nome per rendere il menù più visibile!
========================================================= */

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
      { nome: "📝 Contributi Soci", pagina: "contributi-soci" },
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

// Inietta la sidebar
function generaSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = ''; // Pulisce eventuale contenuto

  menuData.forEach(item => {
    if (item.sottosezioni) {
      const group = document.createElement('div');
      group.className = 'menu-group';

      const mainBtn = document.createElement('button');
      mainBtn.className = 'menu-btn';
      mainBtn.innerHTML = `${item.titolo} <span class="arrow">▶</span>`;
      mainBtn.onclick = () => toggleSubmenu(mainBtn);

      const submenu = document.createElement('div');
      submenu.className = 'submenu';

      item.sottosezioni.forEach(sub => {
        const subBtn = document.createElement('button');
        subBtn.textContent = sub.nome;
        subBtn.onclick = () => caricaPagina(sub.pagina);
        submenu.appendChild(subBtn);
      });

      group.appendChild(mainBtn);
      group.appendChild(submenu);
      sidebar.appendChild(group);
    } else {
      const btn = document.createElement('button');
      btn.className = 'menu-btn';
      btn.textContent = item.titolo;
      btn.onclick = () => caricaPagina(item.pagina);
      sidebar.appendChild(btn);
    }
  });
}

// Espandi o chiudi il submenu
function toggleSubmenu(button) {
  const submenu = button.nextElementSibling;
  submenu.classList.toggle('open');

  // Toggle freccina
  const arrow = button.querySelector('.arrow');
  arrow.textContent = submenu.classList.contains('open') ? '▼' : '▶';
}

// Avvio
document.addEventListener('DOMContentLoaded', () => {
  generaSidebar();
});
