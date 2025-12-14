import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";

// Page Imports
import { MainPage } from "./pages/MainPage";
import { TripsPage } from "./pages/TripsPage";
import { TripDetailPage } from "./pages/TripDetailPage";
import { ReservationPage } from "./pages/ReservationPage";
import { StripeCheckoutPage } from "./pages/StripeCheckoutPage";
import { LoginPage } from "./pages/LoginPage";

// Admin Page Imports
import { AdminPage } from "./pages/AdminPage";
import { ViewReservationsPage } from "./pages/admin/ViewReservationsPage";
import { AddTripPage } from "./pages/admin/trip/AddTripPage";
import { ModifyTripPage } from "./pages/admin/trip/ModifyTripPage";
import { SignupPage } from "./pages/SignupPage";
// Admin Routes Imports
import { RoutesDashboardPage } from "./pages/admin/routes/RoutesDashboardPage";
import { EstimateTimePage } from "./pages/admin/routes/EstimateTimePage";
import { RoutePreviewPage } from "./pages/admin/routes/RoutePreviewPage";
import { RouteEditPage } from "./pages/admin/routes/RouteEditPage";
import { RouteCreatePage } from "./pages/admin/routes/RouteCreatePage"; 
import { RouteCancelPage } from "./pages/admin/routes/RouteCancelPage";
//import { TripDashboardPage } from "./pages/admin/trip/TripDashboardPage";
import { AdminTripListPage } from "./pages/admin/trip/AdminTripListPage"; // Kelias atrodo teisingas, tikrinkite eksportąimport { RezervationListPage } from "./pages/rezervations/RezervationListPage";
import { RezervationDetailPage } from "./pages/rezervations/RezervationDetailPage";
import { RezervationEditPage } from "./pages/rezervations/ReservationEditPage";
import { PaymentPage } from "./pages/rezervations/PaymentPage";
import { ReservationCreationPage } from "./pages/rezervations/ReservationCreationPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfileApprovalPage from "./pages/ProfileApprovalPage";
import { RezervationListPage } from "./pages/rezervations/RezervationListPage";

import { UserPreferencesPage } from "./pages/UserPreferencesPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main Site Routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/trip/:tripId" element={<TripDetailPage />} />
        {/* <Route path="/reservation/:tripId" element={<ReservationPage />} /> */}
        {/* <Route path="/payment/:tripId" element={<StripeCheckoutPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/approve" element={<ProfileApprovalPage />} />
        
        {/* ✅ RECOMMENDATIONS ROUTES */}
        <Route path="/preferences" element={<UserPreferencesPage />} />
        
        {/* Nested Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route path="reservations" element={<ViewReservationsPage />} />
          <Route path="routes" element={<RoutesDashboardPage />} />
          <Route path="routes/create" element={<RouteCreatePage />} />
          <Route path="routes/edit/:id" element={<RouteEditPage />} />
          <Route path="routes/preview/:id" element={<RoutePreviewPage />} />
          <Route path="routes/estimate" element={<EstimateTimePage />} />
          <Route path="routes/cancel/:id" element={<RouteCancelPage />} />
          <Route path="trip" element={<AdminTripListPage />} />
          <Route path="trip/create" element={<AddTripPage />} />
          <Route path="trip/edit/:id" element={<ModifyTripPage />} />
        </Route>
        <Route path="/reservationsList" element={<RezervationListPage />} />
        <Route path="/reservation/:id" element={<RezervationDetailPage />} />
        <Route path="/reservation/:id/edit" element={<RezervationEditPage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route
          path="/reservation/create/:tripId"
          element={<ReservationCreationPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;