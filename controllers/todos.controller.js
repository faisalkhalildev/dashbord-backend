import Todo from "../models/Todos.js";
import redisClient from "../utils/redis.js"


// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = await Todo.create({
      title,
      description: description || "",
      createdBy: req.userId,
    });

    // 🔥 Cache clear for this user
    const key = `todos:${req.userId}`;
    await redisClient.del(key);

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


// GET TODOS (WITH REDIS CACHING)
export const getTodos = async (req, res) => {
  try {

    const key = `todos:${req.userId}`;

    // 1️⃣ Redis check karo
    const cachedTodos = await redisClient.get(key);

    if (cachedTodos) {
      console.log("Data from Redis 🔥");
      return res.json({
        isSuccess: true,
        todos: JSON.parse(cachedTodos),
      });
    }

    // 2️⃣ MongoDB hit
    console.log("Data from MongoDB 🗄️");
    const todos = await Todo.find({ createdBy: req.userId })
      .sort({ createdAt: -1 });

    // 3️⃣ Redis me save (60 sec)
    await redisClient.set(key, JSON.stringify(todos), {
      EX: 60,
    });

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

    if (!todo)
      return res.status(404).json({
        isSuccess: false,
        message: "Todo not found",
      });

    // 🔥 Cache clear
    const key = `todos:${req.userId}`;
    await redisClient.del(key);

    res.json({ isSuccess: true, todo });

  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};


// DELETE TODO
export const deleteTodo = async (req, res) => {
  try {

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId,
    });

    if (!todo)
      return res.status(404).json({
        isSuccess: false,
        message: "Todo not found",
      });

    // 🔥 Cache clear
    const key = `todos:${req.userId}`;
    await redisClient.del(key);

    res.json({ isSuccess: true });

  } catch (error) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};