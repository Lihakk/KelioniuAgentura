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
import { AddTripPage } from './pages/admin/trip/AddTripPage';
import { ModifyTripsPage } from './pages/admin/trip/ModifyTripsPage';
import { SignupPage } from './pages/SignupPage';
// Admin Routes Imports
import { RoutesDashboardPage } from './pages/admin/routes/RoutesDashboardPage';
import { EstimateTimePage } from './pages/admin/routes/EstimateTimePage';
import { RoutePreviewPage } from './pages/admin/routes/RoutePreviewPage';
import { RouteEditPage } from './pages/admin/routes/RouteEditPage';
import { RouteCreatePage } from './pages/admin/routes/RouteCreatePage'; // Import the new page
import { TripDashboardPage } from './pages/admin/trip/TripDashboardPage';
import { TripListPage } from './pages/admin/trip/TripListPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Site Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trip/:tripId" element={<TripDetailPage />} />
        <Route path="/reservation/:tripId" element={<ReservationPage />} />
        <Route path="/checkout" element={<StripeCheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Nested Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route path="reservations" element={<ViewReservationsPage />} />

          <Route path="routes" element={<RoutesDashboardPage />} />
          <Route path="routes/create" element={<RouteCreatePage />} /> {/* Add the new route */}
          <Route path="routes/preview" element={<RoutePreviewPage />} />
          <Route path="routes/edit" element={<RouteEditPage />} />
          <Route path="routes/estimate-time" element={<EstimateTimePage />} />

          <Route path="trip" element={<TripDashboardPage/>} ></Route>
          <Route path="trip/create" element={<AddTripPage />} />
          <Route path="trip/edit" element={<ModifyTripsPage />} />
          <Route path="trip/list" element={<TripListPage/>} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
