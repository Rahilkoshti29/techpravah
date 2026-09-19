import User from "../models/User.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"


// REGISTER USER => POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; //destructuring

    // 1. Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email }); //enhanced object literal

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    // 5. Generate token
    const token = generateToken(user._id);

    // 6. Send response
    res.status(201).json({
      message: "User registered successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// LOGIN USER => POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 3. Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// GET CURRENT USER => GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({ user });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


export {
  registerUser,
  loginUser,
  getCurrentUser
};