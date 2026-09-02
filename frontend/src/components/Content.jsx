import Router from './Router.jsx';

export default function Content() {
  return (
    <div
      className="content"
      style={{
        flexGrow: 1,
        overflow: 'auto',
      }}
    >
      <Router />
    </div>
  );
}
