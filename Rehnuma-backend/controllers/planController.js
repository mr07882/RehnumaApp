const Fuse = require('fuse.js');
const stringSimilarity = require('string-similarity');
const geolib = require('geolib');
const mongoose = require('mongoose');
const User = require('../models/User');

const TRANSPORT_RATE = 28;
const modelCache = new Map();

function sanitizeModelName(name) {
  return `${name.replace(/[^a-zA-Z0-9]/g, '')}Item`;
}

exports.generatePlan = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { items } = req.body;

    if (!user?.nearbySupermarkets?.length) {
      return res.status(400).json({ 
        message: 'No collaborating supermarkets found in your area.' 
      });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const matchedSupermarkets = user.nearbySupermarkets
      .map(sm => ({
        ...sm._doc,
        collectionName: stringSimilarity.findBestMatch(sm.name, collectionNames).bestMatch.target,
      }))
      .filter(sm => sm.collectionName);

    const itemResults = await processItems(items, matchedSupermarkets, user.location);
    const optimizedPlan = optimizeRoute(itemResults, user.location);

    res.json(optimizedPlan);
  } catch (error) {
    console.error('Plan generation error:', error);
    res.status(500).json({ 
      message: 'Failed to generate plan', 
      error: error.message 
    });
  }
};

async function processItems(items, supermarkets, userLocation) {
  const itemMap = [];
  
  for (const rawItem of items) {
    const searchTerm = rawItem.trim().toLowerCase();
    let bestOption = null;

    for (const sm of supermarkets) {
      try {
        const modelName = sanitizeModelName(sm.collectionName);
        
        let Model = modelCache.get(modelName);
        if (!Model) {
          if (mongoose.modelNames().includes(modelName)) {
            Model = mongoose.model(modelName);
          } else {
            Model = mongoose.model(
              modelName,
              new mongoose.Schema({
                itemName: String,
                price: Number
              }),
              sm.collectionName
            );
          }
          modelCache.set(modelName, Model);
        }

        const items = await Model.find({});
        const fuse = new Fuse(items, {
          keys: ['itemName'],
          threshold: 0.4,
          includeScore: true
        });

        const results = fuse.search(searchTerm);
        if (results.length > 0) {
          const [bestMatch] = results.sort((a, b) => a.score - b.score);
          const distance = geolib.getDistance(
            { latitude: userLocation.lat, longitude: userLocation.lng },
            { latitude: sm.location.lat, longitude: sm.location.lng }
          ) / 1000;

          const totalCost = bestMatch.item.price + (distance * TRANSPORT_RATE);

          if (!bestOption || totalCost < bestOption.totalCost) {
            bestOption = {
              itemName: bestMatch.item.itemName,
              originalSearch: rawItem,
              price: bestMatch.item.price,
              supermarket: sm.name,
              supermarketAddress: sm.address,
              distance,
              transportCost: distance * TRANSPORT_RATE,
              totalCost
            };
          }
        }
      } catch (err) {
        console.error(`Error processing ${sm.name}:`, err);
      }
    }

    itemMap.push(bestOption || { 
      originalSearch: rawItem, 
      error: 'Item not found in nearby stores' 
    });
  }

  return itemMap;
}

// Rest of the file remains same as previous optimizeRoute function
function optimizeRoute(items, userLocation) {
  const stores = {};
  
  items.filter(i => !i.error).forEach(item => {
    if (!stores[item.supermarket]) {
      stores[item.supermarket] = {
        items: [],
        totalPrice: 0,
        transportCost: item.transportCost,
        distance: item.distance,
        address: item.supermarketAddress
      };
    }
    stores[item.supermarket].items.push(item);
    stores[item.supermarket].totalPrice += item.price;
  });

  const sortedStores = Object.entries(stores)
    .sort((a, b) => a[1].distance - b[1].distance);

  const totalCost = sortedStores.reduce((acc, curr) => 
    acc + curr[1].totalPrice + curr[1].transportCost, 0);

  return {
    itinerary: sortedStores.map(([store, data]) => ({
      store,
      address: data.address,
      items: data.items,
      storeTotal: data.totalPrice,
      transportCost: data.transportCost,
      distance: data.distance,
      travelTime: calculateTravelTime(data.distance)
    })),
    totalCost: Math.round(totalCost),
    unavailableItems: items.filter(i => i.error).map(i => i.originalSearch)
  };
}

function calculateTravelTime(distance) {
  const avgSpeed = 40; // km/h
  const timeHours = distance / avgSpeed;
  return `${Math.round(timeHours * 60)} min`;
}