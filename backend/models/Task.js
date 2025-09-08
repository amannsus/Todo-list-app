const db = require('../config/database');

class Task {
    static async create(title, description = '') {
        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, completed, created_at) VALUES (?, ?, ?, NOW())',
            [title, description, false]
        );
        return result.insertId;
    }

    static async findAll() {
        const [rows] = await db.execute(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async update(id, title, description, completed) {
        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?',
            [title, description, completed, id]
        );
    }

    static async delete(id) {
        await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    }
}

module.exports = Task;