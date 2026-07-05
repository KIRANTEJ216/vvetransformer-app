class DeliveryLocation {
  final String city;
  final String state;
  final double lat;
  final double lng;
  int deliveries;
  double totalValue;
  final List<String> vehicles;
  double avgDistanceKm;
  final List<String> invoices;
  final List<String> buyers;

  DeliveryLocation({
    required this.city,
    required this.state,
    required this.lat,
    required this.lng,
    this.deliveries = 1,
    this.totalValue = 0,
    List<String>? vehicles,
    this.avgDistanceKm = 0,
    List<String>? invoices,
    List<String>? buyers,
  })  : vehicles = vehicles ?? [],
        invoices = invoices ?? [],
        buyers = buyers ?? [];
}

class CityCoord {
  final String city;
  final String state;
  final double lat;
  final double lng;

  const CityCoord({
    required this.city,
    required this.state,
    required this.lat,
    required this.lng,
  });
}

final List<CityCoord> indianCities = [
  // Andhra Pradesh
  const CityCoord(city: 'visakhapatnam', state: 'andhra pradesh', lat: 17.6868, lng: 83.2185),
  const CityCoord(city: 'vijayawada', state: 'andhra pradesh', lat: 16.5062, lng: 80.6480),
  const CityCoord(city: 'guntur', state: 'andhra pradesh', lat: 16.3067, lng: 80.4365),
  const CityCoord(city: 'nellore', state: 'andhra pradesh', lat: 14.4426, lng: 79.9865),
  const CityCoord(city: 'tirupati', state: 'andhra pradesh', lat: 13.6288, lng: 79.4192),
  // Arunachal Pradesh
  const CityCoord(city: 'itanagar', state: 'arunachal pradesh', lat: 27.0844, lng: 93.6053),
  // Assam
  const CityCoord(city: 'guwahati', state: 'assam', lat: 26.1445, lng: 91.7362),
  const CityCoord(city: 'silchar', state: 'assam', lat: 24.8333, lng: 92.7789),
  // Bihar
  const CityCoord(city: 'patna', state: 'bihar', lat: 25.5941, lng: 85.1376),
  const CityCoord(city: 'gaya', state: 'bihar', lat: 24.7955, lng: 84.9994),
  const CityCoord(city: 'bhagalpur', state: 'bihar', lat: 25.2425, lng: 86.9842),
  const CityCoord(city: 'muzaffarpur', state: 'bihar', lat: 26.1209, lng: 85.3647),
  // Chandigarh
  const CityCoord(city: 'chandigarh', state: 'chandigarh', lat: 30.7333, lng: 76.7794),
  // Chhattisgarh
  const CityCoord(city: 'raipur', state: 'chhattisgarh', lat: 21.2514, lng: 81.6296),
  const CityCoord(city: 'bilaspur', state: 'chhattisgarh', lat: 22.0796, lng: 82.1391),
  // Delhi
  const CityCoord(city: 'delhi', state: 'delhi', lat: 28.7041, lng: 77.1025),
  const CityCoord(city: 'new delhi', state: 'delhi', lat: 28.6139, lng: 77.2090),
  // Goa
  const CityCoord(city: 'panaji', state: 'goa', lat: 15.4909, lng: 73.8278),
  // Gujarat
  const CityCoord(city: 'ahmedabad', state: 'gujarat', lat: 23.0225, lng: 72.5714),
  const CityCoord(city: 'surat', state: 'gujarat', lat: 21.1702, lng: 72.8311),
  const CityCoord(city: 'vadodara', state: 'gujarat', lat: 22.3072, lng: 73.1812),
  const CityCoord(city: 'rajkot', state: 'gujarat', lat: 22.3039, lng: 70.8022),
  const CityCoord(city: 'gandhinagar', state: 'gujarat', lat: 23.2156, lng: 72.6369),
  // Haryana
  const CityCoord(city: 'faridabad', state: 'haryana', lat: 28.4089, lng: 77.3178),
  const CityCoord(city: 'gurugram', state: 'haryana', lat: 28.4595, lng: 77.0266),
  const CityCoord(city: 'gurgaon', state: 'haryana', lat: 28.4595, lng: 77.0266),
  const CityCoord(city: 'panipat', state: 'haryana', lat: 29.3845, lng: 76.9693),
  const CityCoord(city: 'ambala', state: 'haryana', lat: 30.3752, lng: 76.7821),
  // Himachal Pradesh
  const CityCoord(city: 'shimla', state: 'himachal pradesh', lat: 31.1048, lng: 77.1734),
  // Jammu & Kashmir
  const CityCoord(city: 'jammu', state: 'jammu and kashmir', lat: 32.7266, lng: 74.8570),
  const CityCoord(city: 'srinagar', state: 'jammu and kashmir', lat: 34.0837, lng: 74.7973),
  // Jharkhand
  const CityCoord(city: 'ranchi', state: 'jharkhand', lat: 23.3441, lng: 85.3096),
  const CityCoord(city: 'jamshedpur', state: 'jharkhand', lat: 22.8046, lng: 86.2029),
  const CityCoord(city: 'dhanbad', state: 'jharkhand', lat: 23.7957, lng: 86.4304),
  // Karnataka
  const CityCoord(city: 'bengaluru', state: 'karnataka', lat: 12.9716, lng: 77.5946),
  const CityCoord(city: 'bangalore', state: 'karnataka', lat: 12.9716, lng: 77.5946),
  const CityCoord(city: 'mysuru', state: 'karnataka', lat: 12.2958, lng: 76.6394),
  const CityCoord(city: 'hubli', state: 'karnataka', lat: 15.3647, lng: 75.1240),
  const CityCoord(city: 'mangaluru', state: 'karnataka', lat: 12.9141, lng: 74.8560),
  // Kerala
  const CityCoord(city: 'thiruvananthapuram', state: 'kerala', lat: 8.5241, lng: 76.9366),
  const CityCoord(city: 'kochi', state: 'kerala', lat: 9.9312, lng: 76.2673),
  const CityCoord(city: 'kozhikode', state: 'kerala', lat: 11.2588, lng: 75.7804),
  const CityCoord(city: 'thrissur', state: 'kerala', lat: 10.5276, lng: 76.2144),
  // Madhya Pradesh
  const CityCoord(city: 'bhopal', state: 'madhya pradesh', lat: 23.2599, lng: 77.4126),
  const CityCoord(city: 'indore', state: 'madhya pradesh', lat: 22.7196, lng: 75.8577),
  const CityCoord(city: 'jabalpur', state: 'madhya pradesh', lat: 23.1815, lng: 79.9864),
  const CityCoord(city: 'gwalior', state: 'madhya pradesh', lat: 26.2183, lng: 78.1828),
  const CityCoord(city: 'ujjain', state: 'madhya pradesh', lat: 23.1765, lng: 75.7885),
  // Maharashtra
  const CityCoord(city: 'mumbai', state: 'maharashtra', lat: 19.0760, lng: 72.8777),
  const CityCoord(city: 'pune', state: 'maharashtra', lat: 18.5204, lng: 73.8567),
  const CityCoord(city: 'nagpur', state: 'maharashtra', lat: 21.1458, lng: 79.0882),
  const CityCoord(city: 'thane', state: 'maharashtra', lat: 19.2183, lng: 72.9781),
  const CityCoord(city: 'nashik', state: 'maharashtra', lat: 19.9975, lng: 73.7898),
  const CityCoord(city: 'aurangabad', state: 'maharashtra', lat: 19.8762, lng: 75.3433),
  const CityCoord(city: 'solapur', state: 'maharashtra', lat: 17.6599, lng: 75.9064),
  const CityCoord(city: 'kolhapur', state: 'maharashtra', lat: 16.7050, lng: 74.2433),
  const CityCoord(city: 'amravati', state: 'maharashtra', lat: 20.9374, lng: 77.7796),
  const CityCoord(city: 'navi mumbai', state: 'maharashtra', lat: 19.0330, lng: 73.0297),
  // Manipur
  const CityCoord(city: 'imphal', state: 'manipur', lat: 24.8170, lng: 93.9368),
  // Meghalaya
  const CityCoord(city: 'shillong', state: 'meghalaya', lat: 25.5788, lng: 91.8933),
  // Mizoram
  const CityCoord(city: 'aizawl', state: 'mizoram', lat: 23.7307, lng: 92.7173),
  // Nagaland
  const CityCoord(city: 'kohima', state: 'nagaland', lat: 25.6751, lng: 94.1086),
  // Odisha
  const CityCoord(city: 'bhubaneswar', state: 'odisha', lat: 20.2961, lng: 85.8245),
  const CityCoord(city: 'cuttack', state: 'odisha', lat: 20.4625, lng: 85.8830),
  const CityCoord(city: 'rourkela', state: 'odisha', lat: 22.2511, lng: 84.7839),
  // Punjab
  const CityCoord(city: 'ludhiana', state: 'punjab', lat: 30.9010, lng: 75.8573),
  const CityCoord(city: 'amritsar', state: 'punjab', lat: 31.6340, lng: 74.8723),
  const CityCoord(city: 'jalandhar', state: 'punjab', lat: 31.3260, lng: 75.5762),
  const CityCoord(city: 'patiala', state: 'punjab', lat: 30.3398, lng: 76.3869),
  // Rajasthan
  const CityCoord(city: 'jaipur', state: 'rajasthan', lat: 26.9124, lng: 75.7873),
  const CityCoord(city: 'jodhpur', state: 'rajasthan', lat: 26.2389, lng: 73.0243),
  const CityCoord(city: 'udaipur', state: 'rajasthan', lat: 24.5854, lng: 73.7125),
  const CityCoord(city: 'kota', state: 'rajasthan', lat: 25.2138, lng: 75.8648),
  const CityCoord(city: 'bikaner', state: 'rajasthan', lat: 28.0229, lng: 73.3119),
  const CityCoord(city: 'ajmer', state: 'rajasthan', lat: 26.4499, lng: 74.6399),
  // Sikkim
  const CityCoord(city: 'gangtok', state: 'sikkim', lat: 27.3389, lng: 88.6065),
  // Tamil Nadu
  const CityCoord(city: 'chennai', state: 'tamil nadu', lat: 13.0827, lng: 80.2707),
  const CityCoord(city: 'coimbatore', state: 'tamil nadu', lat: 11.0168, lng: 76.9558),
  const CityCoord(city: 'madurai', state: 'tamil nadu', lat: 9.9252, lng: 78.1198),
  const CityCoord(city: 'tiruchirappalli', state: 'tamil nadu', lat: 10.7905, lng: 78.7047),
  const CityCoord(city: 'salem', state: 'tamil nadu', lat: 11.6643, lng: 78.1460),
  const CityCoord(city: 'tirunelveli', state: 'tamil nadu', lat: 8.7139, lng: 77.7567),
  const CityCoord(city: 'vellore', state: 'tamil nadu', lat: 12.9165, lng: 79.1325),
  // Telangana
  const CityCoord(city: 'hyderabad', state: 'telangana', lat: 17.3850, lng: 78.4867),
  const CityCoord(city: 'warangal', state: 'telangana', lat: 18.0000, lng: 79.5833),
  const CityCoord(city: 'nizamabad', state: 'telangana', lat: 18.6721, lng: 78.0940),
  const CityCoord(city: 'karimnagar', state: 'telangana', lat: 18.4386, lng: 79.1288),
  // Tripura
  const CityCoord(city: 'agartala', state: 'tripura', lat: 23.8315, lng: 91.2868),
  // Uttar Pradesh
  const CityCoord(city: 'lucknow', state: 'uttar pradesh', lat: 26.8467, lng: 80.9462),
  const CityCoord(city: 'kanpur', state: 'uttar pradesh', lat: 26.4499, lng: 80.3319),
  const CityCoord(city: 'agra', state: 'uttar pradesh', lat: 27.1751, lng: 78.0421),
  const CityCoord(city: 'varanasi', state: 'uttar pradesh', lat: 25.3176, lng: 82.9739),
  const CityCoord(city: 'prayagraj', state: 'uttar pradesh', lat: 25.4358, lng: 81.8463),
  const CityCoord(city: 'ghaziabad', state: 'uttar pradesh', lat: 28.6692, lng: 77.4538),
  const CityCoord(city: 'noida', state: 'uttar pradesh', lat: 28.5355, lng: 77.3910),
  const CityCoord(city: 'meerut', state: 'uttar pradesh', lat: 28.9845, lng: 77.7064),
  const CityCoord(city: 'bareilly', state: 'uttar pradesh', lat: 28.3641, lng: 79.4220),
  const CityCoord(city: 'agra', state: 'uttar pradesh', lat: 27.1751, lng: 78.0421),
  // Uttarakhand
  const CityCoord(city: 'dehradun', state: 'uttarakhand', lat: 30.3165, lng: 78.0322),
  const CityCoord(city: 'haridwar', state: 'uttarakhand', lat: 29.9457, lng: 78.1642),
  const CityCoord(city: 'rishikesh', state: 'uttarakhand', lat: 30.0869, lng: 78.2676),
  // West Bengal
  const CityCoord(city: 'kolkata', state: 'west bengal', lat: 22.5726, lng: 88.3639),
  const CityCoord(city: 'howrah', state: 'west bengal', lat: 22.5958, lng: 88.2636),
  const CityCoord(city: 'durgapur', state: 'west bengal', lat: 23.5204, lng: 87.3119),
  const CityCoord(city: 'asansol', state: 'west bengal', lat: 23.6833, lng: 86.9833),
  const CityCoord(city: 'siliguri', state: 'west bengal', lat: 26.7271, lng: 88.3953),
];

