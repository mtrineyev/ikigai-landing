/**
 * ФУНКЦІЯ V2 (NODEJS20) для обробки форми контактів.
 * Використовує сучасний синтаксис Functions V2 для коректної роботи з ES Modules та налаштуванням регіону.
 *
 * 1. Зберігає дані заявки у Firestore.
 * 2. Надсилає сповіщення через Nodemailer (MailGun).
 * 3. РЕГІОН: Явно встановлено на 'europe-west4'.
 * 4. СЕКРЕТИ: Облікові дані SMTP завантажуються з Cloud Secret Manager.
 *    Треба встановити наступні секрети:
 *      - SMTP_HOST -> "smtp.eu.mailgun.org"
 *      - SMTP_PORT -> "465"
 *      - SMTP_USER -> "ЛОГІН_НА_mailgun.org"
 *      - SMTP_PASS -> "ВАШ_ПАРОЛЬ_SMTP"
 */
// --------------------------------------------------------------------------------------
// 1. ІМПОРТИ (V2 & ES Modules)
// --------------------------------------------------------------------------------------

// V2 Imports: 'onRequest' для HTTP-функцій
import { onRequest } from 'firebase-functions/v2/https';
// Firebase Admin Imports: Використовуємо іменовані імпорти для Admin SDK V10+
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as nodemailer from 'nodemailer'; 

// ----------------------------------------------------
// 2. КОНСТАНТИ
// ----------------------------------------------------

// Змінні, які будуть автоматично завантажені з Cloud Secret Manager
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || '587';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = SMTP_PORT === '465'; 
const RECEIVING_EMAIL = 'mtrineyev@gmail.com'; // Змінити на вашу адресу отримувача

// ----------------------------------------------------
// 3. ІНІЦІАЛІЗАЦІЯ
// ----------------------------------------------------

// Ініціалізуємо Firebase Admin SDK та Firestore
const adminApp = initializeApp();
const db = getFirestore(adminApp);

// Створюємо об'єкт для відправки пошти
let transporter;

try {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        // Логуємо помилку, але не кидаємо виняток, щоб функція могла розгорнутися.
        console.error("CRITICAL ERROR: SMTP credentials missing from Secret Manager. Email notification will fail.");
    } else {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_SECURE,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });
        console.log("Nodemailer transporter initialized successfully.");
    }
} catch (e) {
    console.error("FATAL ERROR during Nodemailer initialization:", e);
}


// ----------------------------------------------------
// 4. ФУНКЦІЯ V2 (ЕКСПОРТ)
// ----------------------------------------------------

/**
 * Обробляє POST-запити з форми контактів.
 * Встановлює регіон та CORS через об'єкт конфігурації, а також оголошує секрети.
 */
export const submitForm = onRequest({
    region: 'europe-west4', 
    cors: ['https://ikigai.com.ua'], // Дозволяємо лише вашому домену
    secrets: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] // Оголошуємо необхідні секрети
}, async (req, res) => {
    
    // Перевірка методу запиту
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Перевірка наявності тіла запиту
    if (!req.body) {
        console.error("Request body is empty.");
        return res.status(400).send('Request body is required.');
    }

    const { name, phone, message } = req.body;

    if (!name || !phone) {
        return res.status(400).send('Name and phone are required.');
    }

    // Використовуємо admin.firestore.FieldValue для мітки часу
    const timestamp = FieldValue.serverTimestamp();
    const requestData = {
        name,
        phone,
        message: message || 'Немає коментаря',
        timestamp: timestamp,
        status: 'new'
    };

    try {
        
        // 1. Збереження заявки у Firestore
        await db.collection('contactRequests').add(requestData);
        console.log("New contact request saved to Firestore", { name, phone });

        // 2. Надсилання email сповіщення
        if (transporter) {
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
                    <p>Необхідно зв'язатися з клієнтом якнайшвидше.</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log("Notification email sent successfully", { name, phone });
        } else {
             // Це станеться, якщо SMTP дані відсутні
             console.error("Email notification skipped: Transporter not initialized.");
        }
        
        // Успішна відповідь
        return res.status(200).send({ message: 'Заявку успішно надіслано!' });

    } catch (error) {
        // Логуємо помилку для діагностики в Google Cloud Console
        console.error("Error processing form submission or sending email:", error);
        
        // Повертаємо загальну помилку, якщо щось пішло не так
        return res.status(500).send({ message: 'Виникла помилка на сервері.' });
    }
});
