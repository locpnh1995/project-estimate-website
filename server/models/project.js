const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./user');
const Task = require('./task');
const Company = require('./company');

var projectSchema = new Schema({
    project_name: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    start_day: {
        type: Date,
        required: true
    },
    end_day: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    language_programming: {
        type: [String],
        required: false
    },
    level: {
        type: Number,
        required: false
    },
    belong_company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    point_list: {
        type: Array,
        required: false
    },
    warning_list: {
        type: Schema.Types.Mixed,
        required: false
    },
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);