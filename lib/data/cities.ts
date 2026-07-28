export interface City {
  id: string; // stable slug, e.g. "nyc", "tyo" — lowercase, no spaces
  name: string; // display name, e.g. "New York"
  country: string; // e.g. "United States"
  airportCode?: string; // IATA code if it's a well-known airport hub, e.g. "JFK" — optional
  timeZone: string; // IANA time zone name, e.g. "America/New_York"
}

export const CITIES: City[] = [
  // North America - USA
  { id: "nyc", name: "New York", country: "United States", airportCode: "JFK", timeZone: "America/New_York" },
  { id: "lax", name: "Los Angeles", country: "United States", airportCode: "LAX", timeZone: "America/Los_Angeles" },
  { id: "chi", name: "Chicago", country: "United States", airportCode: "ORD", timeZone: "America/Chicago" },
  { id: "dal", name: "Dallas", country: "United States", airportCode: "DFW", timeZone: "America/Chicago" },
  { id: "denver", name: "Denver", country: "United States", airportCode: "DEN", timeZone: "America/Denver" },
  { id: "mia", name: "Miami", country: "United States", airportCode: "MIA", timeZone: "America/New_York" },
  { id: "sf", name: "San Francisco", country: "United States", airportCode: "SFO", timeZone: "America/Los_Angeles" },
  { id: "sea", name: "Seattle", country: "United States", airportCode: "SEA", timeZone: "America/Los_Angeles" },
  { id: "phx", name: "Phoenix", country: "United States", timeZone: "America/Phoenix" },
  { id: "bos", name: "Boston", country: "United States", airportCode: "BOS", timeZone: "America/New_York" },
  { id: "philly", name: "Philadelphia", country: "United States", timeZone: "America/New_York" },
  { id: "atl", name: "Atlanta", country: "United States", airportCode: "ATL", timeZone: "America/New_York" },
  { id: "hnd", name: "Honolulu", country: "United States", airportCode: "HNL", timeZone: "Pacific/Honolulu" },
  { id: "anc", name: "Anchorage", country: "United States", airportCode: "ANC", timeZone: "America/Anchorage" },

  // North America - Canada
  { id: "tor", name: "Toronto", country: "Canada", airportCode: "YYZ", timeZone: "America/Toronto" },
  { id: "van", name: "Vancouver", country: "Canada", airportCode: "YVR", timeZone: "America/Vancouver" },
  { id: "mtl", name: "Montreal", country: "Canada", airportCode: "YUL", timeZone: "America/Toronto" },
  { id: "yeg", name: "Edmonton", country: "Canada", timeZone: "America/Edmonton" },

  // North America - Mexico
  { id: "mex", name: "Mexico City", country: "Mexico", airportCode: "MEX", timeZone: "America/Mexico_City" },
  { id: "can", name: "Cancún", country: "Mexico", timeZone: "America/Cancun" },

  // South America
  { id: "sp", name: "São Paulo", country: "Brazil", airportCode: "GIG", timeZone: "America/Sao_Paulo" },
  { id: "rio", name: "Rio de Janeiro", country: "Brazil", timeZone: "America/Sao_Paulo" },
  { id: "bsas", name: "Buenos Aires", country: "Argentina", airportCode: "EZE", timeZone: "America/Argentina/Buenos_Aires" },
  { id: "lima", name: "Lima", country: "Peru", airportCode: "LIM", timeZone: "America/Lima" },
  { id: "bog", name: "Bogotá", country: "Colombia", airportCode: "BOG", timeZone: "America/Bogota" },
  { id: "santiago", name: "Santiago", country: "Chile", airportCode: "SCL", timeZone: "America/Santiago" },
  { id: "caracas", name: "Caracas", country: "Venezuela", timeZone: "America/Caracas" },
  { id: "quito", name: "Quito", country: "Ecuador", timeZone: "America/Guayaquil" },

  // Europe - West
  { id: "lhr", name: "London", country: "United Kingdom", airportCode: "LHR", timeZone: "Europe/London" },
  { id: "paris", name: "Paris", country: "France", airportCode: "CDG", timeZone: "Europe/Paris" },
  { id: "madrid", name: "Madrid", country: "Spain", airportCode: "MAD", timeZone: "Europe/Madrid" },
  { id: "barcelona", name: "Barcelona", country: "Spain", timeZone: "Europe/Madrid" },
  { id: "dublin", name: "Dublin", country: "Ireland", airportCode: "DUB", timeZone: "Europe/Dublin" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", timeZone: "Europe/Lisbon" },

  // Europe - Central
  { id: "berlin", name: "Berlin", country: "Germany", airportCode: "BER", timeZone: "Europe/Berlin" },
  { id: "frankfurt", name: "Frankfurt", country: "Germany", timeZone: "Europe/Berlin" },
  { id: "munich", name: "Munich", country: "Germany", timeZone: "Europe/Berlin" },
  { id: "vienna", name: "Vienna", country: "Austria", airportCode: "VIE", timeZone: "Europe/Vienna" },
  { id: "prague", name: "Prague", country: "Czech Republic", timeZone: "Europe/Prague" },
  { id: "warsaw", name: "Warsaw", country: "Poland", timeZone: "Europe/Warsaw" },
  { id: "budapest", name: "Budapest", country: "Hungary", timeZone: "Europe/Budapest" },
  { id: "zurich", name: "Zurich", country: "Switzerland", airportCode: "ZRH", timeZone: "Europe/Zurich" },
  { id: "geneva", name: "Geneva", country: "Switzerland", timeZone: "Europe/Zurich" },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", airportCode: "AMS", timeZone: "Europe/Amsterdam" },
  { id: "brussels", name: "Brussels", country: "Belgium", airportCode: "BRU", timeZone: "Europe/Brussels" },
  { id: "rome", name: "Rome", country: "Italy", airportCode: "FCO", timeZone: "Europe/Rome" },
  { id: "milan", name: "Milan", country: "Italy", timeZone: "Europe/Rome" },
  { id: "athens", name: "Athens", country: "Greece", airportCode: "ATH", timeZone: "Europe/Athens" },

  // Europe - North
  { id: "stockholm", name: "Stockholm", country: "Sweden", airportCode: "ARN", timeZone: "Europe/Stockholm" },
  { id: "helsinki", name: "Helsinki", country: "Finland", timeZone: "Europe/Helsinki" },
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", airportCode: "CPH", timeZone: "Europe/Copenhagen" },
  { id: "oslo", name: "Oslo", country: "Norway", airportCode: "OSL", timeZone: "Europe/Oslo" },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", airportCode: "KEF", timeZone: "Atlantic/Reykjavik" },

  // Europe - South/East
  { id: "istanbul", name: "Istanbul", country: "Turkey", airportCode: "IST", timeZone: "Europe/Istanbul" },
  { id: "moscow", name: "Moscow", country: "Russia", airportCode: "SVO", timeZone: "Europe/Moscow" },

  // Africa - North
  { id: "cairo", name: "Cairo", country: "Egypt", airportCode: "CAI", timeZone: "Africa/Cairo" },
  { id: "casablanca", name: "Casablanca", country: "Morocco", timeZone: "Africa/Casablanca" },
  { id: "marrakech", name: "Marrakech", country: "Morocco", timeZone: "Africa/Casablanca" },

  // Africa - West
  { id: "lagos", name: "Lagos", country: "Nigeria", timeZone: "Africa/Lagos" },
  { id: "accra", name: "Accra", country: "Ghana", timeZone: "Africa/Accra" },
  { id: "dakar", name: "Dakar", country: "Senegal", timeZone: "Africa/Dakar" },

  // Africa - East
  { id: "nairobi", name: "Nairobi", country: "Kenya", airportCode: "NBO", timeZone: "Africa/Nairobi" },
  { id: "dar", name: "Dar es Salaam", country: "Tanzania", timeZone: "Africa/Dar_es_Salaam" },
  { id: "addis", name: "Addis Ababa", country: "Ethiopia", timeZone: "Africa/Addis_Ababa" },

  // Africa - South
  { id: "joburg", name: "Johannesburg", country: "South Africa", airportCode: "JNB", timeZone: "Africa/Johannesburg" },
  { id: "cape", name: "Cape Town", country: "South Africa", timeZone: "Africa/Johannesburg" },

  // Middle East
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", airportCode: "DXB", timeZone: "Asia/Dubai" },
  { id: "abudhabi", name: "Abu Dhabi", country: "United Arab Emirates", timeZone: "Asia/Dubai" },
  { id: "doha", name: "Doha", country: "Qatar", airportCode: "DOH", timeZone: "Asia/Qatar" },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", airportCode: "RIA", timeZone: "Asia/Riyadh" },
  { id: "jeddah", name: "Jeddah", country: "Saudi Arabia", timeZone: "Asia/Riyadh" },
  { id: "tehran", name: "Tehran", country: "Iran", airportCode: "IKA", timeZone: "Asia/Tehran" },
  { id: "kuwait", name: "Kuwait City", country: "Kuwait", timeZone: "Asia/Kuwait" },
  { id: "muscat", name: "Muscat", country: "Oman", timeZone: "Asia/Muscat" },
  { id: "tlv", name: "Tel Aviv", country: "Israel", airportCode: "TLV", timeZone: "Asia/Jerusalem" },
  { id: "amman", name: "Amman", country: "Jordan", timeZone: "Asia/Amman" },
  { id: "beirut", name: "Beirut", country: "Lebanon", timeZone: "Asia/Beirut" },
  { id: "baghdad", name: "Baghdad", country: "Iraq", timeZone: "Asia/Baghdad" },

  // Central Asia
  { id: "almaty", name: "Almaty", country: "Kazakhstan", timeZone: "Asia/Almaty" },
  { id: "tashkent", name: "Tashkent", country: "Uzbekistan", timeZone: "Asia/Tashkent" },
  { id: "baku", name: "Baku", country: "Azerbaijan", timeZone: "Asia/Baku" },

  // South Asia
  { id: "delhi", name: "Delhi", country: "India", timeZone: "Asia/Kolkata" },
  { id: "mumbai", name: "Mumbai", country: "India", airportCode: "BOM", timeZone: "Asia/Kolkata" },
  { id: "bangalore", name: "Bangalore", country: "India", timeZone: "Asia/Kolkata" },
  { id: "kolkata", name: "Kolkata", country: "India", timeZone: "Asia/Kolkata" },
  { id: "lahore", name: "Lahore", country: "Pakistan", timeZone: "Asia/Karachi" },
  { id: "karachi", name: "Karachi", country: "Pakistan", airportCode: "KHI", timeZone: "Asia/Karachi" },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", airportCode: "DAC", timeZone: "Asia/Dhaka" },
  { id: "colombo", name: "Colombo", country: "Sri Lanka", timeZone: "Asia/Colombo" },

  // Southeast Asia
  { id: "bangkok", name: "Bangkok", country: "Thailand", airportCode: "BKK", timeZone: "Asia/Bangkok" },
  { id: "singapore", name: "Singapore", country: "Singapore", airportCode: "SIN", timeZone: "Asia/Singapore" },
  { id: "kl", name: "Kuala Lumpur", country: "Malaysia", airportCode: "KUL", timeZone: "Asia/Kuala_Lumpur" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", airportCode: "CGK", timeZone: "Asia/Jakarta" },
  { id: "bali", name: "Bali", country: "Indonesia", timeZone: "Asia/Jakarta" },
  { id: "surabaya", name: "Surabaya", country: "Indonesia", timeZone: "Asia/Jakarta" },
  { id: "manila", name: "Manila", country: "Philippines", airportCode: "MNL", timeZone: "Asia/Manila" },
  { id: "hcm", name: "Ho Chi Minh City", country: "Vietnam", airportCode: "SGN", timeZone: "Asia/Ho_Chi_Minh" },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", airportCode: "HAN", timeZone: "Asia/Ho_Chi_Minh" },
  { id: "phnom_penh", name: "Phnom Penh", country: "Cambodia", timeZone: "Asia/Bangkok" },

  // East Asia
  { id: "hong_kong", name: "Hong Kong", country: "Hong Kong", airportCode: "HKG", timeZone: "Asia/Hong_Kong" },
  { id: "shanghai", name: "Shanghai", country: "China", airportCode: "PVG", timeZone: "Asia/Shanghai" },
  { id: "beijing", name: "Beijing", country: "China", airportCode: "PEI", timeZone: "Asia/Shanghai" },
  { id: "chongqing", name: "Chongqing", country: "China", timeZone: "Asia/Shanghai" },
  { id: "guangzhou", name: "Guangzhou", country: "China", timeZone: "Asia/Shanghai" },
  { id: "chengdu", name: "Chengdu", country: "China", timeZone: "Asia/Shanghai" },
  { id: "shenzhen", name: "Shenzhen", country: "China", timeZone: "Asia/Shanghai" },
  { id: "seoul", name: "Seoul", country: "South Korea", airportCode: "ICN", timeZone: "Asia/Seoul" },
  { id: "busan", name: "Busan", country: "South Korea", timeZone: "Asia/Seoul" },
  { id: "tokyo", name: "Tokyo", country: "Japan", airportCode: "NRT", timeZone: "Asia/Tokyo" },
  { id: "osaka", name: "Osaka", country: "Japan", airportCode: "KIX", timeZone: "Asia/Tokyo" },
  { id: "kyoto", name: "Kyoto", country: "Japan", timeZone: "Asia/Tokyo" },
  { id: "tokyo_haneda", name: "Haneda (Tokyo)", country: "Japan", airportCode: "HND", timeZone: "Asia/Tokyo" },
  { id: "taipei", name: "Taipei", country: "Taiwan", airportCode: "TPE", timeZone: "Asia/Taipei" },

  // Oceania - Australia
  { id: "sydney", name: "Sydney", country: "Australia", airportCode: "SYD", timeZone: "Australia/Sydney" },
  { id: "melbourne", name: "Melbourne", country: "Australia", airportCode: "MEL", timeZone: "Australia/Melbourne" },
  { id: "brisbane", name: "Brisbane", country: "Australia", airportCode: "BNE", timeZone: "Australia/Brisbane" },
  { id: "perth", name: "Perth", country: "Australia", airportCode: "PER", timeZone: "Australia/Perth" },
  { id: "adelaide", name: "Adelaide", country: "Australia", timeZone: "Australia/Adelaide" },

  // Oceania - New Zealand & Pacific
  { id: "auckland", name: "Auckland", country: "New Zealand", airportCode: "AKL", timeZone: "Pacific/Auckland" },
  { id: "wellington", name: "Wellington", country: "New Zealand", timeZone: "Pacific/Auckland" },
  { id: "fiji", name: "Suva", country: "Fiji", timeZone: "Pacific/Fiji" },
];
