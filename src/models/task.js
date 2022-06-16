const mongoose = require('mongoose'); 


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    {
        timestamps: true // enable timestamps for new task when was crated and last updated
    }
)



const Task = mongoose.model('Tasks', taskSchema)


module.exports = Task;


