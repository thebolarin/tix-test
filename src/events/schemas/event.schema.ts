import * as mongoose from 'mongoose';
import {  Schema } from '@nestjs/mongoose';

 const EventSchema = new mongoose.Schema({
    title: String,
    identifier: String,
    description: String,
    address: String,
    longitude: String,
    latitude: String,
    banner: String,
    eventType: {
        type: String,
        enum: ['FREE', 'PAID'],
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
    },
    date: Date,
    startTime: String,
    endTime: String,
    instagramUrl: String,
    facebookUrl: String,
    twitterUrl: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date,
    updatedAt: Date,
});





export { EventSchema };