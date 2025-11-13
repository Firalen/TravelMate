import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface IActivity {
  title: string;
  description?: string;
  location: ILocation;
  startTime: string;
  endTime?: string;
  notes?: string;
  order: number;
}

export interface IItinerary extends Document {
  trip: mongoose.Types.ObjectId;
  date: Date;
  activities: IActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    placeId: {
      type: String,
    },
  },
  { _id: false }
);

const ActivitySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an activity title'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    location: {
      type: LocationSchema,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const ItinerarySchema: Schema = new Schema(
  {
    trip: {
      type: Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    activities: [ActivitySchema],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one itinerary per trip per date
ItinerarySchema.index({ trip: 1, date: 1 }, { unique: true });

const Itinerary: Model<IItinerary> =
  mongoose.models.Itinerary || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);

export default Itinerary;

