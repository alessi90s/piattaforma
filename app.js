/*****************************************************
 * FUNZIONI COMUNI
 *****************************************************/

/**
 * Restituisce l'array di spunti salvati nel localStorage.
 */
function getSavedSuggestions() {
  return JSON.parse(localStorage.getItem("savedSuggestions")) || [];
}

/**
 * Salva l'array di spunti nel localStorage.
 * @param {Array} suggestions 
 */
function setSavedSuggestions(suggestions) {
  localStorage.setItem("savedSuggestions", JSON.stringify(suggestions));
}

/**
 * Aggiunge uno spunto all'elenco salvato (solo se non è già presente).
 * @param {string} suggestion 
 */
function saveSuggestion(suggestion) {
  const savedSuggestions = getSavedSuggestions();

  // Evitiamo i duplicati
  if (!savedSuggestions.includes(suggestion)) {
    savedSuggestions.push(suggestion);
    setSavedSuggestions(savedSuggestions);
    alert("Spunto salvato con successo!");
  } else {
    alert("Questo spunto è già stato salvato.");
  }
}

/**
 * Rimuove uno spunto dalla lista salvata.
 * @param {string} suggestion 
 */
function removeSuggestion(suggestion) {
  const savedSuggestions = getSavedSuggestions();
  const updatedSuggestions = savedSuggestions.filter(item => item !== suggestion);
  setSavedSuggestions(updatedSuggestions);
}

/*****************************************************
 * CODICE PER index.html
 *****************************************************/
if (document.getElementById("suggestion-btn")) {
  const suggestionBtn = document.getElementById("suggestion-btn");
  const suggestionArea = document.getElementById("suggestion-area");

  suggestionBtn.addEventListener("click", () => {
    // Pesco il file JSON
    fetch("spunti.json")
      .then(response => response.json())
      .then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomSuggestion = data[randomIndex];

        suggestionArea.innerHTML = `
          <div class="suggestion-card">
            <p>${randomSuggestion}</p>
            <button class="btn save-btn">Salva tra gli approfondimenti</button>
          </div>
        `;

        // Al click del pulsante Salva
        const saveBtn = document.querySelector(".save-btn");
        saveBtn.addEventListener("click", () => {
          saveSuggestion(randomSuggestion);
        });
      })
      .catch(error => {
        console.error("Errore nel caricamento degli spunti:", error);
        suggestionArea.innerHTML = `<p>Impossibile recuperare spunti al momento.</p>`;
      });
  });
}

/*****************************************************
 * CODICE PER saved.html
 *****************************************************/
if (document.getElementById("saved-list")) {
  const savedList = document.getElementById("saved-list");
  
  /**
   * Renderizza gli spunti salvati in una <ul>
   */
  function renderSavedSuggestions() {
    const savedSuggestions = getSavedSuggestions();

    if (savedSuggestions.length === 0) {
      savedList.innerHTML = "<p>Non hai ancora salvato nessuno spunto!</p>";
      return;
    }

    // Pulisco la lista
    savedList.innerHTML = "";

    savedSuggestions.forEach(suggestion => {
      const li = document.createElement("li");
      li.classList.add("saved-item");

      li.innerHTML = `
        <span>${suggestion}</span>
        <button class="btn remove-btn">Rimuovi</button>
      `;

      const removeBtn = li.querySelector(".remove-btn");
      removeBtn.addEventListener("click", () => {
        removeSuggestion(suggestion);
        renderSavedSuggestions(); // Ricarico la lista aggiornata
      });

      savedList.appendChild(li);
    });
  }

  // Al caricamento della pagina, renderizzo la lista
  renderSavedSuggestions();
}
