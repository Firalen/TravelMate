import { create } from 'zustand';

export interface Trip {
  _id: string;
  title: string;
  description?: string;
  destination: string;
  startDate: string;
  endDate: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  participants: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    };
    role: 'admin' | 'viewer';
    joinedAt: string;
  }>;
  isPublic: boolean;
  shareableLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface TripStore {
  trips: Trip[];
  selectedTrip: Trip | null;
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, trip: Trip) => void;
  deleteTrip: (id: string) => void;
  setSelectedTrip: (trip: Trip | null) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  selectedTrip: null,
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
  updateTrip: (id, updatedTrip) =>
    set((state) => ({
      trips: state.trips.map((t) => (t._id === id ? updatedTrip : t)),
    })),
  deleteTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((t) => t._id !== id),
      selectedTrip: state.selectedTrip?._id === id ? null : state.selectedTrip,
    })),
  setSelectedTrip: (trip) => set({ selectedTrip: trip }),
}));

