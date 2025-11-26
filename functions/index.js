/**
 * ФУНКЦІЯ V2 (NODEJS20) для обробки форми контактів.
 */

import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as nodemailer from 'nodemailer'; 

// Ініціалізація
const adminApp = initializeApp();
const db = getFirestore(adminApp);

export const submitForm = onRequest({
    region: 'europe-west4', 
    cors: ['https://ikigai.com.ua'],
    // Вказуючи секрети тут, Firebase автоматично прив'яже 'latest' версію 
    // під час розгортання (deploy).
    secrets: [
        "SMTP_HOST", 
        "SMTP_PORT", 
        "SMTP_USER", 
        "SMTP_PASS", 
        "RECEIVING_EMAIL"
    ] 
}, async (req, res) => {
    
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    
    // Перевірка наявності тіла запиту
    if (!req.body) {
        return res.status(400).send('Request body is required.');
    }

    const { name, phone, message } = req.body;

    // Зчитування секретів.
    // Cloud Functions робить їх доступними через process.env
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT || '587';
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL;

    // Валідація вхідних даних
    if (!name || !phone) {
        return res.status(400).send('Name and phone are required.');
    }

    // Перевірка наявності критичних налаштувань перед початком роботи
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !RECEIVING_EMAIL) {
        console.error("CONFIGURATION ERROR: Missing secrets.");
        // Корисно вивести, чого саме не вистачає (але не виводь самі паролі!)
        console.error({
            hasHost: !!SMTP_HOST,
            hasUser: !!SMTP_USER,
            hasPass: !!SMTP_PASS,
            hasReceiver: !!RECEIVING_EMAIL
        });
        return res.status(500).send({ message: 'Server configuration error.' });
    }

    try {
        // --- Логіка відправки Email ---
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_PORT === '465',
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        const mailOptions = {
            from: `Ikigai Website <${SMTP_USER}>`, 
            to: RECEIVING_EMAIL, 
            subject: 'Нова заявка з форми Ikigai Landing Page',
            html: `
                <p>Ви отримали нову заявку з контактної форми на сайті:</p>
                <ul>
                    <li><strong>Ім'я:</strong> ${name}</li>
                    <li><strong>Телефон:</strong> ${phone}</li>
                    <li><strong>Коментар:</strong> ${message || 'Немає коментаря'}</li>
                    <li><strong>Час:</strong> ${new Date().toLocaleString('uk-UA')}</li>
                </ul>
            `
        };

        // Спроба відправки
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${RECEIVING_EMAIL}`);

        // --- Збереження у Firestore ---
        try {
            await db.collection('contactRequests').add({
                name,
                phone,
                message: message || '',
                timestamp: FieldValue.serverTimestamp(),
                status: 'new'
            });
            console.log("Request saved to Firestore");
        } catch (dbError) {
            console.error("WARNING: Failed to save to Firestore, but email was sent.", dbError);
        }

        return res.status(200).send({ message: 'Заявку успішно надіслано!' });

    } catch (error) {
        console.error("CRITICAL FAILURE during execution:", error);
        return res.status(500).send({ message: 'Виникла помилка на сервері.' });
    }
});
