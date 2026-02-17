import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import bcrypt from 'bcryptjs';

export const registeredUser = async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400)
      .send({
        isSucess: false,
        message: "email name and password required",
      });
  }


try {
  const foundUser = await User.findOne({ email });

  if (foundUser) {
    return res
      .status(401)
      .send({ isSucess: false, message: "Username or email aready exist" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    email,
    name,
    password: hashPassword,
  });
  await newUser.save();

  res.send({
    isSucess: true,
    message: "User register successfully",
  });
} catch (error) {
  console.log(error);
  res.status(500).send({ isSuccess: false, message: "Server error" });
}
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      isSuccess: true,
      data: users,
    });
  } catch (error) {
    res.status(500).send({ isSuccess: false, message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
     const { email, password } = req.body;

    // 1️⃣ Validation
    if (!email || !password) {
      return res.status(400).send({
        isSuccess: false,
        message: "email and password required",
      });
    }

    // 2️⃣ Find user (email as username)
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(404).send({
        isSuccess: false,
        message: "user does not exist",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(401).send({
        isSuccess: false,
        message: "incorrect password",
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: userFound._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Success response
    return res.status(200).send({
      isSuccess: true,
      message: "login successful",
      token,
      user: {
        id: userFound._id,
        userName: userFound.userName,
        email: userFound.email,
      },
    });

  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: "server error",
      error: error.message,
    });
  }
};

