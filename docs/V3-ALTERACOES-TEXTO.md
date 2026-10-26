# V3 — Alterações de texto em relação ao PPT da Sabrina

## Rodada 21/10/2026 — retorno da Sabrina sobre o protótipo (prevalece sobre as propostas de 20/10 abaixo)

Fonte: mensagens e prints da Sabrina (21/10), sobre `entregas/validacao-2026-10-20/CRED-MHS-prototipo-validacao.pdf`. Textos da cliente aplicados literalmente.

| Item | Antes (20/10) | Agora (21/10) | Origem |
|---|---|---|---|
| Frente 01 — título | Conformidade legal e segurança jurídica | **Conformidade Legal e Jurídica** | texto da Sabrina (caixa como enviada) |
| Frente 01 — texto | Times ideais, com profissionais capacitados… | (sem mudança) | sem pedido |
| Frente 02 — texto | Atendimento de excelência, com estratégia de atuação, gestão… | Processos e procedimentos automatizados e padronizados, disponível em todo o território nacional. | texto da Sabrina |
| Frente 03 — texto | Estrutura de atendimento própria e credenciada, integrada em uma só rede para atender onde a sua operação está. | Estrutura de atendimento própria e credenciada de excelência, integrada em uma só rede para atender onde você estiver. | texto da Sabrina (print 12) |
| Frente 04 — texto | Integração tecnológica e sistêmica, com leitura dos dados… | Sistema operacional em nuvem, apropriação de tecnologia para dispositivos móveis e teleatendimento, integração nativa com diversos ERP e associação de IA. | texto da Sabrina |
| **Frente 05 (nova)** | — | **Dados e Privacidade** — Certificada ISO 9001 / 27001 / 45001 e LGPD | texto da Sabrina; entra após a 04 |
| Frente 06 (era 05) | Inteligência compartilhada | (sem mudança) | “sem alterações” |
| Frente 07 (era 06) | Investimento mútuo | (sem mudança) | “sem alterações” |
| Comunicação e reputação — texto | Presente nas seis frentes: … | A força da marca gerando a percepção positiva sobre a empresa como local de trabalho sadio, seguro, e portanto comprometido com o bem estar da sociedade. | texto da Sabrina |
| Título da seção | Seis frentes, uma atuação única. | Sete frentes, uma atuação única. | contagem com a nova frente |
| Rótulo “Como entregamos” e bloco “Mais gestão de SST para a sua empresa” | presentes | retirados | “Remover” |
| Alcance — rótulo | Rede própria Barra · Centro (topo) / “Rede própria — Barra · Centro” (mapa) | Rio de Janeiro - Barra e Centro (junto ao Rio no mapa) | texto da Sabrina |
| Quem somos — indicadores | 35 anos · Minas Gerais · 2008 · 2018 | retirados (seguem no texto corrido) | “No texto já falamos as mesmas informações” |
| Atuação integrada — diagrama | Sua empresa / Equipe multidisciplinar / executivo | retirado | “Remover” |
| Missão, visão e valores | dentro de Quem somos, valores 01–04 | seção própria, sem numeração | sugestão da Sabrina |
| Contato — LinkedIn / Site | rótulos visíveis | só ícones (rótulos viram nome acessível) | “o vetor já é conhecido” |
| Contato — etapas | 01 / 02 em caixa amarela | texto flutuante, sem números | “não curto … caixa … numeração” |

**Notas**
- Frente 03: o comando da rodada pedia preservar a 03, mas a mensagem da Sabrina traz texto substituto para ela (print 12). Prevaleceu o pedido explícito da Sabrina.
- Frente 02: sugestão gramatical, **não aplicada**: “disponível” → “disponíveis” (concorda com “processos e procedimentos”).
- “Comunicação e reputação”: enquadramento pendente (P49). Na página, fecha a seção sem número e fora da contagem.
- Transição: frase inalterada; ênfase visual em “mais gestão”.

---

Data: 20/10/2026. Regra da Sabrina: “O raciocínio e a comunicação são as que colocamos. Favor não alterar o que está escrito.” Só o slide 9 e as etapas do slide 11 têm ajustes autorizados, vindos dos áudios da Sabrina repassados pelo Nil. Todo o resto da página reproduz o PPT (conferência em `docs/V3-FIDELIDADE-TEXTO.md`).

Os números 01–06 e a ordem das frentes não mudaram. O texto original fica guardado em `fronts[].original` (`src/content/chapters.ts`), só como documentação.

**Status de todos os itens abaixo: proposta para validação da Sabrina.**

## Slide 9 — seis frentes e dimensão transversal

