# Fontes, cobertura e pendências

## Registro da V3 — PPT da Sabrina (20/10/2026)

Autoridade: `docs/CRED-MHS-Apresentacao-Comercial.pptx` (11 slides) + `docs/V3-CONTRATO.md`. Fidelidade do texto: `docs/V3-FIDELIDADE-TEXTO.md`. Ajustes autorizados (slide 9, etapas do slide 11, CTA do slide 1): `docs/V3-ALTERACOES-TEXTO.md`. Tudo o que vem depois desta seção é histórico da V1/V2.

### Pendências V3 abertas

| ID | Tema | Situação | Tratamento na página |
|---|---|---|---|
| P47 | Depoimentos (slide 6) | **Parcialmente resolvida (20/10/2026):** recebido 1 depoimento — Wilton Valente, Coordenador de SMS, Radix — em dois parágrafos, uso autorizado (confirmado pelo Nil). O PPT previa três (Banco, Hotelaria, Restaurante) | Texto inserido sem edição em `copy.depoimentos.items` (inclusive a grafia “CREDMHS” do cliente). Seção agora **visível ao cliente**. Setor não exibido (Radix não é nenhum dos três do PPT). Outros depoimentos entram no mesmo array. **20/10/2026:** 2º depoimento recebido — Sandra Coelho, Gerente de RH, Radisson (hotelaria), enviado pelo Nil para publicar; inserido sem edição (quebra de parágrafo onde o texto tinha espaço duplo). Com dois, a seção vira carrossel. Falta: Banco e Restaurante do PPT |
| P48 | CSAT (slide 7) | **Número liberado ao cliente pelo Nil em 20/10/2026** (“é um número importante”): 99,4% aparece no link do cliente, com contagem animada. Seguem pendentes o percentual exato, a fonte/link, o período e o universo (nº de respondentes) | `copy.satisfacao.showToClient: true`, `status: 'provisorio'`. O aviso de pendência só aparece em `?revisao=1`. Quando a CRED confirmar, preencher `source`/`period`/`universe` e mudar `status` para `'validado'` (aparece a ficha Fonte/Período/Universo). Continua sendo CSAT das unidades próprias, não NPS nem toda a rede |
| P49 | “Comunicação e reputação” (dimensão transversal do slide 9) | Texto novo, pedido nos áudios da Sabrina; não está no PPT | Proposta para validação da Sabrina. É transversal às seis frentes, não sétima frente |
| P49a | Enquadramento de “Comunicação e reputação” (21/10) | A Sabrina enviou o texto novo (“A força da marca gerando a percepção positiva…”) logo após “Inteligência compartilhada” e “Investimento mútuo”; a mensagem não diz se é uma oitava frente ou o fecho da seção | **Decisão da Sabrina pendente.** Na página: fecho da seção de frentes, sem número e fora da contagem (“Sete frentes”). Se for frente, vira 08 e o título passa a “Oito frentes” |
| P56 | “Dados e Privacidade” (21/10) — credenciais | Texto da Sabrina: “Certificada ISO 9001 / 27001 / 45001 e LGPD”. Diverge de P05a: o slide 9 do material antigo citava só ISO 9001 e 45001; o slide 18, as três. Titular (empresa ou sistema), escopo e vigência continuam sem documento | Texto aplicado literalmente como frente 05, sem selos, sem alegação de auditoria/escopo. Confirmar titular, escopo e vigência; LGPD não é certificação — sugerir à Sabrina redação que não leia “certificada em LGPD” (ex.: “… 45001, em conformidade com a LGPD”), **não aplicada** |
| P57 | Frente 02 — concordância | “Processos e procedimentos … padronizados, disponível em todo o território nacional.” | Aplicado como enviado. Sugestão: “disponíveis”. Não corrigido sem aprovação |
| P50 | Títulos das frentes 01 e 04 | “Conformidade legal e segurança jurídica” (era “Capacidade técnica”) e “Convergência Digital” (era “Inovação”; 23/10) | Propostas para validação da Sabrina, junto com os textos B, C, D e F (`docs/V3-ALTERACOES-TEXTO.md`) |
| P51 | Carrossel de empresas (slide 10) | O PPT mostra “1 / 3”, mas só tem 8 logos incorporados. Fairmont (`assets/clients/fairmont-logo.jpeg`) foi incluída por pedido | O contador mostra o total real. Perguntar à CRED se há mais marcas para as outras páginas e se todas podem ser exibidas |
| P52 | Qualidade das fotos das unidades | As fotos vieram do WhatsApp (1200×1600, compressão visível) | Detalhes e tratamento em `docs/V3-FOTOS.md` (agente Visual). Pedir originais em resolução maior |
| P53 | Unidade de cada foto | O PPT não identifica a qual unidade (Barra ou Centro) pertence cada foto | A atribuição em `docs/V3-CONTRATO.md` é da implementação. Confirmar com a CRED antes de legendar uma foto com o nome da unidade |
| P54 | Sugestão de fala (frente 05) | “Ninguém faz nada sozinho.” saiu da página | Fica como sugestão de fala do executivo; não renderizar |
| P55 | CTA “Saiba mais” (slide 1) | Não existe no PPT; controle de avanço preservado da V2 | Microcopy de interface; confirmar com a Sabrina se mantém |
| P45 | Licença do Remotion | **Continua aberta** e passa a valer para o mapa animado do slide 5 (`src/motion/map`) | Confirmar com o Nil a entidade e se a licença cobre o uso |
| P13 | WhatsApp | Continua sem confirmação do canal | Botão só com número confirmado |

