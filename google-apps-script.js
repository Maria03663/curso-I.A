// ============================================
// Pegá esto en Extensión → Apps Script de tu Google Sheet
// Luego: Implementar → Nueva implementación → Aplicación web
//          Ejecutar como: Yo
//          Acceso: Cualquiera
// ============================================

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const data = JSON.parse(e.postData.contents);
  const tipo = data.tipo || 'inscripcion';

  if (tipo === 'inscripcion') {
    sheet.appendRow([
      new Date(),
      data.fullName,
      data.email,
      data.phone || '',
      data.document || '',
      data.education || '',
      data.experience || '',
      data.course || '',
      data.motivation || '',
      'pendiente'
    ]);

    GmailApp.sendEmail(
      data.email,
      '🎓 ¡Bienvenido a CampusIA — Inscripción Recibida!',
      '',
      { htmlBody: buildBienvenidaHTML(data) }
    );

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, msg: 'Inscripción guardada y correo enviado' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (tipo === 'aceptacion') {
    GmailApp.sendEmail(
      data.email,
      '✅ ¡Aprobado — Bienvenido oficialmente a CampusIA!',
      '',
      { htmlBody: buildAceptacionHTML(data) }
    );

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, msg: 'Correo de aceptación enviado' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, msg: 'Tipo no reconocido' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, name: 'CampusIA API' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// PLANTILLAS DE EMAIL
// ============================================

function buildBienvenidaHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 0">
<tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#8B5CF6,#7C3AED);padding:28px 32px;text-align:center">
        <p style="margin:0;font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px">🤖 Campus<span style="color:#C4B5FD">IA</span></p>
      </td>
    </tr>

    <!-- CUERPO -->
    <tr>
      <td style="padding:32px">

        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E293B">¡Bienvenido, ${data.fullName}!</h1>
        <p style="margin:0 0 8px;font-size:15px;color:#475569;line-height:1.7">Gracias por inscribirte en <strong style="color:#8B5CF6">CampusIA</strong>. Tu solicitud fue recibida correctamente.</p>

        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:20px 0">
          <p style="margin:0 0 10px;font-size:13px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:1px">📋 Resumen de tu inscripción</p>
          <table width="100%" cellpadding="4">
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">👤 Nombre</td>
              <td style="font-size:14px;color:#1E293B;font-weight:600;padding-bottom:6px;text-align:right">${data.fullName}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">📧 Email</td>
              <td style="font-size:14px;color:#1E293B;font-weight:600;padding-bottom:6px;text-align:right">${data.email}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#64748B">📚 Curso</td>
              <td style="font-size:14px;color:#8B5CF6;font-weight:700;text-align:right">${data.course || '—'}</td>
            </tr>
          </table>
        </div>

        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:20px 0">
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:1px">🔑 Tus credenciales de acceso</p>
          <table width="100%" cellpadding="4">
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">📧 Usuario</td>
              <td style="font-size:14px;color:#1E293B;font-weight:700;padding-bottom:6px;text-align:right">${data.email}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">🔐 Contraseña</td>
              <td style="font-size:14px;color:#1E293B;font-weight:700;padding-bottom:6px;text-align:right;font-family:monospace;letter-spacing:1px">${data.password || '—'}</td>
            </tr>
          </table>
        </div>

        <div style="background:#FEF9C3;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;padding:12px 16px;margin:20px 0">
          <p style="margin:0;font-size:13px;color:#92400E;line-height:1.5">⏳ Tu cuenta está en <strong>revisión</strong>. Un administrador verificará tus datos y recibirás un correo cuando seas aceptado oficialmente.</p>
        </div>

        <p style="margin:24px 0 0;font-size:14px;color:#64748B;line-height:1.7">Mientras tanto, podés iniciar sesión en <strong>Mi Perfil</strong> con las credenciales de arriba y explorar el sitio.</p>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding:20px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#8B5CF6">CampusIA — Aprendé Machine Learning desde cero</p>
        <p style="margin:0;font-size:11px;color:#94A3B8">Este es un correo automático. Por favor no respondas a este mensaje.</p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}

function buildAceptacionHTML(data) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:40px 0">
<tr><td align="center">
  <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#059669,#10B981);padding:28px 32px;text-align:center">
        <p style="margin:0;font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px">🤖 Campus<span style="color:#A7F3D0">IA</span></p>
      </td>
    </tr>

    <!-- CUERPO -->
    <tr>
      <td style="padding:32px">

        <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1E293B">🎉 ¡Felicitaciones, ${data.fullName}!</h1>
        <p style="margin:0 0 8px;font-size:15px;color:#475569;line-height:1.7">Tu inscripción fue <strong style="color:#059669">aprobada</strong>. Ya podés acceder a todo el contenido del curso.</p>

        <div style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:2px solid #059669;border-radius:12px;padding:24px;margin:20px 0;text-align:center">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:2px">✅ Curso asignado</p>
          <p style="margin:0;font-size:20px;font-weight:800;color:#059669">${data.course || 'CampusIA'}</p>
        </div>

        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:20px;margin:20px 0">
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:1px">🔑 Tus credenciales de acceso</p>
          <table width="100%" cellpadding="4">
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">📧 Usuario</td>
              <td style="font-size:14px;color:#1E293B;font-weight:700;padding-bottom:6px;text-align:right">${data.email}</td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#64748B;padding-bottom:6px">🔐 Contraseña</td>
              <td style="font-size:14px;color:#1E293B;font-weight:700;padding-bottom:6px;text-align:right;font-family:monospace;letter-spacing:1px">${data.password || '—'}</td>
            </tr>
          </table>
        </div>

        <p style="margin:20px 0 8px;font-size:14px;color:#475569;line-height:1.7">Iniciá sesión en <strong>Mi Perfil</strong> con estas credenciales para acceder a las lecciones, material complementario y evaluaciones.</p>

        <div style="margin:24px 0 0;text-align:center">
          <a href="#" style="display:inline-block;padding:14px 36px;background:#8B5CF6;color:#FFFFFF;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px">Ir a Mi Perfil →</a>
        </div>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="padding:20px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#8B5CF6">CampusIA — Aprendé Machine Learning desde cero</p>
        <p style="margin:0;font-size:11px;color:#94A3B8">Este es un correo automático. Por favor no respondas a este mensaje.</p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;
}
