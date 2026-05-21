// ============================================
// Google Sheets Email — Reemplaza Resend (gratis, vía Gmail)
// 1. Pegá google-apps-script.js en tu Google Sheet (Extensiones > Apps Script)
// 2. Implementar > Aplicación web > Cualquiera > Copiá la URL
// 3. Pegá esa URL abajo en GOOGLE_SCRIPT_URL
// ============================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxS7-GviskVHKD1-3lXxqgWpVJKgGxhClzPP3ZBK0GAErWZnCXpKR5kvaQbFl3rzNeq/exec';

// ============================================
// NO TOCAR DE ACÁ PARA ABAJO
// ============================================

async function sendEmailGSheets({ to, subject, html, tipo, fullName, course, password }) {
    const payload = {
        tipo: tipo,
        email: to,
        fullName: fullName,
        course: course,
        password: password || '',
    };

    const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.msg || 'Error enviando correo');
    return data;
}

window.enviarCorreoBienvenida = async function (nombre, email, curso, password) {
    return sendEmailGSheets({
        tipo: 'inscripcion',
        to: email,
        fullName: nombre,
        course: curso,
        password: password || '',
        subject: '🎓 ¡Bienvenido a CampusIA!',
    });
};

window.enviarCorreoAceptacion = async function (nombre, email, curso, password) {
    return sendEmailGSheets({
        tipo: 'aceptacion',
        to: email,
        fullName: nombre,
        course: curso,
        password: password,
        subject: '✅ ¡Fuiste aceptado en CampusIA!',
    });
};

console.log('📊 Google Sheets —', GOOGLE_SCRIPT_URL.startsWith('https://script.google.com') ? '✅ URL detectada' : '⚠️ Pegá tu URL de Google Apps Script en sheets.js');
