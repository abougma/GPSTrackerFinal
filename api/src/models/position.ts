import mongoose, { Document, Schema } from 'mongoose';

interface Iposition extends Document {
    deviceId: number; 
    latitude: number,
    longitude: number,
    createdAt: Date
}

const positionSchema: Schema = new Schema({
    deviceId: {
        type: Number, 
        required: true 
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const Position = mongoose.model<Iposition>('Position', positionSchema);

export default Position;