| Ajuste | Original do PPT | Texto na página | Justificativa (pedido) |
|---|---|---|---|
| **A** — título 01 | Capacidade técnica | **Conformidade legal e segurança jurídica** | Sentido pedido: conformidade legal e segurança jurídica. O título explicita o benefício; o texto técnico continua igual. |
| A — texto 01 | Times ideais, com profissionais capacitados e atualizados às legislações que norteiam o segmento. | (sem mudança) | Preservar o conteúdo técnico. |
| **B** — título 02 | Segurança operacional | (sem mudança) | — |
| B — texto 02 | Atendimento de excelência e procedimentos padronizados em todo o território nacional. | Atendimento de excelência, com estratégia de atuação, gestão, processos e procedimentos padronizados em todo o território nacional. Consistência na operação onde a sua empresa estiver ou onde o exame acontecer. | Padronização da estratégia de atuação, da gestão, dos processos e dos procedimentos no país; benefício: consistência onde a empresa estiver ou o exame acontecer. Sem prometer ausência de risco. |
| **C** — título 03 | Rede ampla e integrada | (sem mudança) | — |
| C — texto 03 | Estrutura própria e credenciada conectada para atender onde a sua operação está. | Estrutura de atendimento própria e credenciada, integrada em uma só rede para atender onde a sua operação está. | Deixar claro que a frente 03 fala da estrutura de atendimento (própria e credenciada) e que “integrada” é a rede, não a tecnologia, que fica na frente 04. |
| **D** — título 04 | Inovação | **Integração tecnológica** | O título passa a dizer o que a frente entrega: integração tecnológica e sistêmica, contexto 100% digital. Em 23/10 “e dados” saiu do título (o tema fica na frente 05, Dados e Privacidade). |
| D — texto 04 | Integração tecnológica e sistêmica, com leitura dos dados, em um contexto 100% digital. | Integração tecnológica e sistêmica, com leitura dos dados, em um contexto 100% digital, do aplicativo ao teleatendimento. | Aplicativo e teleatendimento são os exemplos dados pela Sabrina. Nenhuma funcionalidade ou tela foi acrescentada. |
| **E** — texto 05 | Uma metodologia que constrói conhecimento de forma colaborativa. Ninguém faz nada sozinho. | Uma metodologia que constrói conhecimento de forma colaborativa. | Primeira frase preservada exatamente; “Ninguém faz nada sozinho.” sai da página. |
| **F** — texto 06 | A empresa e a CRED MHS investem juntas — e todo o sistema cresce junto. | A empresa e a CRED MHS investem juntas na troca genuína de informação e na construção de repertório e autoridade — e todo o sistema cresce junto. | Investimento das duas partes, troca genuína de informação, construção de repertório e autoridade. O complemento diz em que as duas partes investem, para não ler como investimento só financeiro. Mantidos o travessão e o fecho da Sabrina. |
| **G** — transversal (título) | — | **Comunicação e reputação** | Dimensão transversal às seis frentes. Não é sétima frente e não substitui nenhuma. |
| G — transversal (texto) | — | Presente nas seis frentes: o cuidado com a saúde e a segurança das pessoas também comunica e faz parte da reputação da sua empresa. | Texto curto, sem promessa de resultado de imagem. |

### Sugestão de fala do executivo (E), fora da página

> “Ninguém faz nada sozinho.”

Sugestão para o executivo dizer ao apresentar a frente 05 (Inteligência compartilhada). Não aparece na página.

### Revisão de redação

Os trechos acrescentados passaram pela skill `stop-slop`: frases curtas, sem advérbios de ênfase, sem absolutos (“sempre”, “nunca”, “zero risco”), sem travessões novos. O único travessão do slide 9 é o original da Sabrina na frente 06.

## Slide 11 — etapas

| Ajuste | Original do PPT | Texto na página | Justificativa |
|---|---|---|---|
| Etapas | Detalhar o escopo · Aprofundar na sua demanda · Dar o primeiro passo | Aprofundar na sua demanda · Detalhar o escopo | Pedido: remover “Dar o primeiro passo” e colocar “Aprofundar na sua demanda” antes de “Detalhar o escopo”. |

## Slide 1 — CTA “Saiba mais”

| Item | Original do PPT | Texto na página | Justificativa |
|---|---|---|---|
| CTA da abertura | (não existe no PPT) | Saiba mais | Controle de avanço preservado da V2: leva a `#provocacao`. A rolagem livre continua funcionando. É microcopy de interface e não muda o texto da Sabrina. |

## Rodada 22/10/2026 — apontamentos

Pedidos recebidos pelo Nil em 22/10/2026, aplicados como enviados.

| Onde | Antes | Agora |
|---|---|---|
| Slide 1 — abertura | Vim te mostrar como a CRED MHS… | Estou aqui para te mostrar como a CRED MHS… |
| Slide 9 — Comunicação e reputação | A força da marca gerando… seguro, e portanto comprometido… | A força da **sua** marca gerando… seguro, e portanto**,** comprometido… |
| Slide 6 — depoimentos | Rótulo “Quem somos · Clientes” acima do título | Rótulo retirado |
| Slide 6 — depoimentos | Radix e Radisson | + Michele Rosa, Coord. de RH, Hotel Nacional (texto como enviado) |
| Rodapé | Logo + “Saúde e Segurança do Trabalho” | Só o logo |
| Slide 8 — transição | “de saúde e segurança / do trabalho” | Quebra fixa: “de saúde e / segurança do trabalho”; mais espaço entre “Como entregamos” e “mais gestão” (o “g” encostava no “mais”). Frase inalterada. |

## Rodada 23/10 — slide 9

| Item | Antes | Depois |
|---|---|---|
| Título da seção | Sete frentes, uma atuação única. | **Múltiplas frentes, uma atuação única.** |
| Frente 04 — título | Integração tecnológica e dados → Integração tecnológica | **Convergência Digital** (texto da frente sem mudança) |
| Frente 05 (nova) | — | **Cultura de Dados** — “Processos decisórios orientados por dados.” (pedido escrito “orientadas”; concordância ajustada para “processos … orientados”) |
| Frente 06 — título | Dados e Privacidade (05) | **Privacidade e Segurança da Informação** (texto “Certificada ISO 9001 / 27001 / 45001 e LGPD” mantido) |
| Numeração | 01–07 | 01–08 (Inteligência compartilhada = 07, Investimento mútuo = 08) |
| Comunicação e reputação | fecho em texto flutuante | mesmo texto, em **faixa amarela de destaque** ao fim da seção (o resultado da metodologia: a força da marca do cliente) |