### Pendências resolvidas ou superadas pela V3

| ID | Situação |
|---|---|
| P01 | **Resolvida pela V3:** o PPT da Sabrina diz “35 anos” (slide 3). A página usa esse número |
| P03, P04 | **Superadas:** a V3 usa só +550 mil vidas e +5 mil clientes (slide 5) e “Atuação nacional”; 16 unidades, +700 clínicas e 27 estados não aparecem |
| P33 | **Encerrada:** os JPEGs dos quatro eixos e da trilha deixaram de ser necessários; a V3 não usa eixos nem trilha |
| P34–P38, P42 | **Superadas:** tratavam do inventário dos quatro eixos e da trilha da V2 |
| P41 | **Superada:** a copy V2 foi substituída pelo texto do PPT da Sabrina |
| P46 | **Encerrada:** selos 3C/3I estão proibidos na página pública da V3 (`docs/V3-CONTRATO.md`) |
| P02, P05–P11 | Fora da página na V3 (ranking, certificações, LGPD, eSocial, EAD, catálogo técnico, FAP/NTEP); o histórico abaixo fica como referência |

Os registros abaixo não foram apagados.

---

> **V2 (14/10/2026):** a matriz de cobertura abaixo descreve a V1 (M01–M10). A cobertura vigente está em `src/content/coverage.ts` e `docs/V2-MAPEAMENTO-FRAMEWORKS.md`; as pendências novas e as atualizações da V2 estão no fim deste arquivo (“Registro da V2”). Registros anteriores ficam como histórico.

## Fontes canônicas do workspace

| Arquivo | Uso |
|---|---|
| `sources/briefing-original.txt` | Intenção comercial e formato acordado |
| `sources/apresentacao-original.md` | Texto integral recebido, por slide |
| `sources/apresentacao-original.pptx` | Layout original e conteúdo incorporado em imagens |
| `sources/analise-e-arquitetura.md` | Análise editorial anterior |
| `assets/brand/` | Identidade oficial que Nil adicionará |

Nenhum arquivo de origem deve ser sobrescrito. Correções são feitas na copy da aplicação, com referência ao original. A transcrição não substitui inspeção de logotipos e selos incorporados no PPTX.

## Matriz de cobertura (V1 — superada)

| Origem | Destino principal | Destino complementar ou tratamento |
|---|---|---|
| Slide 01 — marca/ranking | M01, marca | Ranking preservado na fonte e pendente de comprovação |
| Slide 02 — personalização | M02 | M01, M09 e M10 |
| Slide 03 — pessoas | M01/M02 | Orientação humana da fotografia e da conversa |
| Slide 04 — institucional | M02 | Alcance em M03; idade em conflito |
| Slide 05 — ecossistema | M05 | Personalização em M02/M09 |
| Slide 06 — Brasil | M03 | Alcance textual sem geolocalização inventada |
| Slide 07 — saúde | M05, Saúde Ocupacional | In company em M03; referência técnica no inventário |
| Slide 08 — segurança | M05, Segurança do Trabalho | Equipe em M03 e fallback M08 |
| Slide 09 — tecnologia | M05, Gestão e Tecnologia, e M06 | ISO/LGPD tratadas em M08; mentoria e aprendizagem nos detalhes |
| Slide 10 — EAD | M05, Treinamentos | Integração em M06; lista integral de temas no aprofundamento |
| Slide 11 — diferenciais | M03, M06 e M07 | “4 soluções” preservado na fonte sem inventar modalidades |
| Slide 12 — eSocial | M07 | Integração em M06 |
| Slide 13 — FAP/NTEP | M07 | Relação exata dos sistemas pendente |
| Slide 14 — riscos psicossociais | M07 | Sem renomear como VIVA |
| Slide 15 — adicionais | M05, catálogo adicional | Assuntos selecionáveis em M09 |
| Slide 16 — clientes | M04 | Inventário visual/textual a conciliar |
| Slide 17 — escala | M03 | Idade em conflito; rótulo territorial pendente |
| Slide 18 — credenciais | M08 | Fallback baseado em equipe/estrutura quando faltarem dados |
| Slide 19 — executivo/contato | M01/M10 | Perfil configurável e mensagem personalizada |

Esta matriz registra o destino de todo slide. Durante a implementação, ampliar a conferência para os itens únicos de cada lista e parágrafo. Distinguir informação resumida, preservada em detalhe e retida no inventário por pendência.

## Política de conteúdo durante a implementação local

