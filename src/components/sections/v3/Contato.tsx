import { useCallback, useState, type SVGProps } from 'react';
import { copy } from '../../../content/chapters';
import { contactLinks } from '../../../lib';
import { useExecutive } from '../../../state';
import { IconGlobe, IconMail, IconWhatsApp, SectionShell, sectionTitleId } from '../../ui';
import { Portrait, typeset, typesetLabel } from './shared';
import styles from './Contato.module.css';

/** Telefone (traço, mesmo desenho dos ícones de função): o número abre `tel:`. Local a esta seção. */
function IconPhone(props: Omit<SVGProps<SVGSVGElement>, 'children'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/** Título com a barra amarela reta sob “nossa conversa?” (destaque da casa, sem moldura). */
function Title({ text }: { text: string }) {
  const t = typeset(text);
  const m = /(nossa\s+conversa\?)$/.exec(t);
  if (!m) return <>{t}</>;
  return (
    <>
      {t.slice(0, m.index)}
      <span className="hl">{m[1]}</span>
    </>
  );
}

/**
 * Slide 11 — contato (rodada 21/10). Texto livre sobre o branco, sem caixas, molduras, numeração
 * nem painel: título, frase de apoio, as duas etapas como linha tipográfica (aprofundar → detalhar)
 * e, ao lado, o executivo (retrato, nome, cargo) com telefone e e-mail grandes e clicáveis — cada
 * canal aparece uma vez. WhatsApp (só com canal confirmado) como ícone com nome acessível; LinkedIn
 * e site ficam no rodapé (App.tsx). Sem nenhum canal, o site institucional. Canais só acionados pelo
 * visitante.
 */
export default function Contato() {
  const executive = useExecutive();
  const links = contactLinks(executive);
  const [noPhoto, setNoPhoto] = useState(false);
  const onMissing = useCallback(() => setNoPhoto(true), []);
  const c = copy.contato;
  const hasChannel = Boolean(links.email || links.phone || links.whatsApp || links.linkedIn || links.website);
  const hasIcons = Boolean(links.whatsApp);
  const [emailUser, ...emailHost] = links.email ? links.email.label.split('@') : [''];

  return (
    <SectionShell id="contato" title={typeset(c.title)} header={false} className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.main}>
          <h2 id={sectionTitleId('contato')} className={styles.title}>
            <Title text={c.title} />
          </h2>
          <p className={styles.body}>{typeset(c.body)}</p>
          <ol className={styles.steps} role="list">
            {c.steps.map((s, i) => (
              <li key={s} className={styles.step}>
                {/* Seta presa ao FIM da etapa anterior: nunca abre a linha seguinte. */}
                {typeset(s)}
                {i < c.steps.length - 1 ? (
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        <aside className={styles.contact} aria-labelledby="contato-executivo">
          <div className={`${styles.person} ${noPhoto ? styles.personNoPhoto : ''}`}>
            {!noPhoto ? (
              <div className={styles.portrait}>
                <Portrait executive={executive} alt="" sizes="(min-width: 1024px) 11rem, 30vw" className={styles.photo} onMissing={onMissing} />
              </div>
            ) : null}
            <p className={styles.identity}>
              <span id="contato-executivo" className={styles.name}>
                {typesetLabel(executive.fullName)}
              </span>
              <span className={styles.role}>
                {typesetLabel(executive.role)}
                <span className="visually-hidden">, </span>
                <span className={styles.brand}>{copy.global.brand}</span>
              </span>
            </p>
          </div>

          {links.phone || links.email ? (
            <ul className={styles.channels} role="list">
              {links.phone ? (
                <li>
                  <a className={styles.channel} href={links.phone.href}>
                    <IconPhone className={styles.channelIcon} />
                    <span className="nowrap">{links.phone.label}</span>
                  </a>
                </li>
              ) : null}
              {links.email ? (
                <li>
                  <a className={`${styles.channel} ${styles.email}`} href={links.email.href}>
                    <IconMail className={styles.channelIcon} />
                    {/* Quebra preferencial depois do “@” em telas estreitas (sem mudar o texto). */}
                    <span>
                      {emailUser}@
                      <wbr />
                      {emailHost.join('@')}
                    </span>
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}

          {hasIcons ? (
            <ul className={styles.icons} role="list">
              {links.whatsApp ? (
                <li>
                  <a className={styles.iconLink} href={links.whatsApp.href} target="_blank" rel="noopener noreferrer" aria-label={c.actions.whatsApp}>
                    <IconWhatsApp />
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}

          {!hasChannel ? (
            <a className={styles.channel} href={c.institutionalSite.href} target="_blank" rel="noopener noreferrer">
              <IconGlobe className={styles.channelIcon} />
              <span>{c.institutionalSite.label}</span>
            </a>
          ) : null}
        </aside>
      </div>
    </SectionShell>
  );
}
