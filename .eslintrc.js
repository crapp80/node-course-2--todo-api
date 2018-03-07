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
        "no-underscore-dangle" : 0,
        "func-names": 0,
        "no-unused-vars": [
              "error",
              {
                "varsIgnorePattern": "should|expect|mongoose"
              }
            ],
        "import/no-extraneous-dependencies": [
              "error",
              {
                "devDependencies": true
              }
            ]
    },
};
