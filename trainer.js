// trainer.js

const API_KEY = 'AIzaSyAjkpgN0TiHoFn_X0K2hEHmQwIRcU8i9_c'; // Dein API-Key
const SHEET_ID = '1R2zmh8Mq-YL7jwV1gHF26CxFx5XI8XPHKXJSyasY_DQ'; // Deine Sheet-ID

function fetchTrainer(targetMannschaft, containerId) {
  const urlTrainer = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Trainer?key=${API_KEY}`;

  fetch(urlTrainer)
    .then(response => response.json())
    .then(data => {
      const sheetData = data.values;
      const container = document.getElementById(containerId);

      const trainers = sheetData.filter(row => row[0] && row[0].trim() === targetMannschaft);

      if (trainers.length === 0) {
        container.innerHTML = `<p>Keine Trainer für die Mannschaft "${targetMannschaft}" gefunden.</p>`;
        return;
      }

      trainers.forEach(row => {
        const name = row[1], telefon = row[2], email = row[3];
        if (!name) return;

        let html = `<table class="trainer"><tr><td colspan="2">${name}</td></tr>`;
        if (telefon) {
          html += `<tr><td>Telefon:</td><td>${telefon}</td></tr>`;
        }
        if (email) {
          html += `<tr><td>E-Mail:</td><td><a href="mailto:${email}">${email}</a></td></tr>`;
        }
        html += `</table><br>`;
        container.innerHTML += html;
      });
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Trainer:', error);
      document.getElementById(containerId).innerHTML = `<p>Fehler: ${error.message}</p>`;
    });
}
