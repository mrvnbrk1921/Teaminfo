// trainingszeiten.js

const API_KEY = 'AIzaSyAjkpgN0TiHoFn_X0K2hEHmQwIRcU8i9_c'; // Dein API-Key
const SHEET_ID = '1R2zmh8Mq-YL7jwV1gHF26CxFx5XI8XPHKXJSyasY_DQ'; // Deine Sheet-ID

function fetchTrainingszeiten(targetMannschaft, containerId) {
  const urlTrainingszeiten = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Hallenplan?key=${API_KEY}`;

  fetch(urlTrainingszeiten)
    .then(response => response.json())
    .then(data => {
      const sheetData = data.values;
      const container = document.getElementById(containerId);

      const trainingszeiten = sheetData.filter(row => {
        return row.slice(4).some(cell => cell && cell.trim() === targetMannschaft);  // Suche nach der Mannschaft in einer der Mannschaftsspalten
      });

      if (trainingszeiten.length === 0) {
        container.innerHTML = `<p>Keine Trainingszeiten für die Mannschaft "${targetMannschaft}" gefunden.</p>`;
        return;
      }

      // Sortiere die Trainingszeiten nach Wochentagen und Uhrzeiten
      const wochenTage = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
      trainingszeiten.sort((a, b) => {
        const tagA = wochenTage.indexOf(a[1]);
        const tagB = wochenTage.indexOf(b[1]);
        const uhrzeitA = a[2]; // Startzeit
        const uhrzeitB = b[2]; // Startzeit

        if (tagA !== tagB) return tagA - tagB;
        return uhrzeitA.localeCompare(uhrzeitB); // Vergleiche Uhrzeiten
      });

      let html = '<table>';
      trainingszeiten.forEach(row => {
        const tag = row[1], start = row[2], ende = row[3], halle = row[0], bezeichnung = row[8];
        html += `
          <tr>
            <td>${tag}</td>
            <td>${start}</td>
            <td>-</td>
            <td>${ende}</td>
            <td>Uhr</td>
            <td>${halle}</td>
            <td>${bezeichnung ? `(${bezeichnung})` : ''}</td>
          </tr>
        `;
      });
      html += '</table>';
      container.innerHTML = html;
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Trainingszeiten:', error);
      document.getElementById(containerId).innerHTML = `<p>Fehler: ${error.message}</p>`;
    });
}
