import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

test('renders title and author by default and not number of likes', async () => {
  const blog = {
    title: "Taş Oğuz İç Oğuz'a Asi Olup Beyrek Vefatı",
    author: 'Anonim',
    likes: 100000000,
    url: 'https://en.wikipedia.org/wiki/Book_of_Dede_Korkut',
    user: {},
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText(
    "Taş Oğuz İç Oğuz'a Asi Olup Beyrek Vefatı - author: Anonim"
  );
  expect(element).toBeDefined();
  const { container } = render(<Blog blog={blog} />);
  const likes = container.querySelector('.likes');
  expect(likes).toEqual(null);
});
