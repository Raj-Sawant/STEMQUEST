const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stemquest';

async function resetTeacherPassword() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.model('User', new mongoose.Schema({
            username: String,
            password: { type: String, required: true },
            role: String
        }));

        const salt = await bcrypt.genSalt(10);
        const newPassword = 'teacher123';
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const result = await User.updateOne(
            { username: 'RASHI', role: 'teacher' },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log('Password for teacher "RASHI" has been reset to: teacher123');
        } else {
            console.log('Teacher "RASHI" not found or password update failed.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

resetTeacherPassword();
