const Task = require('../models/Task');

const taskController = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.findAll();
            res.json(tasks);
        } catch (error) {
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
            res.status(500).json({ error: 'Failed to create task' });
        }
    },

    updateTask: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, completed } = req.body;
            await Task.update(id, title, description, completed);
            const updatedTask = await Task.findById(id);
            res.json(updatedTask);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update task' });
        }
    },

    deleteTask: async (req, res) => {
        try {
            const { id } = req.params;
            await Task.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete task' });
        }
    }
};

module.exports = taskController;