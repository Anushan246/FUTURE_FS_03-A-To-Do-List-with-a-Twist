document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const reminderInput = document.getElementById('reminderInput');
    const taskList = document.getElementById('taskList');

    // Request notification permission
    function requestNotificationPermission() {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            createTaskElement(task.text, task.date, task.reminder, task.completed);
        });
    }

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                date: li.querySelector('.task-details').textContent,
                reminder: li.querySelector('.task-reminder').textContent,
                completed: li.querySelector('.task-text').classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Create a task element
    function createTaskElement(taskText, taskDate, taskReminder, isCompleted = false) {
        const li = document.createElement('li');
        
        const span = document.createElement('span');
        span.textContent = taskText;
        span.className = 'task-text' + (isCompleted ? ' completed' : '');

        const details = document.createElement('div');
        details.className = 'task-details';
        details.textContent = `Created on: ${taskDate}`;

        const reminder = document.createElement('div');
        reminder.className = 'task-reminder';
        reminder.textContent = taskReminder ? `Reminder: ${taskReminder}` : '';

        // Toggle complete status
        span.addEventListener('click', () => {
            span.classList.toggle('completed');
            saveTasks();
        });

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => {
            const newTaskText = prompt('Edit your task:', span.textContent);
            if (newTaskText !== null) {
                span.textContent = newTaskText;
                saveTasks();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
            saveTasks();
        });

        li.appendChild(span);
        li.appendChild(details);
        li.appendChild(reminder);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        // Check for reminders
        checkReminder(taskReminder, taskText);
    }

    // Add task function
    function addTask() {
        const taskText = taskInput.value.trim();
        const reminderDate = reminderInput.value;
        if (taskText === '') return;

        const now = new Date();
        const dateString = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const reminderString = reminderDate ? new Date(reminderDate).toLocaleString() : '';

        createTaskElement(taskText, dateString, reminderString);
        taskInput.value = '';
        reminderInput.value = '';
        saveTasks();
    }

    // Check if reminder time is due and notify
    function checkReminder(reminderTime, taskText) {
        if (!reminderTime) return;

        const reminderDate = new Date(reminderTime);
        const now = new Date();
        const timeDifference = reminderDate - now;

        // Set timeout for the notification
        if (timeDifference > 0) {
            setTimeout(() => {
                if (Notification.permission === 'granted') {
                    new Notification('Task Reminder', {
                        body: `Reminder for task: ${taskText}`,
                        icon: 'download (1).jpeg' // Optional: add an icon to the notification
                    });
                }
            }, timeDifference);
        }
    }

    // Event listener for add task button
    addTaskBtn.addEventListener('click', addTask);

    // Allow Enter key to add tasks
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Request notification permission on load
    requestNotificationPermission();

    // Initial load of tasks
    loadTasks();
});
