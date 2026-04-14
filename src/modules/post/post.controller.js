import * as postService from "./post.service.js";
import * as commentService from "./comment.service.js";


export const allPost = async (req, res) => {
    try {
        const posts = await postService.displayAllPost();
        res.json(posts); // PostgreSQL
    } catch (err) { 
        next(err); 
    }
}

export const specificPost = async (req, res) => {
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

        res.render('post.ejs', { posts, comments });

    } catch (err) {
        next(err);
    }
};

// export const createPost = async (req, res) => {
//   try {
//     const { post_title, post_content } = req.body;
//     const createPost = await postService.createPost(post_title, post_content, req.user.userId);

//     res.redirect(`/post/${post.post_id}`, { createPost });

//   } catch (err) {
//     next(err);
//   }
// };

// export const editPostForm = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const posts = await postService.displayPost(postId);

//     // If it return an empty array when SELECT with the post_id, throw error:
//     if (!posts) {
//       const err = new Error("Post not found");
//       err.status = 404;
//       return next(err);
//     }

//     res.render('edit-post.ejs', { posts });

//   } catch (err) {
//     next(err);
//   }
// };

// export const updatePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const { post_title, post_content } = req.body;
//     const posts = await postService.updatedPost(postId,post_title, post_content);

//     res.redirect(`/post/${postId}`, { posts });

//   } catch (err) {
//     next(err);
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const posts = await postService.confirmDeletePost(postId);

//     res.redirect("/home");

//   } catch (err) {
//     next(err);
//   }
// };