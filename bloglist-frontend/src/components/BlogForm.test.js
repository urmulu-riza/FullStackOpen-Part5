import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const authorInput = screen.getByPlaceholderText('author');
  const urlInput = screen.getByPlaceholderText('url');
  const TitleInput = screen.getByLabelText('Title:');
  const createButton = screen.getByText('Create');

  await user.type(TitleInput, "Taş Oğuz İç Oğuz'a Asi Olup Beyrek Vefatı");
  await user.type(authorInput, 'Anonim');
  await user.type(
    urlInput,
    'https://en.wikipedia.org/wiki/Book_of_Dede_Korkut'
  );
  await user.click(createButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].title).toBe(
    "Taş Oğuz İç Oğuz'a Asi Olup Beyrek Vefatı"
  );
});
