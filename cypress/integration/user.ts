import { en } from '../en';

const testUser = 'testUser';
const sendToUser = 'sendToUser';

const sessionUserName = testUser + Date.now();
const sendToUserName = sendToUser + Date.now();

describe('user', () => {
  it('add works', () => {
    cy.visit('/');
    cy.getByTitle(en.USER_CREATE_NAME_LABEL).click();
    cy.getByPlaceholderText(en.USER_CREATE_NAME_LABEL).type(
      `${sessionUserName}{enter}`
    );
    cy.getByText(content => content.startsWith(testUser));
    cy.getByText(en.TRANSACTION_EMPTY_STATE);
    cy.getByTitle(en.BALANCE_TITLE).contains('€0.00');

    cy.getByText('+€1.00').click();
    cy.getByTitle(en.BALANCE_TITLE).contains('+€1.00');
  });
});
