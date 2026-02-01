export const aggregateByYear = (data) => {
  const counts = data.reduce((acc, curr) => {
    const year = curr['Model Year'];
    if (!year) return acc;
    acc[year] = acc[year] || { year, count: 0, bev: 0, phev: 0 };
    acc[year].count += 1;
    if (curr['Electric Vehicle Type']?.includes('BEV')) acc[year].bev += 1;
    if (curr['Electric Vehicle Type']?.includes('PHEV')) acc[year].phev += 1;
    return acc;
  }, {});
  return Object.values(counts).sort((a, b) => a.year - b.year);
};

export const aggregateByMake = (data, limit = 10) => {
  const counts = data.reduce((acc, curr) => {
    const make = curr['Make'];
    if (!make) return acc;
    acc[make] = (acc[make] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts)
    .map(([make, count]) => ({ make, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const aggregateByType = (data) => {
  const counts = data.reduce((acc, curr) => {
    const type = curr['Electric Vehicle Type'];
    if (!type) return acc;
    const key = type.includes('BEV') ? 'BEV' : 'PHEV';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, { BEV: 0, PHEV: 0 });
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const aggregateByCity = (data, limit = 10) => {
  const counts = data.reduce((acc, curr) => {
    const city = curr['City'];
    if (!city) return acc;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getKPIs = (data) => {
  if (!data.length) return {};
  
  const total = data.length;
  const makes = {};
  const models = {};
  const years = {};
  const cities = {};
  const counties = {};
  let totalRange = 0;
  let rangeCount = 0;
  let eligibleCount = 0;
  let bevCount = 0;

  data.forEach(d => {
    if (d.Make) makes[d.Make] = (makes[d.Make] || 0) + 1;
    if (d.Model) models[d.Model] = (models[d.Model] || 0) + 1;
    if (d['Model Year']) years[d['Model Year']] = (years[d['Model Year']] || 0) + 1;
    if (d.City) cities[d.City] = (cities[d.City] || 0) + 1;
    if (d.County) counties[d.County] = (counties[d.County] || 0) + 1;
    
    const range = d['Electric Range'];
    if (range > 0) {
      totalRange += range;
      rangeCount++;
    }
    
    if (d['Clean Alternative Fuel Vehicle (CAFV) Eligibility']?.includes('Eligible')) eligibleCount++;
    if (d['Electric Vehicle Type']?.includes('BEV')) bevCount++;
  });

  const getTop = (freq) => Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Calculate HHI (Insight 3)
  const marketShares = Object.values(makes).map(count => (count / total) * 100);
  const hhi = Math.round(marketShares.reduce((sum, share) => sum + (share * share), 0));

  return {
    total,
    topMake: getTop(makes),
    topModel: getTop(models),
    topCity: getTop(cities),
    topCounty: getTop(counties),
    dominantYear: getTop(years),
    avgRange: rangeCount > 0 ? Math.round(totalRange / rangeCount) : 0,
    bevPercent: Math.round((bevCount / total) * 100),
    phevPercent: 100 - Math.round((bevCount / total) * 100),
    eligiblePercent: Math.round((eligibleCount / total) * 100),
    uniqueModels: Object.keys(models).length,
    hhi
  };
};

export const aggregateRangeByYear = (data) => {
  const yearlyRange = data.reduce((acc, curr) => {
    const year = curr['Model Year'];
    const range = curr['Electric Range'];
    const type = curr['Electric Vehicle Type']?.includes('BEV') ? 'bev' : 'phev';
    if (!year || range === 0) return acc;
    
    acc[year] = acc[year] || { year, bevTotal: 0, bevCount: 0, phevTotal: 0, phevCount: 0, total: 0, count: 0 };
    
    acc[year].total += range;
    acc[year].count += 1;
    
    if (type === 'bev') {
      acc[year].bevTotal += range;
      acc[year].bevCount += 1;
    } else {
      acc[year].phevTotal += range;
      acc[year].phevCount += 1;
    }
    
    return acc;
  }, {});

  return Object.values(yearlyRange)
    .map(d => ({
      year: d.year,
      avgRange: Math.round(d.total / d.count),
      bevRange: d.bevCount > 0 ? Math.round(d.bevTotal / d.bevCount) : 0,
      phevRange: d.phevCount > 0 ? Math.round(d.phevTotal / d.phevCount) : 0
    }))
    .sort((a, b) => a.year - b.year);
};

export const aggregateCAFVStatus = (data) => {
  const counts = data.reduce((acc, curr) => {
    const status = curr['Clean Alternative Fuel Vehicle (CAFV) Eligibility'];
    if (!status) return acc;
    
    let label = 'Unknown';
    if (status.includes('Clean Alternative Fuel Vehicle Eligible')) label = 'Eligible';
    else if (status.includes('Not eligible')) label = 'Not Eligible';
    else label = 'Unknown/TBD';
    
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const aggregateMapData = (data) => {
  return data
    .filter(d => d['Vehicle Location'])
    .map(d => {
      const match = d['Vehicle Location'].match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
      if (match) {
        return {
          lng: parseFloat(match[1]),
          lat: parseFloat(match[2]),
          make: d.Make,
          model: d.Model
        };
      }
      return null;
    })
    .filter(Boolean);
};

export const aggregateRangeDistribution = (data) => {
  const bins = [0, 50, 100, 150, 200, 250, 300, 400];
  const distribution = bins.slice(0, -1).map((bin, i) => ({
    range: `${bin}-${bins[i+1]} mi`,
    count: 0
  }));

  data.forEach(d => {
    const range = d['Electric Range'];
    if (range > 0) {
      for (let i = 0; i < bins.length - 1; i++) {
        if (range >= bins[i] && range < bins[i+1]) {
          distribution[i].count++;
          break;
        }
      }
    }
  });

  return distribution;
};

export const aggregateUtilityDistribution = (data, limit = 10) => {
  const counts = data.reduce((acc, curr) => {
    const utility = curr['Electric Utility']?.split('|')[0]?.trim();
    if (!utility) return acc;
    acc[utility] = (acc[utility] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const aggregateTopModelsTreemap = (data, limitMax = 50) => {
  const manufacturers = {};
  data.forEach(d => {
    const make = d.Make;
    const model = d.Model;
    if (!make || !model) return;
    
    manufacturers[make] = manufacturers[make] || {};
    manufacturers[make][model] = (manufacturers[make][model] || 0) + 1;
  });

  const tree = Object.entries(manufacturers).map(([make, models]) => {
    const children = Object.entries(models).map(([name, size]) => ({ name, size }));
    return {
      name: make,
      children: children.sort((a, b) => b.size - a.size).slice(0, 5)
    };
  }).sort((a, b) => {
    const sumA = a.children.reduce((s, c) => s + c.size, 0);
    const sumB = b.children.reduce((s, c) => s + c.size, 0);
    return sumB - sumA;
  }).slice(0, 10);

  return tree;
};
