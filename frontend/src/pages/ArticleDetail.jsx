import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import mockArticles, { mockComments } from "../data/mockArticles";

function ArticleDetail() {
  const { slug } = useParams(); // Dynamic route parameter
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState(""); // Controlled input

  useEffect(() => {
    // Later: replace with axios.get(`/api/articles/${slug}`)
    const found = mockArticles.find((a) => a.slug === slug);
    setArticle(found);

    const relatedComments = mockComments.filter((c) => c.articleSlug === slug);
    setComments(relatedComments);
  }, [slug]); // re-run whenever slug changes

  // Handling Events + Controlled Component
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      articleSlug: slug,
      user: "You",
      text: commentText,
    };

    setComments([...comments, newComment]);
    setCommentText(""); // reset form
  };

  if (!article) {
    return (
      <div className="container mt-5 text-center">
        <h4>Article not found</h4>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">← Back</Link>

      <img
        src={article.coverImage}
        className="img-fluid rounded mb-3"
        alt={article.title}
      />

      <span className="badge bg-secondary mb-2">{article.category}</span>
      <h2>{article.title}</h2>
      <p className="text-muted">
        By {article.author} • {article.views} views
      </p>

      <p className="fs-5">{article.content}</p>

      <div className="mb-3">
        {article.tags.map((tag, index) => (
          <span key={index} className="badge bg-info text-dark me-2">
            #{tag}
          </span>
        ))}
      </div>

      <hr />

      {/* Comments Section */}
      <h4>Comments ({comments.length})</h4>

      <ul className="list-group mb-4">
        {comments.map((comment) => (
          <li className="list-group-item" key={comment.id}>
            <strong>{comment.user}:</strong> {comment.text}
          </li>
        ))}
        {comments.length === 0 && (
          <li className="list-group-item text-muted">No comments yet.</li>
        )}
      </ul>

      {/* Controlled Form */}
      <form onSubmit={handleCommentSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default ArticleDetail;