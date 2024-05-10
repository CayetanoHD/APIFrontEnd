//get Tareas

var isEditing = false;
var idEdit = 0;

fetch('https://localhost:7262/api/v1/UserToDo/List')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    return response.json();
  })
  .then(data => {
    const tbody = document.querySelector('table tbody');
    let idCounter = 1; // Inicializamos el contador de id
    data.forEach(task => {
        if (task.status !== 'Finalizada') {
            const fechaCreacion = new Date(task.createAt);
            const formattedDate = `${fechaCreacion.toLocaleDateString()} ${fechaCreacion.toLocaleTimeString()}`;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${idCounter++}</td>
                <td>${task.taskName || ''}</td>
                <td>${task.taskDescription || ''}</td>
                <td>${formattedDate}</td>
                <td>${task.status || ''}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm">Eliminar</button>
                    <button type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" onclick="cargarDatosTarea(${task.id})" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Actualizar</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="finalizarTarea(${task.id})">Finalizar</button>
                </td>
            `;
            tbody.appendChild(row);
            const btnEliminar = row.querySelector('.btn-danger');
            btnEliminar.addEventListener('click', () => {
                eliminarTarea(task.id);
            });
        }
    });
})

  .catch(error => {
    console.error('Error:', error);
  });
 //Create
 document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-guardar-tarea").addEventListener("click", function() {
        guardarTarea();
    });
});
function guardarTarea() {
    var nombre = document.getElementById("nombre").value.trim();
    var descripcion = document.getElementById("descripcion").value.trim();

    if (nombre && descripcion) {
        var data = {
            TaskName: nombre,
            TaskDescription: descripcion
        };

        fetch("https://localhost:7262/api/v1/UserToDo/CreateTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("La respuesta del servidor no fue exitosa");
            }
            if (response.status === 204) {
                document.querySelector('[data-bs-dismiss="modal"]').click();
                location.reload();
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log("Respuesta del servidor:", data);
                // Aquí puedes manejar la respuesta del servidor según tus necesidades
            } else {
                console.log("La respuesta del servidor no contiene datos JSON");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            // Aquí puedes manejar el error en caso de que la solicitud falle
        });
    } else {
        alert('Los campos de nombre y descripción son obligatorios');
    }
}


//eliminar
function eliminarTarea(id) {
    // Mostrar ventana de confirmación al usuario
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
    
    // Si el usuario confirma, proceder con la eliminación
    if (confirmacion) {
        // Realizar la solicitud de eliminación al servidor
        fetch(`https://localhost:7262/api/v1/UserToDo/Delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }
            // Eliminar la fila del DOM si la eliminación fue exitosa
            location.reload();
            const fila = document.querySelector(`table tbody tr[data-task-id="${id}"]`);
            fila.remove();
            // Mostrar alerta de éxito (opcional)
        
        })
        .catch(error => {
            console.error('Error al eliminar la tarea:', error);
        });
    } else {
        // Si el usuario cancela, no hacer nada
        return;
    }
}
function finalizarTarea(id) {
    idEdit = id;
    // Mostrar una alerta de confirmación al usuario
    const confirmacion = confirm('¿Estás seguro de que deseas finalizar esta tarea?');

    // Si el usuario confirma, proceder con la actualización del estado
    if (confirmacion) {
        // Datos para enviar en la solicitud PATCH
        const data = {
            id: id,
            // Otros datos necesarios para la actualización del estado, si los hubiera
        };

        // Realizar la solicitud PATCH al servidor
        fetch(`https://localhost:7262/api/v1/UserToDo/UpdateState/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la tarea');
            }
            location.reload();
            // Si la actualización fue exitosa, realizar alguna acción adicional si es necesario
            console.log('Estado de tarea actualizado correctamente');
            // Por ejemplo, puedes recargar la lista de tareas o realizar otras acciones necesarias
        })
        .catch(error => {
            console.error('Error al actualizar el estado de la tarea:', error);
            // Manejar errores si la solicitud falla
        });
    } else {
        // Si el usuario cancela la alerta, no hacer nada
        return;
    }
}

 
function cargarDatosTarea(id) {
    console.log(id);
    // Realizar una solicitud GET al servidor para obtener los detalles de la tarea con el ID proporcionado
    fetch(`https://localhost:7262/api/v1/UserToDo/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los detalles de la tarea');
            }
            return response.json();
        })
        .then(task => {
            // Llenar el formulario modal con los detalles de la tarea obtenidos
            document.getElementById("nombre").value = task.taskName;
            document.getElementById("descripcion").value = task.taskDescription;
            idEdit = id;
            
        })
        .catch(error => {
            console.error('Error al cargar los datos de la tarea:', error);
        });
}

function datosTarea() {
    document.getElementById("nombre").value = "";
    document.getElementById("descripcion").value = "";
 }



 document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-update-tarea").addEventListener("click", function() {
        updateTarea();
    });
});
function updateTarea() {
    console.log(idEdit);
    var nombre = document.getElementById("nombre").value.trim();
    var descripcion = document.getElementById("descripcion").value.trim();

    if (nombre && descripcion) {
        var data = {
            id: idEdit,
            TaskName: nombre,
            TaskDescription: descripcion
        };

        fetch(`https://localhost:7262/api/v1/UserToDo/Update/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("La respuesta del servidor no fue exitosa");
            }
            if (response.status === 200) {
                document.querySelector('[data-bs-dismiss="modal"]').click();
                location.reload();
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log("Respuesta del servidor:", data);
                // Aquí puedes manejar la respuesta del servidor según tus necesidades
            } else {
                console.log("La respuesta del servidor no contiene datos JSON");
            }
        })
        .catch(error => {
            console.error("Error en la solicitud:", error);
            // Aquí puedes manejar el error en caso de que la solicitud falle
        });
    } else {
        alert('Los campos de nombre y descripción son obligatorios');
    }
}






 