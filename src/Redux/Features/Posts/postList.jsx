import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllPosts,
  getPostsError,
  getPostsStatus,
  fetchPosts,
} from "./postSlice";
import { PostExcerpt } from "./postExcerpt";

export default function PostList() {
  // Hooks
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  // Selector hooks to get posts state from Redux store
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  /**
   * useEffect - Dispatches fetchPosts action if postStatus is 'idle'.
   * Sets an interval to show alert every 5 seconds unless dismissed.
   */

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
    if (alertDismissed) return;

    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 5000); // 5000 milliseconds = 5 seconds
    // Clean up interval on component unmount or alertDismissed change
    return () => clearTimeout(timer);
  }, [postStatus, dispatch, alertDismissed]);

  let content;

  /**
   * handleOverlayClick - Handles click events on the overlay to dismiss alert.
   * @param {Object} e - The event object
   */
  const handleOverlayClick = (e) => {
    // Dismiss alert if the user clicks outside the alert box
    if (e.target.className === "overlay") {
      setShowAlert(false);
    }
  };

  /**
   * handleCloseClick - Handles click events on the close button to dismiss alert permanently.
   */
  const handleCloseClick = (e) => {
    setShowAlert(false);
    setAlertDismissed(true);
  };

  if (postStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => (
      <PostExcerpt post={post} key={post.id} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <Fragment>
      {showAlert && (
        <div className="overlay" onClick={handleOverlayClick}>
          <div className="alert">
            <h2>Alert</h2>
            <p>The page has been loaded for more than 5 seconds.</p>
            <button onClick={handleCloseClick}>Close</button>
          </div>
        </div>
      )}
      <div>
        <section>
          <h2>Posts</h2>
          {content}
        </section>
      </div>
    </Fragment>
  );
}
