import styles from './Auth.module.css';

/** Estado inicial enquanto a sessão é verificada. */
export function LoadingView({ label }: { label: string }) {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.loadingSun} aria-hidden="true" />
      <p className="t-lead">{label}</p>
    </div>
  );
}
