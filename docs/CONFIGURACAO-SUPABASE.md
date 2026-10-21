# Configuração do Supabase — personalização por executivo

> Versão de 2026-10-10. Nenhum projeto Supabase real foi criado ou conectado nesta etapa: o código e o banco foram testados com Supabase simulado (ver `qa/RELATORIO.md`). Todos os valores entre `<...>` precisam ser preenchidos por quem administra a conta da CRED. `<domínio>` = endereço público da apresentação, sem barra no final (ex. `https://apresentacao.credmhs.com.br`).

O que este passo a passo entrega:

- **Apresentação pública** `/?executivo=<slug>` sem login. Sem parâmetro, mostra o perfil padrão (Sabrina Ferreira). Identificador inexistente mostra "Não encontramos esta apresentação" (nunca outro executivo). Sem Supabase configurado, o site continua funcionando só com o perfil local de Sabrina.
- **Painel** `/painel/`: cada executivo entra com e-mail e senha e edita só o próprio nome, cargo, contatos e foto.
- Ninguém se cadastra sozinho: o administrador convida cada executivo.

Arquivos envolvidos: `supabase/migrations/*.sql`, `supabase/snippets/*.sql`, `.env.example`, `vercel.json`, `public/_redirects`. Detalhes técnicos e testes: `supabase/README.md`.

---

## 1. Criar o projeto

1. Acesse <https://supabase.com/dashboard> com a conta da CRED → **New project**.
2. **Organization**: a da CRED. **Project name**: ex. `cred-mhs-apresentacao`.
3. **Database Password**: gere uma senha forte e guarde no cofre de senhas da empresa (não vai para o site).
4. **Region**: `South America (São Paulo)` — `sa-east-1`.
5. **Create new project** e aguarde o provisionamento.

## 2. Autenticação

### 2.1 Desligar cadastro público

**Authentication → Sign In / Providers**

| Campo | Valor |
| --- | --- |
| **User Signups → Allow new users to sign up** | **Desligado** |
| **Email** (provider) | **Ligado** |
| **Email → Confirm email** | **Ligado** |
| Demais providers (Google, etc.) | Desligados |

Com o cadastro desligado, só entram usuários convidados ou criados pelo administrador.

### 2.2 URLs

**Authentication → URL Configuration**

| Campo | Valor |
| --- | --- |
| **Site URL** | `https://<domínio>` (sem barra e sem `/painel/` — os modelos de e-mail da seção 2.4 acrescentam `/painel/`) |
| **Redirect URLs** (adicionar cada uma) | `http://localhost:5173/painel/` · `http://localhost:4173/painel/` · `https://<domínio>/painel/` |

Se houver domínio de prévia (ex. `https://<projeto>.vercel.app`), adicione também `https://<projeto>.vercel.app/painel/` em Redirect URLs. Para testar convites a partir do ambiente local, troque temporariamente o Site URL por `http://localhost:5173`.

### 2.3 Envio de e-mail (SMTP)

O SMTP embutido do Supabase é só para testes: tem limite baixo de envios e só entrega para endereços da equipe do projeto. Para convidar executivos reais:

**Authentication → Emails → SMTP Settings → Enable Custom SMTP** — preencher host, porta, usuário, senha e remetente do provedor de e-mail da CRED (ex. `nao-responda@<domínio da CRED>`). Pendente: definir o provedor.

### 2.4 Modelos de e-mail

**Authentication → Emails → Templates**. Use os links abaixo **exatamente** como estão (formato `token_hash`). Eles funcionam mesmo que o executivo abra o e-mail em outro navegador ou no celular. O painel também aceita o link padrão `{{ .ConfirmationURL }}` (convite pelo dashboard), mas a redefinição de senha com o link padrão só funciona no mesmo navegador em que foi pedida.

**Invite user**

- Assunto: `Seu acesso ao painel da apresentação CRED MHS`
- Corpo (sugestão):

  ```html
  <p>Olá,</p>
  <p>Você foi convidado(a) para editar seu perfil na apresentação comercial da CRED MHS.</p>
  <p><a href="{{ .SiteURL }}/painel/?token_hash={{ .TokenHash }}&type=invite">Definir minha senha e entrar no painel</a></p>
  <p>Se você não esperava este convite, ignore este e-mail.</p>
  ```

