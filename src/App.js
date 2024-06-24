import "./App.css";
import AddPostForm from "./Redux/Features/Posts/addPostForm";
import PostList from "./Redux/Features/Posts/postList";

function App() {
  return (
    <div className="App">
      <AddPostForm />
      <PostList />
    </div>
  );
}

export default App;
