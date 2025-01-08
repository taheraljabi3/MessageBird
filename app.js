const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000; // المنفذ، يتم تحديده تلقائيًا في البيئة السحابية

// تفعيل CORS لجميع النطاقات بما فيها OPTIONS
app.use(cors({
    origin: 'https://inbox.messagebird.com', // السماح بالنطاق الخاص بـ MessageBird
    methods: ['GET', 'POST', 'OPTIONS'], // الطرق المسموح بها
    allowedHeaders: ['Content-Type'], // الهيدر المسموح بها
}));

// تفسير محتوى JSON القادم من الطلبات
app.use(express.json());

// عنوان Google Apps Script
const scriptUrl = 'https://script.google.com/macros/s/AKfycbw4r7p5xPXFiKVh4VTFdPdl4EQY67_fALWIespmyLf4YvLf2qjE89v1dvZmIepSXLV8Kg/exec';

// نقطة استقبال البيانات
app.post('/proxy', async (req, res) => {
    console.log('Received data:', req.body);

    try {
        // إرسال البيانات إلى Google Apps Script
        const response = await axios.post(scriptUrl, req.body);

        console.log('Response from Google Apps Script:', response.data);

        // إعادة الرد من Google Apps Script إلى العميل
        res.send(response.data);
    } catch (error) {
        console.error('Error sending data to Google Apps Script:', error.message);

        // إرسال رسالة خطأ إلى العميل
        res.status(500).send({
            status: 'error',
            message: 'Failed to send data to Google Apps Script.',
            error: error.message
        });
    }
});

// تأكد من أن الخادم يستجيب لطلبات OPTIONS
app.options('*', cors());

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
