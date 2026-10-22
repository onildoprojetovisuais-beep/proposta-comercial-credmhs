import type { Chapter, ChapterId, DataStatus, Front, Testimonial } from '../types/presentation';

/**
 * Copy pública V3 — transcrição do PPT da Sabrina (docs/CRED-MHS-Apresentacao-Comercial.pptx,
 * 20/10/2026). "O raciocínio e a comunicação são as que colocamos. Favor não alterar o que está
 * escrito." Só o slide 9 (frentes) e o slide 11 (etapas) têm ajustes autorizados, registrados em
 * docs/V3-ALTERACOES-TEXTO.md.
 *
 * Caixa: o PPT usa caixa alta como tratamento tipográfico. Aqui o texto fica em caixa normal (com
 * nomes próprios e siglas preservados); a página pode aplicar `text-transform: uppercase` no CSS.
 *
 * Variáveis entre chaves são preenchidas com `formatTemplate` (src/lib/format.ts): {firstName}.
 * Notas internas e pendências NÃO fazem parte destes textos (ver docs/07-fontes-e-pendencias.md).
 */
export const copy = {
  /** Slide 1 */
  abertura: {
    greetingTemplate: 'Olá, sou {firstName}.',
    lead: 'Estou aqui para te mostrar como a CRED MHS pode entregar mais gestão para a saúde e segurança do trabalho da sua empresa.',
    body: 'Quero te conhecer, mapear os desafios que temos e oferecer solução, sob medida, para o negócio — e acompanhar essa evolução.',
    /** CTA de avanço → #provocacao (rolagem livre continua funcionando). */
    cta: 'Saiba mais',
  },

  /** Slide 2 */
  provocacao: {
    question: 'O que a sua empresa consegue gerir com os serviços que já possui?',
    support: 'Exames, laudos e programas só geram valor quando viram informação para decidir.',
    /** "É aí que começa a nossa conversa." — no PPT, "nossa conversa." vem destacado em amarelo. */
    statement: { lead: 'É aí que começa a', highlight: 'nossa conversa.' },
  },

  /** Slide 3 */
  quemSomos: {
    intro: 'Mas antes disso, deixa eu te contar um pouco mais sobre',
    title: 'Quem somos.',
    headline: 'Crescemos ao longo de 35 anos em parceria com os nossos clientes.',
    history:
      'Nascemos em Minas Gerais. Estamos no Rio de Janeiro desde 2008 e, desde 2018, com rede própria — hoje com duas unidades: Barra e Centro.',
    /* Rodada 21/10: indicadores 35 / Minas Gerais / 2008 / 2018 retirados (repetiam o texto acima). */
    /** Composição circular (pedido da Sabrina, 21/10): os três atributos em destaque. */
    attributes: ['Atuação nacional', 'Experiência multissetorial', '100% digital'],
    units: [
      { id: 'barra', label: 'Unidade', name: 'Barra' },
      { id: 'centro', label: 'Unidade', name: 'Centro' },
    ],
    /** Missão, visão e valores: seção própria (#missao-visao-valores), sem numeração. */
    mvvTitle: 'Missão, visão e valores',
    mission: {
      label: 'Missão',
      text: 'Prover a implantação da Gestão de Saúde e Segurança do Trabalho como uma força estratégica, para melhor apoiar os negócios do cliente e para o setor.',
    },
    vision: {
      label: 'Visão',
      text: 'Ser a melhor referência em gestão de saúde e segurança do trabalho do cliente e para o setor.',
    },
    values: {
      label: 'Valores',
      /** `lead` aparece em negrito no PPT. */
      items: [
        { lead: 'Ética e transparência', rest: ' no relacionamento com clientes, colaboradores, fornecedores e a sociedade.' },
        { lead: 'Compromisso contínuo', rest: ' com a qualidade.' },
        { lead: 'Capacitação profissional', rest: ' técnica e humana, permanente e multidisciplinar.' },
        { lead: 'Inovação', rest: ' para buscar soluções criativas e tecnológicas.' },
      ],
    },
  },

  /** Slide 4 */
  atuacaoIntegrada: {
    eyebrow: 'Nosso diferencial estratégico',
    title: { lead: 'Uma atuação', highlight: 'integrada.' },
    body: 'Saúde corporativa, segurança do trabalho, higiene ocupacional, gestão estratégica, tecnologia da informação e pessoas trabalhando juntas, potencializando a curva de aprendizagem do seu negócio, com uma equipe multidisciplinar.',
    executive: 'E um executivo de negócios que acompanha e gerencia todo esse projeto.',
    /* Rodada 21/10: diagrama "Sua empresa → Equipe multidisciplinar" retirado a pedido da Sabrina. */
  },

  /** Slide 5 */
  alcance: {
    /* Rodada 21/10: rótulo superior "Rede própria Barra · Centro" retirado. */
    title: 'Nossa força está onde você estiver.',
    /** Medidas diferentes: nunca comparar em gráfico (vidas ≠ clientes). */
    indicators: [
      { id: 'vidas', prefix: '+', value: '550', unit: 'mil', label: 'vidas gerenciadas' },
      { id: 'clientes', prefix: '+', value: '5', unit: 'mil', label: 'clientes em todo o território nacional' },
    ],
    /** Rótulo do destaque do Rio no mapa (HTML, não dentro do vídeo). */
    map: {
      /** Identificação do Rio no mapa (texto da Sabrina, 21/10). */
      rioLabel: 'Rio de Janeiro - Barra e Centro',
      /** Nome acessível do mapa (microcopy de interface). */
      ariaLabel:
        'Mapa do Brasil com os estados e os símbolos de presença da CRED MHS; no Rio de Janeiro, a rede própria, com as unidades Barra e Centro.',
      pause: 'Pausar animação',
      play: 'Continuar animação',
      replay: 'Repetir animação',
    },
  },

  /** Slide 6 — PENDENTE: a CRED ainda enviará os depoimentos. Seção oculta ao cliente enquanto vazia. */
  depoimentos: {
    title: 'O que nossos clientes falam sobre nós',
    /**
     * Texto do cliente, sem edição (recebido pelo Nil em 20/10/2026; uso autorizado). Parágrafos
     * separados por linha em branco. "CREDMHS" está como o cliente escreveu.
     */
    items: [
      {
        id: 'radix-wilton-valente',
        quote:
          'Estamos com a CREDMHS há aproximadamente quatro anos e temos acompanhado uma evolução consistente na parceria. A redução dos prazos de entrega de documentos e o avanço da automação na gestão de Saúde e Segurança Ocupacional trouxeram mais agilidade às nossas entregas, com ganhos expressivos em relação à experiência anterior. Ainda temos desafios a superar, mas reconhecemos na CREDMHS uma parceria estratégica, que alia segurança e cumprimento de prazos, em sintonia com nossas expectativas.\n\nValorizamos muito a proximidade com a liderança e com o time operacional da CRED MHS. A disponibilidade, a facilidade de acesso e a agilidade nas respostas fortalecem o cuidado com a saúde e a segurança dos nossos profissionais e contribuem para o cumprimento dos prazos. Essa parceria permite alinhar requisitos, esclarecer dúvidas e construir soluções seguras, especialmente nas mobilizações, que frequentemente envolvem prazos apertados.',
        name: 'Wilton Valente',
        role: 'Coordenador de SMS',
        company: 'Radix',
        approved: true,
      },
      /* Recebido pelo Nil em 20/10/2026 para publicar no carrossel; parágrafos como enviados. */
      {
        id: 'radisson-sandra-coelho',
        quote:
          'Contar com a CRED MHS tem sido muito importante para fortalecer nossa gestão estratégica de saúde, segurança e medicina do trabalho. O acompanhamento personalizado da saúde física e mental dos nossos colaboradores faz a diferença no dia a dia, trazendo mais cuidado, prevenção e bem-estar para a equipe. É uma parceria que nos apoia no atendimento à NR-1 e na construção de um ambiente de trabalho mais seguro, saudável e acolhedor.\n\nO grande diferencial da CRED MHS é a flexibilidade em atender as demandas, principalmente para a hotelaria. Agradeço imensamente a parceria. Recomendo!',
        name: 'Sandra Coelho',
        role: 'Gerente de RH',
        company: 'Radisson',
        sector: 'Hotelaria',
        approved: true,
      },
      /* Recebido pelo Nil em 22/10/2026 para publicar no carrossel; parágrafos como enviados. */
      {
        id: 'hotel-nacional-michele-rosa',
        quote:
          'Nossa experiência com a CRED MHS vai muito além dos serviços tradicionais de Medicina do Trabalho. Encontramos uma parceria que oferece assessoria completa, com orientação, suporte e soluções estratégicas que fazem a diferença no nosso dia a dia.\n\nUm dos grandes diferenciais é o atendimento humanizado, a proximidade e o cuidado genuíno que têm com o cliente. Sabemos que podemos contar com uma equipe comprometida, que busca entender nossas necessidades e nos apoiar na construção das melhores soluções.\n\nÉ uma parceria que agrega valor ao nosso trabalho e nos traz segurança e confiança. Esperamos seguir juntos por muitos e muitos anos!',
        name: 'Michele Rosa',
        role: 'Coord. de RH',
        company: 'Hotel Nacional',
        sector: 'Hotelaria',
        approved: true,
      },
    ] as Testimonial[],
    /** Controles do carrossel de depoimentos (mesmo padrão do carrossel de marcas). */
    prev: 'Depoimento anterior',
    next: 'Próximo depoimento',
    counterTemplate: '{current} / {total}',
    slideTemplate: 'Depoimento {current} de {total}',
    /** Celular: depoimento longo recolhido (interface, não texto do PPT). */
    expand: 'Ler depoimento completo',
    collapse: 'Recolher depoimento',
    /** Setores dos espaços reservados no PPT. Só aparecem no modo de revisão. */
    reviewSlots: ['Banco', 'Hotelaria', 'Restaurante'],
  },

  /** Slide 7 — fonte, período e universo ainda a confirmar; número liberado para o cliente pelo Nil (20/10). */
  satisfacao: {
    title: 'Como os funcionários dos nossos clientes avaliam o atendimento nas nossas unidades próprias?',
    value: '99,4%',
    label: 'de satisfação com o atendimento',
    /** Nota de método do PPT. Completar fonte, período e universo quando a CRED confirmar. */
    method: 'CSAT — índice de satisfação com o atendimento nas unidades próprias.',
    source: null as string | null,
    period: null as string | null,
    universe: null as string | null,
    /** 'provisorio' → seção oculta ao cliente; aparece só no modo de revisão com o aviso. */
    status: 'provisorio' as DataStatus,
    /**
     * Exibição ao cliente liberada pelo Nil em 20/10/2026 ("é um número importante"), mesmo com
     * fonte/período/universo pendentes. O número aparece sem aviso no link do cliente; o aviso de
     * pendência continua só em ?revisao=1 e em docs/07 (P48).
     */
    showToClient: true,
  },

  /** Slide 8 */
  transicao: {
    lead: 'Agora que já nos conhece um pouco mais, a pergunta que fica é:',
    /**
     * Rodada 21/10: ênfase principal em "mais gestão" (pedido da Sabrina); "sua empresa?" segue
     * destacado como no PPT, em segundo plano. Frase inalterada: before + emphasis + middle + highlight.
     */
    question: {
      before: 'Como entregamos',
      emphasis: 'mais gestão',
      middle: 'de saúde e segurança do trabalho para a',
      highlight: 'sua empresa?',
    },
  },

  /** Slide 9 — único trecho com ajustes de conteúdo autorizados (docs/V3-ALTERACOES-TEXTO.md). */
  frentes: {
    /* Rodada 21/10: rótulo "Como entregamos" e bloco "Mais gestão de SST para a sua empresa" retirados. */
    title: 'Sete frentes, uma atuação única.',
    // Itens: `fronts` (abaixo).
    /**
     * Texto da Sabrina (21/10), literal. Enquadramento (fecho sem número × oitava frente) AGUARDA
     * decisão dela: por ora fecha a seção, sem número e fora da contagem.
     */
    transversal: {
      title: 'Comunicação e reputação',
      text: 'A força da sua marca gerando a percepção positiva sobre a empresa como local de trabalho sadio, seguro, e portanto, comprometido com o bem estar da sociedade.',
    },
  },

  /** Slide 10 — logos em src/content/clients.ts */
  empresas: {
    eyebrow: 'Quem já viu valor na entrega da CRED MHS',
    title: 'Empresas que caminham com a gente',
    prev: 'Marcas anteriores',
    next: 'Próximas marcas',
    /** "{current} / {total}" */
    counterTemplate: '{current} / {total}',
  },

  /** Slide 11 — "Dar o primeiro passo" removido; "Aprofundar na sua demanda" antes de "Detalhar o escopo". */
  contato: {
    title: 'Vamos agendar a nossa conversa?',
    body: 'Me chame para iniciarmos esse projeto juntos.',
    steps: ['Aprofundar na sua demanda', 'Detalhar o escopo'],
    labels: { executive: 'Executivo', phone: 'Telefone', email: 'E-mail' },
    actions: {
      whatsApp: 'Falar por WhatsApp',
      email: 'Enviar e-mail',
      phoneTemplate: 'Ligar para {firstName}',
      /** Rodada 21/10: só ícones visíveis; estes textos ficam como nome acessível. */
      linkedIn: 'LinkedIn',
      website: 'Site da CRED MHS',
    },
    emailSubject: 'Conversa sobre a CRED MHS',
    // Usado só quando o perfil não tem nenhum canal válido.
    institutionalSite: { href: 'https://www.credmhs.com.br', label: 'www.credmhs.com.br' },
  },

  global: {
    brand: 'CRED MHS',
    tagline: 'Saúde e Segurança do Trabalho',
    navLabel: 'Seções da apresentação',
    skipLink: 'Pular para o conteúdo',
  },
} as const;

