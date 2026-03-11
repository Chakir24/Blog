import { Resend } from 'resend';
import type { Article } from './types';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

const FROM_EMAIL = process.env.NEWSLETTER_FROM_EMAIL || 'onboarding@resend.dev';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function sendArticleNotification(
  article: Article,
  subscriberEmails: string[]
): Promise<{ success: number; failed: string[]; lastError?: string }> {
  const resend = getResend();
  if (!resend) {
    throw new Error(
      'Clé API Resend manquante. Ajoutez RESEND_API_KEY dans .env.local (créez un compte sur resend.com)'
    );
  }

  const fromEmail =
    FROM_EMAIL.includes('<') ? FROM_EMAIL : `Manftou Hath <${FROM_EMAIL}>`;
  const articleUrl = `${SITE_URL}/articles/${article.slug}`;
  const subject = `Nouvel article : ${article.title}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #6366f1; font-size: 1.5rem;">Manftou Hath</h1>
  <p style="font-size: 1.1rem;">Bonjour,</p>
  <p>Un nouvel article vient de paraître sur mon blog :</p>
  <h2 style="font-size: 1.25rem; margin: 1rem 0;">${article.title}</h2>
  <p style="color: #666;">${article.excerpt}</p>
  <p style="margin: 1.5rem 0;">
    <a href="${articleUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Lire l'article</a>
  </p>
  <p style="font-size: 0.9rem; color: #999;">${article.readingTime} min de lecture</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 2rem 0;">
  <p style="font-size: 0.85rem; color: #999;">
    Vous recevez cet email car vous êtes abonné à la newsletter de Manftou Hath.
  </p>
</body>
</html>
  `.trim();

  const failed: string[] = [];
  let success = 0;
  let lastError: string | undefined;

  for (const email of subscriberEmails) {
    try {
      const { error } = await resend!.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html,
      });
      if (error) {
        failed.push(email);
        lastError = typeof error === 'object' && error?.message ? String(error.message) : String(error);
      } else {
        success++;
      }
    } catch (err) {
      failed.push(email);
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return { success, failed, lastError };
}
