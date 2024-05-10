fetch('https://localhost:7262/api/v1/UserToDo/ListEndTask')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudieron obtener los datos de la lista de tareas realizadas');
    }
    return response.json();
  })
  .then(data => {
    const tbody = document.querySelector('table tbody');
    let idCounter = 1; // Inicializamos el contador de id
    data.forEach(task => {
      const fechaCreacion = new Date(task.createAt);
      const formattedDate = `${fechaCreacion.toLocaleDateString()} ${fechaCreacion.toLocaleTimeString()}`;
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = idCounter++;
      row.appendChild(idCell);

      const taskNameCell = document.createElement('td');
      taskNameCell.textContent = task.taskName || '';
      row.appendChild(taskNameCell);

      const taskDescriptionCell = document.createElement('td');
      taskDescriptionCell.textContent = task.taskDescription || '';
      row.appendChild(taskDescriptionCell);

      const dateCell = document.createElement('td');
      dateCell.textContent = formattedDate;
      row.appendChild(dateCell);

      const statusCell = document.createElement('td');
      statusCell.textContent = task.status || '';
      row.appendChild(statusCell);

      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Se produjo un error al obtener o procesar los datos:', error);
    // Aquí puedes manejar el error de manera adecuada, por ejemplo, mostrando un mensaje al usuario
  });
