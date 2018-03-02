module.exports = {
    "extends": "airbnb-base",
    "env": {
        "mocha": true,
        "mongo": true,
        "node": true,
        "es6": true,
    },
    "plugins": [
        "chai-friendly"
    ],
    "rules": {
        "no-unused-expressions": 0,
        "chai-friendly/no-unused-expressions": 2,
        "no-unused-vars": [
              "error",
              {
                "varsIgnorePattern": "should|expect"
              }
            ]
    },
    "globals": {
        "done": false
    },
};
