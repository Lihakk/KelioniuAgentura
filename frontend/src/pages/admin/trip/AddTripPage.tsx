import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../../../components/BackButton';

interface Route {
  id: number;
  name: string;
}

export const AddTripPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    price: 0,
    routeId: 1,
    totalSpots: 20,
    availableSpots: 20,
  });

  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  useEffect(() => {
  const fetchRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/Route');
      console.log('Routes loaded:', response.data);
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Nepavyko užkrauti maršrutų. Bandykite atnaujinti puslapį.');
    }
  };
  
  fetchRoutes();
}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'routeId' || name === 'totalSpots' || name === 'availableSpots' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  // Handle main image upload
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Nuotrauka per didelė. Maksimalus dydis: 5MB');
        return;
      }
      
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle gallery images upload
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if total would exceed 10 images
    if (galleryImages.length + files.length > 10) {
      setError('Galite įkelti maksimaliai 10 galerijos nuotraukų');
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Kai kurios nuotraukos per didelės. Maksimalus dydis: 5MB');
      return;
    }

    const newImages = [...galleryImages, ...files];
    setGalleryImages(newImages);

    // Create previews
    const newPreviews = [...galleryPreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setGalleryPreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const submitData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });

    // Add main image
    if (mainImage) {
      submitData.append('mainImage', mainImage);
    }

    galleryImages.forEach((image) => {
      submitData.append('galleryImages', image); 
    });

    await axios.post('http://localhost:5050/api/admin/trips', submitData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    alert('Kelionė sėkmingai sukurta!');
    navigate('/admin/trip');
  } catch (error: any) {
    console.error('Error creating trip:', error);
    setError(
      error.response?.data?.message ||
        'Nepavyko sukurti kelionės. Bandykite dar kartą.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4">Pridėti Naują Kelionę</h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        {/* Trip Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Kelionės Pavadinimas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Pvz: Kelionė į Graikiją"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Aprašymas <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Įveskite kelionės aprašymą..."
          />
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pagrindinė nuotrauka
          </label>
          <div className="mt-1">
            {mainImagePreview ? (
              <div className="relative inline-block">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Spustelėkite įkelti</span> arba vilkite čia
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG iki 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleMainImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Gallery Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Galerijos nuotraukos (iki 10)
          </label>
          
          {/* Preview Grid */}
          {galleryPreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {galleryPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Gallery ${index + 1}`}
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {galleryImages.length < 10 && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm text-gray-500">
                  Pridėti nuotraukas ({galleryImages.length}/10)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
              />
            </label>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Pradžios data <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Pabaigos data <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Price and Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Kaina (EUR) <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-2 text-gray-500">€</span>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="routeId" className="block text-sm font-medium text-gray-700">
              Maršrutas <span className="text-red-500">*</span>
            </label>
            <select
              id="routeId"
              name="routeId"
              required
              value={formData.routeId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pasirinkite maršrutą</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spots */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalSpots" className="block text-sm font-medium text-gray-700">
              Viso vietų <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="totalSpots"
              name="totalSpots"
              required
              min="1"
              value={formData.totalSpots}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pvz: 40"
            />
          </div>

          <div>
            <label htmlFor="availableSpots" className="block text-sm font-medium text-gray-700">
              Laisvos vietos <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="availableSpots"
              name="availableSpots"
              required
              min="0"
              max={formData.totalSpots}
              value={formData.availableSpots}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Pvz: 35"
            />
            <p className="mt-1 text-xs text-gray-500">
              Maksimaliai: {formData.totalSpots}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saugoma...
            </>
          ) : (
            'Išsaugoti Kelionę'
          )}
        </button>
      </form>
    </div>
  );
};