- Informações não conflitantes fornecidas no deck podem compor o preview local com status interno `source-supplied`.
- Não afirmar verificação externa. Não exibir status interno ao prospect.
- Informações conflitantes ou sem escopo claro usam o fallback descrito abaixo.
- Construir o layout e os mecanismos mesmo quando faltarem ativos. Não preencher lacunas com dados fictícios.
- Este pedido termina na versão local. As pendências ficam registradas para revisão antes de uma publicação futura.

## Registro de pendências

| ID | Tema | Situação | Implementação inicial |
|---|---|---|---|
| P01 | Tempo de experiência | 30 no slide 4, 34 no 17 e 35 no briefing | Usar “experiência multissetorial”; não mostrar idade |
| P02 | Ranking | “Entre as 5 maiores” sem fonte/critério | Não usar em headline; preservar no inventário |
| P03 | Escala | Valores do slide 17 sem data-base | Usar no preview como dados fornecidos; não trocar qualificadores nem inventar data |
| P04 | Território | “27 Estados Atendidos” | Usar “atuação nacional” até confirmar a nomenclatura |
| P05 | Certificações | ISO citadas sem titular/escopo/validade | Modelar dados e usar fallback de M08 enquanto faltarem os campos |
| P06 | LGPD | Afirmação textual e referência visual | Manter no inventário; não criar certificação ou garantia nova |
| P07 | Clientes | Relação de nomes e imagens; vínculo não qualificado | Usar linguagem de percurso; não afirmar carteira ativa ou resultados |
| P08 | Quatro soluções eSocial | Quantidade citada, modalidades ausentes | Apresentar a aplicação eSocial sem inventar quatro nomes |
| P09 | Catálogo EAD | Mais de 77 cursos | Preservar valor fornecido no preview; registrar necessidade de atualização |
| P10 | Catálogo técnico | Siglas e referências normativas do original | Preservar nomes; não inferir validade atual nem adicionar normas |
| P11 | FAP/NTEP | “Seu sistema” ambíguo | Síntese genérica de integração; sem atribuir arquitetura não descrita |
| P12 | Retrato | Foto pequena no PPTX | Preferir foto real de alta resolução; se ausente, layout tipográfico funcional |
| P13 | WhatsApp | Telefone existe; canal não confirmado | Desabilitado; e-mail, telefone e LinkedIn documentados |
| P14 | Agenda | Nenhum link de agendamento | Não criar CTA “Agendar” com destino inexistente |
| P15 | Identidade | Nil vai adicionar os arquivos | Inspecionar antes de definir tokens finais |
| P16 | VIVA | Nome não está no deck | Não incluir como produto automaticamente |
| P17 | Direitos no slide 16 | Copyright com referência a Sabrina | Preservar na fonte; confirmar titular da assinatura pública antes de substituir |

Ao receber confirmação, registrar a informação, data e origem da confirmação. Não apagar o histórico da divergência do documento de trabalho. Atualizar dado centralizado, não procurar e substituir valores em vários componentes.

## O que pode mudar sem inventar conteúdo

Ortografia, pontuação, hierarquia, ordem, síntese e microcopy. Exemplos: “Relatório Annual” passa a “Relatório Anual”; “solução solução” perde a duplicação; “multidiciplinar” vira “multidisciplinar”; “E-social” é padronizado como “eSocial”.

A taxonomia “Gestão e Tecnologia” padroniza a frente que aparece também como “Gestão de Tecnologia”. Não criar uma quinta frente por causa dessa variação.

## O que não pode ser inferido

Que todas as certificações pertencem à CRED; que toda marca é cliente atual; que clínicas credenciadas são unidades próprias; que clientes atendidos são ativos; que todos os recursos fazem parte de um único contrato; que integração ERP é instantânea ou sem trabalho; que o programa de riscos psicossociais é necessariamente o VIVA; que o telefone aceita WhatsApp.

## Registro da implementação de conteúdo e estado (2026-10-08)

Acréscimo do agente de conteúdo/estado. Dados centralizados em `src/content/`; status interno em `verificationStatus` e política de exibição em `displayPolicy` (nunca exibidos ao prospect). Mapa fonte→destino detalhado por item em `src/content/coverage.ts`.

