import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Trip {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: number;
  routeId: number;
  routeName?: string;
  mainImage?: string;
  galleryImages?: string;
  availableSpots?: number;
  totalSpots?: number;
}

export const TripDetailPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { role } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(parseInt(tripId));
    }
  }, [tripId]);

  const fetchTripDetails = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:5050/api/admin/trips/${id}`
      );
      console.log("Trip details loaded:", response.data);

      setTrip(response.data);
    } catch (error: any) {
      console.error("Error fetching trip details:", error);
      setError("Nepavyko užkrauti kelionės informacijos. Bandykite dar kartą.");
    } finally {
      setLoading(false);
    }
  };

  const getMainImageUrl = (trip: Trip) => {
    if (trip.mainImage) {
      return `http://localhost:5050${trip.mainImage}`;
    }
    return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop";
  };

  const getGalleryImages = (trip: Trip): string[] => {
    if (!trip.galleryImages) return [];
    return trip.galleryImages
      .split(",")
      .map((img) => `http://localhost:5050${img.trim()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("lt-LT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
               {" "}
        <div className="flex items-center justify-center min-h-[400px]">
                   {" "}
          <div className="text-center">
                       {" "}
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                       {" "}
            <p className="text-gray-600">Kraunama kelionės informacija...</p>   
                 {" "}
          </div>
                   {" "}
        </div>
             {" "}
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
               {" "}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                   {" "}
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
                       {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
                     {" "}
          </svg>
                   {" "}
          <h3 className="text-lg font-semibold text-red-900 mb-2">Klaida</h3>   
               {" "}
          <p className="text-red-700 mb-4">{error || "Kelionė nerasta"}</p>     
             {" "}
          <Link
            to="/trips"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
                        Grįžti į kelionių sąrašą          {" "}
          </Link>
                 {" "}
        </div>
             {" "}
      </div>
    );
  }

  const galleryImages = getGalleryImages(trip);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
            {/* Grįžimo mygtukas */}     {" "}
      <Link
        to="/trips"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
               {" "}
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
                   {" "}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
                 {" "}
        </svg>
                Grįžti į visas keliones      {" "}
      </Link>
           {" "}
      <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-4">
                {trip.name}     {" "}
      </h1>
           {" "}
      <img
        src={getMainImageUrl(trip)}
        alt={trip.name}
        className="w-full h-[500px] object-cover rounded-lg shadow-2xl mb-8"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop";
        }}
      />
            {/* Gallery Images */}     {" "}
      {galleryImages.length > 0 && (
        <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Galerija</h2>       
           {" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {" "}
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${trip.name} - ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&auto=format&fit=crop";
                }}
              />
            ))}
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* Informacijos kortelė */}     {" "}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
                {/* Datos ir kaina */}       {" "}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-6 border-b border-gray-200">
                   {" "}
          <div className="text-center">
                       {" "}
            <div className="flex items-center justify-center mb-2">
                           {" "}
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                             {" "}
              </svg>
                           {" "}
              <span className="font-semibold text-gray-700">Trukmė</span>       
                 {" "}
            </div>
                       {" "}
            <p className="text-2xl font-bold text-gray-900">
                            {trip.duration}              {" "}
              {trip.duration === 1
                ? "diena"
                : trip.duration < 10
                ? "dienos"
                : "dienų"}
                         {" "}
            </p>
                     {" "}
          </div>
                   {" "}
          <div className="text-center">
                       {" "}
            <div className="flex items-center justify-center mb-2">
                           {" "}
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                             {" "}
              </svg>
                           {" "}
              <span className="font-semibold text-gray-700">Data</span>         
               {" "}
            </div>
                       {" "}
            <p className="text-lg text-gray-900">
                            {formatDate(trip.startDate)}           {" "}
            </p>
                        <p className="text-sm text-gray-500">iki</p>           {" "}
            <p className="text-lg text-gray-900">{formatDate(trip.endDate)}</p> 
                   {" "}
          </div>
                   {" "}
          <div className="text-center">
                       {" "}
            <div className="flex items-center justify-center mb-2">
                           {" "}
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                             {" "}
              </svg>
                           {" "}
              <span className="font-semibold text-gray-700">Kaina</span>       
                 {" "}
            </div>
                       {" "}
            <p className="text-3xl font-bold text-blue-600">€{trip.price}</p>   
                    <p className="text-sm text-gray-500">vienam asmeniui</p>   
                 {" "}
          </div>
                 {" "}
        </div>
                {/* Laisvos vietos */}       {" "}
        {trip.availableSpots !== undefined && trip.totalSpots !== undefined && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                       {" "}
            <div className="flex items-center justify-between">
                           {" "}
              <span className="text-gray-700 font-medium">Laisvos vietos:</span>
                           {" "}
              <span className="text-xl font-bold text-blue-600">
                                {trip.availableSpots} / {trip.totalSpots}       
                     {" "}
              </span>
                         {" "}
            </div>
                       {" "}
            {trip.availableSpots <= 3 && trip.availableSpots > 0 && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Tik kelios vietos liko!
              </p>
            )}
                     {" "}
          </div>
        )}
                {/* Aprašymas */}       {" "}
        <div className="mb-8">
                   {" "}
          <h2 className="text-2xl font-bold mb-4 flex items-center">
                       {" "}
            <svg
              className="w-6 h-6 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
                           {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
                         {" "}
            </svg>
                        Aprašymas            {" "}
          </h2>
                   {" "}
          <p className="text-gray-700 leading-relaxed text-lg">
                        {trip.description}         {" "}
          </p>
                 {" "}
        </div>
                {/* Maršrutas (jei yra) */}       {" "}
        {trip.routeName && (
          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
                       {" "}
            <h2 className="text-2xl font-bold mb-4 flex items-center text-blue-900">
                           {" "}
              <svg
                className="w-6 h-6 text-blue-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                               {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 0L9 7"
                />
                             {" "}
              </svg>
                            Maršrutas            {" "}
            </h2>
                       {" "}
            <p className="text-blue-900 text-lg font-medium">
                            {trip.routeName}           {" "}
            </p>
                     {" "}
          </div>
        )}
                {/* Rezervacijos mygtukas */}
        <div className="text-center">
          {role !== "Administrator" &&
            role !== "guest" && ( // ← ADD THIS CONDITION
              <Link
                to={`/reservation/create/${trip.id}`}
                className="inline-block bg-blue-600 text-white font-bold px-12 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Rezervuoti Dabar
              </Link>
            )}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
};
