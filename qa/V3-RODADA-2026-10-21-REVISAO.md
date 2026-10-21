# V3 — Rodada 21/10/2026: revisão independente

Data: 21/10/2026. Revisor independente; nenhum código foi editado.
Método: Python Playwright (Chromium) contra o dev server `http://127.0.0.1:5173`, larguras 1440×900, 1024×768, 414×896 e 360×740, sem parâmetro e com `?executivo=sabrina-ferreira`, mais `?revisao=1` e `prefers-reduced-motion: reduce`. Também foram feitos: auditoria no DOM de bordas e pseudo-elementos (linhas), comparação do texto renderizado com `src/content/chapters.ts`, cliques nos carrosséis, clique no trilho lateral, foco por teclado e medição de alvos de toque.
Capturas: `qa/capturas/v3/rodada-2026-10-21/revisao-independente/` (por seção e largura; mapa após 10 s; carrosséis depois de "próximo"; revisão; foco; rodapé).

## Checklist pedido a pedido

| # | Pedido | Status | Evidência |
|---|---|---|---|
| 1 | Remover traços (linhas acima de títulos e chamadas, entre indicadores, entre atributos) | **Parcial** | Nas seções da rodada não restou nenhuma linha: Quem somos, Missão e valores, Atuação integrada, Alcance, Transição, Frentes e Contato. A auditoria de bordas e pseudo-elementos ainda acha linhas equivalentes em seções vizinhas: o **traço preto de 3px sobre o amarelo acima de "Olá, sou Sabrina."** (abertura, todas as larguras), os traços amarelos de 40px antes dos rótulos de Depoimentos e de Empresas, o fio amarelo à esquerda das citações, o fio de 3px no topo do rodapé e o fio fino no topo de Satisfação. Ver achados I1 e M1. |
| 2 | Quem somos: retirar indicadores, usar diagrama circular, manter fotos Barra e Centro | **Atendido** | Nenhum resquício de 35/Minas Gerais/2008/2018 como indicador. A história continua no texto corrido. Os três atributos aparecem em diagrama de círculos sobrepostos (Venn); as fotos Barra e Centro foram mantidas (no celular, carrossel com abas, como antes). |
| 3 | Atributos com leveza; um único bloco de missão, visão e valores, sem 1/2/3/4 | **Atendido** | Os atributos ficaram em círculos amarelos translúcidos, sem fios nem ícones. A seção própria `#missao-visao-valores` usa fundo amarelo e texto livre, sem numeração e sem caixas. |
| 4 | Atuação integrada: remover o diagrama | **Atendido** | O diagrama saiu. Eyebrow, título, corpo e frase do executivo continuam iguais aos de `chapters.ts`. |
| 5 | Alcance: remover rótulo e linha; "Rio de Janeiro - Barra e Centro" como identificação | **Atendido** (com ressalva) | O rótulo superior e os fios entre os indicadores saíram. O rótulo do Rio aparece junto ao marcador ao fim da animação, em 1440 e em 414. Ressalva: quebra ruim, ver I3. |
| 6 | Transição: remover a foto, destacar o slide, enfatizar "mais gestão… da sua empresa?" | **Parcial** | Foto removida; o slide ficou em tela cheia amarela, e o traço preto acima do lead saiu. A ênfase, porém, cai só em "mais gestão" (grande, negrito, faixa branca). "de saúde e segurança do trabalho para a" segue no peso normal, e "sua empresa?" mantém o sublinhado do PPT. O pedido cita o trecho inteiro, "mais gestão para a Saúde e Segurança do Trabalho da sua empresa?". Ver I2. Frase literal preservada. |
| 7 | Frentes: textos literais, nova frente 05, título, retirar rótulo e bloco preto | **Atendido** | Título "Sete frentes, uma atuação única." Textos 01–04 iguais aos da Sabrina, caractere por caractere. "Dados e Privacidade" vem como 05, depois da 04 e antes de "Inteligência compartilhada" (06) e "Investimento mútuo" (07), estes dois sem alteração. "Comunicação e reputação" fecha a seção sem número e com o texto novo. O rótulo "Como entregamos" e o bloco preto "Mais gestão de SST…" não aparecem. |
| 8 | Contato: sem caixas nem numeração; LinkedIn e site só como ícone; sem painel | **Atendido** | Título, frase e as etapas "Aprofundar na sua demanda → Detalhar o escopo" (nessa ordem, sem números nem caixa) estão preservados. Executivo sem painel: foto, nome, cargo, telefone (`tel:`) e e-mail (`mailto:`) aparecem uma vez cada. Não há botões duplicados. Os ícones de LinkedIn e site têm `aria-label` ("LinkedIn", "Site da CRED MHS"), alvo de 48×48 px, `target=_blank` com `rel=noopener` e foco visível (contorno de 3px mais anel amarelo). Telefone e e-mail têm 44 px de altura. |

