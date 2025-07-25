function fetchTrainingszeiten(targetMannschaft, sheetId, apiKey) {
  const urlTrainingszeiten = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Trainingsplan?key=${apiKey}`;

  fetch(urlTrainingszeiten)
    .then(response => response.json())
    .then(data => {
      const sheetData = data.values;
      const container = document.getElementById('trainingszeiten-data');
      const trainingszeiten = sheetData.filter(row =>
        row[4] && row[4].trim() === targetMannschaft
      );

      if (trainingszeiten.length === 0) {
        container.innerHTML = `<p>Info folgt.</p>`;
        return;
      }

      let html = '<table class="trainingszeiten">';
      trainingszeiten.forEach(row => {
        const ort = row[0];
        const tag = row[1];
        const start = row[2];
        const ende = row[3];
        const bezeichnung = row[5] ? `(${row[5]})` : '';

        html += `
          <tr>
            <td>${tag}.</td>
            <td>${start}</td>
            <td>-</td>
            <td>${ende}</td>
            <td>Uhr</td>
            <td>${ort}</td>
            <td>${bezeichnung}</td>
          </tr>
        `;
      });
      html += '</table>';
      html += `<p><a target="_blank" href="https://vfl-mettingen-app.de/platzbelegung/#/">Änderungen und aktuelle Platzbelegung</a></p>`;
      container.innerHTML = html;
    })
    .catch(error => {
      console.error('Fehler beim Abrufen der Trainingszeiten:', error);
      document.getElementById('trainingszeiten-data').innerHTML = `<p>Fehler: ${error.message}</p>`;
    });
}


function fetchTrainer(targetMannschaft, sheetId, apiKey) {
  const urlTrainer = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Trainer?key=${apiKey}`;
  
  fetch(urlTrainer)
    .then(response => response.json())
    .then(data => {
      const sheetData = data.values;
      const container = document.getElementById('trainer-data');
      const trainers = sheetData.filter(row => row[0] && row[0].trim() === targetMannschaft);

      if (trainers.length === 0) {
        container.innerHTML = `<p>Info folgt.</p>`;
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
      document.getElementById('trainer-data').innerHTML = `<p>Fehler: ${error.message}</p>`;
    });
}