| ID | Tema | Situação | Implementação inicial |
|---|---|---|---|
| P05a | Credenciais — divergência entre slides | Slide 9 lista “Certificada ISO 9001 e ISO45001” dentro da lista de tecnologia (sem ISO 27001); slide 18 lista ISO 27001, ISO 9001:2015 e ISO 45001. Titularidade (empresa ou sistema) ambígua | As três ISO modeladas com `missing` + `hidden-until-confirmed`; `trustMode = 'fallback'` em M08 até haver titular, escopo e validade |
| P07a | Logos do slide 16 | O PPTX traz ~40 imagens de marca separadas, sem nome associado (só descrições automáticas). Não há conciliação imagem ↔ nome | `clients[].logo` vazio; nomes em texto como fallback editorial. Seleção inicial de 8 marcas segue a ordem da fonte, sem juízo de relevância — pedir a Nil/CRED as marcas prioritárias e os arquivos oficiais |
| P12a | Retrato de Sabrina | Foto real recebida (`assets/executives/sabrina-ferreira/foto-sabrina.png`, 1098 × 1433, ~2,2 MB). Copiada sem alteração para `public/media/executives/sabrina-ferreira.png` | Gerar derivado otimizado (WebP/AVIF) antes de publicação; caminho centralizado em `src/content/executives.ts` |
| P18 | Aprofundamento técnico de Saúde Ocupacional | docs/02 manda remover “O material apresenta” só após revisão técnica | Texto mantido literalmente em `serviceAreas#saude.extras` até a revisão |
| P19 | Microcopy nova não prevista em docs/02 | Assunto do e-mail (“Conversa sobre a CRED MHS”), aviso de mensagem longa, rótulos de itens livres da pauta (“Incluir outro assunto”, “Mover para cima/baixo”, “Editar”), fallback “a minha empresa” na mensagem com escolhas e sem nome | Marcadas como “microcopy nova” em `src/content/chapters.ts`; revisar com Nil |
| P20 | Itens livres e reordenação na pauta | docs/03 prevê só assuntos por ID; a edição de texto livre e a reordenação foram pedidas na orquestração da implementação | Itens livres (`nota:*`, até 20, 120 caracteres, texto puro) e reordenação implementados no estado; persistidos só em sessionStorage, nunca na URL. Rótulos do catálogo não são editáveis |

Decisões de dados registradas:

- Fallback de executivo: ID ausente ou desconhecido resolve para o perfil de Sabrina (único documentado). Não existe perfil genérico com contatos inventados.
- Mensagem: frentes que já aparecem como prioridade não se repetem na linha “Assuntos para aprofundar” (docs/03, evitar repetir a mesma frase).
- “27 Estados Atendidos” e tempo de experiência ficam com `use-fallback` (“Atuação nacional”, “experiência multissetorial”); ranking e “4 soluções eSocial” ficam `inventory-only`.
- Estado restaurado de outro executivo é descartado inteiro (sem vazamento de contexto).

## Registro do QA funcional/cobertura (2026-10-08)

Conferência do texto renderizado (preview com acordeões e frentes abertos) contra `sources/apresentacao-original.md` e `docs/02-copy.md`. Nenhum conteúdo da fonte ficou ausente sem tratamento em `src/content/coverage.ts`: os 37 nomes do slide 16, os 12 temas NR, os 10 serviços adicionais, os catálogos dos slides 7–9 e os aspectos dos slides 11–14 aparecem na interface. O que não aparece está registrado como `retido`/`inventario` (ranking, 30/34 anos, 27 Estados, ISO/LGPD, "4 soluções eSocial", copyright, adjetivos do slide 10, "e muitos outros"). Não foi encontrado texto de instrução interna, status de verificação, ISO/LGPD, VIVA, "Agendar" ou WhatsApp renderizado.

| ID | Tema | Situação | Implementação inicial |
|---|---|---|---|
| P21 | Microcopy nova escrita pelos agentes (fora de docs/02), a validar com Nil | M05/M06: anúncio "{assunto}: adicionado à conversa." / "removido da conversa."; M07 (`m07/microcopy.ts`): "Na sua pauta", "{assunto} adicionado à sua pauta.", "removido da sua pauta.", "Outras necessidades da operação aparecem no catálogo de soluções."; M08 (`m08/content.ts`): rótulos "Equipe multidisciplinar", "Equipamentos próprios", "Recursos de acompanhamento"; M09 (`m09/microcopy.ts`): "Pauta de conversa", "com {nome}, {cargo}", "Nenhuma prioridade escolhida.", "Nenhum assunto adicionado ainda.", "Incluir", "Escreva com suas palavras. Até 120 caracteres.", "Esse assunto já está na pauta.", aviso de limite, "{assunto} incluído na pauta.", "agora está na posição {n}.", "Escolhas limpas. A pauta está vazia.", diálogo "Limpar escolhas?" / "Manter pauta", tipos "Frente/Aplicação/Serviço/Seu assunto"; M10 (`m10/microcopy.ts`): "Revise e ajuste o texto. Ele só sai daqui quando você decidir.", "Suas escolhas mudaram depois que você editou o texto.", "Mensagem preparada. Revise e envie pelo seu aplicativo de e-mail.", "Os botões abrem o seu aplicativo de e-mail, telefone ou navegador. Nada é enviado automaticamente.", "Outros canais", "Texto da pauta", "Site da CRED MHS"; global/M06: "você está aqui", "Reproduzir/Pausar animação", "{n} recursos", eyebrows ("Sua pauta", "Contato"); assunto do e-mail "Conversa sobre a CRED MHS"; aviso de mensagem longa; fallback "a minha empresa" | Nenhuma promete envio, resultado ou diagnóstico. Inconsistência de vocabulário a decidir: "adicionado à conversa" (M05/M06), "adicionado à sua pauta" (M07) e "incluído na pauta" (M09) |
| P22 | Redação técnica ainda com tom de bastidor | "O material apresenta a solução como voltada…" (Saúde Ocupacional, P18) e "O sistema de gestão online descrito pela CRED…" (eSocial) aparecem ao prospect conforme docs/02 | Manter até revisão técnica da CRED; não ampliar a afirmação ao reescrever |
| P23 | E-mail da executiva não aparece como texto em M10 | docs/02 lista o e-mail entre os contatos documentados; a interface só o expõe dentro do `mailto` | Decidir com Nil se exibe o endereço (útil para quem não tem app de e-mail). Achado registrado em `qa/achados-funcionais.md` |

