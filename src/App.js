import "./App.css";
import Layout from "./Components/Layout";
import SinglePostPage from "./Redux/Features/Posts/SinglePostPage";
import AddPostForm from "./Redux/Features/Posts/addPostForm";
import PostList from "./Redux/Features/Posts/postList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
