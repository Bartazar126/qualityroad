import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    const { name, email, phone, message } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Kötelező mezők hiányoznak." }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      console.error("[contact] GMAIL_USER vagy GMAIL_APP_PASSWORD nincs beállítva.");
      return NextResponse.json(
        { error: "Az e-mail küldés nincs konfigurálva. Kérjük hívjon minket telefonon." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    });

    await transporter.sendMail({
      from: `"Quality Road – Weboldal" <${gmailUser}>`,
      to: "dznswish41@gmail.com",
      replyTo: email?.trim() || undefined,
      subject: `Új ajánlatkérés: ${name.trim()}`,
      html: `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#f97316;padding:0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:28px 32px 0;">
                  <p style="margin:0;font-size:10px;font-weight:800;letter-spacing:0.25em;color:rgba(255,255,255,0.6);text-transform:uppercase;">Quality Road Intact Kft · Weboldal</p>
                  <h1 style="margin:8px 0 0;font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.02em;line-height:1.2;">Új ajánlatkérés érkezett</h1>
                </td>
              </tr>
              <!-- orange stripe decoration -->
              <tr>
                <td style="padding:20px 32px 28px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="width:40px;height:4px;background:#fff;border-radius:2px;"></td>
                    <td style="width:8px;"></td>
                    <td style="width:12px;height:4px;background:rgba(255,255,255,0.4);border-radius:2px;"></td>
                    <td style="width:8px;"></td>
                    <td style="width:6px;height:4px;background:rgba(255,255,255,0.2);border-radius:2px;"></td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#1e293b;padding:32px;">

            <!-- Sender info cards -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="padding-bottom:8px;">
                  <p style="margin:0;font-size:9px;font-weight:800;letter-spacing:0.22em;color:#f97316;text-transform:uppercase;">Feladó adatai</p>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0">
              <!-- Name -->
              <tr>
                <td style="background:#0f172a;border-left:3px solid #f97316;padding:14px 18px;border-radius:0 4px 4px 0;margin-bottom:8px;">
                  <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:0.18em;color:#64748b;text-transform:uppercase;">Név</p>
                  <p style="margin:0;font-size:17px;font-weight:800;color:#f8fafc;">${name.trim()}</p>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>

              ${email?.trim() ? `
              <!-- Email -->
              <tr>
                <td style="background:#0f172a;border-left:3px solid #f97316;padding:14px 18px;border-radius:0 4px 4px 0;">
                  <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:0.18em;color:#64748b;text-transform:uppercase;">E-mail</p>
                  <a href="mailto:${email.trim()}" style="display:block;font-size:15px;font-weight:700;color:#f97316;text-decoration:none;">${email.trim()}</a>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              ` : ""}

              ${phone?.trim() ? `
              <!-- Phone -->
              <tr>
                <td style="background:#0f172a;border-left:3px solid #f97316;padding:14px 18px;border-radius:0 4px 4px 0;">
                  <p style="margin:0 0 2px;font-size:9px;font-weight:700;letter-spacing:0.18em;color:#64748b;text-transform:uppercase;">Telefon</p>
                  <a href="tel:${phone.trim()}" style="display:block;font-size:15px;font-weight:700;color:#f8fafc;text-decoration:none;">${phone.trim()}</a>
                </td>
              </tr>
              <tr><td style="height:8px;"></td></tr>
              ` : ""}
            </table>

            <!-- Divider -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr><td style="height:1px;background:#334155;"></td></tr>
            </table>

            <!-- Message -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:12px;">
                  <p style="margin:0;font-size:9px;font-weight:800;letter-spacing:0.22em;color:#f97316;text-transform:uppercase;">Üzenet</p>
                </td>
              </tr>
              <tr>
                <td style="background:#0f172a;padding:20px 22px;border-radius:4px;">
                  <p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.75;white-space:pre-wrap;">${message.trim()}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0f172a;padding:20px 32px;border-top:1px solid #1e293b;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-size:11px;font-weight:900;color:#f97316;letter-spacing:0.12em;text-transform:uppercase;">Quality Road Intact Kft</p>
                  <p style="margin:4px 0 0;font-size:11px;color:#475569;">Ez az üzenet a weboldalon keresztül érkezett — qualityroad.hu</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/contact]", msg);
    return NextResponse.json({ error: "Küldési hiba. Kérjük próbálja újra, vagy hívjon minket." }, { status: 500 });
  }
}
