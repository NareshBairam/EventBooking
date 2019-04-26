const Event = require('../../models/event');
const User = require('../../models/user');

const { transformEvent } = require('../helpers/merge');

const { dateToString } = require('../helpers/date');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        }
        catch (err) {
            return err;
        };
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthenticated!");
        }
        const eventObj = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creater: req.userId
        });
        let createdEvent;
        try {
            const event = await eventObj.save();
            createdEvent = transformEvent(event);

            const existingUser = await User.findById(req.userId);
            if (!existingUser) {
                throw new Error('No user exists');
            }
            existingUser.createdEvents.push(event);
            existingUser.save();
            return createdEvent;
        }
        catch (err) {
            throw err;
        };
    }
}