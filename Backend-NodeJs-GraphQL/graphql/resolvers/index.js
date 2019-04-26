
const eventResolver = require('./events');
const bookingResolver = require('./booking');
const authResolver = require('./auth')

const rootResolvers = {
    ...eventResolver,
    ...bookingResolver,
    ...authResolver
}

module.exports = rootResolvers;
