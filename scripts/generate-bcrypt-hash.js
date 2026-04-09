const bcrypt = require('bcryptjs');

const password = 'Entraide2026';
const saltRounds = 10;

const hash = bcrypt.hashSync(password, saltRounds);
console.log('Password:', password);
console.log('BCrypt Hash:', hash);
console.log('\nUse this hash in your SQL script:');
console.log(`SET @password_hash = '${hash}';`);
