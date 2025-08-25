import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
dotenv.config();

const app = express();

connectDB();

app.use(express.json);

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => res.send('File Sharing API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT} `));

