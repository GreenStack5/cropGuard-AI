import type {
  Alert,
  Disease,
  PreventionTip,
  ScanRecord,
  UserProfile,
} from '../types'

export const currentUser: UserProfile = {
  name: 'Amara Okafor',
  email: 'amara.okafor@farm.com',
  phone: '+234 803 555 0192',
  location: 'Kwara State, Nigeria',
  farmName: 'Greenleaf Acres',
  farmSize: '12 hectares',
  primaryCrops: 'Maize, Cassava, Tomato',
  memberSince: 'March 2024',
  timezone: 'West Africa Time (UTC+1)',
}

export const crops = [
  { id: 'c1', name: 'Maize', category: 'Cereal', },
  { id: 'c2', name: 'Tomato', category: 'Vegetable', },
  { id: 'c3', name: 'Cassava', category: 'Root crop', },
  { id: 'c4', name: 'Potato', category: 'Root crop', },
  { id: 'c5', name: 'Rice', category: 'Cereal', },
  { id: 'c6', name: 'Wheat', category: 'Cereal', },
  { id: 'c7', name: 'Beans', category: 'Legume', },
  { id: 'c8', name: 'Cabbage', category: 'Vegetable', },
]

export interface DiseaseCategory {
  id: string
  name: string
  key: string
  emoji: string
  image?: string
  bgGradient: string
  borderAccent: string
  description: string
  crops: string[]
}

export const diseaseCategories: DiseaseCategory[] = [
  {
    id: 'cat-cereals',
    name: 'Cereals',
    key: 'Cereal',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-amber-500/10 via-amber-100/50 to-amber-500/5',
    borderAccent: 'border-amber-200 hover:border-amber-400',
    description: 'Grain crops including maize, rice, wheat, sorghum, and millet.',
    crops: ['Maize', 'Rice', 'Wheat', 'Sorghum', 'Millet'],
  },
  {
    id: 'cat-fruits',
    name: 'Fruits',
    key: 'Fruit',
    emoji: '🍎',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-rose-500/10 via-red-100/50 to-rose-500/5',
    borderAccent: 'border-rose-200 hover:border-rose-400',
    description: 'Tree fruits, vines, and tropical fruits like pawpaw, watermelon, and mango.',
    crops: ['Pawpaw', 'Watermelon', 'Mango', 'Citrus', 'Banana', 'Apple'],
  },
  {
    id: 'cat-legumes',
    name: 'Legumes',
    key: 'Legume',
    emoji: '🫘',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16431?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-lime-500/10 via-green-100/50 to-lime-500/5',
    borderAccent: 'border-lime-200 hover:border-lime-400',
    description: 'Pod-bearing starchy crops like beans, cowpea, groundnut, and soybean.',
    crops: ['Beans', 'Cowpea', 'Groundnut', 'Soybean', 'Chickpea'],
  },
  {
    id: 'cat-roots',
    name: 'Roots & Tubers',
    key: 'Root crop',
    emoji: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-orange-500/10 via-amber-100/50 to-orange-500/5',
    borderAccent: 'border-orange-200 hover:border-orange-400',
    description: 'Underground starchy crops including cassava, yam, sweet potato, and Irish potato.',
    crops: ['Cassava', 'Yam', 'Potato', 'Sweet Potato', 'Cocoyam'],
  },
  {
    id: 'cat-vegetables',
    name: 'Vegetables',
    key: 'Vegetable',
    emoji: '🥬',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-emerald-500/10 via-brand-100/50 to-emerald-500/5',
    borderAccent: 'border-emerald-200 hover:border-emerald-400',
    description: 'Leafy greens, fruiting vegetables, and nightshades like tomato, pepper, and cabbage.',
    crops: ['Tomato', 'Pepper', 'Cabbage', 'Eggplant', 'Spinach', 'Okra', 'Cucumber'],
  },
]