**Reset password**

- Assunto: `Redefinir sua senha — painel CRED MHS`
- Corpo (sugestão):

  ```html
  <p>Recebemos um pedido para redefinir a senha do seu acesso ao painel.</p>
  <p><a href="{{ .SiteURL }}/painel/?token_hash={{ .TokenHash }}&type=recovery">Criar uma nova senha</a></p>
  <p>Se não foi você, ignore este e-mail; sua senha atual continua valendo.</p>
  ```

**Confirm signup** e **Magic Link** não são usados (cadastro desligado), mas podem ser traduzidos.

## 3. Aplicar as migrations

Aplique **uma vez**, **nesta ordem**:

1. `supabase/migrations/20261010120000_executives.sql`
2. `supabase/migrations/20261010120100_executive_photos_storage.sql`
3. `supabase/migrations/20261010120200_seed_sabrina.sql`

### Opção A — SQL Editor (sem instalar nada)

**SQL Editor → New query** → colar o conteúdo inteiro do arquivo 1 → **Run** → confirmar "Success. No rows returned". Repetir com os arquivos 2 e 3, cada um numa consulta.

Se o arquivo 1 falhar no meio, a tabela pode ter ficado parcial: rode `drop table if exists public.executives cascade; drop function if exists public.get_public_executive(text);` e cole de novo. (O arquivo 3 pode ser repetido sem efeito.)

### Opção B — Supabase CLI

Na pasta do projeto:

```bash
npx supabase login
npx supabase init            # só se ainda não existir supabase/config.toml; responda "N" às perguntas de editor
npx supabase link --project-ref <REF_DO_PROJETO>   # o ref aparece na URL do dashboard
npx supabase db push         # aplica as migrations pendentes, na ordem
```

### Conferir

**Table Editor → executives**: uma linha `sabrina-ferreira`, `is_default = true`, `is_active = true`, `user_id` vazio. O cadeado "RLS enabled" deve aparecer.

**SQL Editor**:

```sql
select * from public.get_public_executive();                    -- 1 linha: Sabrina
select * from public.get_public_executive('nao-existe');        -- 0 linhas
```

## 4. Storage

O bucket é criado pela migration 2. Confira em **Storage → executive-photos**:

| Configuração (**Edit bucket**) | Valor esperado |
| --- | --- |
| **Public bucket** | Ligado |
| **Restrict file upload size** | Ligado, **2 MB** |
| **Allowed MIME types** | `image/webp, image/jpeg` |

Em **Storage → Policies** (bucket `executive-photos`) devem aparecer quatro policies para `authenticated`: `executive_photos_insert_own`, `executive_photos_select_own`, `executive_photos_update_own`, `executive_photos_delete_own`. Não crie policy para `anon`: a leitura pública acontece pela URL pública do bucket.

As fotos ficam em `executive-photos/<id do usuário>/<arquivo>`. O painel otimiza a imagem no navegador antes de enviar.

## 5. Criar os executivos

### 5.1 Sabrina (perfil já existe pela migration 3)

1. **Authentication → Users → Add user → Send invitation** (ou "Invite user"): e-mail de login de Sabrina — `<EMAIL_DE_LOGIN_SABRINA>` (confirmar com a CRED; pode ser `sabrina.ferreira@credmhs.com.br`).
   - Alternativa sem e-mail: **Add user → Create new user**, e-mail + senha provisória, marcar **Auto Confirm User**. Envie a senha por canal seguro e peça para trocar em "Esqueci minha senha".
2. **SQL Editor**: abrir `supabase/snippets/vincular-executivo.sql`, trocar `<EMAIL_DE_LOGIN>` e `<SLUG>` (`sabrina-ferreira`) e executar. O `update` deve afetar 1 linha.

### 5.2 Outros executivos (ex. `catarina`)

1. **SQL Editor**: `supabase/snippets/criar-executivo.sql` com os dados **confirmados pela CRED** (não preencher por suposição). O slug vira o link `/?executivo=<slug>` e não pode ser trocado depois.
2. **Authentication → Users → Invite user** com o e-mail de login.
3. **SQL Editor**: `supabase/snippets/vincular-executivo.sql`.

### 5.3 Administração