## Registro da rodada final de correções (2026-10-08)

| ID | Tema | Situação | Implementação |
|---|---|---|---|
| P21 (atualização) | Vocabulário dos anúncios | Os anúncios misturavam “adicionado à conversa” (M05/M06), “adicionado à sua pauta” (M07) e “incluído na pauta” (M09) | Decisão: o **botão** continua “Adicionar à conversa” / “Remover da conversa” (docs/03); o **anúncio e o selo** usam “pauta”, porque o destino é a pauta de M09. Formato único: “{assunto} adicionado à pauta.” / “{assunto} removido da pauta.”; selo “Na pauta” em M05 e M07 (antes “Na conversa” / “Na sua pauta”). A validar com Nil |
| P21 (nova microcopy) | Rótulo “E-mail” em M10 | Rótulo do canal de e-mail em “Outros canais” (`m10/microcopy.ts`) | Microcopy nova, sem fato novo |
| P21 (nova microcopy) | Introdução do catálogo adicional de M05 | A coluna de introdução repete o rótulo existente “Adicionar à conversa” com o ícone “+”, como legenda das linhas | Reuso de copy de docs/02; nenhuma frase nova |
| P23 | E-mail da executiva em M10 | **Resolvido no preview:** o endereço de `executives.ts` (slide 19, `source-supplied`) aparece como texto e link `mailto:` sem corpo em “Outros canais” | Confirmar com Nil se o endereço pode ficar visível na versão publicada |
| P24 | Trilho lateral do índice | Entre 1024 e 1279 px o trilho cobria o disco amarelo de M01 | O trilho agora só aparece a partir de 1280 × 640 px. Abaixo disso, o índice fica no botão “Conteúdo”. Decisão de implementação, não regra de marca |

## Registro da revisão de copy — linguagem de bastidor (2026-10-08)

Base: `docs/cred-mhs-revisao-da-experiencia.md`, ajustes 1 e 2. As frases abaixo falavam da relação com a fonte (“o material”, “descrito pela CRED”, “apresentada”) em vez de falar com o visitante. A redação nova usa só o que a fonte afirma, sem promessa técnica nova. As ressalvas que saíram da página ficam registradas aqui.

| ID | Local | Antes | Depois | Ressalva que saiu da página (fica só neste documento) |
|---|---|---|---|---|
| P22 / P18 | M05, Saúde Ocupacional, “Aprofundamento técnico” (`ecosystem.ts`) | “O material apresenta a solução como voltada à organização e ao controle dos requisitos da NR-7, com documentos obrigatórios e ferramentas auxiliares de gestão.” | “Além dos documentos obrigatórios, a CRED oferece ferramentas auxiliares para organizar e acompanhar a gestão de saúde do trabalho.” (slide 7) | A referência à NR-7 (“atende aos requisitos da norma regulamentadora 7”) fica fora da página até redação técnica validada pela CRED; não transformar em promessa de conformidade |
| P22 | M07, eSocial (`applications.ts`) | “O sistema de gestão online descrito pela CRED interliga seus locais de atendimento…” | “Um sistema de gestão online interliga os locais de atendimento da CRED e integra informações de saúde e segurança, com parametrização para o eSocial e recursos de integração via webservice com sistemas ERP.” (slide 12) | “100%”, “em tempo real” e “qualquer software ERP” continuam só na fonte; integração ERP não é instantânea nem sem trabalho |
| P22 | M07, FAP/NTEP (`applications.ts`) | “A solução apresentada permite acompanhar as etapas do processo pelos envolvidos…” | “Os envolvidos acompanham as etapas do processo, com integração entre os sistemas de gestão de saúde e segurança.” (slide 13) | Relação exata entre os sistemas segue ambígua (P11); sem promessa de alíquota ou economia |
| P22 | M04, apoio (`chapters.ts`) | “Conheça algumas das empresas apresentadas na trajetória comercial da CRED MHS.” | “Conheça algumas das empresas que fazem parte do percurso da CRED MHS.” (slide 16, “empresas que estão no percurso”) | Vínculo não qualificado: não afirma carteira ativa nem resultados (P07) |
| P22 | M05, soluções adicionais (`ecosystem.ts`) | “Conheça outras soluções apresentadas no portfólio da CRED.” | “Conheça outras soluções do portfólio da CRED.” (slide 15) | Nenhuma |
| P22 | M08, fallback (`chapters.ts`) | “…fazem parte da atuação apresentada pela CRED.” | “Equipe multidisciplinar, equipamentos próprios e recursos de acompanhamento apoiam a gestão de saúde e segurança.” (slides 8 e 11) | Repetição de M08 com M03/M06 segue como recomendação editorial; capítulo não reestruturado nesta rodada |

