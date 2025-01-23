// Función para cargar las tareas desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Obtener todas las columnas
const columns = document.querySelectorAll('.column');

// Función para agregar una nueva tarea a la lista de tareas pendientes
function addNewTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Por favor ingresa una tarea válida');
        return;
    }

    // Crear un nuevo elemento de tarea
    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.draggable = true;
    newTask.innerText = taskText;

    // Asignar un ID único a la nueva tarea
    const taskId = `task-${Date.now()}`;
    newTask.setAttribute('id', taskId);

    // Agregar la tarea a la columna de tareas pendientes
    document.getElementById('tareas-pendientes').appendChild(newTask);

    // Añadir funcionalidad de arrastrar a la nueva tarea
    addDragEvents(newTask);

    // Guardar en localStorage
    saveTasks();

    // Limpiar el campo de entrada
    taskInput.value = '';
}

// Permitir arrastrar tareas sobre columnas
columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = document.getElementById(taskId);
        
        // Mover la tarea a la columna de destino
        if (!column.contains(task)) {
            column.appendChild(task);
            saveTasks();
        }
    });
});

// Función para añadir eventos de arrastrar a una tarea
function addDragEvents(task) {
    if (!task.id) {
        task.setAttribute('id', `task-${Math.random().toString(36).substr(2, 9)}`);
    }

    task.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        setTimeout(() => {
            task.style.display = 'none';
        }, 0);
    });

    task.addEventListener('dragend', () => {
        task.style.display = 'block';
    });
}

// Función para guardar tareas en localStorage
function saveTasks() {
    const taskData = {};

    columns.forEach(column => {
        const tasks = Array.from(column.querySelectorAll('.task'));
        taskData[column.id] = tasks.map(task => task.innerText);
    });

    localStorage.setItem('tableroTareas', JSON.stringify(taskData));
}

// Función para cargar tareas desde localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tableroTareas');

    if (savedTasks) {
        const taskData = JSON.parse(savedTasks);

        for (const columnId in taskData) {
            const column = document.getElementById(columnId);
            taskData[columnId].forEach(taskText => {
                const newTask = document.createElement('div');
                newTask.className = 'task';
                newTask.draggable = true;
                newTask.innerText = taskText;

                addDragEvents(newTask);
                column.appendChild(newTask);
            });
        }
    }
}

// Función para limpiar todas las tareas y el almacenamiento
function clearTasks() {
    localStorage.removeItem('tableroTareas');
    document.querySelectorAll('.task').forEach(task => task.remove());
}

// Función para manejar la carga masiva de tareas desde un archivo
function handleFileUpload() {
    const fileInput = document.getElementById('taskFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor selecciona un archivo.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const content = event.target.result;
        
        // Determinar si el archivo es CSV o TXT
        const lines = content.includes(',') ? content.split(',') : content.split('\n');

        lines.forEach(taskText => {
            taskText = taskText.trim();
            if (taskText) {
                createTask(taskText);
            }
        });

        // Guardar tareas en localStorage
        saveTasks();

        // Limpiar el input después de cargar
        fileInput.value = '';
    };

    reader.readAsText(file);
}

// Función para crear una tarea y agregarla a la lista de tareas pendientes
function createTask(taskText) {
    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.draggable = true;
    newTask.innerText = taskText;

    // Asignar un ID único a la nueva tarea
    newTask.setAttribute('id', `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Agregar la tarea a la columna de tareas pendientes
    document.getElementById('tareas-pendientes').appendChild(newTask);

    // Añadir eventos de arrastrar a la nueva tarea
    addDragEvents(newTask);
}