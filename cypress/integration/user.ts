import { en } from '../en';

const testUser = 'testUser';
const sendToUser = 'sendToUser';
const splitMoneyUser = 'splitMoneyUser';
const editedUser = 'sendToUserEdited';

const sessionUserName = testUser + Date.now();
const sendToUserName = sendToUser + Date.now();
const editedUserName = editedUser + Date.now();
const splitMoneyUserName = splitMoneyUser + Date.now();

const createUser = (name: string) => {
  cy.getByTitle(en.USER_CREATE_NAME_LABEL).click();
  cy.getByPlaceholderText(en.USER_CREATE_NAME_LABEL).type(`${name}{enter}`);
};

describe('user', () => {
  it('basic user flow works', () => {
    cy.visit('/');

    // create user and navigate to detail page on success
    createUser(sessionUserName);
    cy.getByText(content => content.startsWith(testUser));
    cy.getByText(en.TRANSACTION_EMPTY_STATE);
    cy.getByTitle(en.BALANCE_TITLE).contains('€0.00');

    // create transaction buttons do work
    cy.getByText('+€1.00').click();
    cy.getByTitle(en.BALANCE_TITLE).contains('+€1.00');
    cy.getByText('-€1.00').click();
    cy.getByTitle(en.BALANCE_TITLE).contains('€0.00');

    // go to transaction is displayed
    cy.getByText(en.USER_TRANSACTIONS_LINK).should('be.visible');

    // custom transaction form is working
    cy.getByTitle(en.BALANCE_DEPOSIT).should('be.disabled');
    cy.getByTitle(en.BALANCE_DISPENSE).should('be.disabled');
    cy.getByPlaceholderText(en.BALANCE_PLACEHOLDER).type('500');
    cy.getByTitle(en.BALANCE_DEPOSIT).should('not.be.disabled');
    cy.getByTitle(en.BALANCE_DISPENSE).should('not.be.disabled');
    cy.getByTitle(en.BALANCE_DEPOSIT).click();
    cy.getByTitle(en.BALANCE_TITLE).contains('+€5.00');
    cy.getByPlaceholderText(en.BALANCE_PLACEHOLDER).type('500');
    cy.getByTitle(en.BALANCE_DISPENSE).click();
    cy.getByTitle(en.BALANCE_TITLE).contains('€0.00');
  });

  it('search works', () => {
    goToUserBySearch(sessionUserName);
  });

  it('send money works', () => {
    cy.visit('/');
    createUser(sendToUserName);
    cy.getByText(en.USER_TRANSACTION_CREATE_LINK).click();
    cy.getByTitle(en.USER_TRANSACTION_CREATE_SUBMIT_TITLE).should(
      'be.disabled'
    );
    cy.getByPlaceholderText(en.USER_TRANSACTION_FROM_AMOUNT_LABEL).type('500');

    cy.getByPlaceholderText(en.CREATE_USER_TO_USER_TRANSACTION_USER)
      .click()
      .type(`${sessionUserName}{downarrow}{enter}`);

    cy.getByPlaceholderText(en.CREATE_USER_TO_USER_TRANSACTION_COMMENT).type(
      'a test comment'
    );
    cy.getByTitle(en.USER_TRANSACTION_CREATE_SUBMIT_TITLE).click();
    cy.getByText(/You sent User/).should('be.visible');
  });

  it('edit user works', () => {
    const editMail = 'test@test.de';
    goToUserBySearch(sessionUserName);
    cy.getByText(en.USER_EDIT_LINK).click();
    cy.getByPlaceholderText(en.USER_EDIT_NAME_LABEL)
      .clear()
      .type(editedUserName);
    cy.getByPlaceholderText(en.USER_EDIT_MAIL_LABEL).type(editMail);
    cy.getByTitle(en.USER_EDIT_TRIGGER).click();
    cy.visit('/');
    cy.wait(100);
    goToUserBySearch(editedUserName);
    cy.getByText(en.USER_EDIT_LINK).click();
    cy.getByDisplayValue(editMail).should('be.visible');
  });

  it('split money works', () => {
    cy.visit('/');
    createUser(splitMoneyUserName);
    cy.getByText(en.SPLIT_INVOICE_LINK).click();
    cy.getByPlaceholderText('amount').type('900');
    cy.getByPlaceholderText('select recipient').type(splitMoneyUserName);
    cy.getByText(splitMoneyUserName).click();
    cy.getByPlaceholderText('comment').type('test');
    cy.getByPlaceholderText('add participant').type(editedUserName);
    cy.getByText(editedUserName).click();
    cy.getByPlaceholderText('add participant').type(sendToUserName);
    cy.getByText(sendToUserName).click();
    cy.getByText('2 participants split +€9.00').should('be.visible');
    cy.getByText(
      'everybody has to pay +€4.50 to splitMoneyUser1568789926996'
    ).should('be.visible');
    cy.getByTitle(en.SPLIT_INVOICE_SUBMIT).click();
  });

  it('disables test users', () => {
    cleanUpUser(editedUserName);
    cleanUpUser(sendToUserName);
    cleanUpUser(splitMoneyUserName);
  });
});

function cleanUpUser(name: string) {
  goToUserBySearch(name);
  cy.getByText(en.USER_EDIT_LINK).click();
  cy.getByLabelText(en.USER_EDIT_ACTIVE_LABEL).click();
  cy.getByText(en.USER_EDIT_ACTIVE_WARNING).should('be.visible');
  cy.getByTitle(en.USER_EDIT_TRIGGER).click();
}

function goToUserBySearch(name: string) {
  cy.getByText(en.SEARCH).click();
  cy.getByPlaceholderText('search').type(name);
  cy.getByText(name).click();
}
