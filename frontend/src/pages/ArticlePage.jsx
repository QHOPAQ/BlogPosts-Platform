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

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const [error, setError] = useState("");
  const [busyDelete, setBusyDelete] = useState(false);
  const [busyComment, setBusyComment] = useState(false);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await api.getArticle(id);
      setArticle(data);
    } catch (e) {
      setError(e?.message || "Не удалось загрузить статью");
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function onDelete() {
    if (!confirm("Удалить эту статью?")) return;

    setError("");
    try {
      setBusyDelete(true);
      await api.deleteArticle(id);
      navigate("/articles");
    } catch (e) {
      setError(e?.message || "Не удалось удалить статью");
    } finally {
      setBusyDelete(false);
    }
  }

  async function onAddComment(e) {
    e.preventDefault();
    setError("");

    try {
      setBusyComment(true);
      await api.addComment(id, {
        author_name: commentAuthor,
        content: commentContent,
      });
      setCommentAuthor("");
      setCommentContent("");
      await load();
    } catch (e) {
      setError(e?.message || "Не удалось добавить комментарий");
    } finally {
      setBusyComment(false);
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

  if (!article) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>Статья не найдена.</p>
          <Link className="create-btn" to="/articles">
            Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <div className="page-title">{article.title}</div>
          <div className="article-meta">
            <span>{formatDate(article.created_at)}</span>
            <span>#{article.id}</span>
          </div>
        </div>

        <div className="row">
          <Link className="btn btn-secondary" to="/articles">
            ← Список
          </Link>
          <Link className="btn" to={`/articles/${id}/edit`}>
            Редактировать
          </Link>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onDelete}
            disabled={busyDelete}
            style={{ background: "var(--danger)" }}
          >
            {busyDelete ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>

      <div className="card">
        {error && <div className="error">{error}</div>}
        <div className="article-content" style={{ whiteSpace: "pre-wrap" }}>
          {article.content}
        </div>
      </div>

      <div className="section-title">Комментарии</div>

      {(article.comments || []).length === 0 ? (
        <div className="empty-state">
          <p>Пока нет комментариев.</p>
        </div>
      ) : (
        <div>
          {article.comments.map((c) => (
            <div className="comment" key={c.id}>
              <div className="comment-name">{c.author_name}</div>
              <div className="comment-meta">{formatDate(c.created_at)}</div>
              <div className="comment-text" style={{ whiteSpace: "pre-wrap" }}>
                {c.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="spacer-24" />

      <div className="card">
        <div className="form-title">Добавить комментарий</div>

        <form className="form" onSubmit={onAddComment}>
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input
              className="input"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder="Ваше имя"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Комментарий</label>
            <textarea
              className="textarea"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Напишите комментарий"
              required
            />
          </div>

          <div className="row">
            <button className="btn" type="submit" disabled={busyComment}>
              {busyComment ? "Отправка..." : "Отправить"}
            </button>
            <span className="note">Комментарий появится сразу после отправки.</span>
          </div>
        </form>
      </div>
    </div>
  );
}