export const diseases: Disease[] = [
  // CEREALS
  {
    id: 'd1',
    name: 'Northern Corn Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    crop: 'Maize',
    category: 'Cereal',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fungal disease that forms long, cigar-shaped lesions on maize leaves, reducing photosynthesis and grain yield.',
    symptoms: [
      'Long, gray-green or tan lesions along the leaf',
      'Lesions darken and turn brown as they mature',
      'Lesions begin on lower leaves and move upward',
      'Severe cases cause the plant to appear scorched',
    ],
    causes: [
      'Fungal spores spread by wind and rain splash',
      'Cold, humid weather favours infection',
      'Continuous maize cropping without rotation',
      'Poor air circulation in dense plantings',
    ],
    prevention: [
      'Plant resistant or tolerant maize varieties',
      'Rotate maize with legumes every other season',
      'Space plants properly to improve airflow',
      'Clear crop residue after harvest',
    ],
    treatment: [
      'Apply protective fungicides at the first sign',
      'Remove and destroy heavily infected leaves',
      'Fungicide sprays every 10–14 days during wet spells',
      'Fertilise adequately to help plants recover',
    ],
  },
  {
    id: 'd5',
    name: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    crop: 'Rice',
    category: 'Cereal',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    summary:
      'A serious fungal disease that causes diamond-shaped lesions on leaves and can blank grain formation.',
    symptoms: [
      'Diamond-shaped lesions with grey centres on leaves',
      'Lesions on the neck of the panicle turn the seed head white',
      'Infected grain is discoloured or empty',
      'Seedlings can die back in severe infections',
    ],
    causes: [
      'Fungal spores spread by wind and dew',
      'High humidity and long leaf-wetness periods',
      'Excess nitrogen fertiliser',
    ],
    prevention: [
      'Plant blast-resistant rice varieties',
      'Avoid excessive nitrogen application',
      'Maintain even water depth and drain before spraying',
      'Remove weed and volunteer hosts',
    ],
    treatment: [
      'Apply fungicide at booting and heading stages',
      'Split nitrogen applications to reduce risk',
      'Keep fields clean of fallen infected straw',
    ],
  },
  {
    id: 'd6',
    name: 'Wheat Leaf Rust',
    scientificName: 'Puccinia triticina',
    crop: 'Wheat',
    category: 'Cereal',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    summary:
      'A rust disease that produces orange pustules on wheat leaves and can reduce yield by up to 20%.',
    symptoms: [
      'Small, round, orange-red pustules on leaves',
      'Pustules mainly on the upper leaf surface',
      'Leaves turn yellow and dry out in heavy attacks',
    ],
    causes: [
      'Spores blown long distances by the wind',
      'Mild, humid weather conditions',
      'Susceptible varieties and volunteer wheat',
    ],
    prevention: [
      'Grow resistant wheat varieties',
      'Avoid dense sowing of a single variety',
      'Control volunteer wheat before planting',
    ],
    treatment: [
      'Seed treatment with registered fungicide',
      'Foliar fungicide during stem elongation',
      'Apply one to two sprays during wet seasons',
    ],
  },
  {
    id: 'd9',
    name: 'Maize Streak Virus',
    scientificName: 'Maize streak virus (MSV)',
    crop: 'Maize',
    category: 'Cereal',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    summary:
      'A viral disease transmitted by leafhoppers causing severe chlorotic streaking and stunting in maize plants.',
    symptoms: [
      'Broken yellow or white stripes along leaf veins',
      'Severe stunting of young plants',
      'Deformed ears with missing grain fill',
      'Leaves appear bleached and brittle',
    ],
    causes: [
      'Transmitted by Cicadulina leafhoppers',
      'Early planting near infected grasses or cereal fields',
    ],
    prevention: [
      'Plant MSV-resistant hybrid varieties',
      'Control leafhopper vector populations early',
      'Avoid early planting next to infected grass weeds',
    ],
    treatment: [
      'Uproot and destroy infected young plants',
      'Apply systemic insecticides to suppress leafhoppers',
    ],
  },
  {
    id: 'd10',
    name: 'Sorghum Anthracnose',
    scientificName: 'Colletotrichum sublineolum',
    crop: 'Sorghum',
    category: 'Cereal',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    summary:
      'Fungal disease affecting sorghum leaves, stems, and heads, causing circular lesions and stalk rot.',
    symptoms: [
      'Small elliptical reddish to purple leaf spots',
      'Fungal fruiting bodies visible in center of lesions',
      'Stalk rot leading to lodging of mature plants',
    ],
    causes: ['High rainfall and temperatures above 25°C', 'Infected crop debris in soil'],
    prevention: ['Use certified disease-free seeds', 'Rotate with legumes or cotton'],
    treatment: ['Fungicide seed dressing', 'Foliar fungicide application at boot stage'],
  },
  {
    id: 'd11',
    name: 'Millet Head Smut',
    scientificName: 'Sporisorium destruens',
    crop: 'Millet',
    category: 'Cereal',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    summary:
      'A seed-borne fungal disease that replaces millet grain panicles with dark spore masses.',
    symptoms: [
      'Entire head replaced by a dark brown spore mass',
      'Spores exposed as outer membrane ruptures',
      'Stunted growth in infected plants',
    ],
    causes: ['Soil-borne and seed-borne fungal spores', 'Dry soil conditions during seedling emergence'],
    prevention: ['Seed treatment with systemic fungicide', 'Crop rotation of 2–3 years'],
    treatment: ['Remove and burn smutted heads before spores release'],
  },

  // FRUITS
  {
    id: 'd12',
    name: 'Papaya Ringspot Virus',
    scientificName: 'Papaya ringspot virus (PRSV)',
    crop: 'Pawpaw',
    category: 'Fruit',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    summary:
      'A devastating viral disease of pawpaw (papaya) causing leaf mosaic, ringspots on fruit, and severe stunting.',
    symptoms: [
      'Yellowing and severe distortion of crown leaves',
      'Dark green ring-like spots on pawpaw fruit skin',
      'Water-soaked oily streaks on leaf stalks',
      'Stunted tree growth and reduced sugar content',
    ],
    causes: [
      'Transmitted by aphids in a non-persistent manner',
      'Movement of infected seedlings or nearby infected trees',
    ],
    prevention: [
      'Plant PRSV-tolerant or resistant cultivars',
      'Maintain isolation distance from old papaya orchards',
      'Rogue infected plants as soon as symptoms appear',
    ],
    treatment: [
      'No cure available for virus; remove infected trees to save orchard',
      'Control aphid vectors with insecticidal soap or oil',
    ],
  },
  {
    id: 'd13',
    name: 'Watermelon Gummy Stem Blight',
    scientificName: 'Stagonosporopsis cucurbitacearum',
    crop: 'Watermelon',
    category: 'Fruit',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fungal disease attacking foliage, stems, and fruits of watermelon, producing gummy amber exudate.',
    symptoms: [
      'Circular tan-brown spots on leaves expanding rapidly',
      'Cankers on stems oozing reddish-brown gummy sap',
      'Black rot lesions on fruit surface',
    ],
    causes: ['High humidity and temperatures of 20–28°C', 'Infected seed or crop debris'],
    prevention: ['Practice 2–3 year crop rotation', 'Use clean, certified seeds', 'Drip irrigate'],
    treatment: ['Apply broad-spectrum fungicides early', 'Remove diseased plant material'],
  },
  {
    id: 'd14',
    name: 'Mango Anthracnose',
    scientificName: 'Colletotrichum gloeosporioides',
    crop: 'Mango',
    category: 'Fruit',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    summary:
      'A widespread fungal disease causing black spots on mango leaves, flowers, and ripening fruit.',
    symptoms: [
      'Dark brown spots on young leaves causing leaf drop',
      'Blossom blight leading to flower fall',
      'Sunken black spots on mature mango fruits',
    ],
    causes: ['Rainfall and high humidity during flowering', 'Windblown fungal spores'],
    prevention: ['Prune trees for maximum light and air penetration', 'Field sanitation'],
    treatment: ['Fungicide sprays from flowering until harvest', 'Post-harvest hot water dips'],
  },
  {
    id: 'd15',
    name: 'Citrus Greening (Huanglongbing)',
    scientificName: 'Candidatus Liberibacter asiaticus',
    crop: 'Citrus',
    category: 'Fruit',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80',
    summary:
      'A deadly bacterial disease spread by psyllids that causes yellow shoots, bitter lopsided fruit, and tree decline.',
    symptoms: [
      'Asymmetrical blotchy yellowing on leaves',
      'Small, lopsided fruit that remain green at bottom',
      'Bitter, unusable citrus fruit',
    ],
    causes: ['Transmitted by Asian citrus psyllids feeding on shoots'],
    prevention: ['Use certified disease-free nursery stock', 'Control psyllids aggressively'],
    treatment: ['Remove infected trees immediately', 'Nutritional foliar sprays to prolong life'],
  },
  {
    id: 'd16',
    name: 'Banana Black Sigatoka',
    scientificName: 'Mycosphaerella fijiensis',
    crop: 'Banana',
    category: 'Fruit',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80',
    summary:
      'A leaf spot disease of bananas that causes premature leaf death and up to 50% loss in bunch weight.',
    symptoms: [
      'Small reddish-brown streaks parallel to leaf veins',
      'Streaks enlarge into dark brown or black spots with yellow halos',
      'Extensive leaf necrosis and premature ripening',
    ],
    causes: ['Wind-dispersed spores favored by high moisture and heat'],
    prevention: ['Plant resistant tissue culture banana varieties', 'De-leafing affected foliage'],
    treatment: ['Apply fungicide sprays in oil carriers', 'Improve field drainage'],
  },
  {
    id: 'd17',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    crop: 'Apple',
    category: 'Fruit',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fungal disease producing dull olive-green scabby spots on apple leaves and fruit.',
    symptoms: [
      'Olive green circular spots on leaves',
      'Velvety dark lesions on fruit that crack open',
      'Early leaf drop weakening the tree',
    ],
    causes: ['Overwintering spores in fallen leaves', 'Cool, wet spring weather'],
    prevention: ['Rake and destroy fallen leaves in autumn', 'Prune canopy for airflow'],
    treatment: ['Apply protectant fungicides from bud break to summer'],
  },

  // LEGUMES
  {
    id: 'd7',
    name: 'Beans Angular Leaf Spot',
    scientificName: 'Phaeoisariopsis griseola',
    crop: 'Beans',
    category: 'Legume',
    severity: 'low',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb16431?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fungal disease that creates angular brown spots on bean leaves and pods, common in humid seasons.',
    symptoms: [
      'Angular grey or brown spots bounded by leaf veins',
      'Dark centres on older spots',
      'Spots appear on pods as red-brown lesions',
    ],
    causes: [
      'Contaminated seed and crop residue',
      'Cool, humid weather and heavy dew',
      'Crowded plant spacing',
    ],
    prevention: [
      'Use clean, certified seed',
      'Rotate beans with cereals',
      'Bury or remove infected crop residue',
      'Space rows to improve drying',
    ],
    treatment: [
      'Spray with a registered fungicide in early pod set',
      'Remove heavily infected plant parts',
      'Do not save seed from diseased plants',
    ],
  },
  {
    id: 'd18',
    name: 'Cowpea Mosaic Virus',
    scientificName: 'Cowpea mosaic virus (CPMV)',
    crop: 'Cowpea',
    category: 'Legume',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    summary:
      'Viral infection causing mottling, leaf blistering, and yield reduction in cowpeas.',
    symptoms: [
      'Light and dark green mosaic pattern on leaves',
      'Leaf distortion and blistering',
      'Stunted plants with fewer pods',
    ],
    causes: ['Transmitted by leaf beetles and infected seed'],
    prevention: ['Use virus-free planting seed', 'Plant resistant cowpea varieties'],
    treatment: ['Control beetle vectors with organic or chemical sprays', 'Rogue infected plants'],
  },
  {
    id: 'd19',
    name: 'Groundnut Rosette Disease',
    scientificName: 'Groundnut rosette virus (GRV)',
    crop: 'Groundnut',
    category: 'Legume',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?auto=format&fit=crop&w=800&q=80',
    summary:
      'A destructive virus transmitted by aphids causing severe dwarfing and yellowing of groundnut (peanut) crops.',
    symptoms: [
      'Severe stunting giving plant a bushy appearance',
      'Bright yellowing or dark green mottling of leaves',
      'Failure to produce pods',
    ],
    causes: ['Transmitted by groundnut aphids (Aphis craccivora)'],
    prevention: ['Plant early at high density to shade out aphids', 'Use rosette-resistant seeds'],
    treatment: ['Apply systemic insecticide for aphid control', 'Uproot infected clumps'],
  },
  {
    id: 'd20',
    name: 'Soybean Rust',
    scientificName: 'Phakopsora pachyrhizi',
    crop: 'Soybean',
    category: 'Legume',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    summary:
      'An aggressive fungal disease causing rapid defoliation and major yield loss in soybean fields.',
    symptoms: [
      'Tiny tan to reddish-brown lesions on leaf undersides',
      'Volcano-shaped pustules releasing pale spores',
      'Premature leaf fall starting from lower canopy',
    ],
    causes: ['Wind-borne spores traveling long distances during wet weather'],
    prevention: ['Scout fields weekly from flowering', 'Plant early-maturing varieties'],
    treatment: ['Apply foliar fungicides at first sign of lesions'],
  },
  {
    id: 'd21',
    name: 'Chickpea Ascochyta Blight',
    scientificName: 'Ascochyta rabiei',
    crop: 'Chickpea',
    category: 'Legume',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e3?auto=format&fit=crop&w=800&q=80',
    summary:
      'Fungal disease affecting all above-ground parts of chickpea plants causing stem breakage and pod lesions.',
    symptoms: [
      'Circular leaf spots with concentric dark dots',
      'Stem lesions causing plants to break and fall over',
      'Sunken lesions on pods infecting seeds',
    ],
    causes: ['Infected seed and airborne spores from stubble'],
    prevention: ['Treat seed with fungicide', 'Maintain 3-year rotation away from legumes'],
    treatment: ['Foliar fungicide application before canopy closure'],
  },

  // ROOTS & TUBERS
  {
    id: 'd3',
    name: 'Cassava Mosaic Disease',
    scientificName: 'Cassava mosaic virus',
    crop: 'Cassava',
    category: 'Root crop',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    summary:
      'A viral disease spread by whiteflies that distorts leaves and stunts cassava plants, lowering root yield.',
    symptoms: [
      'Yellow-green mosaic pattern on the leaves',
      'Leaves become misshapen and twisted',
      'Plants are stunted with shortened stems',
      'Reduced root size and quality at harvest',
    ],
    causes: [
      'Transmitted by whitefly insects feeding on sap',
      'Planting cuttings taken from infected plants',
      'Volunteer cassava plants acting as hosts',
    ],
    prevention: [
      'Plant only certified disease-free cuttings',
      'Use resistant cassava varieties',
      'Control whiteflies with approved insecticide',
      'Remove and burn infected plants early',
    ],
    treatment: [
      'Uproot and destroy severely infected plants',
      'Avoid saving planting material from sick plants',
      'Replant with tolerant varieties',
    ],
  },
  {
    id: 'd4',
    name: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    crop: 'Potato',
    category: 'Root crop',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    summary:
      'A common fungal disease producing dark, target-shaped spots on older leaves that can reduce tuber size.',
    symptoms: [
      'Dark brown spots with concentric rings',
      'Yellowing around leaf spots',
      'Spots appear first on lower, older leaves',
      'In severe cases leaves fall off early',
    ],
    causes: [
      'Fungal spores carried by wind or irrigation water',
      'Warm, humid weather with alternating wet/dry periods',
      'Plants weakened by poor nutrition',
    ],
    prevention: [
      'Rotate crops away from solanaceous plants',
      'Maintain balanced soil fertility',
      'Use drip irrigation instead of overhead watering',
      'Plant certified disease-free tubers',
    ],
    treatment: [
      'Spray with registered fungicide when spots appear',
      'Remove severely affected foliage',
      'Harvest and store tubers in dry, cool conditions',
    ],
  },
  {
    id: 'd22',
    name: 'Yam Anthracnose (Dieback)',
    scientificName: 'Colletotrichum gloeosporioides',
    crop: 'Yam',
    category: 'Root crop',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80',
    summary:
      'A serious fungal disease of yam vines causing dark leaf spots, shoot dieback, and reduced tuber development.',
    symptoms: [
      'Black spots on foliage expanding to scorch entire leaf',
      'Dieback of vine tips and stems',
      'Stunted tuber growth and early vine death',
    ],
    causes: ['High rainfall and temperatures above 28°C', 'Infected seed tubers'],
    prevention: ['Plant anthracnose-tolerant yam varieties', 'Fungicide seed tuber treatment'],
    treatment: ['Spray protective fungicides during rainy periods'],
  },
  {
    id: 'd23',
    name: 'Sweet Potato Virus Disease (SPVD)',
    scientificName: 'Sweet potato feathery mottle virus',
    crop: 'Sweet Potato',
    category: 'Root crop',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    summary:
      'Dual-virus infection causing severe leaf chlorosis, puckering, stunting, and up to 80% loss in tuber yield.',
    symptoms: [
      'Small, distorted, strap-like leaves',
      'Yellow mosaic and vein clearing',
      'Severe stunting of sweet potato vines',
    ],
    causes: ['Synergistic infection spread by aphids and whiteflies'],
    prevention: ['Use virus-tested clean vine cuttings', 'Rogue infected plants early'],
    treatment: ['Re-establish fields with clean planting material'],
  },
  {
    id: 'd24',
    name: 'Cassava Brown Streak Disease',
    scientificName: 'Cassava brown streak virus (CBSV)',
    crop: 'Cassava',
    category: 'Root crop',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    summary:
      'An insidious viral disease causing dry brown rot inside cassava tubers, often without obvious leaf symptoms.',
    symptoms: [
      'Feathery yellowing along secondary leaf veins',
      'Dark brown necrotic streaks on green stems',
      'Dry, corky brown rot inside harvested tubers',
    ],
    causes: ['Transmitted by whiteflies (Bemisia tabaci) and stem cuttings'],
    prevention: ['Plant CBSD-tolerant cassava varieties', 'Scout stems and harvest early'],
    treatment: ['Destroy infected fields and clear vector weeds'],
  },

  // VEGETABLES
  {
    id: 'd2',
    name: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    crop: 'Tomato',
    category: 'Vegetable',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fast-spreading disease that can destroy an entire tomato crop within days when conditions are cool and wet.',
    symptoms: [
      'Dark, water-soaked patches on leaves and stems',
      'White fuzzy mould on the underside of leaves',
      'Hard, dark, greasy lesions on green fruit',
      'Rapid wilting and collapse of the plant',
    ],
    causes: [
      'Spores spread by wind and splashing water',
      'Cool temperatures with high humidity',
      'Infected transplants or volunteer tomato plants',
      'Dense foliage that traps moisture',
    ],
    prevention: [
      'Use certified, disease-free seedlings',
      'Stake and prune for better airflow',
      'Water at the base, not on the leaves',
      'Avoid planting near potatoes',
    ],
    treatment: [
      'Remove infected plants immediately',
      'Apply fungicide before weather turns cool and wet',
      'Rogue volunteer tomato plants around the field',
      'Harvest fruit early in mild outbreaks',
    ],
  },
  {
    id: 'd8',
    name: 'Cabbage Black Rot',
    scientificName: 'Xanthomonas campestris',
    crop: 'Cabbage',
    category: 'Vegetable',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=800&q=80',
    summary:
      'A bacterial disease that yellows cabbage edges into V-shaped lesions and rots the inner head.',
    symptoms: [
      'V-shaped yellow lesions at the leaf edges',
      'Veins turn black in affected tissue',
      'Heads rot with an unpleasant odour in wet weather',
    ],
    causes: [
      'Bacteria entering through damaged leaves and roots',
      'Spread by rain splash and irrigation water',
      'Infected seeds and transplants',
    ],
    prevention: [
      'Plant disease-free seeds treated with hot water',
      'Practice a four-year crop rotation',
      'Avoid overhead irrigation',
      'Control insects that damage leaves',
    ],
    treatment: [
      'Remove and destroy infected plants promptly',
      'Disinfect tools between rows',
      'Spray copper-based products as a protectant',
    ],
  },
  {
    id: 'd25',
    name: 'Pepper Bacterial Spot',
    scientificName: 'Xanthomonas euvesicatoria',
    crop: 'Pepper',
    category: 'Vegetable',
    severity: 'moderate',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    summary:
      'Bacterial disease causing dark water-soaked spots on pepper leaves and scab-like spots on fruits.',
    symptoms: [
      'Small yellow-green leaf spots turning dark brown',
      'Severe leaf drop exposing peppers to sunscald',
      'Raised, rough scabs on pepper fruits',
    ],
    causes: ['Seed-borne bacteria spread by rain and overhead water'],
    prevention: ['Use certified disease-free seeds', 'Copper fungicide seed treatment'],
    treatment: ['Spray copper bactericides mixed with mancozeb'],
  },
  {
    id: 'd26',
    name: 'Eggplant Bacterial Wilt',
    scientificName: 'Ralstonia solanacearum',
    crop: 'Eggplant',
    category: 'Vegetable',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    summary:
      'Soil-borne bacteria causing rapid wilting of green eggplant foliage and vascular browning.',
    symptoms: [
      'Sudden wilting of upper leaves during warm daytime',
      'Plant remains green while wilted',
      'Brown vascular ring inside stem releasing bacterial slime',
    ],
    causes: ['Soil-borne bacteria entering through root wounds'],
    prevention: ['Graft on resistant rootstocks', 'Practice 4-year crop rotation'],
    treatment: ['Drench soil with biocontrol agents; no chemical cure'],
  },
  {
    id: 'd27',
    name: 'Okra Yellow Vein Mosaic Virus',
    scientificName: 'Okra yellow vein mosaic virus (OYVMV)',
    crop: 'Okra',
    category: 'Vegetable',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1628773822503-930a8586a111?auto=format&fit=crop&w=800&q=80',
    summary:
      'A viral infection transmitted by whiteflies leading to yellow leaf veins, stunted pods, and yield loss.',
    symptoms: [
      'Vein clearing followed by bright yellow network on leaves',
      'Stunting and yellowing of okra pods',
      'Hard, fibrous, unmarketable pods',
    ],
    causes: ['Transmitted by whiteflies (Bemisia tabaci)'],
    prevention: ['Grow yellow-vein mosaic resistant okra hybrids', 'Control whitefly vector'],
    treatment: ['Apply neem oil or imidacloprid sprays early'],
  },
  {
    id: 'd28',
    name: 'Cucumber Downy Mildew',
    scientificName: 'Pseudoperonospora cubensis',
    crop: 'Cucumber',
    category: 'Vegetable',
    severity: 'high',
    image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    summary:
      'A fast-moving foliar disease causing angular yellow leaf lesions and purple-grey mould on undersides.',
    symptoms: [
      'Angular yellow spots bounded by leaf veins',
      'Purplish-grey fungal downy growth underneath leaf',
      'Rapid leaf browning and drying up',
    ],
    causes: ['Airborne spores transported by wind during humid weather'],
    prevention: ['Plant resistant cucumber cultivars', 'Ensure drip irrigation and good aeration'],
    treatment: ['Spray targeted downy mildew fungicides immediately upon notice'],
  },
]


