import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mockArticles from "../data/mockArticles";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect simulates an API call (lifecycle: runs once on mount)
  useEffect(() => {
    // Later: replace this with axios.get("/api/articles")
    const timer = setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 500); // simulate network delay

    return () => clearTimeout(timer); // cleanup on unmount
  }, []); // empty dependency array = runs only once

  // Conditional Rendering
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Latest Tech News</h2>

      <div className="row">
        {/* Lists and Keys */}
        {articles.map((article) => (
          <div className="col-md-4 mb-4" key={article.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={article.coverImage}
                className="card-img-top"
                alt={article.title}
              />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-secondary mb-2" style={{ width: "fit-content" }}>
                  {article.category}
                </span>
                <h5 className="card-title">{article.title}</h5>
                <p className="card-text text-muted">{article.summary}</p>
                <Link
                  to={`/article/${article.slug}`}
                  className="btn btn-primary mt-auto"
                >
                  Read More
                </Link>
              </div>
              <div className="card-footer text-muted small">
                By {article.author} • {article.views} views
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;