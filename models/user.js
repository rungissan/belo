import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: 'String',
        required: true,
        unique: true
    },
    hash: String,
    name: {
        type: 'String',
        required: true
    },
    profile: String,
    role: {
        type: String,
        default: 'USER'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verif_token: String,
    verif_token_expired: Date,
    reset_password_token: String,
    reset_password_expires: Date,
    lastVisit: {
        type: Date,
        default: Date.now()
    },
     dateAdded: {
            type: 'Date',
            default: Date.now,
            required: true
        },
});

userSchema.plugin(passportLocalMongoose);

let User = mongoose.model('User', userSchema);

export default User;