Com isso, P18 e P22 deixam de bloquear a página: a redação pública não depende mais da revisão técnica, que continua necessária para qualquer menção normativa (NR-7) no futuro.

| ID | Tema | Copy nova | Observação |
|---|---|---|---|
| P21 (nova microcopy) | M02, instrução | “Escolha até duas prioridades.” (antes “Você pode escolher até duas prioridades.”) + “Ao explorar as soluções, você pode reunir assuntos para conversar com {firstName}.” | `{firstName}` vem do perfil do executivo (`executives.ts`). A frase fica fora da `legend` para não ser lida a cada opção |
| P21 (nova microcopy) | M05, início do ecossistema | “Use “Adicionar à conversa” nos assuntos que quiser retomar com {firstName}. Eles aparecem na sua pauta, no final.” | Aparece uma vez, antes das frentes; os itens repetem só o rótulo do botão. A validar com Nil |

Trechos de bastidor em M06/M09/M10: a varredura (código e texto renderizado com acordeões abertos) não encontrou frases sobre material/fonte/apresentação nesses capítulos. “Conheci a apresentação da CRED MHS” (mensagem de M10) é fala do visitante e foi mantida.

## Registro da revisão da experiência — 4 ajustes (2026-10-08)

| ID | Tema | Copy nova / decisão | Observação |
|---|---|---|---|
| P21 (nova microcopy) | M09, “Copiar pauta” com pauta vazia (`m09/microcopy.ts`, `copyEmptyHint`) | “Escolha uma prioridade ou adicione um assunto para copiar a pauta.” | Botão secundário no grupo de ações de M09, desabilitado com a pauta vazia e ligado à dica por `aria-describedby`. Feedback reaproveita “Pauta copiada.” de M10 (mesmo hook `m10/useAgendaCopy.ts`). A validar com Nil |
| M06 (decisão) | Vídeo complementar | Re-renderizado em versão neutra: os três aspectos aparecem juntos, sem realçar nenhum | O scroll (marcador do topo e texto ativo) é o único indicador de etapa. Reduced motion continua só com poster |

### Próxima rodada (não implementado nesta rodada)

Registrado a partir de `docs/cred-mhs-revisao-da-experiencia.md`. Nada abaixo foi alterado na página.

| Item | Recomendação | Condição |
|---|---|---|
| Revisão 4 — M08 Confiança | Equipe multidisciplinar, equipamentos próprios e acompanhamento repetem M03/M06. Na demonstração atual, passar brevemente por M08. Na próxima versão, integrar o conteúdo repetido às seções anteriores e reservar um capítulo de confiança para credenciais confirmadas (P05/P05a), fotos operacionais pertinentes ou case real autorizado | Recomendação editorial. Não criar provas para preencher espaço. Se a seção for fundida, atualizar navegação, índice e links antigos (`#m08`, slug) de forma consistente; o número dez não é obrigatório |
| Revisão 5 — movimento a favor da compreensão | Nesta rodada só se removeu o conflito (vídeo neutro). Fica para depois avaliar se a peça conceitual pode representar melhor o conjunto, sem repetir os mesmos três rótulos do texto e sem sincronização complexa de vídeo; manter os textos inativos confortáveis em projeção | Não ampliar a quantidade de efeitos. Preservar reduced motion e leitura mobile |
| Revisão 6 — valor durável da pauta | “Salvar pauta em PDF” / impressão dedicada com empresa, executivo, prioridades e assuntos na ordem definida | Hipótese de uso, não garantia de conversão. Só impressão da pauta (sem as dez seções), sem CRM nem backend. Implementar depois dos ajustes de copy e clareza |
| Guia — certificações | Trocar “os slides divergem” por: os slides citam conjuntos diferentes de referências; a lacuna demonstrável é titularidade, escopo e validade ausentes | Ajuste no `docs/guia/GUIA-DA-APRESENTACAO.md` (M08 e tabela P05/P05a) |
| Guia — fechar a aba | Evitar garantia absoluta de que fechar a aba elimina tudo. Orientar a copiar a pauta e usar “Reiniciar apresentação” entre clientes | Não depender da restauração de sessão de cada navegador |
| Guia — peso das pendências | Separar pendências que bloqueiam publicação das que não bloqueiam a demonstração (conteúdo factual, ativos, preferências de interface) | — |
| Guia — imagens | O guia referencia `img/`; ao distribuir, incluir as imagens ou gerar versão autossuficiente. As capturas atuais de `docs/guia/img/` são anteriores aos 4 ajustes (M02, M05, M06 e M09 mudaram) e devem ser refeitas | Capturas novas desta rodada em `qa/capturas/revisao-experiencia/` |
| Guia — escopo dos testes | Explicar que os testes foram feitos no ambiente informado, preservando a lista do que não foi testado | — |
| Guia — roteiro curto | Usar o guia como consulta e preparar um roteiro de demonstração de 7–9 minutos para Sabrina | — |

