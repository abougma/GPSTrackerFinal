import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document{
    username: String;
    password: String;
}

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    password: { 
        type: String,
        required: true
    }
});


const User = mongoose.model<IUser>('User', userSchema);

export default User;