export const scans: ScanRecord[] = [
  {
    id: 's1',
    cropName: 'Maize',
    cropEmoji: '🌽',
    fileName: 'field_08_maize.jpg',
    date: '2026-09-17',
    time: '09:42',
    status: 'affected',
    confidence: 92,
    diseaseName: 'Northern Corn Leaf Blight',
    location: 'Plot B — Greenleaf Acres',
  },
  {
    id: 's2',
    cropName: 'Tomato',
    cropEmoji: '🍅',
    fileName: 'tomato_row3.jpg',
    date: '2026-09-14',
    time: '16:10',
    status: 'healthy',
    confidence: 96,
    location: 'Backyard garden',
  },
  {
    id: 's3',
    cropName: 'Cassava',
    cropEmoji: '🌱',
    fileName: 'cassava_plot_a.jpg',
    date: '2026-09-10',
    time: '11:25',
    status: 'at-risk',
    confidence: 74,
    diseaseName: 'Cassava Mosaic Disease',
    location: 'Plot A — Greenleaf Acres',
  },
  {
    id: 's4',
    cropName: 'Potato',
    cropEmoji: '🥔',
    fileName: 'potato_section2.jpg',
    date: '2026-09-02',
    time: '08:55',
    status: 'healthy',
    confidence: 98,
    location: 'North field',
  },
  {
    id: 's5',
    cropName: 'Rice',
    cropEmoji: '🌾',
    fileName: 'paddy_east.jpg',
    date: '2026-08-28',
    time: '14:05',
    status: 'affected',
    confidence: 87,
    diseaseName: 'Rice Blast',
    location: 'East paddy',
  },
  {
    id: 's6',
    cropName: 'Beans',
    cropEmoji: '🫘',
    fileName: 'beans_plot_c.jpg',
    date: '2026-08-21',
    time: '10:33',
    status: 'at-risk',
    confidence: 68,
    diseaseName: 'Beans Angular Leaf Spot',
    location: 'Plot C — Greenleaf Acres',
  },
]

