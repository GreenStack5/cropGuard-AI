import tomatoImg from '../assets/images/tomato.png'
import cassavaImg from '../assets/images/cassava.png'
import pepperImg from '../assets/images/pepper.png'
import maizeImg from '../assets/images/diseased-maize.png'

export interface Disease {
  id: string
  name: string
  crop: string
  img: string
  summary: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
}

export const diseases: Disease[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato Early Blight',
    crop: 'Tomato',
    img: tomatoImg,
    summary:
      'A common fungal disease caused by Alternaria solani that attacks the leaves, stems and fruit of tomato plants, especially during warm, wet weather.',
    symptoms: [
      'Dark brown spots with concentric rings on older leaves first',
      'Yellowing of leaf tissue around the spots',
      'Leaves drying out and dropping from the plant',
      'Dark, sunken lesions on stems near the soil line',
      'Sunken dark spots on fruit around the stem end',
    ],
    treatment: [
      'Remove and burn infected leaves and plants immediately',
      'Apply a copper-based or chlorothalonil fungicide every 7–10 days',
      'Water at the base of plants, avoiding wetting the leaves',
      'Re-treat after heavy rain, which washes off fungicides',
    ],
    prevention: [
      'Rotate tomato crops every 2–3 years, never replanting tomatoes in the same bed',
      'Space plants well apart for good air circulation',
      'Mulch around plants to stop soil splashing onto leaves',
      'Choose certified disease-resistant tomato varieties',
    ],
  },
  {
    id: 'cassava-mosaic-disease',
    name: 'Cassava Mosaic Disease',
    crop: 'Cassava',
    img: cassavaImg,
    summary:
      'A viral disease spread by the whitefly that causes stunted growth and a yellow mosaic pattern on cassava leaves, cutting yields dramatically.',
    symptoms: [
      'Yellow and green mosaic patches on leaves',
      'Leaves becoming distorted, crumpled and reduced in size',
      'Plant stems shortening, giving a bushy, stunted look',
      'Lower yields and smaller, poorer-quality tubers',
    ],
    treatment: [
      'Uproot and destroy severely infected plants to remove the virus source',
      'Control whiteflies using biopesticides or neem-based sprays',
      'Avoid using cuttings taken from infected plants',
    ],
    prevention: [
      'Plant only certified, virus-free cassava cuttings',
      'Use tolerant varieties such as TMS 30572 where available',
      'Rogue out infected plants early in the season',
      'Intercrop with other crops to reduce whitefly spread',
    ],
  },
  {
    id: 'pepper-bacterial-spot',
    name: 'Pepper Bacterial Spot',
    crop: 'Pepper',
    img: pepperImg,
    summary:
      'A bacterial disease that causes dark water-soaked spots on pepper leaves and fruit, leading to leaf drop and unmarketable, spotted pods.',
    symptoms: [
      'Small dark, water-soaked spots on leaves and stems',
      'Spots merging into irregular dead patches that dry and tear',
      'Fruit showing raised, scabby brown lesions',
      'Severe leaf yellowing and premature defoliation',
    ],
    treatment: [
      'Remove infected plants promptly to slow the spread',
      'Spray with a copper-based bactericide every 7 days during wet periods',
      'Avoid overhead watering to keep foliage dry',
      'Harvest fruit before spots spread onto pods',
    ],
    prevention: [
      'Use disease-free seeds, soaked in hot water before planting',
      'Practice 2–3 year crop rotation away from peppers',
      'Resolve standing water and improve field drainage',
      'Avoid working in the field when leaves are wet',
    ],
  },
  {
    id: 'maize-leaf-blight',
    name: 'Maize Leaf Blight',
    crop: 'Maize',
    img: maizeImg,
    summary:
      'A fungal disease that produces long tan lesions along maize leaves, reducing the leaf area needed for photosynthesis and stunting cobs.',
    symptoms: [
      'Long, pale brown lesions running between the leaf veins',
      'Lesions merging, causing large areas of the leaf to die',
      'Lower leaves yellowing and dying first',
      'Reduced ear size and poor grain filling',
    ],
    treatment: [
      'Apply a recommended fungicide like mancozeb early in disease onset',
      'Remove and dispose of heavily infected crop residue after harvest',
      'Improve airflow by thinning dense plantings',
    ],
    prevention: [
      'Plant resistant hybrids where available',
      'Rotate maize with legumes or other non-cereal crops',
      'Tillage to bury infected stubble from the previous season',
      'Avoid late planting which exposes crops to peak fungal pressure',
    ],
  },
]

export function getDisease(id: string | undefined): Disease | undefined {
  return diseases.find((disease) => disease.id === id)
}