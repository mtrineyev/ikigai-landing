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
 *      - RECEIVING_EMAIL -> "ВАША_ЕЛЕКТРОННА_АДРЕСА_ДЛЯ_ОТРИМАННЯ_СПОВІЩЕНЬ"
 * Примітка: Переконайтеся, що у вашому проєкті Firebase увімкнено Cloud Secret Manager API.
 */

// --------------------------------------------------------------------------------------
// 1. ІМПОРТИ (V2 & ES Modules)
// --------------------------------------------------------------------------------------

import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as nodemailer from 'nodemailer'; 

// ----------------------------------------------------
// 2. ІНІЦІАЛІЗАЦІЯ (Global)
// ----------------------------------------------------

// Ініціалізуємо Firebase Admin SDK та Firestore. 
// Це виконується на Cold Start і є безпечним.
const adminApp = initializeApp();
const db = getFirestore(adminApp);


// ----------------------------------------------------
// 3. ФУНКЦІЯ V2 (ЕКСПОРТ)
// ----------------------------------------------------

export const submitForm = onRequest({
    region: 'europe-west4', 
    cors: ['https://ikigai.com.ua'],
    secrets: ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "RECEIVING_EMAIL"] 
}, async (req, res) => {
    
    // Перевірка HTTP-методу та тіла запиту
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }
    
    if (!req.body) {
        console.error("Request body is empty.");
        return res.status(400).send('Request body is required.');
    }

    const { name, phone, message } = req.body;

    // Отримуємо секрети всередині обробника
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = process.env.SMTP_PORT || '587';
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const SMTP_SECURE = SMTP_PORT === '465'; 
    const RECEIVING_EMAIL = process.env.RECEIVING_EMAIL;

    if (!name || !phone) {
        return res.status(400).send('Name and phone are required.');
    }

    try {
        
        // КРИТИЧНИЙ ЕТАП 1: Надсилання email сповіщення
        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !RECEIVING_EMAIL) {
             // Якщо немає секретів, це вважається критичною помилкою для Клієнта
             throw new Error("SMTP or RECEIVING_EMAIL credentials missing. Cannot send critical notification.");
        } 
        
        // --- Логіка відправки Email ---
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT),
            secure: SMTP_SECURE,
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
                <p>Необхідно зв'язатися з клієнтом якнайшвидше.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Notification email sent successfully", { name, phone });
        // --- Кінець Email-логіки ---

        // КРИТИЧНИЙ ЕТАП 2 (Вторинний): Збереження заявки у Firestore
        // Ізолюємо цю операцію, щоб її збій не спричинив помилку 500 для клієнта.
        try {
            const timestamp = FieldValue.serverTimestamp();
            const requestData = {
                name,
                phone,
                message: message || 'Немає коментаря',
                timestamp: timestamp,
                status: 'new'
            };
            await db.collection('contactRequests').add(requestData);
            console.log("New contact request saved to Firestore", { name, phone });
        } catch (dbError) {
            // Логуємо помилку бази даних, але НЕ кидаємо її далі
            console.error("WARNING: Failed to save request to Firestore. Email was sent.", dbError);
        }

        // Успішна відповідь, якщо Email був успішно надісланий
        return res.status(200).send({ message: 'Заявку успішно надіслано!' });

    } catch (error) {
        // Спіймано критичну помилку (наприклад, не вдалося відправити Email або відсутні секрети)
        console.error("CRITICAL FAILURE:", error);
        
        // Повертаємо загальну помилку, якщо щось пішло не так
        return res.status(500).send({ message: 'Виникла помилка на сервері.' });
    }
});
