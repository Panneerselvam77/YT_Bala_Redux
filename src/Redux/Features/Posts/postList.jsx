import React from "react";
import { useSelector } from "react-redux";
import { selectAllPosts, getPostsError, getPostsStatus } from "./postSlice";
import { PostExcerpt } from "./postExcerpt";

export default function PostList() {
  // Selector hooks to get posts state from Redux store
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  /**
   * useEffect - Dispatches fetchPosts action if postStatus is 'idle'.
   * Sets an interval to show alert every 5 seconds unless dismissed.
   */

  // useEffect(() => {
  //   if (postStatus === "idle") {
  //     dispatch(fetchPosts());
  //   }
  // }, [postStatus, dispatch]);

  let content;

  /**
   * handleCloseClick - Handles click events on the close button to dismiss alert permanently.
   */

  if (postStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post, index) => (
      <PostExcerpt key={index} post={post} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div>
      <section>
        <h2>Posts</h2>
        {content}
      </section>
    </div>
  );
}