| Tarefa | Como |
| --- | --- |
| Desativar/reativar perfil | `supabase/snippets/desativar-executivo.sql` |
| Trocar perfil padrão | `supabase/snippets/trocar-perfil-padrao.sql` |
| LinkedIn / site | `update public.executives set linkedin_url = 'https://...' where slug = '<slug>';` (só https) |
| Bloquear login | **Authentication → Users → (usuário) → Ban user** |
| Renomear slug | Evitar (quebra links). Procedimento consciente em `supabase/README.md`. |

## 6. Variáveis de ambiente

Valores em **Project Settings → API Keys** (chave) e **Project Settings → Data API** (Project URL) — ou no botão **Connect** do topo do dashboard.

| Variável | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL, ex. `https://<REF_DO_PROJETO>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave **pública**: `anon` (legada) ou **publishable** (`sb_publishable_...`) |
| `VITE_PUBLIC_SITE_URL` | Opcional. Domínio público usado em "Copiar meu link", ex. `https://<domínio>` |

**Nunca** use a `service_role` nem chaves `sb_secret_...`: tudo que começa com `VITE_` vai para o navegador. O frontend recusa essas chaves, mas não as cole.

### Local

```bash
cp .env.example .env.local    # .env.local é ignorado pelo Git
# preencher as variáveis
npm run dev                   # http://localhost:5173/ e http://localhost:5173/painel/
```

### Hospedagem

- **Vercel**: **Project → Settings → Environment Variables** → adicionar as três variáveis para *Production* (e *Preview*, se usar) → **Deployments → … → Redeploy**. As variáveis `VITE_*` entram no build: sem novo build, nada muda.
- **Netlify**: **Site configuration → Environment variables → Add a variable** → **Deploys → Trigger deploy → Clear cache and deploy site**.

### Reescritas do `/painel`

Já configuradas: `vercel.json` (Vercel) e `public/_redirects` (Netlify) fazem `/painel` e `/painel/*` servirem `painel/index.html`. Em outra hospedagem, criar regra equivalente.

## 7. Painel e fluxo de convite

- **Convite**: o link do e-mail abre `/painel/` na tela "Defina sua senha" (mínimo 8 caracteres, com confirmação). Depois de salvar, o executivo entra direto no editor. Link vencido ou já usado mostra "link expirado": o administrador reenvia o convite (**Authentication → Users → (usuário) → Send invitation** / **Send password recovery**).
- **Esqueci minha senha**: pede o e-mail de acesso e responde sempre com mensagem neutra (não revela se a conta existe). O link do e-mail abre "Defina sua senha" em `/painel/`.
- **Conta sem perfil**: se o login funcionar mas `user_id` não estiver vinculado, o painel mostra "Sua conta ainda não está vinculada a um perfil" — rodar `vincular-executivo.sql`.
- **Edição**: nome completo, nome de apresentação (o que aparece em "Olá, eu sou …"), cargo, e-mail de contato (pode ser diferente do e-mail de login) e um único campo de telefone que gera o número exibido e o número discado (+55 automático para números brasileiros). Prévia ao vivo da abertura e do contato. Aviso ao sair com alterações não salvas.
- **Foto**: JPEG, PNG ou WebP de até 15 MB. O navegador corrige a orientação, remove metadados (inclusive localização), reduz para no máximo 1400 px no maior lado e converte para WebP (JPEG no Safari), sempre abaixo de 2 MB. Nada é enviado antes de **Salvar**; a foto anterior é apagada depois que a nova é gravada.
- Slug, LinkedIn, site, perfil padrão e ativação ficam com o administrador.
- **Copiar meu link de apresentação** copia `https://<domínio>/?executivo=<slug>` (ou `VITE_PUBLIC_SITE_URL`). O link contém só o identificador do executivo, nunca dados de clientes.
- **Sair** encerra a sessão neste navegador.

### Sessão do cliente na apresentação

Empresa, prioridades, assuntos e pauta ficam só no `sessionStorage` da aba do navegador. Nada disso vai para o Supabase nem para a URL. **Nova apresentação** (no topo da página) limpa esses dados e mantém o executivo. Abrir o link de outro executivo na mesma aba também começa uma sessão limpa.
- No painel, o executivo edita nome, nome de apresentação, cargo, e-mail de contato, telefones e foto. Slug, LinkedIn, site, perfil padrão e ativação ficam com o administrador.
- O link pessoal mostrado no painel é `https://<domínio>/?executivo=<slug>`. Ele contém só o identificador do executivo.

