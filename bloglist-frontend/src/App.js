import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedinUserJSON = window.localStorage.getItem('loggedinBlogUser');

    if (loggedinUserJSON) {
      const user = JSON.parse(loggedinUserJSON);
      setUser(user);
      blogService.setToken(user.token);
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
    try {
      const newBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(newBlog));
      messageHandler(
        `A new blog titled ${newBlog.title} by ${newBlog.author} added`,
        'success'
      );
    } catch (exception) {
      messageHandler('Posting new blog failed.', 'error');
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
          <BlogForm createBlog={createBlog} />

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
