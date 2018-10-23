module.exports = {
    "parser": "babel-eslint",
  "env": {
      "browser": true,
      "es6": true,
      "jest": true,
  },
  "settings": {
        "ecmascript": 6,
        "jsx": true
  },
  "parserOptions": {
      "ecmaVersion": 2017,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "experimentalDecorators": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "plugins": [
      "react",
  ],
  "extends": "airbnb",
  "rules": {
    "react/jsx-filename-extension": 0,
    "function-paren-newline": 0,
    "linebreak-style": 0,
    "react/destructuring-assignment": 0,
    "react/no-access-state-in-setstate": 0,
    "react/jsx-one-expression-per-line": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "no-plusplus": 0,
    "no-restricted-syntax": 0,
    "jsx-a11y/label-has-for": 'off',
    "consistent-return": 0,
    "no-lonely-if": 0,
    "implicit-arrow-linebreak": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "import/no-extraneous-dependencies": 0,
    "no-shadow": 0,
    "comma-dangle": 0,
    "prefer-destructuring": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "global-require": 0,
  }
};