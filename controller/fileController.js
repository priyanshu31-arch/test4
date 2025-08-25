import File from '../models/File.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'file-sharing' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      uploadStream.end(req.file.buffer);
    });

    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); 

    const newFile = new File({
      filename: req.file.originalname,
      fileURL: result.secure_url,
      uploadedBy: req.user.id,
      expiryTime,
    });
    await newFile.save();

    const user = await User.findById(req.user.id);
    const downloadLink = `${req.protocol}://${req.get('host')}/api/files/download/${newFile._id}`;

    await transporter.sendMail({
      from: `"FileShare" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your File Upload and Download Link',
      html: `<p>Hi ${user.name},</p><p>Your download link is: <a href="${downloadLink}">${downloadLink}</a></p><p>This link will expire in 1 hour.</p>`,
    });

    res.status(201).json({ msg: 'File uploaded and email sent.', downloadLink });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: 'File not found or link is invalid.' });
    }
    if (new Date() > file.expiryTime) {
      return res.status(400).json({ msg: 'This download link has expired.' });
    }
    file.downloadCount += 1;
    await file.save();
    res.json({ fileURL: file.fileURL });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};