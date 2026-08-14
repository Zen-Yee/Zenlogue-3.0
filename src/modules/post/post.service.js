import db from "../../config/pool.js";

export const displayAllPosts = async () => {

  const query = `
    SELECT * FROM public.posts;
  `;

  const result = await db.query(query);

  return result.rows;

};

export const displayPost = async (postId) => {

    const query = `
      SELECT * FROM public.posts
      WHERE post_id = $1
    `;

    const result = await db.query(query, [postId]);

  return result.rows[0];
};

export const createPost = async (post_title, post_content, user_id) => {

  const query = `
    INSERT INTO public.post (title, content, author_id)
      VALUES ($1,$2,$3)
      RETURNING *;
  `;

   const result = await db.query(query, [post_title, post_content, user_id]);
  return result.rows[0];
};

export const updatePost = async (postId, post_title, post_content) => {

  const query = `
    UPDATE public.post 
      SET title = $1, content = $2)
      WHERE post_id = $3
      RETURNING *;
  `;

   const result = await db.query(query, [post_title, post_content, postId]);
  return result.rows[0];
};

// export const confirmDeletePost = async (postId) => {

//   const query = `
//     DELETE FROM public.post
//       WHERE post_id = $1;
//   `;

//   await db.query(query, [postId]);
//   return result.rows[0];
// };