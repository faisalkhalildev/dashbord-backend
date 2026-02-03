import Todo from "../models/Todos.js";

// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = await Todo.create({
      title,
      description: description || "",
      createdBy: req.userId, // JWT middleware se set
    });

    res.status(201).json({
      isSuccess: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

// GET TODOS for logged in user
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ createdBy: req.userId }).sort({ createdAt: -1 });

    res.json({
      isSuccess: true,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

// UPDATE TODO
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      req.body,
      { new: true }
    );

    if (!todo) return res.status(404).json({ isSuccess: false, message: "Todo not found" });

    res.json({ isSuccess: true, todo });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};

// DELETE TODO
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });

    if (!todo) return res.status(404).json({ isSuccess: false, message: "Todo not found" });

    res.json({ isSuccess: true });
  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};