/**
 * Sete frentes (slide 9; "Dados e Privacidade" incluída pela Sabrina em 21/10). `original` guarda o texto do PPT (documentação; nunca renderizar).
 * Títulos e textos ajustados são propostas sujeitas à revisão da Sabrina.
 */
export const fronts: readonly Front[] = [
  {
    id: 'conformidade',
    number: '01',
    title: 'Conformidade Legal e Jurídica',
    text: 'Times ideais, com profissionais capacitados e atualizados às legislações que norteiam o segmento.',
    original: {
      title: 'Capacidade técnica',
      text: 'Times ideais, com profissionais capacitados e atualizados às legislações que norteiam o segmento.',
    },
    adjustment: 'A',
  },
  {
    id: 'seguranca-operacional',
    number: '02',
    title: 'Segurança operacional',
    text: 'Processos e procedimentos automatizados e padronizados, disponível em todo o território nacional.',
    original: {
      title: 'Segurança operacional',
      text: 'Atendimento de excelência e procedimentos padronizados em todo o território nacional.',
    },
    adjustment: 'B',
  },
  {
    id: 'rede',
    number: '03',
    title: 'Rede ampla e integrada',
    text: 'Estrutura de atendimento própria e credenciada de excelência, integrada em uma só rede para atender onde você estiver.',
    original: {
      title: 'Rede ampla e integrada',
      text: 'Estrutura própria e credenciada conectada para atender onde a sua operação está.',
    },
    adjustment: 'C',
  },
  {
    id: 'tecnologia',
    number: '04',
    title: 'Integração tecnológica e dados',
    text: 'Sistema operacional em nuvem, apropriação de tecnologia para dispositivos móveis e teleatendimento, integração nativa com diversos ERP e associação de IA.',
    original: {
      title: 'Inovação',
      text: 'Integração tecnológica e sistêmica, com leitura dos dados, em um contexto 100% digital.',
    },
    adjustment: 'D',
  },
  {
    id: 'dados-privacidade',
    number: '05',
    title: 'Dados e Privacidade',
    text: 'Certificada ISO 9001 / 27001 / 45001 e LGPD',
    // Frente nova (não existe no PPT): incluída pela Sabrina em 21/10.
    original: { title: '', text: '' },
    adjustment: 'H',
  },
  {
    id: 'inteligencia',
    number: '06',
    title: 'Inteligência compartilhada',
    text: 'Uma metodologia que constrói conhecimento de forma colaborativa.',
    original: {
      title: 'Inteligência compartilhada',
      text: 'Uma metodologia que constrói conhecimento de forma colaborativa. Ninguém faz nada sozinho.',
    },
    adjustment: 'E',
  },
  {
    id: 'investimento',
    number: '07',
    title: 'Investimento mútuo',
    text: 'A empresa e a CRED MHS investem juntas na troca genuína de informação e na construção de repertório e autoridade — e todo o sistema cresce junto.',
    original: {
      title: 'Investimento mútuo',
      text: 'A empresa e a CRED MHS investem juntas — e todo o sistema cresce junto.',
    },
    adjustment: 'F',
  },
];

