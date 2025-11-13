import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvitation extends Document {
  trip: mongoose.Types.ObjectId;
  invitedBy: mongoose.Types.ObjectId;
  email: string;
  role: 'admin' | 'viewer';
  status: 'pending' | 'accepted' | 'rejected';
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema: Schema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'viewer',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
InvitationSchema.index({ email: 1, trip: 1 });
InvitationSchema.index({ token: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation || mongoose.model<IInvitation>('Invitation', InvitationSchema);

export default Invitation;

