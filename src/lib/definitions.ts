export type Property = {
  id: string;
  address: string;
  price: number;
  type: 'House' | 'Apartment' | 'Condo' | 'Townhouse';
  status: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  imageUrl: string;
  amenities: string[];
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferences: string;
};
