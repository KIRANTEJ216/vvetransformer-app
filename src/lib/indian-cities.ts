export interface CityCoord {
  city: string
  state: string
  lat: number
  lng: number
}

const cities: CityCoord[] = [
  // Andhra Pradesh
  { city: "visakhapatnam", state: "andhra pradesh", lat: 17.6868, lng: 83.2185 },
  { city: "vijayawada", state: "andhra pradesh", lat: 16.5062, lng: 80.6480 },
  { city: "guntur", state: "andhra pradesh", lat: 16.3067, lng: 80.4365 },
  { city: "nellore", state: "andhra pradesh", lat: 14.4426, lng: 79.9865 },
  { city: "kurnool", state: "andhra pradesh", lat: 15.8281, lng: 78.0373 },
  { city: "kakinada", state: "andhra pradesh", lat: 16.9891, lng: 82.2475 },
  { city: "rajahmundry", state: "andhra pradesh", lat: 17.0005, lng: 81.8040 },
  { city: "tirupati", state: "andhra pradesh", lat: 13.6288, lng: 79.4192 },
  { city: "anantapur", state: "andhra pradesh", lat: 14.6819, lng: 77.6006 },
  // Arunachal Pradesh
  { city: "itanagar", state: "arunachal pradesh", lat: 27.0844, lng: 93.6053 },
  // Assam
  { city: "guwahati", state: "assam", lat: 26.1445, lng: 91.7362 },
  { city: "silchar", state: "assam", lat: 24.8333, lng: 92.7789 },
  { city: "dibrugarh", state: "assam", lat: 27.4728, lng: 94.9120 },
  { city: "jorhat", state: "assam", lat: 26.7508, lng: 94.2037 },
  // Bihar
  { city: "patna", state: "bihar", lat: 25.5941, lng: 85.1376 },
  { city: "gaya", state: "bihar", lat: 24.7955, lng: 84.9994 },
  { city: "bhagalpur", state: "bihar", lat: 25.2425, lng: 86.9842 },
  { city: "muzaffarpur", state: "bihar", lat: 26.1209, lng: 85.3647 },
  { city: "purnia", state: "bihar", lat: 25.7800, lng: 87.4700 },
  { city: "darbhanga", state: "bihar", lat: 26.1542, lng: 85.8918 },
  // Chandigarh
  { city: "chandigarh", state: "chandigarh", lat: 30.7333, lng: 76.7794 },
  // Chhattisgarh
  { city: "raipur", state: "chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { city: "bilaspur", state: "chhattisgarh", lat: 22.0796, lng: 82.1391 },
  { city: "bhilai", state: "chhattisgarh", lat: 21.2167, lng: 81.4333 },
  { city: "korba", state: "chhattisgarh", lat: 22.3500, lng: 82.6833 },
  // Delhi
  { city: "delhi", state: "delhi", lat: 28.7041, lng: 77.1025 },
  { city: "new delhi", state: "delhi", lat: 28.6139, lng: 77.2090 },
  // Goa
  { city: "panaji", state: "goa", lat: 15.4909, lng: 73.8278 },
  { city: "margao", state: "goa", lat: 15.2719, lng: 73.9583 },
  // Gujarat
  { city: "ahmedabad", state: "gujarat", lat: 23.0225, lng: 72.5714 },
  { city: "surat", state: "gujarat", lat: 21.1702, lng: 72.8311 },
  { city: "vadodara", state: "gujarat", lat: 22.3072, lng: 73.1812 },
  { city: "rajkot", state: "gujarat", lat: 22.3039, lng: 70.8022 },
  { city: "bhavnagar", state: "gujarat", lat: 21.7645, lng: 72.1519 },
  { city: "jamnagar", state: "gujarat", lat: 22.4707, lng: 70.0577 },
  { city: "gandhinagar", state: "gujarat", lat: 23.2156, lng: 72.6369 },
  { city: "anand", state: "gujarat", lat: 22.5645, lng: 72.9289 },
  // Haryana
  { city: "faridabad", state: "haryana", lat: 28.4089, lng: 77.3178 },
  { city: "gurugram", state: "haryana", lat: 28.4595, lng: 77.0266 },
  { city: "gurgaon", state: "haryana", lat: 28.4595, lng: 77.0266 },
  { city: "panipat", state: "haryana", lat: 29.3845, lng: 76.9693 },
  { city: "ambala", state: "haryana", lat: 30.3752, lng: 76.7821 },
  { city: "karnal", state: "haryana", lat: 29.6857, lng: 76.9905 },
  { city: "rohtak", state: "haryana", lat: 28.8955, lng: 76.6066 },
  // Himachal Pradesh
  { city: "shimla", state: "himachal pradesh", lat: 31.1048, lng: 77.1734 },
  { city: "dharamshala", state: "himachal pradesh", lat: 32.2190, lng: 76.3234 },
  { city: "solan", state: "himachal pradesh", lat: 30.9045, lng: 77.0967 },
  // Jammu & Kashmir
  { city: "jammu", state: "jammu and kashmir", lat: 32.7266, lng: 74.8570 },
  { city: "srinagar", state: "jammu and kashmir", lat: 34.0837, lng: 74.7973 },
  // Jharkhand
  { city: "ranchi", state: "jharkhand", lat: 23.3441, lng: 85.3096 },
  { city: "jamshedpur", state: "jharkhand", lat: 22.8046, lng: 86.2029 },
  { city: "dhanbad", state: "jharkhand", lat: 23.7957, lng: 86.4304 },
  { city: "bokaro", state: "jharkhand", lat: 23.6693, lng: 86.1511 },
  // Karnataka
  { city: "bengaluru", state: "karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "bangalore", state: "karnataka", lat: 12.9716, lng: 77.5946 },
  { city: "mysuru", state: "karnataka", lat: 12.2958, lng: 76.6394 },
  { city: "mysore", state: "karnataka", lat: 12.2958, lng: 76.6394 },
  { city: "hubli", state: "karnataka", lat: 15.3647, lng: 75.1240 },
  { city: "dharwad", state: "karnataka", lat: 15.4589, lng: 75.0078 },
  { city: "mangaluru", state: "karnataka", lat: 12.9141, lng: 74.8560 },
  { city: "mangalore", state: "karnataka", lat: 12.9141, lng: 74.8560 },
  { city: "belagavi", state: "karnataka", lat: 15.8497, lng: 74.4977 },
  { city: "belgaum", state: "karnataka", lat: 15.8497, lng: 74.4977 },
  { city: "davangere", state: "karnataka", lat: 14.4644, lng: 75.9218 },
  { city: "bellary", state: "karnataka", lat: 15.1394, lng: 76.9214 },
  { city: "tumkur", state: "karnataka", lat: 13.3379, lng: 77.1173 },
  { city: "udupi", state: "karnataka", lat: 13.3409, lng: 74.7421 },
  // Kerala
  { city: "thiruvananthapuram", state: "kerala", lat: 8.5241, lng: 76.9366 },
  { city: "trivandrum", state: "kerala", lat: 8.5241, lng: 76.9366 },
  { city: "kochi", state: "kerala", lat: 9.9312, lng: 76.2673 },
  { city: "cochin", state: "kerala", lat: 9.9312, lng: 76.2673 },
  { city: "kozhikode", state: "kerala", lat: 11.2588, lng: 75.7804 },
  { city: "calicut", state: "kerala", lat: 11.2588, lng: 75.7804 },
  { city: "thrissur", state: "kerala", lat: 10.5276, lng: 76.2144 },
  { city: "kollam", state: "kerala", lat: 8.8873, lng: 76.6233 },
  { city: "alappuzha", state: "kerala", lat: 9.4981, lng: 76.3388 },
  { city: "palakkad", state: "kerala", lat: 10.7867, lng: 76.6548 },
  { city: "kannur", state: "kerala", lat: 11.8745, lng: 75.3704 },
  // Madhya Pradesh
  { city: "bhopal", state: "madhya pradesh", lat: 23.2599, lng: 77.4126 },
  { city: "indore", state: "madhya pradesh", lat: 22.7196, lng: 75.8577 },
  { city: "jabalpur", state: "madhya pradesh", lat: 23.1815, lng: 79.9864 },
  { city: "gwalior", state: "madhya pradesh", lat: 26.2183, lng: 78.1828 },
  { city: "ujjain", state: "madhya pradesh", lat: 23.1765, lng: 75.7885 },
  { city: "sagar", state: "madhya pradesh", lat: 23.8388, lng: 78.7378 },
  { city: "dewas", state: "madhya pradesh", lat: 22.9579, lng: 76.0541 },
  { city: "satna", state: "madhya pradesh", lat: 24.6005, lng: 80.8322 },
  { city: "ratlam", state: "madhya pradesh", lat: 23.3303, lng: 75.0403 },
  // Maharashtra
  { city: "mumbai", state: "maharashtra", lat: 19.0760, lng: 72.8777 },
  { city: "pune", state: "maharashtra", lat: 18.5204, lng: 73.8567 },
  { city: "nagpur", state: "maharashtra", lat: 21.1458, lng: 79.0882 },
  { city: "thane", state: "maharashtra", lat: 19.2183, lng: 72.9781 },
  { city: "nashik", state: "maharashtra", lat: 19.9975, lng: 73.7898 },
  { city: "aurangabad", state: "maharashtra", lat: 19.8762, lng: 75.3433 },
  { city: "solapur", state: "maharashtra", lat: 17.6599, lng: 75.9064 },
  { city: "kolhapur", state: "maharashtra", lat: 16.7050, lng: 74.2433 },
  { city: "amravati", state: "maharashtra", lat: 20.9374, lng: 77.7796 },
  { city: "navi mumbai", state: "maharashtra", lat: 19.0330, lng: 73.0297 },
  { city: "vasai", state: "maharashtra", lat: 19.3500, lng: 72.8000 },
  { city: "jalgaon", state: "maharashtra", lat: 21.0020, lng: 75.5703 },
  { city: "akola", state: "maharashtra", lat: 20.7049, lng: 77.0021 },
  { city: "latur", state: "maharashtra", lat: 18.4088, lng: 76.5604 },
  { city: "ahmednagar", state: "maharashtra", lat: 19.0948, lng: 74.7581 },
  { city: "dhule", state: "maharashtra", lat: 20.9042, lng: 74.7749 },
  { city: "satara", state: "maharashtra", lat: 17.6809, lng: 74.0185 },
  { city: "sangli", state: "maharashtra", lat: 16.8661, lng: 74.5673 },
  { city: "malegaon", state: "maharashtra", lat: 20.5467, lng: 74.5203 },
  // Manipur
  { city: "imphal", state: "manipur", lat: 24.8170, lng: 93.9368 },
  // Meghalaya
  { city: "shillong", state: "meghalaya", lat: 25.5788, lng: 91.8933 },
  // Mizoram
  { city: "aizawl", state: "mizoram", lat: 23.7307, lng: 92.7173 },
  // Nagaland
  { city: "kohima", state: "nagaland", lat: 25.6751, lng: 94.1086 },
  { city: "dimapur", state: "nagaland", lat: 25.9116, lng: 93.7438 },
  // Odisha
  { city: "bhubaneswar", state: "odisha", lat: 20.2961, lng: 85.8245 },
  { city: "cuttack", state: "odisha", lat: 20.4625, lng: 85.8830 },
  { city: "rourkela", state: "odisha", lat: 22.2511, lng: 84.7839 },
  { city: "sambalpur", state: "odisha", lat: 21.4653, lng: 83.9782 },
  { city: "berhampur", state: "odisha", lat: 19.3150, lng: 84.7941 },
  { city: "puri", state: "odisha", lat: 19.8135, lng: 85.8315 },
  // Puducherry
  { city: "puducherry", state: "puducherry", lat: 11.9416, lng: 79.8083 },
  // Punjab
  { city: "ludhiana", state: "punjab", lat: 30.9010, lng: 75.8573 },
  { city: "amritsar", state: "punjab", lat: 31.6340, lng: 74.8723 },
  { city: "jalandhar", state: "punjab", lat: 31.3260, lng: 75.5762 },
  { city: "patiala", state: "punjab", lat: 30.3398, lng: 76.3869 },
  { city: "bathinda", state: "punjab", lat: 30.2110, lng: 74.9455 },
  { city: "mohali", state: "punjab", lat: 30.7046, lng: 76.7179 },
  // Rajasthan
  { city: "jaipur", state: "rajasthan", lat: 26.9124, lng: 75.7873 },
  { city: "jodhpur", state: "rajasthan", lat: 26.2389, lng: 73.0243 },
  { city: "udaipur", state: "rajasthan", lat: 24.5854, lng: 73.7125 },
  { city: "kota", state: "rajasthan", lat: 25.2138, lng: 75.8648 },
  { city: "bikaner", state: "rajasthan", lat: 28.0229, lng: 73.3119 },
  { city: "ajmer", state: "rajasthan", lat: 26.4499, lng: 74.6399 },
  { city: "bhilwara", state: "rajasthan", lat: 25.3470, lng: 74.6349 },
  { city: "alwar", state: "rajasthan", lat: 27.5532, lng: 76.6345 },
  { city: "sikar", state: "rajasthan", lat: 27.6148, lng: 75.1395 },
  { city: "sri ganganagar", state: "rajasthan", lat: 29.9090, lng: 73.8818 },
  // Sikkim
  { city: "gangtok", state: "sikkim", lat: 27.3389, lng: 88.6065 },
  // Tamil Nadu
  { city: "chennai", state: "tamil nadu", lat: 13.0827, lng: 80.2707 },
  { city: "madras", state: "tamil nadu", lat: 13.0827, lng: 80.2707 },
  { city: "coimbatore", state: "tamil nadu", lat: 11.0168, lng: 76.9558 },
  { city: "madurai", state: "tamil nadu", lat: 9.9252, lng: 78.1198 },
  { city: "tiruchirappalli", state: "tamil nadu", lat: 10.7905, lng: 78.7047 },
  { city: "trichy", state: "tamil nadu", lat: 10.7905, lng: 78.7047 },
  { city: "salem", state: "tamil nadu", lat: 11.6643, lng: 78.1460 },
  { city: "tirunelveli", state: "tamil nadu", lat: 8.7139, lng: 77.7567 },
  { city: "vellore", state: "tamil nadu", lat: 12.9165, lng: 79.1325 },
  { city: "erode", state: "tamil nadu", lat: 11.3410, lng: 77.7172 },
  { city: "thoothukudi", state: "tamil nadu", lat: 8.7642, lng: 78.1348 },
  { city: "tuticorin", state: "tamil nadu", lat: 8.7642, lng: 78.1348 },
  { city: "dindigul", state: "tamil nadu", lat: 10.3600, lng: 77.9700 },
  { city: "nagercoil", state: "tamil nadu", lat: 8.1789, lng: 77.4300 },
  { city: "kanchipuram", state: "tamil nadu", lat: 12.8342, lng: 79.7030 },
  { city: "kumbakonam", state: "tamil nadu", lat: 10.9608, lng: 79.3712 },
  // Telangana
  { city: "hyderabad", state: "telangana", lat: 17.3850, lng: 78.4867 },
  { city: "secunderabad", state: "telangana", lat: 17.4344, lng: 78.5016 },
  { city: "warangal", state: "telangana", lat: 18.0000, lng: 79.5833 },
  { city: "nizamabad", state: "telangana", lat: 18.6721, lng: 78.0940 },
  { city: "karimnagar", state: "telangana", lat: 18.4386, lng: 79.1288 },
  { city: "khammam", state: "telangana", lat: 17.2473, lng: 80.1514 },
  // Tripura
  { city: "agartala", state: "tripura", lat: 23.8315, lng: 91.2868 },
  // Uttar Pradesh
  { city: "lucknow", state: "uttar pradesh", lat: 26.8467, lng: 80.9462 },
  { city: "kanpur", state: "uttar pradesh", lat: 26.4499, lng: 80.3319 },
  { city: "agra", state: "uttar pradesh", lat: 27.1751, lng: 78.0421 },
  { city: "varanasi", state: "uttar pradesh", lat: 25.3176, lng: 82.9739 },
  { city: "prayagraj", state: "uttar pradesh", lat: 25.4358, lng: 81.8463 },
  { city: "allahabad", state: "uttar pradesh", lat: 25.4358, lng: 81.8463 },
  { city: "ghaziabad", state: "uttar pradesh", lat: 28.6692, lng: 77.4538 },
  { city: "noida", state: "uttar pradesh", lat: 28.5355, lng: 77.3910 },
  { city: "meerut", state: "uttar pradesh", lat: 28.9845, lng: 77.7064 },
  { city: "bareilly", state: "uttar pradesh", lat: 28.3641, lng: 79.4220 },
  { city: "gorakhpur", state: "uttar pradesh", lat: 26.7606, lng: 83.3732 },
  { city: "moradabad", state: "uttar pradesh", lat: 28.8410, lng: 78.7565 },
  { city: "aligarh", state: "uttar pradesh", lat: 27.8891, lng: 78.0748 },
  { city: "saharanpur", state: "uttar pradesh", lat: 29.9679, lng: 77.5465 },
  { city: "mathura", state: "uttar pradesh", lat: 27.4924, lng: 77.6737 },
  { city: "jhansi", state: "uttar pradesh", lat: 25.4484, lng: 78.5685 },
  { city: "ayodhya", state: "uttar pradesh", lat: 26.7999, lng: 82.2050 },
  // Uttarakhand
  { city: "dehradun", state: "uttarakhand", lat: 30.3165, lng: 78.0322 },
  { city: "haridwar", state: "uttarakhand", lat: 29.9457, lng: 78.1642 },
  { city: "rishikesh", state: "uttarakhand", lat: 30.0869, lng: 78.2676 },
  { city: "haldwani", state: "uttarakhand", lat: 29.2225, lng: 79.5286 },
  // West Bengal
  { city: "kolkata", state: "west bengal", lat: 22.5726, lng: 88.3639 },
  { city: "howrah", state: "west bengal", lat: 22.5958, lng: 88.2636 },
  { city: "durgapur", state: "west bengal", lat: 23.5204, lng: 87.3119 },
  { city: "asansol", state: "west bengal", lat: 23.6833, lng: 86.9833 },
  { city: "siliguri", state: "west bengal", lat: 26.7271, lng: 88.3953 },
  { city: "bardhaman", state: "west bengal", lat: 23.2400, lng: 87.8600 },
  { city: "malda", state: "west bengal", lat: 25.0100, lng: 88.1500 },
  // Central office default
  { city: "central", state: "maharashtra", lat: 19.0760, lng: 72.8777 },
]

const cityIndex = new Map<string, CityCoord>()
cities.forEach((c) => {
  cityIndex.set(c.city, c)
  cityIndex.set(c.city.replace(/[\s-]+/g, ""), c)
})

export function extractCity(address: string): CityCoord | null {
  if (!address) return null
  const lower = address.toLowerCase()

  for (const c of cities) {
    if (lower.includes(c.city)) return c
  }

  const stateMatch = cities.find((c) => lower.includes(c.state))
  if (stateMatch) return stateMatch

  return null
}

export function getOfficeLocation(): CityCoord {
  return { city: "office", state: "maharashtra", lat: 19.0760, lng: 72.8777 }
}
