import mongoose, { Schema, Model } from 'mongoose'

const MicroTaskSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  order: { type: Number, required: true },
  dayTarget: { type: Number, required: true },
}, { _id: false })

const PressureSnapshotSchema = new Schema({
  date: { type: Date, required: true },
  score: { type: Number, required: true },
  zone: { type: String, enum: ['calm', 'warning', 'panic'], required: true },
}, { _id: false })

const TaskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 200 },
  deadline: { type: Date, required: true },
  effortLevel: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  pressureScore: { type: Number, default: 0, min: 0, max: 100 },
  pressureZone: { type: String, enum: ['calm', 'warning', 'panic'], default: 'calm' },
  microTasks: { type: [MicroTaskSchema], default: [] },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  originalDeadline: { type: Date },
  rescheduleCount: { type: Number, default: 0 },
  lastRescheduledAt: { type: Date, default: null },
  pressureHistory: { type: [PressureSnapshotSchema], default: [] },
}, {
  timestamps: true,
})

TaskSchema.index({ pressureScore: -1 })
TaskSchema.index({ deadline: 1 })
TaskSchema.index({ isCompleted: 1, pressureScore: -1 })

TaskSchema.pre('save', function (next) {
  if (this.isNew && !this.originalDeadline) {
    this.originalDeadline = this.deadline
  }
  next()
})

export const TaskModel: Model<any> =
  mongoose.models.Task || mongoose.model('Task', TaskSchema)
