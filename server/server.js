const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = 'mongodb://localhost:27017/todoapp'; // Replace with your MongoDB URI

mongoose.connect('mongodb://127.0.0.1:27017/todoapp', {
    useNewUrlParser: true,  // Deprecated but included for older versions
    useUnifiedTopology: true // Deprecated but included for older versions
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post('/todos', async (req, res) => {
    try {
      const newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed
      });
      await newTodo.save();
      res.status(201).json(newTodo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.put('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!todo) return res.status(404).json({ message: 'Todo not found' });
      res.json(todo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findByIdAndDelete(req.params.id);
      if (!todo) return res.status(404).json({ message: 'Todo not found' });
      res.json({ message: 'Todo deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });