import axios from 'axios';

const LocationHandler = async (onLocationSuccess, onError) => {
  const fetchNearbySupermarkets = async (latitude, longitude) => {
    const apiKey = '4f87702fb2be40368547d4b6073f9fbe';
    const url = `https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&apiKey=${apiKey}`;

    try {
      const response = await axios.get(url);
      const supermarkets = response.data.features
        .filter((place) => {
          const name = place.properties.name?.toLowerCase() || '';
          return name.includes('naheed') || name.includes('imtiaz') || name.includes('springs') || name.includes('chase up');
        })
        .map((place) => place.properties.name)
        .filter(Boolean); // Ensure valid names

      return supermarkets;
    } catch (err) {
      console.error('Error fetching supermarkets:', err);
      onError('Failed to fetch nearby supermarkets.');
      return [];
    }
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User Location:', { latitude, longitude });
        const supermarkets = await fetchNearbySupermarkets(latitude, longitude);
        onLocationSuccess(latitude, longitude, supermarkets);
      },
      (err) => {
        if (err.code === 1) {
          onError('Location tracking is disabled. Please enable it to proceed.');
        } else if (err.code === 2) {
          onError('Unable to determine your location. Please try again.');
        } else if (err.code === 3) {
          onError('Location request timed out. Please try again.');
        } else {
          onError('An unknown error occurred while accessing location.');
        }
      }
    );
  } else {
    onError('Geolocation is not supported by this browser.');
  }
};

export default LocationHandler;
