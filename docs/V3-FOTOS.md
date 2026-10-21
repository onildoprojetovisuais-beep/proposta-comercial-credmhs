# V3 — fotos reais da CRED MHS

Responsável: agente Visual (20/10/2026). Registro técnico em `src/app/mediaManifest.ts`.

## Origem e tratamento

- Originais: `assets/image/WhatsApp Image 2026-10-20 at 09.43.NN.jpeg` (fotos de WhatsApp, JPEG já recomprimido, 1200×1600 retrato ou 1600×1200 paisagem).
- Derivados em `public/media/fotos/<slug>-<largura>.{avif,webp}` + `<slug>-1200.jpg` (fallback), gerados com Python/Pillow (LANCZOS; WebP q78, AVIF q58, JPEG q80 progressivo). Larguras: 800 e 1200 (e 1600 só na paisagem, que tem 1600 de origem). **Nenhuma ampliação** além do original.
- Servidas por `CredPhoto` (`src/components/sections/v3/shared.tsx`): AVIF → WebP → JPEG, `loading="lazy"`, `object-fit: cover` com o ponto de interesse do manifesto.
- Nenhuma foto de banco ou gerada.
- **Cor:** todas as fotos ficam coloridas (ambientes, unidades e executivo), por decisão do Nil na rodada de sobriedade (20/10/2026). Derivados em preto e branco chegaram a ser gerados e foram removidos.
- **Tratamento V3 (sobriedade):** recorte retangular com cantos retos; moldura amarela deslocada nas fotos principais (abertura, quem somos, contato).

## Arquivo → uso → corte → qualidade

| Original | Slug | Unidade (PPT) | Uso na página | Corte / object-position | Qualidade |
|---|---|---|---|---|---|
| 09.43.21 | `barra-fachada` | Barra | Quem somos — foto principal Barra, sangrada à direita | 4:3, `55% 50%` | Boa até ~1200 px de exibição; no desktop ocupa ~50vw (720 px em 1440) |
| 09.43.23 | `barra-consultorio` | Barra | Quem somos — foto de apoio sobreposta | 3:4, `50% 60%` | Boa (exibida ≤ 300 px) |
| 09.43.18 | `centro-porta` | Centro | Quem somos — foto principal Centro, sangrada à esquerda | 1:1 no desktop, 4:5 no celular, `50% 45%` | Aceitável; recorte 1:1 de 1200×1600 usa 1200 px de largura |
| 09.43.17 | `centro-recepcao` | Centro | Quem somos — foto de apoio sobreposta | 3:4, `40% 55%` | Boa (exibida ≤ 300 px) |
| 09.43.27 | `ambiente-espera` | — (sem atribuição) | Transição — ambiente CRED, sem rótulo de unidade | coluna alta (32vw × altura da seção), `55% 50%` | Aceitável; compressão de WhatsApp visível em telas retina |
| 09.43.22 | `barra-fachada-vertical` | Barra (mesma fachada da .21) | Reserva — não usada | — | — |
| 09.43.25 | `ambiente-corredor` | — | Reserva — não usada | — | — |
| 09.43.26 | `ambiente-consultorio` | — | Reserva — não usada | — | — |
| 09.43.20 | — | — | **Não usada**: mostra uma pessoa na recepção; consentimento de imagem não confirmado | — | — |
| 09.43.29, .30 | — | — | Não usadas (sem unidade atribuída, sem função na narrativa atual) | — | — |

Regra: fotos sem unidade atribuída no PPT nunca são rotuladas como Barra ou Centro.

## Originais em maior resolução (pedido à CRED)

As fotos de WhatsApp chegam recomprimidas (artefatos de JPEG em paredes lisas e no vidro). Para telas grandes:

1. **09.43.21 (fachada Barra)** — exibida a ~720 px (1440) e até ~960 px em telas de 1920; em densidade 2× pede ~1900 px de largura. Original da câmera recomendado.
2. **09.43.18 (porta Centro)** — recorte 1:1 a ~780 px em 1440; em 2× pede ~1600 px. Original recomendado.
3. **09.43.27 (sala de espera, Transição)** — coluna de ~460 × 900 px em 1440; em 2× pede ~1800 px de altura (origem: 1600). Original recomendado.
4. As fotos de apoio (09.43.23, 09.43.17) servem bem na escala atual.

Também a confirmar: autorização de uso da 09.43.20 (pessoa identificável), caso se queira usá-la.
