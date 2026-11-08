import 'server-only';
import { PROGRAM_EMAIL_COLORS, PROGRAM_EMAIL_LOGO_CONTENT_ID } from './constants';
import { PROGRAM_EMAIL_TEMPLATE_COPY } from './content';
import type { ProgramEmailDetail, ProgramEmailSource, ProgramEmailTemplate } from './types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeLink(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? escapeHtml(url.toString()) : '#';
  } catch {
    return '#';
  }
}

function renderDetail(detail: ProgramEmailDetail): string {
  const colors = PROGRAM_EMAIL_COLORS;
  const notes = detail.notes
    .map((note) => `<li style="margin:7px 0;color:${colors.muted};font-size:15px;line-height:23px;">${escapeHtml(note)}</li>`)
    .join('');
  return `<tr><td style="padding:18px 0;border-top:1px solid ${colors.border};vertical-align:top;">
    <p style="margin:0;color:${colors.ink};font-size:16px;font-weight:700;line-height:23px;">${escapeHtml(detail.title)}</p>
    ${notes ? `<ul style="margin:9px 0 0;padding-left:20px;">${notes}</ul>` : ''}
  </td></tr>`;
}

function renderSource(source: ProgramEmailSource): string {
  const colors = PROGRAM_EMAIL_COLORS;
  let domain = source.url;
  try {
    domain = new URL(source.url).hostname.replace(/^www\./, '');
  } catch {
    domain = source.url;
  }
  return `<tr><td style="padding:12px 0;border-top:1px solid ${colors.border};">
    <a href="${safeLink(source.url)}" style="color:${colors.primary};font-size:14px;font-weight:700;line-height:21px;text-decoration:underline;">${escapeHtml(source.label)}</a>
    <p style="margin:4px 0 0;color:${colors.muted};font-size:12px;line-height:18px;">${escapeHtml(domain)}</p>
  </td></tr>`;
}

export function renderProgramEmailHtml(content: ProgramEmailTemplate): string {
  const colors = PROGRAM_EMAIL_COLORS;
  const details = content.details?.map(renderDetail).join('') ?? '';
  const sources = content.sources.map(renderSource).join('');
  const contextTitle = content.contextTitle
    ? `<h2 style="margin:9px 0 0;color:${colors.ink};font-size:20px;font-weight:700;line-height:28px;">${escapeHtml(content.contextTitle)}</h2>`
    : '';
  const contextMeta = content.contextMeta
    ? `<p style="margin:9px 0 0;color:${colors.muted};font-size:13px;line-height:20px;">${escapeHtml(content.contextMeta)}</p>`
    : '';
  const contextBody = content.contextBody
    ? `<p style="margin:15px 0 0;color:${colors.ink};font-size:16px;line-height:26px;">${escapeHtml(content.contextBody)}</p>`
    : '';
  const note = content.note
    ? `<tr><td style="padding:30px 36px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.panel};border-left:4px solid ${colors.primary};">
          <tr><td style="padding:20px 23px;">
            <p style="margin:0;color:${colors.ink};font-size:16px;font-weight:700;line-height:23px;">${escapeHtml(content.note.title)}</p>
            <p style="margin:9px 0 0;color:${colors.ink};font-size:15px;line-height:24px;">${escapeHtml(content.note.body)}</p>
          </td></tr>
        </table>
      </td></tr>`
    : '';

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(content.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.background};color:${colors.ink};font-family:Arial,Helvetica,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(content.intro)}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${colors.background};">
    <tr><td align="center" style="padding:24px 10px 44px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;background:${colors.surface};">
        <tr><td style="height:5px;background:${colors.primary};font-size:0;line-height:0;"><span style="display:block;width:56px;height:5px;background:${colors.red};"></span></td></tr>
        <tr><td style="padding:31px 36px 29px;border-bottom:1px solid ${colors.border};">
          <img src="cid:${PROGRAM_EMAIL_LOGO_CONTENT_ID}" width="148" height="45" alt="HAKKITA" style="display:block;width:148px;height:auto;border:0;">
        </td></tr>
        <tr><td style="padding:35px 36px 38px;background:${colors.masthead};">
          <p style="margin:0 0 18px;color:${colors.mastheadText};font-size:14px;font-weight:700;line-height:21px;">Kabar ${escapeHtml(content.programName)}</p>
          <h1 style="margin:0;color:${colors.surface};font-size:30px;font-weight:700;line-height:38px;letter-spacing:-0.6px;">${escapeHtml(content.heading)}</h1>
          <p style="margin:18px 0 0;color:${colors.mastheadText};font-size:16px;line-height:26px;">${escapeHtml(content.intro)}</p>
        </td></tr>
        <tr><td style="padding:30px 36px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td>
            <p style="margin:0;color:${colors.primary};font-size:14px;font-weight:700;line-height:21px;">${escapeHtml(content.contextLabel)}</p>
            ${contextTitle}${contextMeta}${contextBody}
            ${details ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:20px;">${details}</table>` : ''}
          </td></tr></table>
        </td></tr>
        ${note}
        <tr><td style="padding:31px 36px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:${colors.primary};">
            <a href="${safeLink(content.actionUrl)}" style="display:inline-block;padding:14px 21px;color:${colors.surface};font-size:15px;font-weight:700;line-height:22px;text-decoration:none;">${escapeHtml(content.actionLabel)}</a>
          </td></tr></table>
        </td></tr>
        <tr><td style="padding:36px 36px 0;">
          <p style="margin:0 0 12px;color:${colors.ink};font-size:16px;font-weight:700;line-height:23px;">${PROGRAM_EMAIL_TEMPLATE_COPY.sourceLabel}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${sources}</table>
        </td></tr>
        <tr><td style="padding:33px 36px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding-top:25px;border-top:1px solid ${colors.border};">
            <p style="margin:0;color:${colors.muted};font-size:13px;line-height:21px;">${PROGRAM_EMAIL_TEMPLATE_COPY.disclaimer}</p>
            <p style="margin:16px 0 0;font-size:13px;line-height:20px;"><a href="${safeLink(content.settingsUrl)}" style="color:${colors.primary};font-weight:700;text-decoration:underline;">${PROGRAM_EMAIL_TEMPLATE_COPY.settingsLabel}</a></p>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
