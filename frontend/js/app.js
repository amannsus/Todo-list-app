class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.loadTasks();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('taskForm').addEventListener('submit', this.handleSubmit.bind(this));
        document.getElementById('cancelBtn').addEventListener('click', this.cancelEdit.bind(this));
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', this.handleFilter.bind(this));
        });
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            this.tasks = await response.json();
            this.renderTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        
        if (!title) {
            this.showError('Please enter a task title');
            return;
        }

        try {
            if (this.editingTaskId) {
                await this.updateTask(this.editingTaskId, title, description);
            } else {
                await this.createTask(title, description);
            }
            
            this.resetForm();
            this.loadTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            this.showError('Failed to save task');
        }
    }

    async createTask(title, description) {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create task');
        }
    }

    async updateTask(id, title, description, completed = null) {
        const task = this.tasks.find(t => t.id == id);
        const completedStatus = completed !== null ? completed : task.completed;
        
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, completed: completedStatus })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
    }

    async deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }
        
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.loadTasks();
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError('Failed to delete task');
        }
    }

    async toggleComplete(id) {
        const task = this.tasks.find(t => t.id == id);
        try {
            await this.updateTask(id, task.title, task.description, !task.completed);
            this.loadTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
            this.showError('Failed to update task');
        }
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id == id);
        if (task) {
            this.editingTaskId = id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('submitBtn').textContent = 'Update Task';
            document.getElementById('cancelBtn').style.display = 'inline-block';
            document.getElementById('taskTitle').focus();
        }
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        this.editingTaskId = null;
        document.getElementById('taskForm').reset();
        document.getElementById('submitBtn').textContent = 'Add Task';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    handleFilter(e) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.renderTasks();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.tasks.filter(task => task.completed);
            case 'pending':
                return this.tasks.filter(task => !task.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        taskList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const date = new Date(task.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="task-item ${task.completed ? 'completed' : 'pending'}">
                <div class="task-header">
                    <div class="task-content">
                        <div class="task-title ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.title)}</div>
                        ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
                        <div class="task-date">Created: ${date}</div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-sm ${task.completed ? 'btn-secondary' : 'btn-success'}" 
                                onclick="app.toggleComplete(${task.id})">
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="btn-sm btn-warning" onclick="app.editTask(${task.id})">Edit</button>
                        <button class="btn-sm btn-danger" onclick="app.deleteTask(${task.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        alert(message); // In production, use a better notification system
    }
}

// Initialize the app
const app = new TodoApp();