Aplicado ao guia nesta rodada (correções factuais decorrentes dos 4 ajustes): frases novas de M02 e M05, nova frase de M04 e do aprofundamento de Saúde Ocupacional, “Copiar pauta” em M09 (e “Depois da reunião”), comportamento neutro do vídeo de M06 e linha P18/P22 da tabela de pendências.

## Registro da personalização por executivo com Supabase (2026-10-10)

Instrução de Nil: perfis dos executivos no Supabase, painel `/painel/`, apresentação pública `/?executivo=<slug>`. Configuração em `docs/CONFIGURACAO-SUPABASE.md`; resultados em `qa/RELATORIO.md`.

| ID | Tema | Situação | Tratamento |
|---|---|---|---|
| P25 | Conflito: ID desconhecido | docs/03 mandava cair no perfil padrão; a instrução atual pede mensagem clara | Prevalece a instrução atual: "Não encontramos esta apresentação", sem mostrar outro executivo. docs/03 atualizado |
| P26 | Rótulo do reset | Nil pediu o botão "Nova apresentação" | O antigo "Reiniciar apresentação" foi renomeado (mesmo fluxo, com confirmação). Nova confirmação: "Começar uma nova apresentação apaga o nome da empresa, as prioridades e a pauta desta sessão. O executivo continua o mesmo." / "Começar nova". docs/02 e guia atualizados; captura `docs/guia/img/08-desktop-reiniciar.png` ficou desatualizada |
| P27 | Microcopy nova — telas de estado da apresentação (`src/app/status/statusCopy.ts`) | Carregando, "Não encontramos esta apresentação", "Esta apresentação não está disponível no momento", "Não foi possível carregar a apresentação" + "Tentar novamente", link "Conhecer o site da CRED MHS" | Proposta de trabalho, sem fato novo. A validar com Nil |
| P28 | Microcopy nova — painel (`src/painel/**`) | Login, convite/definir senha, conta sem perfil, editor, prévia, foto, link | Proposta de trabalho. A validar com Nil |
| P29 | Perfil padrão desativado | Se o perfil padrão estiver com `is_active = false`, o endereço sem identificador mostra "não disponível" (não cai no perfil local) | Decisão de implementação a confirmar com Nil (alternativa: usar o perfil local de Sabrina) |
| P30 | Credenciais e e-mail de login | Projeto Supabase, chaves, domínio, e-mail de login de cada executivo e provedor SMTP não foram fornecidos | Pendente de Nil/CRED. Nada foi inventado; `.env.example` sem valores |
| P31 | Outros executivos | Só Sabrina tem dados documentados (seed). `criar-executivo.sql` usa placeholders | Cadastrar só com dados confirmados pela CRED |
| P32 | LinkedIn, site e WhatsApp | Administrados no banco, fora do painel. WhatsApp continua desligado (P13) | Sem mudança de regra |

## Registro da V2 — frameworks e reformulação (2026-10-14)

Fonte: `docs/REVISAO-CRED-MHS-V2.md` rev. 2.1. A pendência genérica “framework não recebido” está **encerrada**: os dois frameworks (quatro eixos e trilha de cinco etapas) foram recebidos da Sabrina e incorporados em `src/content/solutions.ts` e `src/content/valueTrail.ts`. Continuam pendentes só a validação da tradução comercial, a atualidade/escopo do catálogo e detalhes proprietários que não precisam aparecer.

### Fontes novas

| Arquivo | Uso | Situação no projeto |
|---|---|---|
| “soluçoes que nos levam alem cred mhs.jpeg” | Quatro eixos e distribuição das soluções | **Ausente** (ver P33) |
| “trilha de valor na gestao de sso cred hs.jpeg” | Cinco etapas da trilha | **Ausente** (ver P33) |
| `REUNIÃO _ Apresentação da Proposta Comercial — CRED-MHS.txt` (13/10) | Feedback da cliente | Não encontrado no workspace; usar a base rastreável da revisão §2 |
| `assets/brand/Brandbook-V0-rev 200318.pdf` | 3C/3I, paleta, linguagem, imagens | Presente |

### Atualizações de pendências existentes

