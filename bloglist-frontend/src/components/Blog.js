import { useState } from 'react';

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };
  const [visible, setVisible] = useState(false);
  const addLike = () => {};
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
        </div>
      )}
    </div>
  );
};
export default Blog;