/** Seções na ordem dos slides. `id` = id do <section> e hash da URL. */
export const chapters: readonly Chapter[] = [
  { id: 'abertura', slide: 1, navLabel: 'Início', legacyHashes: ['m01', 'apresentacao', 'm02', 'prioridades'] },
  { id: 'provocacao', slide: 2, navLabel: 'A conversa', legacyHashes: ['gestao-integrada', 'relacionamento', 'dados'] },
  { id: 'quem-somos', slide: 3, navLabel: 'Quem somos', legacyHashes: ['institucional', 'm03', 'estrutura'] },
  { id: 'missao-visao-valores', slide: 3, navLabel: 'Missão e valores' },
  { id: 'atuacao-integrada', slide: 4, navLabel: 'Atuação integrada' },
  { id: 'alcance', slide: 5, navLabel: 'Alcance' },
  { id: 'depoimentos', slide: 6, navLabel: 'Depoimentos' },
  { id: 'satisfacao', slide: 7, navLabel: 'Satisfação' },
  { id: 'transicao', slide: 8, navLabel: 'Como entregamos', navHidden: true },
  { id: 'frentes', slide: 9, navLabel: 'Sete frentes', legacyHashes: ['solucoes', 'trilha', 'm05', 'ecossistema', 'm07', 'aplicacoes'] },
  { id: 'empresas', slide: 10, navLabel: 'Empresas', legacyHashes: ['m04', 'empresas-atendidas'] },
  { id: 'contato', slide: 11, navLabel: 'Contato', legacyHashes: ['m09', 'sua-pauta', 'm10'] },
];

export const chapterById: Readonly<Record<ChapterId, Chapter>> = Object.fromEntries(
  chapters.map((c) => [c.id, c]),
) as Record<ChapterId, Chapter>;

/** Resolve um hash (#frentes, ou hash antigo como #m05) para a seção; desconhecido → null. */
export function chapterFromHash(hash: string): Chapter | null {
  let slug = hash.replace(/^#/, '');
  try {
    slug = decodeURIComponent(slug);
  } catch {
    return null;
  }
  slug = slug.trim().toLowerCase();
  if (!slug) return null;
  return chapters.find((c) => c.id === slug) ?? chapters.find((c) => c.legacyHashes?.includes(slug)) ?? null;
}
