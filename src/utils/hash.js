import hash from 'hash.js';

const getHashedString = (str) => hash.sha256().update(str).digest('hex');

export { getHashedString };
