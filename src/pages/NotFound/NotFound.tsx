import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="back-home">Go back home</a>
    </div>
  );
}