export const alerts: Alert[] = [
  {
    id: 'a1',
    type: 'disease',
    title: 'Northern Corn Leaf Blight detected',
    message:
      'Your recent scan of Plot B returned a 92% match for Northern Corn Leaf Blight. Consider applying a protective fungicide within 7 days.',
    date: '2026-09-17T09:45:00',
    read: false,
  },
  {
    id: 'a2',
    type: 'weather',
    title: 'Heavy rain expected Thursday',
    message:
      'The forecast shows 40mm of rain in the next 48 hours. Avoid overhead watering and check drainage in your maize plots.',
    date: '2026-09-15T08:00:00',
    read: false,
  },
  {
    id: 'a3',
    type: 'reminder',
    title: 'Fertiliser application due',
    message:
      'Your maize fields are due for a nitrogen top-dressing this week. Split the application to reduce disease pressure.',
    date: '2026-09-13T07:30:00',
    read: true,
  },
  {
    id: 'a4',
    type: 'crop-warning',
    title: 'Whitefly pressure increasing',
    message:
      'Monitoring traps show rising whitefly counts near the cassava plots. Scout frequently and protect young plants.',
    date: '2026-09-11T12:15:00',
    read: false,
  },
  {
    id: 'a5',
    type: 'system',
    title: 'Scoring model updated',
    message:
      'The disease detection model was upgraded with new field data. Previous scan results have been re-scored for accuracy.',
    date: '2026-09-08T18:20:00',
    read: true,
  },
  {
    id: 'a6',
    type: 'reminder',
    title: 'Irrigation schedule adjusted',
    message:
      'Based on recent soil moisture, we adjusted your drip irrigation schedule. View the updated plan in Settings.',
    date: '2026-09-05T09:00:00',
    read: true,
  },
]