CityCoord? extractCity(String address) {
  final lower = address.toLowerCase();
  for (final c in indianCities) {
    if (lower.contains(c.city)) return c;
  }
  for (final c in indianCities) {
    if (lower.contains(c.state)) return c;
  }
  return null;
}

List<DeliveryLocation> aggregateDeliveries(
  List<InvoiceRow> rows, {
  double officeLat = 19.0760,
  double officeLng = 72.8777,
}) {
  final cityMap = <String, DeliveryLocation>{};

  for (final row in rows) {
    final address = row.consigneeAddress.isNotEmpty
        ? row.consigneeAddress
        : row.buyerAddress;
    final coord = extractCity(address);
    if (coord == null) continue;

    final key = '${coord.lat},${coord.lng}';
    if (cityMap.containsKey(key)) {
      final loc = cityMap[key]!;
      loc.deliveries++;
      loc.totalValue += row.invoiceTotal;
      loc.avgDistanceKm =
          (loc.avgDistanceKm + row.approxDistanceKm) / 2;
      if (row.vehicleNumber.isNotEmpty &&
          !loc.vehicles.contains(row.vehicleNumber)) {
        loc.vehicles.add(row.vehicleNumber);
      }
      if (row.invoiceNumber.isNotEmpty) {
        loc.invoices.add(row.invoiceNumber);
      }
      if (row.buyerName.isNotEmpty &&
          !loc.buyers.contains(row.buyerName)) {
        loc.buyers.add(row.buyerName);
      }
    } else {
      cityMap[key] = DeliveryLocation(
        city: coord.city,
        state: coord.state,
        lat: coord.lat,
        lng: coord.lng,
        deliveries: 1,
        totalValue: row.invoiceTotal,
        avgDistanceKm: row.approxDistanceKm,
        vehicles: row.vehicleNumber.isNotEmpty
            ? [row.vehicleNumber]
            : [],
        invoices: row.invoiceNumber.isNotEmpty
            ? [row.invoiceNumber]
            : [],
        buyers: row.buyerName.isNotEmpty
            ? [row.buyerName]
            : [],
      );
    }
  }

  return cityMap.values.toList();
}
