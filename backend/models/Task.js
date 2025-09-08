const { mongoose } = require('../config/database');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Normalize JSON output: expose `id` (string) and hide `_id` and `__v`
taskSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
    }
});

const TaskModel = mongoose.model('Task', taskSchema);

class Task {
    static async create(title, description = '') {
        const task = new TaskModel({
            title,
            description,
            completed: false
        });
        await task.save();
        return task._id;
    }

    static async findAll() {
        return await TaskModel.find().sort({ created_at: -1 });
    }

    static async findById(id) {
        return await TaskModel.findById(id);
    }

    static async update(id, title, description, completed) {
        await TaskModel.findByIdAndUpdate(id, {
            title,
            description,
            completed,
            updated_at: Date.now()
        });
    }

    static async delete(id) {
        await TaskModel.findByIdAndDelete(id);
    }
}

module.exports = Task;
