-- =============================================================================
-- Trocar o perfil padrão (usado quando a URL não tem ?executivo=).
-- Só pode existir um is_default = true; o bloco abaixo desliga o atual e liga o
-- novo de uma vez. Se o slug não existir ou estiver inativo, nada muda (erro).
--
-- Substitua <SLUG> pelo slug do novo perfil padrão.
-- =============================================================================

do $$
declare
  v_slug constant text := '<SLUG>';
begin
  if not exists (select 1 from public.executives where slug = v_slug and is_active) then
    raise exception 'Perfil "%" não existe ou está inativo. Nada foi alterado.', v_slug;
  end if;

  update public.executives set is_default = false where is_default and slug <> v_slug;
  update public.executives set is_default = true  where slug = v_slug;
end;
$$;

-- Conferir:
select slug, is_default, is_active from public.executives order by is_default desc, slug;
