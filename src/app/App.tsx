import type { ComponentType } from 'react';
import { copy } from '../content';
import type { ChapterId } from '../types/presentation';
import { IconGlobe, IconLinkedIn, SideRail } from '../components/ui';
import { contactLinks } from '../lib';
import { useExecutive } from '../state';
import Abertura from '../components/sections/v3/Abertura';
import Provocacao from '../components/sections/v3/Provocacao';
import QuemSomos from '../components/sections/v3/QuemSomos';
import MissaoVisaoValores from '../components/sections/v3/MissaoVisaoValores';
import AtuacaoIntegrada from '../components/sections/v3/AtuacaoIntegrada';
import Alcance from '../components/sections/v3/Alcance';
import Depoimentos from '../components/sections/v3/Depoimentos';
import Satisfacao from '../components/sections/v3/Satisfacao';
import Transicao from '../components/sections/v3/Transicao';
import Frentes from '../components/sections/v3/Frentes';
import Empresas from '../components/sections/v3/Empresas';
import Contato from '../components/sections/v3/Contato';
import { CHAPTER_IDS, CHAPTER_INDEX } from './chapterIndex';
import { useCurrentChapter } from './useCurrentChapter';
import styles from './App.module.css';

/** Crédito da geometria do mapa (src/motion/map/brazilGeo.ts). */
const MAP_CREDIT = 'Mapa: malhas territoriais IBGE';

/** Seção → componente (ordem da página = CHAPTER_IDS, que já considera o modo de revisão). */
const SECTIONS: Record<ChapterId, ComponentType> = {
  abertura: Abertura,
  provocacao: Provocacao,
  'quem-somos': QuemSomos,
  'missao-visao-valores': MissaoVisaoValores,
  'atuacao-integrada': AtuacaoIntegrada,
  alcance: Alcance,
  depoimentos: Depoimentos,
  satisfacao: Satisfacao,
  transicao: Transicao,
  frentes: Frentes,
  empresas: Empresas,
  contato: Contato,
};

/**
 * Apresentação V3: sem cabeçalho fixo nem menu “Conteúdo” — o logotipo está integrado à
 * abertura; a navegação é o trilho lateral discreto (≥1024px). Rolagem natural, sem snap.
 */
export default function App() {
  const current = useCurrentChapter(CHAPTER_IDS);
  const links = contactLinks(useExecutive());
  const a = copy.contato.actions;
  return (
    <>
      <a className="skip-link" href="#conteudo">
        {copy.global.skipLink}
      </a>
      <SideRail chapters={CHAPTER_INDEX} currentId={current} label={copy.global.navLabel} />
      <main id="conteudo" tabIndex={-1} className={styles.main}>
        {CHAPTER_IDS.map((id) => {
          const Section = SECTIONS[id];
          return <Section key={id} />;
        })}
      </main>
      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <img src="/brand/cred-mhs-logo-negativo.svg" alt={copy.global.brand} width={1600} height={481} className={styles.logo} />
          {/* LinkedIn do executivo e site da CRED: só ícones, nome acessível (rodada 21/10). */}
          {links.linkedIn || links.website ? (
            <ul className={styles.social} role="list">
              {links.linkedIn ? (
                <li>
                  <a className={styles.socialLink} href={links.linkedIn.href} target="_blank" rel="noopener noreferrer" aria-label={a.linkedIn}>
                    <IconLinkedIn />
                  </a>
                </li>
              ) : null}
              {links.website ? (
                <li>
                  <a className={styles.socialLink} href={links.website.href} target="_blank" rel="noopener noreferrer" aria-label={a.website}>
                    <IconGlobe />
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
          <p className={styles.tagline}>{copy.global.tagline}</p>
          {/* Atribuição da fonte do mapa do Alcance (pedido do coordenador). */}
          <p className={styles.credit}>{MAP_CREDIT}</p>
        </div>
      </footer>
    </>
  );
}
