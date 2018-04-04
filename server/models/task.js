const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');
const Project = require('./project');

taskSchema = new Schema({
    task_name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    start_day: {
        type: Date,
        required: true
    },
    end_day: {
        type: Date,
        required: true
    },
    labels: {
        type: Array,
        required: false
    },
    editor: {
        type: Schema.Types.Mixed,
        required: false
    },
    belong_project: { 
        type: Schema.Types.ObjectId, 
        ref: 'Project',
        required: true
    },
    responsible_user: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);