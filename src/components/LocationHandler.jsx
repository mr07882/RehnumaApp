import axios from 'axios';
import * as stringSimilarity from 'string-similarity';

const LocationHandler = async (onLocationSuccess, onError) => {
  const fetchNearbySupermarkets = async (latitude, longitude) => {
    const apiKey = '4f87702fb2be40368547d4b6073f9fbe';
    const targetNames = ["Naheed", "Chase up", "Springs" ];
    const MAX_LIMIT = 100; // Geoapify's max allowed per request
    const RADIUS = 5000;
    let allSupermarkets = [];
    let offset = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const url = `https://api.geoapify.com/v2/places?categories=commercial.supermarket
          &filter=circle:${longitude},${latitude},${RADIUS}
          &bias=proximity:${longitude},${latitude}
          &limit=${MAX_LIMIT}
          &offset=${offset}
          &apiKey=${apiKey}`.replace(/\s+/g, '');

        const response = await axios.get(url, { timeout: 10000 });
        
        if (!response.data?.features?.length) {
          hasMore = false;
          break;
        }

        // Fuzzy match with similarity threshold
        const filtered = response.data.features.filter(place => {
          const placeName = place.properties.name?.toLowerCase() || '';
          return targetNames.some(target => {
            const targetLower = target.toLowerCase();
            const similarity = stringSimilarity.compareTwoStrings(placeName, targetLower);
            return similarity > 0.6 || placeName.includes(targetLower);
          });
        });

        allSupermarkets = [...allSupermarkets, ...filtered];
        
        if (response.data.features.length < MAX_LIMIT) {
          hasMore = false;
        } else {
          offset += MAX_LIMIT;
          await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
        }
      }

      return allSupermarkets.map(place => ({
        name: place.properties.name,
        address: place.properties.address_line2 || 'Address not available',
        location: {
          lat: parseFloat(place.properties.lat),
          lng: parseFloat(place.properties.lon)
        }
      })).filter(sm => sm.name);

    } catch (err) {
      console.error('API Error:', err);
      onError(err.response?.status === 429 
        ? 'Too many requests - try again later'
        : 'Failed to fetch supermarkets'
      );
      return [];
    }
  };

  const handleGeolocation = async () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by this browser.');
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          error => reject({
            code: error.code,
            message: error.message
          }),
          { 
            timeout: 10000,
            maximumAge: 5 * 60 * 1000 // 5 minutes cache
          }
        );
      });

      const { latitude, longitude } = position.coords;
      const supermarkets = await fetchNearbySupermarkets(latitude, longitude);
      
      if (!supermarkets.length) {
        onError('No collaborating supermarkets found. Try increasing search range.');
        return;
      }
      
      onLocationSuccess(latitude, longitude, supermarkets);

    } catch (error) {
      console.error('Geolocation Error:', error);
      const errorMessages = {
        1: 'Location permission denied. Please enable it in browser settings.',
        2: 'Location unavailable. Check your network connection.',
        3: 'Location request timed out. Please try again.',
        default: 'Failed to get location. Please try again.'
      };
      onError(errorMessages[error.code] || error.message || errorMessages.default);
    }
  };

  handleGeolocation();
};

export default LocationHandler;