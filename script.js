// script.js
const timetableDiv = document.getElementById('timetable');
const readRfidButton = document.getElementById('readRfid');

async function fetchTimetable() {
  try {
    const response = await fetch('http://localhost:5000/timetable');
    const timetable = await response.json();
    displayTimetable(timetable);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    timetableDiv.innerHTML = '<p>Error fetching timetable.</p>';
  }
}

function displayTimetable(timetable) {
  const tableBody = timetableDiv.querySelector('tbody');
  tableBody.innerHTML = '';

  timetable.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="time" value="${entry.time}"></td>
      <td>${entry.day}</td>
      <td><input type="text" class="teacher" value="${entry.teacher}"></td>
      <td>${entry.className}</td>
      <td><button class="save" data-id="${entry._id}">Save</button></td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listeners to the save buttons
  const saveButtons = document.querySelectorAll('.save');
  saveButtons.forEach(button => {
    button.addEventListener('click', saveTimetableEntry);
  });
}

async function saveTimetableEntry(event) {
  const button = event.target;
  const id = button.dataset.id;
  const row = button.parentNode.parentNode;
  const time = row.querySelector('.time').value;
  const teacher = row.querySelector('.teacher').value;

  try {
    const response = await fetch(`http://localhost:5000/timetable/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ time: time, teacher: teacher })
    });

    if (response.ok) {
      alert('Timetable entry updated successfully!');
    } else {
      alert('Failed to update timetable entry.');
    }
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    alert('Error updating timetable entry.');
  }
}

async function readRfid() {
  try {
    const response = await fetch('http://localhost:5000/rfid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rfid: '12345' }) // Replace with actual RFID data
    });

    if (response.ok) {
      const data = await response.json();
      alert(`RFID: ${data.rfid}`);
    } else {
      alert('Failed to read RFID.');
    }
  } catch (error) {
    console.error('Error reading RFID:', error);
    alert('Error reading RFID.');
  }
}

readRfidButton.addEventListener('click', readRfid);

fetchTimetable();