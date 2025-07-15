function fetchTrainingszeiten(targetMannschaft, sheetId, apiKey) {
  const urlTrainingszeiten = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Hallenplan?key=${apiKey}`;
  
  fetch(urlTrainingszeiten)
    .then(response => response.json())
    .then(data => {
      const sheetData = data.values;
      const container = document.getElementById('trainingszeiten-data');
      const trainingszeiten = sheetData.filter(row =>
        row[0] && (row[4] === targetMannschaft || row[5] === targetMannschaft || row[6] === targetMannschaft || row[7] === targetMannschaft)
      );

      if (trainingszeiten.length === 0) {
        container.innerHTML = `<p>Info folgt.</p>`;
        return;
      }

      let html = '<table class="trainingszeiten">';
      trainingszeiten.forEach(row => {
        const tag = row[1], start = row[2], ende = row[3], halle = row[0], bezeichnung = row[8] ? `(${row[8]})` : '';
        html += `
          <tr>
            <td>${tag}.</td>
            <td>${start}</td>
            <td>-</td>
            <td>${ende}</td>
            <td>Uhr</td>
            <td>${halle}</td>
            <td>${bezeichnung}</td>
          </tr>
        `;
      });
      html += '</table>';
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
