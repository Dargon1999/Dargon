const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// Настройка CORS для разрешения запросов с вашего фронтенда
app.use(cors());

// Настройка папки для статических файлов (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '.')));

// Настройка папки для хранения загруженных файлов
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Лимит 10 МБ на файл
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|webm/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Только изображения (jpeg, jpg, png, gif) или видео (mp4, webm) разрешены!'));
    }
});

// Эндпоинт для загрузки файла
app.post('/upload', upload.single('media'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
    }
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Эндпоинт для получения списка файлов
app.get('/media', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка чтения папки' });
        }
        const mediaFiles = files.map(file => ({
            src: `/uploads/${file}`,
            type: file.match(/\.(mp4|webm)$/i) ? 'video' : 'img'
        }));
        res.json(mediaFiles);
    });
});

// Эндпоинт для удаления файла
app.delete('/media/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка удаления файла' });
        }
        res.json({ message: 'Файл удален' });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});