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
    console.log('handlelogin');
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedinBlogUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      messageHandler('Wrong Credentials', 'error');
    }
  };
  // const addBlog = (blogObject) => {
  //   console.log(blogObject);
  // };

  const handleLogout = async () => {
    window.localStorage.clear();
    setUser(null);
  };

  return (
    <div>
      <Notification message={message} />
      <h2>blogs</h2>
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          onChangeUsername={({ target }) => setUsername(target.value)}
          onChangePassword={({ target }) => setPassword(target.value)}
        />
      )}
      {/* {user !== null && <BlogForm createBlog={addBlog} />} */}
      {user && (
        <div>
          <p>
            {`${user.name} logged in `}
            <button onClick={handleLogout}>Logout</button>
          </p>

          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
