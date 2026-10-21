-- =============================================================================
-- Desativar (ou reativar) um executivo.
-- Inativo: /?executivo=<SLUG> mostra o perfil como indisponível; a RPC pública
-- devolve available=false sem nenhum dado de contato. A linha e o login continuam
-- existindo (o executivo ainda entra no painel).
--
-- Atenção: se o perfil desativado for o padrão (is_default), a página sem
-- ?executivo= também ficará indisponível. Troque o padrão antes
-- (supabase/snippets/trocar-perfil-padrao.sql).
-- =============================================================================

update public.executives
set is_active = false
where slug = '<SLUG>';

-- Reativar:
-- update public.executives set is_active = true where slug = '<SLUG>';

-- Para também impedir o login: Authentication → Users → (usuário) → Ban user / Delete user.
-- Excluir o usuário não apaga o perfil: user_id vira null (on delete set null).
-- As fotos em executive-photos/<user_id>/ ficam no Storage até serem removidas
-- manualmente em Storage → executive-photos.
