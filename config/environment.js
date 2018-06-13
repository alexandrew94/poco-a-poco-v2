const port = process.env.PORT || 4000;
const dbURI =  process.env.MONGODB_URI || 'mongodb://localhost/poco-a-poco';
const secret = process.env.SECRET || 'HERCULES MULLIGAN';

module.exports = { port, dbURI, secret };