## Verificações gerais

- **Rolagem horizontal:** nenhuma nas 4 larguras (`scrollWidth == clientWidth`). Os elementos além da borda são slides de carrossel recortados, como esperado.
- **Personalização:** sem parâmetro e com `?executivo=sabrina-ferreira`, nome, foto, cargo e contatos aparecem na abertura e no contato. Sem parâmetro, a página carrega o perfil padrão (Sabrina).
- **`?revisao=1`:** a Satisfação mostra o aviso "Dado provisório — percentual exato, fonte, período e universo a confirmar". Os depoimentos (reais) aparecem também no link do cliente, como pretendido.
- **Carrosséis:** depoimentos 1/2 → 2/2 → 1/2. Marcas 1/3 → 2/3 → 1/3 no desktop e 1/9 → 2/9 → 3/9 → 2/9 no celular. Fairmont está presente ("Fairmont Rio de Janeiro Copacabana").
- **Mapa:** a animação completa em cerca de 9 s (estados e símbolos), e o destaque do Rio vem com o rótulo novo. "Pausar" vira "Repetir animação" ao fim. Também capturado com movimento reduzido.
- **Trilho lateral:** 11 links, incluindo "Missão e valores" (`#missao-visao-valores`). O clique leva a seção ao topo (top = 0), atualiza o hash e marca `aria-current`. No celular o trilho fica oculto, como antes.
- **Texto:** todas as strings públicas de `chapters.ts` aparecem renderizadas sem alteração. Não há texto público fora do arquivo (só a microcopy de interface já existente). Os textos `original` não são renderizados.
- **Quebras de linha:** nenhuma preposição ou palavra órfã no fim de linha nas seções revisadas e nas quatro larguras, com uma exceção estética no rótulo do mapa (I3).
- **Contraste:** texto escuro sobre amarelo e branco sobre o grafite estão legíveis. O cinza dos números 01–07 das frentes é claro, mas é tamanho grande e o padrão já existia.

## Achados por severidade

### Bloqueante
Nenhum.

### Importante

**I1 — Traço preto sobre amarelo acima de "Olá, sou Sabrina." (abertura)**
- Seção: Abertura. Larguras: todas (1440, 1024, 414, 360).
- É exatamente o tipo de linha que a Sabrina pediu para tirar ("linha preta sobre fundo amarelo", acima de título). A da Transição foi removida, mas esta continua.
- Arquivo provável: `src/components/sections/v3/Abertura.module.css`, linha 50 (`border-top: var(--rule)` no `.greeting`).
- Correção sugerida: remover o `border-top` e o `padding-top` associado, depois conferir se o CTA "Saiba mais" continua visível na primeira dobra nas 4 larguras.

