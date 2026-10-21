# Personalização e estado

> **Superado em 20/10/2026 pela V3 (`docs/V3-CONTRATO.md` + PPT da Sabrina). Mantido como histórico; não usar como requisito.**

> **Superado em parte pela V2 (14/10/2026).** Autoridade: `docs/REVISAO-CRED-MHS-V2.md` (rev. 2.1) e `docs/V2-CONTRATO.md`.
> Tudo o que este documento diz sobre nome da empresa, prioridades, destaques, “Adicionar à conversa”, pauta, itens livres, reordenação, mensagem gerada, “Nova apresentação”/reset e `sessionStorage` foi **retirado** da apresentação pública e não deve ser restaurado. O texto antigo abaixo da seção “Regras V2” fica como histórico; a V1 completa está em `historico/v1-antes-da-v2-2026-10-14.tar.gz`.

## Regras V2 (vigentes)

**Princípio.** A única personalização é a do executivo que enviou o link. O visitante não preenche campos, não escolhe prioridades nem monta pauta: percorre a narrativa por rolagem ou pelo índice.

**Perfil.** `?executivo=<slug>` resolve o perfil (Supabase quando configurado; perfil local de Sabrina sem variáveis). A foto, o nome e o cargo aparecem na abertura; nome e canais de contato, no fechamento. Um executivo nunca aparece no lugar de outro.

| Situação | Comportamento |
|---|---|
| Sem identificador | Perfil padrão (Sabrina). Se o Supabase falhar, perfil local documentado. |
| Identificador encontrado | Perfil desse executivo, de ponta a ponta. |
| Identificador inexistente ou com formato inválido | “Não encontramos esta apresentação”. Nunca outro executivo. |
| Perfil desativado | “Indisponível”. |
| Falha de conexão com identificador | Erro com “Tentar novamente”. |
| Sem variáveis do Supabase | Modo local, só Sabrina. Não fingir serviço conectado. |

**Estado.** Não há estado de sessão do visitante. `src/state` expõe só `ExecutiveProvider` e `useExecutive()` (perfil resolvido) e `useExecutiveResolution()` (origem e motivo, uso interno). Na carga, a chave antiga `cred-mhs:apresentacao` do `sessionStorage` da V1 é removida, se existir; falha de storage é ignorada. A URL só carrega o executivo e o capítulo (`#trilha`); hashes da V1 (`#m05`, `#ecossistema`…) caem no capítulo equivalente.

**Contatos** (`contactLinks(executive)` em `src/lib/personalization.ts`). Nada é enviado nem pré-preenchido com escolhas:
- E-mail: `mailto:` com o endereço do perfil e assunto fixo “Conversa sobre a CRED MHS”, sem corpo.
- WhatsApp: só com `whatsAppEnabled` e número confirmado; link `wa.me` sem texto. Hoje desligado (P13).
- Telefone: `tel:` em E.164. LinkedIn e site como links secundários.
- Agendamento: `booking` é sempre `null` até existir URL real confirmada; o botão é omitido.
- Canal sem valor válido no perfil some da interface.

**Verificações.** `node --import ./src/lib/checks-resolve.mjs src/lib/__checks__.ts` cobre resolução do executivo (local e Supabase simulado), contatos, remoção da sessão da V1, link compartilhável, ordem da trilha, quatro eixos e hashes.

---

## Histórico V1 (superado)

## Princípio

A apresentação se adapta às escolhas explícitas do visitante. A identidade do executivo vem de configuração. A interface não deduz informações sobre a empresa nem recomenda serviços como diagnóstico.

## Perfil do executivo

Campos necessários: `id`, `firstName`, `fullName`, `role`, `photo`, `photoAlt`, `email`, `phoneDisplay`, `phoneE164`, `linkedInUrl`, `whatsAppEnabled` e `whatsAppNumber`.

Registro inicial documentado:

| Campo | Valor |
|---|---|
| id | sabrina-ferreira |
| firstName | Sabrina |
| fullName | Sabrina Ferreira |
| role | Executiva de Negócios |
| email | sabrina.ferreira@credmhs.com.br |
| phoneDisplay | +55 (21) 98896-7369 |
| phoneE164 | +5521988967369 |
| linkedInUrl | https://www.linkedin.com/in/sabrinaferreira |
| photo | Resolver ativo real em assets/executives/sabrina-ferreira |
| whatsAppEnabled | false até confirmação do canal |
| whatsAppNumber | Não preencher por inferência |

`?executivo=sabrina-ferreira` resolve esse perfil. Sem parâmetro, usar o perfil padrão. Não aceitar telefone/e-mail de query string. Alterar perfil limpa o contexto de conversa para evitar associação ao contato errado.

**Atualização 2026-10-10 (instrução de Nil):** os perfis passam a vir do Supabase (`public.executives`, editados pelo próprio executivo em `/painel/`; ver `docs/CONFIGURACAO-SUPABASE.md`). O registro acima é o perfil padrão migrado (seed) e o fallback local. **ID desconhecido não cai mais no perfil padrão:** mostra "Não encontramos esta apresentação", para não apresentar outro executivo silenciosamente. Perfil desativado mostra "não disponível"; falha de conexão com identificador mostra erro com "Tentar novamente". Só o endereço sem identificador usa o perfil local de Sabrina quando o Supabase não responde.

## Estado da sessão

