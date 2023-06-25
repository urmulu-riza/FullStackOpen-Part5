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
    it('user login fails', function () {
      cy.get('input:first').type('rizaman');
      cy.get('input:last').type('wrong');
      cy.contains('Login').click();
      cy.contains('Wrong Credentials');
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
});

// User logged out.
// Dear rizaman, Welcome!
//
