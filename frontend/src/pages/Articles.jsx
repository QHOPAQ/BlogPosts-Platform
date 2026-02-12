import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

function excerpt(text, max = 180) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trimEnd() + "…";
}

export default function Articles() {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await api.getArticles();
      setArticles(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Не удалось загрузить статьи");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(id) {
    if (!confirm("Удалить статью?")) return;

    setError("");
    try {
      setBusyId(id);
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => String(a.id) !== String(id)));
    } catch (e) {
      setError(e?.message || "Не удалось удалить статью");
    } finally {
      setBusyId(null);
    }
  }

  const isEmpty = useMemo(
    () => !loading && articles.length === 0,
    [loading, articles]
  );

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">Статьи</div>

        <Link className="create-btn" to="/articles/new">
          + Новая статья
        </Link>
      </div>

      {error && (
        <div className="error" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <p>Загрузка…</p>
        </div>
      )}

      {isEmpty && (
        <div className="empty-state">
          <p>Пока нет статей.</p>
          <Link className="create-btn" to="/articles/new">
            Создать первую
          </Link>
        </div>
      )}

      {!loading &&
        articles.map((a) => (
          <div className="article-card" key={a.id}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="article-title">
                  <Link to={`/articles/${a.id}`}>{a.title}</Link>
                </div>

                <div className="article-meta">
                  <span>{formatDate(a.created_at)}</span>
                  <span>#{a.id}</span>
                </div>
              </div>

              <div className="row">
                <button
                  className="btn"
                  type="button"
                  onClick={() => navigate(`/articles/${a.id}/edit`)}
                >
                  Редактировать
                </button>

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => onDelete(a.id)}
                  disabled={busyId === a.id}
                  style={{ background: "var(--danger)" }}
                >
                  {busyId === a.id ? "..." : "Удалить"}
                </button>
              </div>
            </div>

            <div className="spacer-16" />

            <div className="article-content">
              {excerpt(a.content, 220)}{" "}
              <Link className="link" to={`/articles/${a.id}`}>
                Читать полностью →
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}