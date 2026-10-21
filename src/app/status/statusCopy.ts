/**
 * Microcopy nova das telas de estado da apresentação pública (carregamento, link não
 * encontrado, perfil indisponível, falha de conexão). Proposta de trabalho, sem mensagens
 * técnicas. Nunca oferece a apresentação de outro executivo.
 */
export const INSTITUTIONAL_SITE = { href: 'https://www.credmhs.com.br', label: 'Conhecer o site da CRED MHS' } as const;

export const BASE_DOCUMENT_TITLE = 'CRED MHS — Saúde e Segurança do Trabalho';

export const statusCopy = {
  eyebrow: 'Apresentação CRED MHS',
  loading: {
    label: 'Carregando a apresentação',
    documentTitle: `Carregando · ${BASE_DOCUMENT_TITLE}`,
  },
  notFound: {
    title: 'Não encontramos esta apresentação',
    body: 'O link pode estar incompleto ou ter alguma diferença no endereço. Confirme o endereço com quem enviou a apresentação para você.',
    documentTitle: 'Apresentação não encontrada · CRED MHS',
  },
  unavailable: {
    title: 'Esta apresentação não está disponível no momento',
    body: 'O endereço está correto, mas a apresentação não pode ser aberta agora. Confirme com quem enviou o link se há um endereço atualizado para você.',
    documentTitle: 'Apresentação indisponível · CRED MHS',
  },
  error: {
    title: 'Não foi possível carregar a apresentação',
    body: 'A conexão falhou antes de a apresentação abrir. Verifique sua internet e tente novamente.',
    retry: 'Tentar novamente',
    documentTitle: 'Não foi possível carregar · CRED MHS',
  },
} as const;
