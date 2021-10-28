/* eslint-disable no-undef */
/// <reference types="cypress" />
describe('Should render app', () => {
  const user = {
    name: 'user tester',
    email: 'user@gmail.com',
    phone: '050542313'
  }

  beforeEach(() => {
    cy.visit('localhost:3000').wait(500)

    cy.get('#addUserNameField').type(`${user.name}{enter}`)
    cy.get('#addUserEmailField').type(`${user.email}{enter}`)
    cy.get('#addUserPhoneField').type(`${user.phone}{enter}`)
    cy.get('#addNewUserBtn').should('have.length', 1)
    cy.get('.userTable tr').should('have.length', 22)
  })

  it('displays 20 random users', () => {
    cy.get('.userTable tr').should('have.length', 22)
  })
  
  it('can edit user', () => {
    cy.get('.editIcon').first().click();
    cy.get('.editUserName').first().clear().type(user.name);
    cy.get('.editUserEmail').first().clear().type(user.email);
    cy.get('.editUserPhone').first().clear().type(user.phone);
    cy.get('.save').first().click();


    cy.get('.userTable').should('contain', user.name);
    cy.get('.userTable').should('contain', user.email);
    cy.get('.userTable').should('contain', user.phone);

  });

  it('can delete user', () => {
    cy.get('.userTable').should('contain', user.name);
    cy.get('.userTable').should('contain', user.email);
    cy.get('.userTable').should('contain', user.phone);

    cy.get('#deleteIcon').first().click();
    cy.get('.userTable').should('not.contain', user.name);
    cy.get('.userTable').should('not.contain', user.email);
    cy.get('.userTable').should('not.contain', user.phone);
  });


})
