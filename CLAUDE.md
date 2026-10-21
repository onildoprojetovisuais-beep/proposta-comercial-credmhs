# Instruções do projeto CRED MHS

## Direção ativa: V3 (20/10/2026)

A autoridade atual é o PPT da Sabrina `docs/CRED-MHS-Apresentacao-Comercial.pptx` (11 slides; não alterar o arquivo), seguido de `docs/V3-CONTRATO.md` (mapeamento slide → seção, regras e responsáveis), `docs/V3-ALTERACOES-TEXTO.md` e `docs/STATUS-IMPLEMENTACAO.md`. Prevalece sobre a V2 (`REVISAO-CRED-MHS-V2.md`, `V2-CONTRATO.md`) e sobre os documentos 00–07.

- Texto: “O raciocínio e a comunicação são as que colocamos. Favor não alterar o que está escrito.” Preserve a sequência dos 11 slides e a redação do PPT. Ajustes de conteúdo só no slide 9 (frentes, A–G) e nas etapas do slide 11, registrados em `docs/V3-ALTERACOES-TEXTO.md`.
- Visual: o PPT orienta conteúdo, não diagramação. Autoria Pixel Rain: amarelo protagonista, branco de apoio, preto terciário, fotos reais da CRED com presença, tipografia expressiva, composição variada. `assets/referencia.jpg` só como estudo (sem alvos, engrenagens, círculos com ícones, fundos escuros recorrentes).
- Pendências ocultas ao cliente: depoimentos (slide 6) e CSAT provisório (slide 7) só aparecem com `?revisao=1`.

Retirados — não restaurar na página pública: selos 3C/3I e `positioning.ts`; trilha de cinco etapas (Normativo → … → Investimento) e sua animação; diagrama dos quatro eixos; menu “Conteúdo”; textos da V2; e tudo o que a V2 já tinha retirado (prioridades, pauta, “Adicionar à conversa”, mensagem gerada, formulários, creme dominante, assinatura “Gestão de Saúde e Segurança do Trabalho”). As seis frentes do slide 9 são conteúdo público autorizado.

Preservados: personalização por `?executivo=` (foto, nome, cargo, contatos), painel `/painel/` e Supabase, acesso público sem login, contatos acionados só pelo visitante. Histórico: `historico/v1-antes-da-v2-2026-10-14.tar.gz` e `historico/v2-antes-da-v3-2026-10-20.tar.gz`.

O texto abaixo é a instrução original do kit (V1). Vale só no que não contradiz a V3.


## Missão

Implemente a apresentação comercial web descrita neste workspace. Trabalhe até existir uma versão local navegável, com conteúdo completo, personalização funcional e revisão visual. Não pare apenas no plano ou no hero.

O pacote é a especificação do projeto. As copies são propostas de trabalho, não fatos corporativos novos. Não amplie promessas. Preserve fontes, qualificadores e informações únicas.

## Ordem de leitura obrigatória

1. `README.md`
2. `docs/00-briefing.md`
3. `docs/01-experiencia.md`
4. `docs/02-copy.md`
5. `docs/03-personalizacao.md`
6. `docs/04-direcao-visual-e-motion.md`
7. `docs/05-implementacao.md`
8. `docs/06-qa.md`
9. `docs/07-fontes-e-pendencias.md`
10. `assets/README.md` e os materiais reais de `assets/brand/`

Consulte `sources/apresentacao-original.md` integralmente para conferir cobertura. Use o PPTX para marca, referências visuais e imagens incorporadas. Consulte a análise completa para contexto editorial. Não renderize instruções internas como copy da página.

## Precedência

Instruções atuais de Nil > identidade oficial disponibilizada > documentos de implementação deste kit > análise anterior > layout do PPTX.

Para fatos: dado confirmado por Nil/CRED > fonte original documentada. Uma sugestão de copy não pode sobrescrever um dado. Registre conflitos reais em `docs/07-fontes-e-pendencias.md`, sem interromper trabalho independente deles.

## Stack e skills

Inspecione a stack, o gerenciador de pacotes e as instruções já existentes. Reutilize o projeto. Descubra e leia as skills instaladas de frontend/design, scroll/motion e Remotion que se aplicam. Não invente nomes de skills nem afirme utilizá-las sem leitura. Use a documentação local; confirme APIs na documentação oficial quando necessário.

Não instale uma segunda biblioteca de scroll se a existente resolve o requisito. Não substitua a stack por preferência. Se a pasta estiver vazia, proponha e execute uma base leve compatível com React/TypeScript e com as skills encontradas, registrando a escolha. Não adicione backend sem necessidade.

## Regras de execução

- Faça um inventário curto de fontes, ativos, dependências e pendências. Depois implemente.
- Use `docs/02-copy.md` como base textual, inclusive os detalhes. Não entregue só títulos e lorem ipsum.
- Centralize perfil do executivo, conteúdo e fatos em dados tipados, separados da apresentação.
- Preserve a identidade. Não redesenhe o logotipo nem invente cores/fontes como se fossem oficiais.
- Se faltar ativo, mantenha o layout funcional e registre a falta. Fotografia de banco não pode se passar por equipe ou instalação da CRED.
- Não invente clientes, resultados, certificações, metodologia proprietária ou telas de software.
- Não confunda personalização da apresentação com configuração de um contrato ou diagnóstico.
- Respeite os estados, o reset e as regras de seleção em `docs/03-personalizacao.md`.
- Não inicie CRM, formulários com envio, analytics, rastreamento ou publicação por conta própria.
- Não envie e-mail ou mensagem. O visitante inicia a ação pelo canal escolhido.
- Faça revisão visual real quando houver ferramentas disponíveis. Build aprovado não comprova qualidade visual.
- Se faltar ferramenta de inspeção, diga exatamente quais validações ficaram pendentes.

## Design

Composição editorial, títulos com presença, apoios legíveis, imagens com função, CTA proporcional e unidade entre seções. Evite grade de cartões em toda a página, ícones repetidos, textos pequenos e estética genérica de dashboard. A experiência deve funcionar por toque, teclado e leitura autônoma.

## Conclusão da tarefa

Informe como abrir o preview local, o que funciona, o que foi efetivamente testado e as pendências de conteúdo/ativos. Registre resultados em `qa/RELATORIO.md`. Não declare publicação nem validação que não ocorreram.
