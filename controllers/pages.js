const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const initialRender = (req, res) => {
  try {
    const user = req.loggedUser;
    res.render("index", { user });
  } catch (error) {
    console.log(error.message);
  }
};

const registerUser = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      res.status(400).json({ status: "error", message: "User already exists" });
      return;
    }
    console.log(req.body);
    const bcryptPassword = await securePassword(req.body.password);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcryptPassword,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ status: "success", userId: savedUser._id });
    } else {
      res.status(500).json({ status: "error", message: "Failed to save user" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    const password = req.body.password;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .json({ status: "error", message: "Incorrect username or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.status(200).json({ status: "success", userId: user._id });
    } else {
      res
        .status(401)
        .json({ status: "error", message: "Incorrect username or password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// for encrypted password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//for fetching users and sending to front end
const searchUsers = async (req, res) => {
  try {
    const { keyToSearch } = req.body;

    const regex = new RegExp(keyToSearch, "i");
    const listedUsers = await User.find(
      {
        $and: [{ _id: { $ne: req.loggedUser } }, { name: regex }],
      },
      { password: 0 }
    );
    res.json({ listedUsers });
  } catch (error) {
    console.log(error.message);
  }
};

const loadMessage = async (req,res)=>{
  try {
  const {receiverId} = req.params
  const senderId = req.loggedUser
  const messages = await Chat.find({$or:[
    {senderId,receiverId},
    {senderId:receiverId,receiverId:senderId},
  ]})
  res.status(200).json({status:"success",messages})
  } catch (error) {
    console.log(error.message);
  }
}

const sendMessage = async(req,res)=>{
  try {
    const senderId = req.loggedUser
    const {message,receiverId} = req.body
    const newChat = await new Chat({senderId,receiverId,message}).save();
    if(newChat){
      res.status(200).json({status:"success",senderId})
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  initialRender,
  registerUser,
  userLogin,
  searchUsers,
  sendMessage,
  loadMessage,


};
