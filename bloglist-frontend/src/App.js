import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem('loggedinBlogUser');
    const loggedUserBlogs = window.localStorage.getItem('userBlogs');

    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      setBlogs(JSON.parse(loggedUserBlogs));
    }
  }, []);

  const messageHandler = (message, type) => {
    setMessage({ message, type });
    setTimeout(() => {
      setMessage();
    }, 20000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedinBlogUser', JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);

      const blogList = blogs.sort((a, b) => b.likes - a.likes);
      const filtered = blogList.filter(
        (blog) => blog.user.username === username
      );
      // Set the filtered blogs in the local storage
      window.localStorage.setItem('userBlogs', JSON.stringify(filtered));
      // Display the filtered blogs
      setBlogs(filtered);

      setUsername('');
      setPassword('');
      messageHandler(`Dear ${user.name}, Welcome!`, 'success');
    } catch (exception) {
      messageHandler('Wrong Credentials', 'error');
    }
  };

  const handleLogout = async () => {
    window.localStorage.clear();
    setUser(null);
    messageHandler(`User logged out.`, 'success');
  };

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      const newBlog = await blogService.create(blogObject);
      // setBlogs(blogs.concat(newBlog));
      const blogs = await blogService.getAll();
      setBlogs(blogs);
      messageHandler(
        `A new blog titled ${newBlog.title} by ${newBlog.author} added`,
        'success'
      );
    } catch (exception) {
      messageHandler('Posting new blog failed.', 'error');
    }
  };

  // Add likes
  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, blog);
      const blogs = await blogService.getAll();
      setBlogs(blogs.sort((a, b) => b.likes - a.likes));
      messageHandler(
        `blog titled ${blog.title} by ${blog.author} liked`,
        'success'
      );
    } catch (err) {
      console.log(err);
      messageHandler(
        `Liking blog titled ${blog.title} by ${blog.author} failed.`,
        'error'
      );
    }
  };

  // Delete a blog
  const deleteBlog = async (id, blog) => {
    try {
      if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
        await blogService.deleteBlog(id);
        const response = await blogService.getAll();
        setBlogs(response);
        messageHandler(
          `blog titled ${blog.title} by ${blog.author} deleted`,
          'success'
        );
      }
    } catch (err) {
      console.log(err);
      messageHandler(
        `Deleting blog titled ${blog.title} by ${blog.author} failed.`,
        'error'
      );
    }
  };
  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      {!user && (
        <div>
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            onChangeUsername={({ target }) => setUsername(target.value)}
            onChangePassword={({ target }) => setPassword(target.value)}
          />
        </div>
      )}
      {user && (
        <div>
          <p>
            {`${user.name} logged in `}
            <button onClick={handleLogout}>Logout</button>
          </p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              {...{ blog, deleteBlog, updateBlog, username: user.username }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
