import mongoose, { Schema, Model } from 'mongoose'

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 255,
    },
    password: { type: String, required: true },
}, {
    timestamps: true,
})

UserSchema.index({ email: 1 })

export const UserModel: Model<any> =
    mongoose.models.User || mongoose.model('User', UserSchema)
