import React from "react";
import PostAuthor from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";

export const PostExcerpt = ({ post }) => {
  return (
    <div key={post.id}>
      <article>
        <h3>{post.title}</h3>
        <p>{post.body.substring(0, 100)}</p>
        <div className="postCredit">
          <PostAuthor userId={post.userId} />
          <TimeAgo timeStamp={post.date} />
          <ReactionButtons post={post} />
        </div>
      </article>
    </div>
  );
};