| ID | Situação na V2 | Tratamento |
|---|---|---|
| P01 | Tempo de atuação: 30 (slide 4), 34 (slide 17), 35 (briefing e reunião de 13/10) | Copy usa “experiência em diferentes setores”. Confirmar o número único com a CRED antes de exibir; não espalhar valores diferentes |
| P02 | “Entre as cinco maiores” | Continua fora da página; só no inventário |
| P03 | 16 unidades, +700 clínicas, +550 mil vidas, +5 mil clientes | Reutilizados sem alteração em `institucional`. Conferir denominação, atualidade e se “clientes atendidos” é acumulado |
| P04 | 27 estados | Continua “Atuação nacional”. Se o número incluir o DF, avaliar “27 unidades federativas” com a cliente |
| P05 | ISO 27001, 9001:2015, 45001 | Sem dobra de credenciais na V2. Confirmar titular, escopo e vigência; não atribuir certificação de fornecedor/tecnologia à CRED MHS inteira |
| P09 | “Mais de 77 cursos” | Na V2 fica só no inventário do eixo Inovação até revisão do catálogo de cursos |
| P10 | Siglas e nomenclatura de programas | Siglas no inventário; página mostra exemplos editoriais |
| P13 | WhatsApp | Continua desligado; botão “Falar por WhatsApp” só com número confirmado para o canal |
| P14 | Agendamento | Nenhuma URL real; botão “Agendar uma conversa” omitido |
| P16 | VIVA | Riscos psicossociais nunca renomeado como VIVA; a apresentação não vira página do VIVA |
| P19–P24, P26 | Microcopy e decisões da pauta/reset/mensagem | **Superadas**: pauta, mensagem gerada e “Nova apresentação” foram retiradas na V2 |

### Pendências novas

| ID | Tema | Situação | Tratamento |
|---|---|---|---|
| P33 | JPEGs dos frameworks | Os dois arquivos não foram encontrados no disco em 14/10/2026 | Mapeamento feito pela transcrição da revisão §5. Adicionar os originais a `assets/brand/` ou `sources/` e conferir nomes, ordem e distribuição |
| P34 | Símbolos BI e AI no framework; “Fábrica de Power BI” (slide 11) | Não descrevem produto nem capacidade | Sem promessa de IA, análise preditiva, recomendação automática ou previsão de afastamentos. Power BI só no inventário até descrição validada |
| P35 | Ícones ESG/ODS | Ilustração | Não comprovam certificação nem resultado ambiental/social |
| P36 | “OK’s e KPI’s” (eixo Reputacional) | Grafia e significado não confirmados | Copy pública usa “indicadores”; não expandir para OKRs |
| P37 | PCMAT, PPRA, demais programas e adequação à LGPD | Itens presentes no framework/PPTX | Revisão técnica de vigência e escopo antes de publicação detalhada; não apresentar como prova de conformidade |
| P38 | Itens da V1 fora do framework | Riscos Psicossociais (slide 14), Gestão de Absenteísmo (slide 15), ASO, Exames In Company, portal/SLA, teleatendimento | Classificação provisória por afinidade, com `note` em `solutions.ts`: Riscos Psicossociais → Normativo; Absenteísmo → Inovação. Confirmar com a CRED |
| P39 | Frequência de reuniões, duração contratual (12 meses), SLA, prazos de atendimento | Não confirmados | Nenhuma promessa na copy; “SLA” do slide 11 fica só no inventário |
| P40 | Assinatura no arquivo do logo | **Resolvida em 14/10:** a captura do header mostra que `public/brand/cred-mhs-logo.svg` já traz “SAÚDE E SEGURANÇA DO TRABALHO”. Texto e `alt` usam a mesma assinatura | Nenhuma ação |
| P41 | Copy V2 | Base executável consolidada com Nil a partir do feedback da cliente | Validar com a Sabrina; não declarar aprovação da cliente |
| P42 | Uso da palavra “gestão” na trilha e nos eixos | “Gestão” é eixo e etapa; também aparece na narrativa | Manter os nomes oficiais com inicial maiúscula quando forem eixo/etapa |
| P43 | Transcrição da reunião de 13/10 (`REUNIÃO _ Apresentação da Proposta Comercial — CRED-MHS.txt`) | Não encontrada no disco em 16/10/2026 (busca no workspace, `SABRINA-FERREIRA`, Downloads, Desktop, Documentos, OneDrive). Os PDFs de `Transcrições/` são da reunião de maio, e o trecho 34:12–35:16 deles trata de outro assunto | “Saiba mais” aplicado conforme a instrução do Nil. Adicionar o .txt a `sources/` para conferir a fala |
| P44 | “Revisão visual” citada na instrução de 16/10 | Nenhum arquivo novo encontrado; a rodada usou `qa/V2-REVISAO-INDEPENDENTE.md` (B2 era o único item aberto, resolvido) | Se houver outra revisão (prints, PDF, mensagem), anexar para nova rodada |
| P46 | Selos 3C/3I por seção (16/10) | Decisão do Nil; mapeamento seção → eixo proposto pela implementação a partir das mensagens-chave do brandbook p. 21; legenda “O posicionamento da CRED MHS” é copy nova | Validar mapeamento e legenda com a Sabrina. Atenção à homonímia: Inovação (3I, eixo de soluções) e Investimento (3I, etapa da trilha) |
| P45 | Licença do Remotion | O player roda na página comercial. A licença gratuita do Remotion cobre pessoas físicas e empresas com até 3 funcionários; acima disso exige licença de empresa | Confirmar com o Nil qual entidade usa e se a licença cobre (já se aplicava ao vídeo M06 da V1) |

