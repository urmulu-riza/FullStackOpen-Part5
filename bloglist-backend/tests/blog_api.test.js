const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
let token, id;

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  await User.deleteMany({});
  const passwordHash = bcrypt.hashSync('sifre', 10);
  const user = new User({
    username: 'rizam',
    passwordHash,
  });
  await user.save();
}, 40000);

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);

//Login
describe('HTTP POST /login', () => {
  test('authenticate user', async () => {
    const user = {
      username: 'rizam',
      password: 'sifre',
    };

    const response = await api.post('/api/login').send(user).expect(201);
    token = response.body.token;
  });
});

// GET /blogs
describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 20000);

  test('get all blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 20000);

  test('the blog titles list contains  "REACT patterns"', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain('React patterns');
  }, 20000);

  test('unique identifier property is named id and exists', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].id).toBeDefined();
  });
});

// POST /blogs
describe('HTTP POST request to  /api/blogs', () => {
  test('a valid new blog can be added to DB', async () => {
    const newBlog = {
      title: 'Learn Modern Web Dev - MOOC',
      author: 'Urmulu Riza',
      url: 'https://www.fullstackopen.com',
      likes: 15,
    };

    const response = await api
      .post('/api/login')
      .send({
        username: 'rizam',
        password: 'sifre',
      })
      .expect(201);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain('Learn Modern Web Dev - MOOC');
  }, 20000);

  test("if the likes property doesn't exist, likes defaults to zero", async () => {
    const newBlog = {
      title: 'Learn Modern Web Dev - MOOC',
      author: 'Urmulu Riza',
      url: 'https://www.fullstackopen.com',
    };
    const response = await api
      .post('/api/login')
      .send({
        username: 'rizam',
        password: 'sifre',
      })
      .expect(201);
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const likes = blogsAtEnd.map((r) => r.likes);
    expect(likes[likes.length - 1]).toBe(0);
  });

  test('if the title or url properties are missing from the request data, the backend responds with the status code 400 Bad Request', async () => {
    const newBlog = {
      author: 'Urmulu Riza',
    };
    const response = await api
      .post('/api/login')
      .send({
        username: 'rizam',
        password: 'sifre',
      })
      .expect(201);
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

//GET /api/blogs/:id
describe('HTTP GET /api/blogs/:id', () => {
  test('returns the correct blog', async () => {
    const blogs = await helper.blogsInDb();
    const blog = blogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(resultBlog.body).toEqual(blog);
  });

  test('If blog does not exist, fails with the status code 404 ', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('If id is invalid, fails with the status code 400', async () => {
    const invalidId = 'a422b3a1b54a676234d17f9';
    const response = await api.get(`/api/blogs/${invalidId}`);
    expect(response.statusCode).toEqual(400);
    expect(response.body.error).toContain('invalid id');
  });
});

//Delete
describe('HTTP DELETE /api/blogs/:id', () => {
  test('a blog can be deleted', async () => {
    const newBlog = {
      title: 'blog to delete',
      author: 'Urmulu Riza',
      url: 'https://www.fullstackopen.com/',
      likes: 15,
    };

    const response = await api
      .post('/api/login')
      .send({
        username: 'rizam',
        password: 'sifre',
      })
      .expect(201);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${response.body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain('blog to delete');
  });
});

//PUT
describe('HTTP PUT /api/blogs/:id', () => {
  test('updates the likes', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      ...blogToUpdate,
      likes: 20,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].likes).toBe(20);
  });
});
