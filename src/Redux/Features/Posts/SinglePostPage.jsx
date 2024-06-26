import React from "react";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";
import PostAuthor from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link, useParams } from "react-router-dom";

export default function SinglePostPage() {
  const { postId } = useParams();
  const post = useSelector((state) => selectPostById(state, Number(postId)));
  if (!post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }
  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <div className="postCredit">
        <Link to={`post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
        <ReactionButtons post={post} />
      </div>
    </article>
  );
}