export const preventionTips: PreventionTip[] = [
  {
    id: 't1',
    category: 'Crop care',
    title: 'Inspect fields early in the morning',
    excerpt:
      'Spot problems before they spread by walking your fields at first light, when symptoms are easiest to see.',
    steps: [
      'Walk the field in a W pattern so no row is missed.',
      'Check the underside of leaves for eggs and mould.',
      'Note isolated patches and revisit them within two days.',
    ],
  },
  {
    id: 't2',
    category: 'Disease prevention',
    title: 'Rotate crops between seasons',
    excerpt:
      'Growing the same crop on one plot lets disease build up in the soil. Rotation breaks the cycle.',
    steps: [
      'Never plant the same crop family in the same plot twice in a row.',
      'Follow cereals with legumes to restore nitrogen.',
      'Keep a simple map of what is planted where each season.',
    ],
  },
  {
    id: 't3',
    category: 'Pest prevention',
    title: 'Encourage natural predators',
    excerpt:
      'Beneficial insects control pests for free. A little habitat goes a long way.',
    steps: [
      'Leave flowering borders such as marigolds along field edges.',
      'Avoid broad-spectrum sprays that kill helpers too.',
      'Provide perches for birds by keeping trees near fields.',
    ],
  },
  {
    id: 't4',
    category: 'Watering',
    title: 'Water at the base, not the leaves',
    excerpt:
      'Wet leaves invite fungal disease. Direct water to the roots where it is needed.',
    steps: [
      'Use drip lines or furrow irrigation where possible.',
      'If overhead watering is unavoidable, do it in the morning.',
      'Allow the soil surface to dry between waterings.',
    ],
  },
  {
    id: 't5',
    category: 'Soil care',
    title: 'Test your soil every season',
    excerpt:
      'Healthy soil grows resilient plants. A simple test tells you what your field actually needs.',
    steps: [
      'Take samples from several spots around the field.',
      'Refresh your soil test every planting season.',
      'Apply lime or compost based on the test results.',
    ],
  },
  {
    id: 't6',
    category: 'Environmental',
    title: 'Adapt planting to the rains',
    excerpt:
      'Planting in sync with rainfall reduces transplant shock and disease stress.',
    steps: [
      'Watch the short-term forecast before transplanting.',
      'Stagger planting across a couple of weeks to spread risk.',
      'Delay planting during very wet, cool spells.',
    ],
  },
  {
    id: 't7',
    category: 'Crop care',
    title: 'Keep tools clean between fields',
    excerpt:
      'Disease often travels on your own equipment. A few minutes of hygiene protects every plot.',
    steps: [
      'Wipe cutting tools with a disinfectant after pruning.',
      'Clean boots before moving between fields.',
      'Remove and dispose of sick plants off the field edge.',
    ],
  },
  {
    id: 't8',
    category: 'Disease prevention',
    title: 'Remove and destroy infected plants quickly',
    excerpt:
      'A single infected plant can seed a whole outbreak. Act fast and dispose properly.',
    steps: [
      'Pull up plants with clear disease symptoms.',
      'Burn or bag them — do not compost sick plants.',
      'Re-check the area for three days after removal.',
    ],
  },
]

export const cropCategories = [
  'All',
  'Cereals',
  'Fruits',
  'Legumes',
  'Roots & Tubers',
  'Vegetables',
]

export const tipCategories = [
  'All',
  ...new Set(preventionTips.map((t) => t.category)),
]

export const alertTypeMeta = {
  'crop-warning': { label: 'Crop warning', tone: 'warn' },
  disease: { label: 'Disease alert', tone: 'danger' },
  reminder: { label: 'Reminder', tone: 'brand' },
  weather: { label: 'Weather', tone: 'info' },
  system: { label: 'System', tone: 'neutral' },
} as const

export function scanningSteps() {
  return [
    'Checking image quality',
    'Identifying crop type',
    'Detecting diseases',
    'Preparing recommendation',
  ]
}