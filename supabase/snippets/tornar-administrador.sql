-- =============================================================================
-- Dar (ou tirar) acesso à aba "Equipe" do painel.
-- Rodar no SQL Editor do Supabase DEPOIS que a pessoa já tiver conta de login
-- (convite aceito ou usuário criado em Authentication → Users).
--
-- Quem é administrador cadastra vendedoras, reenvia convites e desativa perfis
-- pelo próprio painel. Basta fazer isto UMA vez para a primeira pessoa da CRED.
--
-- Substitua <EMAIL_DE_LOGIN> pelo e-mail com que a pessoa entra no painel.
-- =============================================================================

insert into public.panel_admins (user_id)
select id from auth.users where lower(email) = lower('<EMAIL_DE_LOGIN>')
on conflict (user_id) do nothing;

-- Conferir (deve listar o e-mail):
select u.email, a.created_at
from public.panel_admins a
join auth.users u on u.id = a.user_id
order by a.created_at;

-- Para TIRAR o acesso de administração:
-- delete from public.panel_admins
-- where user_id = (select id from auth.users where lower(email) = lower('<EMAIL_DE_LOGIN>'));
