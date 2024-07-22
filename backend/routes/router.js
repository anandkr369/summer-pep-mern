const express = require('express');
const StudentModel = require('../models/user');
const AppliedModel = require('../models/applied');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');

  router.post('/signup', async (req, res) => {
    const { username, email, password, age, dateOfBirth } = req.body;
    const { image } = req.files;
  
    let cloudinaryResponse;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error",
          cloudinaryResponse.error || "Unknown Cloudinary Error"
        );
        return res.status(500).json({ message: "Failed to upload image" });
      }
    }
  
    const user = await StudentModel.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new StudentModel({
      username,
      email,
      password: hashedPass,
      age,
      dateOfBirth,
      pic: cloudinaryResponse ? {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      } : "https://tse2.mm.bing.net/th?id=OIP.lemSvD193RXLAVtkXfTjDAHaGd&pid=Api&P=0&h=180"
    });
    await newUser.save();
    return res.json({ status: true, message: "User Created" });
  });
  

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await StudentModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).json({ message: "Password is wrong" });
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie("token", token);
  return res.json({ status: true, message: "User LoggedIn" });
});

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Auth Failed" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

router.get('/verify', verifyUser, (req, res) => {
  return res.json({ status: true, message: "Auth successful", user: req.user });
});

router.post('/apply', verifyUser, async (req, res) => {
  try {
    const { opportunity } = req.body;
    if (!opportunity || !opportunity.id) {
      return res.status(400).json({ message: "Invalid opportunity data" });
    }

    const appliedOpportunity = new AppliedModel({
      userId: req.user.email,
      id: opportunity.id,
      profile_name: opportunity.profile_name,
      company_name: opportunity.company_name,
      stipend: opportunity.stipend.salary,
      duration: opportunity.duration,
    });

    await appliedOpportunity.save();
    res.status(201).json({ message: "Applied Successfully" });
  } catch (error) {
    console.error('Error during applying:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Error during applying", error: error.message });
  }
});

router.get('/applied-opportunity', verifyUser, async (req, res) => {
  try {
    const appliedOffer = await AppliedModel.find({ userId: req.user.email });
    res.json(appliedOffer);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching Applied Opportunity" });
  }
});

router.get('/all-opportunity', verifyUser, async (req, res) => {
  try {
    const appliedOffer = await AppliedModel.find();
    res.json(appliedOffer);
  } catch (error) {
    res.status(500).json({ message: "Error in fetching Applied Opportunity" });
  }
});

router.post('/logout', async (req, res) => {
  await res.clearCookie('token');
  res.status(200).send({ message: 'Logged out successfully' });
});

router.get('/personal-details', verifyUser, async (req, res) => {
  try {
    const user = await StudentModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching personal details", error: error.message });
  }
});

router.post('/update-personal-details', verifyUser, async (req, res) => {
  try {
    const updates = req.body;
    const user = await StudentModel.findOneAndUpdate(
      { email: req.user.email },
      { $set: updates },
      { new: true }
    );
    res.json({ status: true, message: "Personal details updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating personal details", error: error.message });
  }
});

module.exports = router;
