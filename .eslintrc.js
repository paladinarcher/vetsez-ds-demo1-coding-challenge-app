//run 'eslint --init' to regenerate this file.
//eslint --ext jsx .\app\frontend\packs\.
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "settings": {
      "react": {
          "version": "detect"
      }
    },
    "extends": ["plugin:react/recommended",
    "eslint:recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    }
};