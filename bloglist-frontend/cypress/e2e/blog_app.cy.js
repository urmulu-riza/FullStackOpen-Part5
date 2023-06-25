import { func } from 'prop-types';

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'rizaman',
      username: 'rizaman',
      password: 'rizaman',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });
  it('Login form is shown', function () {
    cy.contains('Login');
  });
  describe('Login', function () {
    it('user logs in successfully', function () {
      cy.get('input:first').type('rizaman');
      cy.get('input:last').type('rizaman');
      cy.contains('Login').click();
      cy.contains('Dear rizaman, Welcome!');
    });
    it('non-user login fails', function () {
      cy.get('input:first').type('rizaman');
      cy.get('input:last').type('wrong');
      cy.contains('Login').click();
      cy.contains('Wrong Credentials');
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'rizaman',
        password: 'rizaman',
      }).then((response) => {
        localStorage.setItem('loggedinBlogUser', JSON.stringify(response.body));
      });
      cy.visit('http://localhost:3000');
    });

    it('A blog can be created', function () {
      cy.contains('Create new blog').click();
      cy.get('#title').type('new blog created with Cypress');
      cy.get('#author').type('Anonim');
      cy.get('#url').type('www.google.com');
      cy.get('#create-btn').click();
      cy.contains('new blog created with Cypress - author: Anonim');
      cy.get('div.success').should(
        'contain',
        'A new blog titled new blog created with Cypress by Anonim added'
      );
    });
    it.only('blog can be liked', function () {
      cy.createBlog({
        title: 'This blog post gets 1 like',
        author: 'Sunal',
        url: 'www.likelikelike.az',
      });
      cy.get('.visiblity-btn').click();
      cy.contains('likes 0');
      cy.get('#like-btn').click();
      cy.contains('likes 1');
    });
  });
});

// User logged out.
// Dear rizaman, Welcome!
//
