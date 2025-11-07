const { DocumentStore } = require('ravendb');

let store;

const getStore = () => {
  if (!store) {
    store = new DocumentStore(['http://localhost:8080'], 'leadsoft-challenger');
    store.initialize();
  }
  return store;
};

module.exports = { getStore };