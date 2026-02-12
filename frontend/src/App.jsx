import { Routes, Route, Navigate } from "react-router-dom";

import Articles from "./pages/Articles";
import ArticlePage from "./pages/ArticlePage";
import CreateArticlePage from "./pages/CreateArticlePage";
import EditArticlePage from "./pages/EditArticlePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" replace />} />
      <Route path="/articles" element={<Articles />} />
      <Route path="/articles/new" element={<CreateArticlePage />} />
      <Route path="/articles/:id" element={<ArticlePage />} />
      <Route path="/articles/:id/edit" element={<EditArticlePage />} />
      <Route path="*" element={<Navigate to="/articles" replace />} />
    </Routes>
  );
}