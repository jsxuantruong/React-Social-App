import "./ShowError.css";

export default function ShowError({ err }) {
  if (!err) return "";
  return <span className="mes-err">{err}</span>;
}
