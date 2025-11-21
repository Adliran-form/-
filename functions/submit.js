const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    // --- ارسال به Google Sheet ---
    const WEBHOOK = "https://script.google.com/macros/s/AKfycbx819xxYUL8424H30N1vwPtriBo0m7DBO8u9wfyEPXR2FvElWUd-R_qTgPEq3-JTgzu-Q/exec";
    await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nationalId: data.nationalId,
        locationDisplay: data.locationDisplay,
        locationFull: data.locationFull,
        timestamp: data.timestamp
      })
    });

    // --- ارسال پیام به تلگرام ---
    const BOT_TOKEN = "8430479124:AAFAW5rtSLqD_V8_8gg0ehkHjosYNXfUrQk";
    const CHAT_ID = "7570861617";
    const textMsg = `<b>ثبت‌نام جدید</b>\n<b>کد ملی:</b> ${data.nationalId}\n<b>لوکیشن:</b> ${data.locationDisplay}\n<b>لوکیشن کامل:</b> ${data.locationFull}\n<b>زمان:</b> ${data.timestamp}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: textMsg, parse_mode: "HTML" })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success" })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: "error", message: err.message }) };
  }
};
