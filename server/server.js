// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const Url = 'mongodb+srv://sandeep2171996:T9gJ9WgHbBt7rzI3@cluster0.fo651.mongodb.net/tasks_db?retryWrites=true&w=majority&appName=Cluster0'

// Middleware
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(Url)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Connection error', error);
});

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);
//get all
app.get('/task', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.status(200)
        res.send(tasks)
    }
    catch(error) {
        res.status(404).send({message : error.message})
    }
})
//post
app.post('/task', async (req, res) => {
    try {
        const {title, completed = false} = req.body
        const newtask = await Task.create({title, completed})
        res.status(200)
        res.send(newtask)
    }
    catch(error) {
        res.status(404).send({message : error.message})
    }
})
//update
app.put('/task/:id', async (req, res) => {
    try {
        const {id} = req.params
        const updated = req.body
        const task = await Task.findByIdAndUpdate(id,  updated)
        if (!task) {
                return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json(updated)
    }
    catch(error) {
        res.status(500).send({message : error.message})
    }
})
//getbyid
app.get('/task/:id', async (req, res) => {
    try {
        const {id} = req.params
        const task = await Task.findById(id)
        if (!task) {
                return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json(task)
    }
    catch(error) {
        res.status(404).send({message : error.message})
    }
})
//delete
app.delete('/task/:id', async (req, res) => {
    try {
        const {id} = req.params
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
                return res.status(404).json({ message: 'Task not found' });
        }
    const remainig = await Task.find()
    res.status(200).json({
        message: 'Product deleted successfully',
        remainig: remainig
    });
    }
    catch(error) {
        res.status(404).send({message : error.message})
    }
})

app.listen(PORT)