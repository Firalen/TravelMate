import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParticipant {
  user: mongoose.Types.ObjectId;
  role: 'admin' | 'viewer';
  joinedAt: Date;
}

export interface ITrip extends Document {
  title: string;
  description?: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
  participants: IParticipant[];
  isPublic: boolean;
  shareableLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'viewer'],
      default: 'admin',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const TripSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a trip title'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Please provide a destination'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Please provide a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please provide an end date'],
      validate: {
        validator: function (this: ITrip, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [ParticipantSchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareableLink: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate shareable link before saving
TripSchema.pre('save', async function (this: ITrip, next) {
  if (this.isPublic && !this.shareableLink) {
    const id = this._id as mongoose.Types.ObjectId;
    this.shareableLink = `trip-${id.toString()}-${Date.now()}`;
  }
  next();
});

const Trip: Model<ITrip> = mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);

export default Trip;