**I2 — Ênfase da Transição mais curta do que o trecho citado**
- Seção: Transição. Larguras: todas.
- A Sabrina pediu ênfase em "mais gestão para a Saúde e Segurança do Trabalho da sua empresa?". Hoje só "mais gestão" ganhou peso; o resto fica no corpo normal, o que lê como ênfase em duas palavras.
- Arquivos prováveis: `src/components/sections/v3/Transicao.tsx` e `Transicao.module.css` (e `copy.transicao.question` em `chapters.ts`, se for preciso reagrupar `emphasis`/`middle`).
- Correção sugerida: estender o tratamento enfático (peso ou tamanho) a "mais gestão … sua empresa?", mantendo "Como entregamos" como entrada mais leve, ou confirmar com a Sabrina que a leitura em duas palavras basta. Registrar a decisão em `docs/V3-ALTERACOES-TEXTO.md`. Não mexer na frase.

**I3 — Rótulo do mapa começa a segunda linha com hífen**
- Seção: Alcance. Larguras: 1440 e 414 (provavelmente todas).
- Aparece como "Rio de Janeiro" / "- Barra e Centro". O hífen no começo da linha parece marcador de lista e foge da regra de quebra equilibrada.
- Arquivo provável: `src/components/sections/v3/Alcance.tsx` (rótulo do Rio) e `Alcance.module.css`.
- Correção sugerida: manter " - " preso a "Rio de Janeiro" (espaço não separável antes do hífen, ficando "Rio de Janeiro -" / "Barra e Centro") ou usar `white-space: nowrap` se couber. O texto literal não muda.

### Menor

**M1 — Outros traços decorativos equivalentes fora das seções da rodada**
- Traço amarelo de 40×3 px antes do rótulo "Quem somos · Clientes" (`Depoimentos.module.css`, `.eyebrow::before`, linha 21) e antes de "Quem já viu valor na entrega da CRED MHS" (`Empresas.module.css`, `.eyebrow::before`).
- Fio amarelo de 3px à esquerda das citações (`Depoimentos.module.css`, linha 70, `border-left`).
- Fio preto de 3px no topo do rodapé (`src/app/App.module.css`, linha 18). Além disso, é mais largo que a coluna de conteúdo (vai de 64 a 1376 px, e o conteúdo começa em 102).
- Fio cinza fino no topo de Satisfação (`Satisfacao.module.css`, linha 2).
- Correção sugerida: se a regra "Remover esses traços" valer para a página toda (a leitura mais segura, dado "e equivalentes"), remover esses fios. Os trilhos de progresso dos carrosséis são controles e podem ficar.

**M2 — Seta das etapas do Contato quebra para o início da linha**
- Em 1024, 414 e 360 a leitura fica "Aprofundar na sua demanda" / "→ Detalhar o escopo". É legível, mas a seta solta no começo da linha é menos limpa.
- Arquivo: `Contato.module.css` (`.steps` e `.step`). Sugestão: quando o par não couber em uma linha, empilhar as etapas com a seta alinhada ou deixá-la no fim da primeira linha.

**M3 — Trilho lateral com alvo de 44×32 px**
- Desktop ou tablet (o trilho fica oculto no celular). A altura fica abaixo de 44 px. Já era assim antes da rodada e o uso principal é com mouse, mas em tablet com toque fica justo.
- Arquivo: `src/components/ui/SideRail.module.css`. Sugestão: área de toque de 44 px de altura com o traço visual inalterado.

**M4 (observação, sem ação obrigatória) — Molduras amarelas deslocadas das fotos**
- As molduras atrás das fotos (abertura, Barra, Centro) não são linhas acima de título e não constavam dos pedidos. Se a Sabrina voltar a falar em "muito traço" nas fotos, este é o próximo candidato (`.offset-frame`).

## Sem regressões encontradas
Abertura (exceto I1), Provocação, Depoimentos (dois depoimentos reais, carrossel funcionando), Satisfação (99,4% visível ao cliente e aviso só na revisão), Empresas (carrossel com Fairmont) e rodapé seguem como antes. O WhatsApp continua desligado por dado (`whatsAppEnabled: false`), e o ícone ao lado do telefone agora é de telefone, coerente com o `tel:`.
