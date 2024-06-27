import "./App.css";
import Layout from "./Components/Layout";
import EditPostForm from "./Redux/Features/Posts/EditPostForm";
import SinglePostPage from "./Redux/Features/Posts/SinglePostPage";
import AddPostForm from "./Redux/Features/Posts/addPostForm";
import PostList from "./Redux/Features/Posts/postList";
import { Routes, Route, Navigate } from "react-router-dom";
import { UsersList } from "./Redux/Features/User/UsersList";
import { UserPage } from "./Redux/Features/User/UserPage";

function App() {
  return (
    <Routes>
      {/* Route For Home */}
      <Route path="/" element={<Layout />}>
        <Route index element={<PostList />} />
        {/* Route For post */}
        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>

        {/* Route For user */}
        <Route path="user">
          <Route index element={<UsersList />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* Catch all - replace with 404 component if we need */}
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Route>
    </Routes>
  );
}

export default App;
