import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function CreateArticlePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      const created = await api.createArticle({ title, content });
      navigate(`/articles/${created.id}`);
    } catch (e) {
      setError(e?.message || "Не удалось создать статью");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">Новая статья</div>

        <div className="row">
          <Link className="btn btn-secondary" to="/articles">
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
              {saving ? "Создание..." : "Создать"}
            </button>
            <span className="note">Без WYSIWYG, как в ТЗ.</span>
          </div>
        </form>
      </div>
    </div>
  );
}