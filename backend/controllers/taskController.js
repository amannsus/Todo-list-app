const Task = require('../models/Task');

const taskController = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    },

    createTask: async (req, res) => {
        try {
            const { title, description } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }
            const taskId = await Task.create(title, description);
            const newTask = await Task.findById(taskId);
            res.status(201).json(newTask);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, completed } = req.body;
            await Task.update(id, title, description, completed);
            const updatedTask = await Task.findById(id);
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            const task = await Task.findById(id);
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            await Task.delete(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }
};

module.exports = taskController;