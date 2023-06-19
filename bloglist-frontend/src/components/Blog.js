import { useState } from 'react';

const Blog = ({ blog, updateBlog, deleteBlog, username }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisible] = useState(false);
  const [userLikes, setUserLikes] = useState(blog.likes);

  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    user: blog.user.id,
    id: blog.id,
    likes: userLikes + 1,
  };

  const addLike = () => {
    setUserLikes(userLikes + 1);
    updateBlog(updatedBlog);
  };
  return (
    <div style={blogStyle}>
      {blog.title} - author: {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <a href={blog.url.includes('//') ? blog.url : `//${blog.url}`}>
            {blog.url}
          </a>
          <div>
            likes {blog.likes} <button onClick={addLike}>Like</button>
          </div>
          {blog.user.username}
          {blog.user.username === username && (
            <button onClick={() => deleteBlog(blog.id, blog)}>Remove</button>
          )}
        </div>
      )}
    </div>
  );
};
export default Blog;
