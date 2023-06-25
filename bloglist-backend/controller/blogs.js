const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', 'username name id');
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  if (request.params.id.length !== 24) {
    return response.status(400).json({ error: 'invalid id' }).end();
  }
  const blog = await Blog.findById(request.params.id).populate(
    'user',
    'username name id'
  );
  blog ? response.json(blog) : response.status(404).end();
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, url, likes, author } = request.body;

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });

  if (!(blog.title && blog.author && blog.url)) {
    return response
      .status(400)
      .json({ error: 'title, author, and url are required' })
      .end();
  }
  if (!blog.likes) {
    blog.likes = 0;
  }
  await blog.populate('user', 'username name id');
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id;
  const blog = await Blog.findById(id);
  const userId = request.user._id.toString();

  if (blog.user.toString() === userId) {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  }
  //most also delete blogid from user.blogs
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = { title, author, url, likes };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
