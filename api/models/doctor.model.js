import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/013/215/160/non_2x/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-vector.jpg",
    },
    isDoctor: {
        type: Boolean,
        default: true,
    },
    availableDates: {
        type: [String], // Example: ['Monday', 'Tuesday']
        required: true,
    },
    timeRanges: {
        type: [{
            day: { type: String, required: true },
            from: { type: String, required: true },
            to: { type: String, required: true },
        }],
        required: true,
    },
    maxAppointmentsPerDay: {
        type: Number,
        required: true,
    },
    channelingCost: {
        type: Number,
        required: true,
    },
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