## 8. Checklist de verificação (no projeto real)

- [ ] **Allow new users to sign up** desligado; tentar cadastro pela API retorna erro.
- [ ] Site URL e as três Redirect URLs salvas.
- [ ] SMTP próprio configurado e convite recebido na caixa de entrada (não só no spam).
- [ ] As três migrations aplicadas; `get_public_executive()` devolve Sabrina.
- [ ] Bucket `executive-photos` público, 2 MB, `image/webp, image/jpeg`; quatro policies.
- [ ] Sabrina convidada, vinculada, consegue definir senha e entrar em `/painel/`.
- [ ] No painel, Sabrina altera um campo e a mudança aparece em `/?executivo=sabrina-ferreira` (recarregar).
- [ ] Upload de foto WebP/JPEG funciona; arquivo maior que 2 MB ou PNG direto no Storage é recusado.
- [ ] Um segundo executivo de teste não vê nem altera o perfil de Sabrina.
- [ ] `/?executivo=nao-existe` e um perfil desativado mostram o estado previsto na apresentação.
- [ ] Sem login (aba anônima), uma chamada REST a `/rest/v1/executives` retorna lista vazia ou erro de permissão.
- [ ] Variáveis no Vercel/Netlify e redeploy feito; `/painel/` abre direto pela URL (reescrita).
- [ ] Testes locais: `npm run test:rls` passa.

## 9. Solução de problemas

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| `/?executivo=<slug>` mostra "Não encontramos esta apresentação" | Variáveis `VITE_*` vazias no build (sem elas só Sabrina existe) ou slug não cadastrado | Conferir variáveis e fazer redeploy; conferir a linha em **Table Editor** |
| "Esta apresentação não está disponível no momento" | `is_active = false` | Reativar com `desativar-executivo.sql` (bloco de reativação) |
| "Não foi possível carregar a apresentação" | Projeto pausado (plano gratuito pausa após inatividade), URL errada ou rede | Retomar o projeto no dashboard; conferir `VITE_SUPABASE_URL` |
| Painel mostra "Painel ainda não configurado" | Variáveis ausentes no build, ou chave secreta colada (recusada) | Preencher `VITE_SUPABASE_URL` e a chave **anon/publishable** e refazer o build |
| Convite não chega | SMTP embutido (só equipe do projeto, poucos envios/hora) | Configurar SMTP próprio (2.3) |
| Link do convite abre a página inicial, não o painel | Modelo de e-mail sem `/painel/` | Conferir os modelos (2.4) e reenviar o convite |
| Link abre `/painel/painel/` | Site URL cadastrado com `/painel/` | Site URL deve ser só `https://<domínio>` (2.2) |
| "redirect_to não permitido" / volta para o Site URL | Endereço ausente em Redirect URLs | Adicionar a URL exata, com `/painel/` |
| Executivo entra, mas o painel diz que não há perfil | `user_id` não vinculado | Rodar `vincular-executivo.sql` |
| `duplicate key value violates unique constraint "executives_user_id_key"` | Conta já vinculada a outro perfil | Desvincular o outro perfil antes |
| `duplicate key ... "executives_single_default"` | Tentativa de dois perfis padrão | Usar `trocar-perfil-padrao.sql` |
| `O slug do executivo é imutável` | Tentativa de mudar slug | Esperado. Ver `supabase/README.md` se for mesmo necessário |
| `violates check constraint "executives_..."` | Valor fora do formato (telefone E.164, e-mail, tamanho, https) | Corrigir o valor; regras em `src/lib/supabase/types.ts` |
| Upload da foto falha com 403 | Caminho fora de `<id do usuário>/` ou usuário sem sessão | Sair e entrar de novo; conferir policies (4) |
| Upload falha com 413/415 | Arquivo > 2 MB ou tipo não aceito | Esperado; o painel deveria otimizar antes — reportar |
| `/painel/` dá 404 na hospedagem | Reescrita ausente | Conferir `vercel.json` / `public/_redirects` |
| `must be owner of table objects` ao aplicar a migration 2 | Projeto antigo com permissões diferentes em `storage` | Criar as policies pela tela **Storage → Policies** com as mesmas expressões do arquivo |
