const express = require('express');
const multer = require('multer');
const QRCode = require('qrcode');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('uploads')); // Serve uploaded files

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
    const file = req.file;

    if (!file) return res.status(400).send('No file uploaded.');

    const fileUrl = `${req.protocol}://${req.get('host')}/${file.filename}`;
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(fileUrl);
        res.json({ fileUrl, qrCodeDataUrl });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating QR code.');
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
