export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="spinner-text">{text}</p>
    </div>
  );
}