| Campo | Tipo/conteúdo | Regra |
|---|---|---|
| schemaVersion | versão do estado | Descartar estrutura incompatível com a versão atual |
| executiveId | ID permitido | Resolver na lista local de perfis |
| companyName | texto opcional, até 80 caracteres | Trim, renderizar como texto, nunca HTML |
| priorities | lista de IDs, máximo 2 | IDs conhecidos, sem duplicação, manter ordem de escolha |
| topics | lista de IDs de assuntos | Inclusão explícita, única, com remoção |
| currentChapter | M01–M10 | Navegação, sem obrigação de persistência |
| expandedDetail | ID ou null | Estado transitório, não precisa persistir |
| messageDraft | texto editado | Estado transitório, não enviar automaticamente |

Persistir apenas executivo, empresa, prioridades e assuntos em `sessionStorage`, quando disponível. Não usar localStorage por padrão. Persistência é conveniência: qualquer falha deve manter a experiência funcional em memória. Recarregar a aba restaura a seleção válida. Oferecer reset para o próximo cliente. Não transportar nome de empresa ou pauta em URL compartilhável.

Toda restauração valida IDs, tipos, comprimento e versão. Dado inválido é descartado. Nome da empresa não deve entrar em título de documento, analytics ou requisições externas automáticas.

## Prioridades

| ID | Rótulo | Frente inicial de M05 | Destaques editoriais |
|---|---|---|---|
| saude | Saúde Ocupacional | saude | Saúde Ocupacional e seus recursos de acompanhamento |
| seguranca | Segurança do Trabalho | seguranca | Equipe e catálogo de Segurança do Trabalho |
| gestao | Gestão e Tecnologia | gestao | M06, eSocial e FAP/NTEP |
| treinamento | Treinamentos | treinamento | EAD, registros e temas de treinamento |

Destaque significa rótulo/ênfase editorial e sugestão de navegação. Não significa avaliação de adequação. Riscos psicossociais continua disponível para todos, sem inferir risco por escolha.

- Primeira escolha define a primeira frente aberta ao entrar em M05.
- Depois que o usuário troca uma frente, a troca manual prevalece até que ele altere prioridades.
- Selecionar uma terceira prioridade mantém as duas existentes e mostra a microcopy do limite.
- Desmarcar e marcar outra é imediato.
- “Conhecer a atuação completa” limpa prioridades e segue. Não apaga assuntos já adicionados sem ação explícita de reset.
- “Continuar” funciona também com zero escolhas.
- Não reordenar capítulos ou mover a página inesperadamente após uma seleção.

## Assuntos da pauta

Há três categorias de IDs: `frente:*`, `aplicacao:*` e `servico:*`.

As quatro frentes podem ser adicionadas. Aplicações: eSocial, FAP/NTEP e riscos psicossociais. Serviços adicionais: os dez itens do slide 15. Não é necessário transformar cada sigla técnica do catálogo principal em um controle, reduzindo ruído.

Usar “Adicionar à conversa” somente em elementos selecionáveis. Estado selecionado vira “Remover da conversa”. Atualizar a pauta em região de anúncio acessível discreta. Abrir, visitar ou ler um tema não implica seleção.

Prioridades e assuntos são mostrados em grupos distintos. O contador persistente representa assuntos adicionados, não mistura prioridades com tópicos sem explicar. Se houver duplicação semântica, manter grupos claros e evitar repetir a mesma frase na mensagem final.

## Resumo personalizado

M09 recebe o nome da empresa quando informado. Mostra escolhas existentes e permite edição. Estado vazio é válido e tem caminho direto ao contato.

A pauta deve continuar legível com muitos itens. Permitir expansão no fluxo. Nunca ocultar assuntos por limite visual nem renderizar dezenas de chips em uma única linha horizontal.

## Mensagem e contatos

A mensagem inicial usa o perfil atual e as escolhas. O visitante revisa/edita. Abrir e-mail usa endereço configurado, assunto curto e corpo codificado corretamente. `mailto` depende do aplicativo de e-mail do dispositivo, então oferecer cópia do texto como alternativa.

Se a mensagem exceder o limite conservador adotado para URL, manter a prévia e orientar a cópia, abrindo e-mail apenas com destinatário e assunto. Não cortar silenciosamente a pauta.

Se escolhas mudarem depois de edição manual, mostrar “Atualizar mensagem com minhas escolhas” em vez de sobrescrever o texto digitado. Não persistir rascunho depois de reset.

WhatsApp depende de confirmação. Não testar canal enviando mensagem. Ao abrir link externo, o próprio visitante decide enviar. Fallback de cópia funciona sem Clipboard API, com texto selecionável.

## Reset

“Nova apresentação” (antes “Reiniciar apresentação”) pede confirmação porque remove escolhas. Após confirmar: limpar nome, prioridades, assuntos, rascunho, detalhes abertos e dados de sessão; manter o executivo da URL; retornar a M01 e restaurar foco no início. Essa confirmação faz parte do produto, não é uma aprovação para o Claude continuar trabalhando.

## Casos obrigatórios

- Zero, uma e duas prioridades.
- Tentativa de terceira prioridade.
- ID de executivo desconhecido.
- Nome vazio, longo e com acentos ou caracteres especiais.
- Adicionar duas vezes, remover, adicionar novamente.
- Recarregar, limpar e reiniciar.
- Storage indisponível ou inválido.
- Link direto a um capítulo sem estado anterior.
- Pauta vazia e pauta longa.
- Alteração de escolhas após editar a mensagem.
- Alternância entre executivos sem vazamento de contexto.
