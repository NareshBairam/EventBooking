
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async (args) => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('User already exists');
            }
            const passwordHash = await bcrypt.hash(args.userInput.password, 12);
            const user_1 = new User({
                email: args.userInput.email,
                password: passwordHash
            });
            const user_2 = await user_1.save();
            console.log("Created Üser : " + user_2);
            return {
                ...user_2._doc,
                _id: user_2._doc._id.toString()
            };
        }
        catch (err) {
            throw err;
        }
    },

    login: async ({ email, password }) => {

        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' });
            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            }
        } catch (error) {
            throw error;
        }
    }
}