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
    let bestOptions = [];

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
            threshold: 0.5, // Increased threshold for more flexibility
            includeScore: true,
            ignoreLocation: true,
            minMatchCharLength: 2, // Allow shorter matches
            shouldSort: true,
            useExtendedSearch: false, // Remove exact phrase restriction
            findAllMatches: true,
            tokenize: true, // Split search into tokens
            matchAllTokens: true,
            distance: 100, // Increased allowed edit distance
            location: 0,
            ignoreFieldNorm: true
          });

        const cleanSearch = searchTerm
        .replace(/[^a-z0-9\s]/gi, '') // Remove special chars
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();

        const results = fuse.search(cleanSearch);
        if (results.length > 0) {
          const distance = geolib.getDistance(
            { latitude: userLocation.lat, longitude: userLocation.lng },
            { latitude: sm.location.lat, longitude: sm.location.lng }
          ) / 1000;

          // Find best match in current supermarket
          const bestStoreMatch = results.reduce((best, current) => {
            // Normalize database item name
            const dbItem = current.item.itemName
              .toLowerCase()
              .replace(/[^a-z0-9\s]/gi, '')
              .replace(/\(.*?\)/g, '') // Remove parentheses content
              .trim();

            // Calculate similarity with multiple methods
            const similarity = Math.max(
              stringSimilarity.compareTwoStrings(cleanSearch, dbItem),
              stringSimilarity.compareTwoStrings(
                cleanSearch.replace(/\s/g, ''), 
                dbItem.replace(/\s/g, '')
              )
            );

            // Weighted scoring favoring similarity
            const combinedScore = (current.score * 0.4) + ((1 - similarity) * 0.6);
            
            return combinedScore < best.combinedScore ? 
              { ...current, combinedScore } : 
              best;
          }, { combinedScore: Infinity });


          bestOptions.push({
            item: bestStoreMatch.item,
            distance,
            transportCost: distance * TRANSPORT_RATE,
            supermarket: sm.name,
            supermarketAddress: sm.address,
            combinedScore: bestStoreMatch.combinedScore
          });
        }
      } catch (err) {
        console.error(`Error processing ${sm.name}:`, err);
      }
    }

    if (bestOptions.length > 0) {
      // Sort by similarity first, then total cost
      bestOptions.sort((a, b) => {
        if (a.combinedScore !== b.combinedScore) {
          return a.combinedScore - b.combinedScore;
        }
        return (a.item.price + a.transportCost) - (b.item.price + b.transportCost);
      });

      const bestMatch = bestOptions[0];
      itemMap.push({
        originalSearch: rawItem,
        matchedItem: bestMatch.item.itemName,
        price: bestMatch.item.price,
        supermarket: bestMatch.supermarket,
        distance: bestMatch.distance,
        transportCost: bestMatch.transportCost
      });
    } else {
      itemMap.push({ 
        originalSearch: rawItem, 
        error: 'Item not found in nearby stores' 
      });
    }
  }

  return itemMap;
}

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
    stores[item.supermarket].items.push({
        itemName: item.matchedItem,
        originalSearch: item.originalSearch,
        price: item.price
      });
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
  const avgSpeed = 40;
  const timeHours = distance / avgSpeed;
  return `${Math.round(timeHours * 60)} min`;
}