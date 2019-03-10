const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

const historyMock = (function() {
  const items = [];
  return {
    push: function(key) {
      return items.push(key);
    },
    length: items.length
  };
})();

const fetch = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
Object.defineProperty(window, 'history', {
  value: historyMock
});
Object.defineProperty(window, 'fetch', {
  value: fetch
});
