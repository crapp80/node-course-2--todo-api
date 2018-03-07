/* eslint-disable no-console */
const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10,
}

const token = jwt.sign(data, 'mySecretSalt');
console.log(token);

const decoded = jwt.verify(token, 'mySecretSalt');
console.log(decoded);

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);
//
// const data = {
//   id: 4,
// };
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(`${data}someSecret`)).toString(),
// };
//
// // data gets changed
// token.data.id = 4;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// // will log that data was changed, because we do not know the Salt
//
// const resultHash = SHA256(JSON.stringify(`${token.data}someSecret`)).toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust.');
// }
