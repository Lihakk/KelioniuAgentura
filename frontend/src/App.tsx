import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

// Page Imports
import { MainPage } from './pages/MainPage';
import { TripsPage } from './pages/TripsPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { ReservationPage } from './pages/ReservationPage';
import { StripeCheckoutPage } from './pages/StripeCheckoutPage';
import { LoginPage } from './pages/LoginPage';

// Admin Page Imports
import { AdminPage } from './pages/AdminPage';
import { ViewReservationsPage } from './pages/admin/ViewReservationsPage';
import { AddTripPage } from './pages/admin/AddTripPage';
import { ModifyTripsPage } from './pages/admin/ModifyTripsPage';
import { EstimateTimePage } from './pages/admin/EstimateTimePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trip/:tripId" element={<TripDetailPage />} />
        <Route path="/reservation/:tripId" element={<ReservationPage />} />
        <Route path="/checkout" element={<StripeCheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Nested Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route path="reservations" element={<ViewReservationsPage />} />
          <Route path="add-trip" element={<AddTripPage />} />
          <Route path="modify-trips" element={<ModifyTripsPage />} />
          <Route path="estimate-time" element={<EstimateTimePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
