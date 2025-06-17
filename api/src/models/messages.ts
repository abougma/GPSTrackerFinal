import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
    content: string;
    timestamp: Date;
}

const messageSchema: Schema = new Schema({
    content: {
        type: String,
        require: true,
    },
    timestamp:{
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;