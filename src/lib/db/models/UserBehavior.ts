import mongoose, { Schema, Model } from 'mongoose'

const UserBehaviorSchema = new Schema({
  event: {
    type: String,
    enum: [
      'task_created',
      'task_completed',
      'microtask_completed',
      'deadline_missed',
      'task_rescheduled',
      'simulator_used',
    ],
    required: true,
  },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: Schema.Types.Mixed, default: {} },
})

UserBehaviorSchema.index({ event: 1, timestamp: -1 })
UserBehaviorSchema.index({ taskId: 1 })

export const UserBehaviorModel: Model<any> =
  mongoose.models.UserBehavior || mongoose.model('UserBehavior', UserBehaviorSchema)
