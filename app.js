const express = require('express');
const cors = require('cors');
const axios = require('axios'); // تأكد من تثبيت axios

const app = express();
const port = process.env.PORT || 3000; // يمكن استخدام البيئة السحابية لتحديد البورت تلقائيًا

// تفعيل CORS لجميع النطاقات بما فيها OPTIONS
app.use(cors({
    origin: 'https://inbox.messagebird.com',  // تحديد النطاق الذي يسمح بالوصول
    methods: ['GET', 'POST', 'OPTIONS'],  // السماح بالطرق المسموح بها بما في ذلك OPTIONS
    allowedHeaders: ['Content-Type'],  // السماح بالهيدر Content-Type
}));

// تفسير محتوى JSON القادم من الطلبات
app.use(express.json());

// عنوان Google Apps Script
const scriptUrl = 'https://script.google.com/macros/s/AKfycbySJkYa3v9wrD8h0r27bGs5ZYvS2TWb_nukrjG9fUh8WdzVIeaVYnRs8DGkNxsKpKAieQ/exec';

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

// تأكد من أن الخادم يستجيب لطلبات OPTIONS أيضًا
app.options('*', cors());  // تمكين CORS لكل المسارات

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
