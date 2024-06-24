import React from "react";
import PostAuthor from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

export const PostExcerpt = ({ post }) => {
  return (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeAgo timeStamp={post.date} />
        <ReactionButtons post={post} />
      </p>
    </article>
  );
};
