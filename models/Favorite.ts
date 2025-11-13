import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
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
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ user: 1, placeId: 1 }, { unique: true, sparse: true });

const Favorite: Model<IFavorite> =
  mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;

