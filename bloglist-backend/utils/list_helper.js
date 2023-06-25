const _ = require('lodash');
const { info } = require('./logger');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

const favoriteBlog = (blogs) => {
  const likesArray = blogs.map((b) => b.likes);
  const maxIndex = likesArray.indexOf(Math.max(...likesArray));
  return blogs[0] ? blogs[maxIndex] : [];
};

const mostBlogs = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const blogAuthors = Object.keys(grouped);
  const blogsCount = Object.values(grouped).map((g) => g.length);
  const ind = blogsCount.indexOf(Math.max(...blogsCount));
  return blogs[0] ? { author: blogAuthors[ind], blogs: blogsCount[ind] } : [];
};

const mostLikes = (blogs) => {
  const grouped = _.groupBy(blogs, 'author');
  const blogAuthors = Object.keys(grouped);
  const likesCount = Object.values(grouped).map((g) =>
    g.reduce((sum, item) => sum + item.likes, 0)
  );
  const ind = likesCount.indexOf(Math.max(...likesCount));
  return blogs[0] ? { author: blogAuthors[ind], likes: likesCount[ind] } : [];
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
