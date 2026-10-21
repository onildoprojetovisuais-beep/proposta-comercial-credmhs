import type { ContactLinksV2, Executive } from '../types';
import { copy } from '../content/chapters';

/**
 * Links de contato iniciados pelo visitante (docs/REVISAO-CRED-MHS-V2.md §7, 08).
 * A V2 não gera mensagem com escolhas: nada é enviado automaticamente e nenhum texto é pré-preenchido.
 * - E-mail: mailto com destinatário e assunto fixo, sem corpo. null → perfil sem e-mail válido.
 * - WhatsApp: só com `whatsAppEnabled` e número confirmado (10–15 dígitos); sem texto. Senão null.
 * - Telefone: tel: com E.164.
 * - Agendamento: sempre null até existir URL real de booking confirmada (o perfil não tem esse campo).
 */
export function contactLinks(executive: Executive): ContactLinksV2 {
  const email = executive.email
    ? { href: `mailto:${executive.email}?subject=${encodeURIComponent(copy.contato.emailSubject)}`, label: executive.email }
    : null;

  const waDigits = executive.whatsAppNumber?.replace(/\D/g, '') ?? '';
  const whatsApp = executive.whatsAppEnabled && /^\d{10,15}$/.test(waDigits) ? { href: `https://wa.me/${waDigits}` } : null;

  return {
    email,
    whatsApp,
    phone: executive.phoneE164 ? { href: `tel:${executive.phoneE164}`, label: executive.phoneDisplay ?? executive.phoneE164 } : null,
    linkedIn: executive.linkedInUrl ? { href: executive.linkedInUrl } : null,
    website: executive.websiteUrl
      ? { href: executive.websiteUrl, label: executive.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') }
      : null,
    booking: null,
  };
}
