import { AuthLayout } from './AuthLayout';
import styles from './Auth.module.css';

/** Sem VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY: explica sem expor detalhes técnicos. */
export function NotConfiguredView() {
  return (
    <AuthLayout
      eyebrow="Painel do executivo"
      title="Painel ainda não configurado"
      lead={<p>O acesso dos executivos ainda não foi ativado neste endereço. A apresentação pública continua funcionando normalmente.</p>}
    >
      <h2 className={styles.sheetTitle}>Para a equipe técnica</h2>
      <p className={styles.sheetText}>
        Siga o passo a passo em <strong>docs/CONFIGURACAO-SUPABASE.md</strong>, no repositório do projeto, e publique de novo o site.
      </p>
      <p className={styles.note}>Se você é executivo da CRED MHS, fale com a administração para receber o seu acesso.</p>
    </AuthLayout>
  );
}
