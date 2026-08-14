import * as postService from "./post.service.js";
import * as commentService from "./comment.service.js";

export const allPost = async (req, res, next) => {
  try {
    const posts = await postService.displayAllPosts();
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    next(err);
  }
};

export const onePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const posts = await postService.displayPost(postId);

    // If it return an empty array when SELECT with the post_id, throw error:
    if (!posts) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }

    // fetch all comments for this post
    const comments = await commentService.getCommentsByPost(postId);

    res.status(200).json({
      success: true,
      postData: posts,
      commentsData: comments
    });

  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const newPost = await postService.createPost(title, content, req.user.userId);

    res.status(200).json({
      success: true,
      postData: newPost,
      commentsData: []
    });

  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const updatedPost = await postService.updatePost(postId, title, content);

    // If it return an empty array when SELECT with the post_id, throw error:
    if (!updatedPost) {
      const err = new Error("Post not found");
      err.status = 404;
      return next(err);
    }

    // fetch all comments for this post
    const comments = await commentService.getCommentsByPost(postId);

    res.status(200).json({
      success: true,
      postData: updatedPost,
      commentsData: comments
    });

  } catch (err) {
    next(err);
  }
};

// export const deletePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const posts = await postService.confirmDeletePost(postId);

//     res.redirect("/home");

//   } catch (err) {
//     next(err);
//   }
// };
