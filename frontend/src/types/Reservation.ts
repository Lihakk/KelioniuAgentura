export interface Reservation {
  id: number;
  date: string;
  totalAmount: number;
  status: string;
  userId: number;
  reservationTrip: ReservationTrip;
  payment: PaymentInfo;
  travelers: Traveler[];
}

export interface ReservationTrip {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
}

export interface PaymentInfo {
  id: number;
  amount: number;
  date: string;
  method: string;
  currency: string;
  status: string;
  reservationId: number;
}

export interface Traveler {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  documentNumber: string;
  reservationId: number;
}

export interface CreateTraveler {
  firstName: string;
  lastName: string;
  birthDate: string;
  documentNumber: string;
  reservationId: number;
}
export interface ReservationCreation {
  tripId: number;
  travelers: CreateTraveler[];
}

export interface ReservationUpdate {
  id: number;
  status: string;
  payment: PaymentInfo;
}
