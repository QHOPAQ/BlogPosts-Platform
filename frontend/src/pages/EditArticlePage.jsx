import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function EditArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        const article = await api.getArticle(id);
        if (!active) return;

        setTitle(article?.title || "");
        setContent(article?.content || "");
      } catch (e) {
        if (!active) return;
        setError(e?.message || "Не удалось загрузить статью");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await api.updateArticle(id, { title, content });
      navigate(`/articles/${id}`);
    } catch (e) {
      setError(e?.message || "Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Загрузка…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <div className="page-title">Редактирование</div>
          <div className="note">Статья #{id}</div>
        </div>

        <div className="row">
          <Link className="link" to={`/articles/${id}`}>
            ← Назад
          </Link>
        </div>
      </div>

      <div className="card">
        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Заголовок</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите заголовок"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Текст</label>
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите текст статьи"
              required
            />
          </div>

          <div className="row">
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <span className="note">
              Последнее обновление будет видно после сохранения.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}