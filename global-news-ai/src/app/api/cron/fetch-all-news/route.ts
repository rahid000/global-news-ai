
import { NextResponse } from 'next/server';
import { newsSourcesConfig } from '../../../../lib/newsSourcesConfig';
// Import all country-specific orchestrators
import { fetchAfghanistanNews } from '../../../../lib/newsFetchers/af/afghanistanNewsFetcher';
import { fetchAlbaniaNews } from '../../../../lib/newsFetchers/al/albaniaNewsFetcher';
import { fetchAlgeriaNews } from '../../../../lib/newsFetchers/dz/algeriaNewsFetcher';
import { fetchAndorraNews } from '../../../../lib/newsFetchers/ad/andorraNewsFetcher';
import { fetchAngolaNews } from '../../../../lib/newsFetchers/ao/angolaNewsFetcher';
import { fetchAntiguaAndBarbudaNews } from '../../../../lib/newsFetchers/ag/antiguaAndBarbudaNewsFetcher';
import { fetchArgentinaNews } from '../../../../lib/newsFetchers/ar/argentinaNewsFetcher';
import { fetchArmeniaNews } from '../../../../lib/newsFetchers/am/armeniaNewsFetcher';
import { fetchAustraliaNews } from '../../../../lib/newsFetchers/au/australiaNewsFetcher';
import { fetchAustriaNews } from '../../../../lib/newsFetchers/at/austriaNewsFetcher';
import { fetchAzerbaijanNews } from '../../../../lib/newsFetchers/az/azerbaijanNewsFetcher';
import { fetchBahamasNews } from '../../../../lib/newsFetchers/bs/bahamasNewsFetcher';
import { fetchBahrainNews } from '../../../../lib/newsFetchers/bh/bahrainNewsFetcher';
import { fetchBangladeshNews } from '../../../../lib/newsFetchers/bd/bangladeshNewsFetcher';
import { fetchBarbadosNews } from '../../../../lib/newsFetchers/bb/barbadosNewsFetcher';
import { fetchBelarusNews } from '../../../../lib/newsFetchers/by/belarusNewsFetcher';
import { fetchBelgiumNews } from '../../../../lib/newsFetchers/be/belgiumNewsFetcher';
import { fetchBelizeNews } from '../../../../lib/newsFetchers/bz/belizeNewsFetcher';
import { fetchBeninNews } from '../../../../lib/newsFetchers/bj/beninNewsFetcher';
import { fetchCanadaNews } from '../../../../lib/newsFetchers/ca/canadaNewsFetcher';
import { fetchCapeVerdeNews } from '../../../../lib/newsFetchers/cv/capeVerdeNewsFetcher';
import { fetchCentralAfricanRepublicNews } from '../../../../lib/newsFetchers/cf/centralAfricanRepublicNewsFetcher';
import { fetchChadNews } from '../../../../lib/newsFetchers/td/chadNewsFetcher';
import { fetchChileNews } from '../../../../lib/newsFetchers/cl/chileNewsFetcher';
import { fetchChinaNews } from '../../../../lib/newsFetchers/cn/chinaNewsFetcher';
import { fetchColombiaNews } from '../../../../lib/newsFetchers/co/colombiaNewsFetcher';
import { fetchComorosNews } from '../../../../lib/newsFetchers/km/comorosNewsFetcher';
import { fetchCongoBrazzavilleNews } from '../../../../lib/newsFetchers/cg/congoBrazzavilleNewsFetcher';
import { fetchDRCongoNews } from '../../../../lib/newsFetchers/cd/drCongoNewsFetcher';
import { fetchCostaRicaNews } from '../../../../lib/newsFetchers/cr/costaRicaNewsFetcher';
import { fetchCroatiaNews } from '../../../../lib/newsFetchers/hr/croatiaNewsFetcher';
import { fetchCubaNews } from '../../../../lib/newsFetchers/cu/cubaNewsFetcher';
import { fetchCyprusNews } from '../../../../lib/newsFetchers/cy/cyprusNewsFetcher';
import { fetchCzechRepublicNews } from '../../../../lib/newsFetchers/cz/czechRepublicNewsFetcher';
import { fetchDenmarkNews } from '../../../../lib/newsFetchers/dk/denmarkNewsFetcher';
import { fetchDjiboutiNews } from '../../../../lib/newsFetchers/dj/djiboutiNewsFetcher';
import { fetchDominicaNews } from '../../../../lib/newsFetchers/dm/dominicaNewsFetcher';
import { fetchDominicanRepublicNews } from '../../../../lib/newsFetchers/do/dominicanRepublicNewsFetcher';
import { fetchEcuadorNews } from '../../../../lib/newsFetchers/ec/ecuadorNewsFetcher';
import { fetchEgyptNews } from '../../../../lib/newsFetchers/eg/egyptNewsFetcher';
import { fetchElSalvadorNews } from '../../../../lib/newsFetchers/sv/elSalvadorNewsFetcher';
import { fetchEstoniaNews } from '../../../../lib/newsFetchers/ee/estoniaNewsFetcher';
import { fetchEthiopiaNews } from '../../../../lib/newsFetchers/et/ethiopiaNewsFetcher';
import { fetchFijiNews } from '../../../../lib/newsFetchers/fj/fijiNewsFetcher';
import { fetchFinlandNews } from '../../../../lib/newsFetchers/fi/finlandNewsFetcher';
import { fetchFranceNews } from '../../../../lib/newsFetchers/fr/franceNewsFetcher';
import { fetchGabonNews } from '../../../../lib/newsFetchers/ga/gabonNewsFetcher';
import { fetchGambiaNews } from '../../../../lib/newsFetchers/gm/gambiaNewsFetcher';
import { fetchGeorgiaNews } from '../../../../lib/newsFetchers/ge/georgiaNewsFetcher';
import { fetchGermanyNews } from '../../../../lib/newsFetchers/de/germanyNewsFetcher';
import { fetchGhanaNews } from '../../../../lib/newsFetchers/gh/ghanaNewsFetcher';
import { fetchGreeceNews } from '../../../../lib/newsFetchers/gr/greeceNewsFetcher';
import { fetchGrenadaNews } from '../../../../lib/newsFetchers/gd/grenadaNewsFetcher';
import { fetchGuatemalaNews } from '../../../../lib/newsFetchers/gt/guatemalaNewsFetcher';
import { fetchGuineaNews } from '../../../../lib/newsFetchers/gn/guineaNewsFetcher';
import { fetchGuineaBissauNews } from '../../../../lib/newsFetchers/gw/guineaBissauNewsFetcher';
import { fetchGuyanaNews } from '../../../../lib/newsFetchers/gy/guyanaNewsFetcher';
import { fetchHaitiNews } from '../../../../lib/newsFetchers/ht/haitiNewsFetcher';
import { fetchHondurasNews } from '../../../../lib/newsFetchers/hn/hondurasNewsFetcher';
import { fetchHungaryNews } from '../../../../lib/newsFetchers/hu/hungaryNewsFetcher';
import { fetchIcelandNews } from '../../../../lib/newsFetchers/is/icelandNewsFetcher';
import { fetchIndiaNews } from '../../../../lib/newsFetchers/in/indiaNewsFetcher';
import { fetchIndonesiaNews } from '../../../../lib/newsFetchers/id/indonesiaNewsFetcher';
import { fetchIranNews } from '../../../../lib/newsFetchers/ir/iranNewsFetcher';
import { fetchIraqNews } from '../../../../lib/newsFetchers/iq/iraqNewsFetcher';
import { fetchIrelandNews } from '../../../../lib/newsFetchers/ie/irelandNewsFetcher';
import { fetchIsraelNews } from '../../../../lib/newsFetchers/il/israelNewsFetcher';
import { fetchItalyNews } from '../../../../lib/newsFetchers/it/italyNewsFetcher';
import { fetchJamaicaNews } from '../../../../lib/newsFetchers/jm/jamaicaNewsFetcher';
import { fetchJapanNews } from '../../../../lib/newsFetchers/jp/japanNewsFetcher';
import { fetchJordanNews } from '../../../../lib/newsFetchers/jo/jordanNewsFetcher';
import { fetchKazakhstanNews } from '../../../../lib/newsFetchers/kz/kazakhstanNewsFetcher';
import { fetchKenyaNews } from '../../../../lib/newsFetchers/ke/kenyaNewsFetcher';
import { fetchKiribatiNews } from '../../../../lib/newsFetchers/ki/kiribatiNewsFetcher';
import { fetchKosovoNews } from '../../../../lib/newsFetchers/xk/kosovoNewsFetcher';
import { fetchKuwaitNews } from '../../../../lib/newsFetchers/kw/kuwaitNewsFetcher';
import { fetchKyrgyzstanNews } from '../../../../lib/newsFetchers/kg/kyrgyzstanNewsFetcher';
import { fetchLaosNews } from '../../../../lib/newsFetchers/la/laosNewsFetcher';
import { fetchLatviaNews } from '../../../../lib/newsFetchers/lv/latviaNewsFetcher';
import { fetchLebanonNews } from '../../../../lib/newsFetchers/lb/lebanonNewsFetcher';
import { fetchLesothoNews } from '../../../../lib/newsFetchers/ls/lesothoNewsFetcher';
import { fetchLiberiaNews } from '../../../../lib/newsFetchers/lr/liberiaNewsFetcher';
import { fetchLibyaNews } from '../../../../lib/newsFetchers/ly/libyaNewsFetcher';
import { fetchLiechtensteinNews } from '../../../../lib/newsFetchers/li/liechtensteinNewsFetcher';
import { fetchLithuaniaNews } from '../../../../lib/newsFetchers/lt/lithuaniaNewsFetcher';
import { fetchLuxembourgNews } from '../../../../lib/newsFetchers/lu/luxembourgNewsFetcher';
import { fetchMadagascarNews } from '../../../../lib/newsFetchers/mg/madagascarNewsFetcher';
import { fetchMalawiNews } from '../../../../lib/newsFetchers/mw/malawiNewsFetcher';
import { fetchMalaysiaNews } from '../../../../lib/newsFetchers/my/malaysiaNewsFetcher';
import { fetchMaldivesNews } from '../../../../lib/newsFetchers/mv/maldivesNewsFetcher';
import { fetchMaliNews } from '../../../../lib/newsFetchers/ml/maliNewsFetcher';
import { fetchMaltaNews } from '../../../../lib/newsFetchers/mt/maltaNewsFetcher';
import { fetchMarshallIslandsNews } from '../../../../lib/newsFetchers/mh/marshallIslandsNewsFetcher';
import { fetchMauritaniaNews } from '../../../../lib/newsFetchers/mr/mauritaniaNewsFetcher';
import { fetchMauritiusNews } from '../../../../lib/newsFetchers/mu/mauritiusNewsFetcher';
import { fetchMexicoNews } from '../../../../lib/newsFetchers/mx/mexicoNewsFetcher';
import { fetchMicronesiaNews } from '../../../../lib/newsFetchers/fm/micronesiaNewsFetcher';
import { fetchMoldovaNews } from '../../../../lib/newsFetchers/md/moldovaNewsFetcher';
import { fetchMonacoNews } from '../../../../lib/newsFetchers/mc/monacoNewsFetcher';
import { fetchMongoliaNews } from '../../../../lib/newsFetchers/mn/mongoliaNewsFetcher';
import { fetchMontenegroNews } from '../../../../lib/newsFetchers/me/montenegroNewsFetcher';
import { fetchMoroccoNews } from '../../../../lib/newsFetchers/ma/moroccoNewsFetcher';
import { fetchMozambiqueNews } from '../../../../lib/newsFetchers/mz/mozambiqueNewsFetcher';
import { fetchMyanmarNews } from '../../../../lib/newsFetchers/mm/myanmarNewsFetcher';
import { fetchNamibiaNews } from '../../../../lib/newsFetchers/na/namibiaNewsFetcher';
import { fetchNauruNews } from '../../../../lib/newsFetchers/nr/nauruNewsFetcher';
import { fetchNepalNews } from '../../../../lib/newsFetchers/np/nepalNewsFetcher';
import { fetchNetherlandsNews } from '../../../../lib/newsFetchers/nl/netherlandsNewsFetcher';
import { fetchNewZealandNews } from '../../../../lib/newsFetchers/nz/newZealandNewsFetcher';
import { fetchNicaraguaNews } from '../../../../lib/newsFetchers/ni/nicaraguaNewsFetcher';
import { fetchNigerNews } from '../../../../lib/newsFetchers/ne/nigerNewsFetcher';
import { fetchNigeriaNews } from '../../../../lib/newsFetchers/ng/nigeriaNewsFetcher';
import { fetchNorthKoreaNews } from '../../../../lib/newsFetchers/kp/northKoreaNewsFetcher';
import { fetchNorthMacedoniaNews } from '../../../../lib/newsFetchers/mk/northMacedoniaNewsFetcher';
import { fetchNorwayNews } from '../../../../lib/newsFetchers/no/norwayNewsFetcher';
import { fetchOmanNews } from '../../../../lib/newsFetchers/om/omanNewsFetcher';
import { fetchPakistanNews } from '../../../../lib/newsFetchers/pk/pakistanNewsFetcher';
import { fetchPalauNews } from '../../../../lib/newsFetchers/pw/palauNewsFetcher';
import { fetchPalestineStateNews } from '../../../../lib/newsFetchers/ps/palestineStateNewsFetcher';
import { fetchPanamaNews } from '../../../../lib/newsFetchers/pa/panamaNewsFetcher';
import { fetchPapuaNewGuineaNews } from '../../../../lib/newsFetchers/pg/papuaNewGuineaNewsFetcher';
import { fetchParaguayNews } from '../../../../lib/newsFetchers/py/paraguayNewsFetcher';
import { fetchPeruNews } from '../../../../lib/newsFetchers/pe/peruNewsFetcher';
import { fetchPhilippinesNews } from '../../../../lib/newsFetchers/ph/philippinesNewsFetcher';
import { fetchPolandNews } from '../../../../lib/newsFetchers/pl/polandNewsFetcher';
import { fetchPortugalNews } from '../../../../lib/newsFetchers/pt/portugalNewsFetcher';
import { fetchQatarNews } from '../../../../lib/newsFetchers/qa/qatarNewsFetcher';
import { fetchRomaniaNews } from '../../../../lib/newsFetchers/ro/romaniaNewsFetcher';
import { fetchRussiaNews } from '../../../../lib/newsFetchers/ru/russiaNewsFetcher';
import { fetchRwandaNews } from '../../../../lib/newsFetchers/rw/rwandaNewsFetcher';
import { fetchSaintKittsAndNevisNews } from '../../../../lib/newsFetchers/kn/saintKittsAndNevisNewsFetcher';
import { fetchSaintLuciaNews } from '../../../../lib/newsFetchers/lc/saintLuciaNewsFetcher';
import { fetchSaintVincentAndTheGrenadinesNews } from '../../../../lib/newsFetchers/vc/saintVincentAndTheGrenadinesNewsFetcher';
import { fetchSamoaNews } from '../../../../lib/newsFetchers/ws/samoaNewsFetcher';
import { fetchSanMarinoNews } from '../../../../lib/newsFetchers/sm/sanMarinoNewsFetcher';
import { fetchSaoTomeAndPrincipeNews } from '../../../../lib/newsFetchers/st/saoTomeAndPrincipeNewsFetcher';
import { fetchSaudiArabiaNews } from '../../../../lib/newsFetchers/sa/saudiArabiaNewsFetcher';
import { fetchSenegalNews } from '../../../../lib/newsFetchers/sn/senegalNewsFetcher';
import { fetchSerbiaNews } from '../../../../lib/newsFetchers/rs/serbiaNewsFetcher';
import { fetchSeychellesNews } from '../../../../lib/newsFetchers/sc/seychellesNewsFetcher';
import { fetchSierraLeoneNews } from '../../../../lib/newsFetchers/sl/sierraLeoneNewsFetcher';
import { fetchSingaporeNews } from '../../../../lib/newsFetchers/sg/singaporeNewsFetcher';
import { fetchSlovakiaNews } from '../../../../lib/newsFetchers/sk/slovakiaNewsFetcher';
import { fetchSloveniaNews } from '../../../../lib/newsFetchers/si/sloveniaNewsFetcher';
import { fetchSolomonIslandsNews } from '../../../../lib/newsFetchers/sb/solomonIslandsNewsFetcher';
import { fetchSomaliaNews } from '../../../../lib/newsFetchers/so/somaliaNewsFetcher';
import { fetchSouthAfricaNews } from '../../../../lib/newsFetchers/za/southAfricaNewsFetcher';
import { fetchSouthKoreaNews } from '../../../../lib/newsFetchers/kr/southKoreaNewsFetcher';
import { fetchSouthSudanNews } from '../../../../lib/newsFetchers/ss/southSudanNewsFetcher';
import { fetchSpainNews } from '../../../../lib/newsFetchers/es/spainNewsFetcher';
import { fetchSriLankaNews } from '../../../../lib/newsFetchers/lk/sriLankaNewsFetcher';
import { fetchSudanNews } from '../../../../lib/newsFetchers/sd/sudanNewsFetcher';
import { fetchSurinameNews } from '../../../../lib/newsFetchers/sr/surinameNewsFetcher';
import { fetchSwedenNews } from '../../../../lib/newsFetchers/se/swedenNewsFetcher';
import { fetchSwitzerlandNews } from '../../../../lib/newsFetchers/ch/switzerlandNewsFetcher';
import { fetchSyriaNews } from '../../../../lib/newsFetchers/sy/syriaNewsFetcher';
import { fetchTaiwanNews } from '../../../../lib/newsFetchers/tw/taiwanNewsFetcher';
import { fetchTajikistanNews } from '../../../../lib/newsFetchers/tj/tajikistanNewsFetcher';
import { fetchTanzaniaNews } from '../../../../lib/newsFetchers/tz/tanzaniaNewsFetcher';
import { fetchThailandNews } from '../../../../lib/newsFetchers/th/thailandNewsFetcher';
import { fetchTimorLesteNews } from '../../../../lib/newsFetchers/tl/timorLesteNewsFetcher';
import { fetchTogoNews } from '../../../../lib/newsFetchers/tg/togoNewsFetcher';
import { fetchTongaNews } from '../../../../lib/newsFetchers/to/tongaNewsFetcher';
import { fetchTrinidadAndTobagoNews } from '../../../../lib/newsFetchers/tt/trinidadAndTobagoNewsFetcher';
import { fetchTunisiaNews } from '../../../../lib/newsFetchers/tn/tunisiaNewsFetcher';
import { fetchTurkeyNews } from '../../../../lib/newsFetchers/tr/turkeyNewsFetcher';
import { fetchTurkmenistanNews } from '../../../../lib/newsFetchers/tm/turkmenistanNewsFetcher';
import { fetchTuvaluNews } from '../../../../lib/newsFetchers/tv/tuvaluNewsFetcher';
import { fetchUgandaNews } from '../../../../lib/newsFetchers/ug/ugandaNewsFetcher';
import { fetchUkraineNews } from '../../../../lib/newsFetchers/ua/ukraineNewsFetcher';
import { fetchUnitedArabEmiratesNews } from '../../../../lib/newsFetchers/ae/unitedArabEmiratesNewsFetcher';
import { fetchUnitedKingdomNews } from '../../../../lib/newsFetchers/gb/unitedKingdomNewsFetcher';
import { fetchUnitedStatesNews } from '../../../../lib/newsFetchers/us/unitedStatesNewsFetcher';
import { fetchUruguayNews } from '../../../../lib/newsFetchers/uy/uruguayNewsFetcher';
import { fetchUzbekistanNews } from '../../../../lib/newsFetchers/uz/uzbekistanNewsFetcher';
import { fetchVanuatuNews } from '../../../../lib/newsFetchers/vu/vanuatuNewsFetcher';
import { fetchVaticanCityNews } from '../../../../lib/newsFetchers/va/vaticanCityNewsFetcher';
import { fetchVenezuelaNews } from '../../../../lib/newsFetchers/ve/venezuelaNewsFetcher';
import { fetchVietnamNews } from '../../../../lib/newsFetchers/vn/vietnamNewsFetcher';
import { fetchWesternSaharaNews } from '../../../../lib/newsFetchers/eh/westernSaharaNewsFetcher';
import { fetchYemenNews } from '../../../../lib/newsFetchers/ye/yemenNewsFetcher';
import { fetchZambiaNews } from '../../../../lib/newsFetchers/zm/zambiaNewsFetcher';
import { fetchZimbabweNews } from '../../../../lib/newsFetchers/zw/zimbabweNewsFetcher';


interface OrchestratorConfig {
  countryCode: string;
  orchestratorFunction: () => Promise<void>;
}

// Define your orchestrator map here.
// For each country, list its main orchestrator function.
const countryOrchestratorMap: Record<string, OrchestratorConfig> = {
  AF: { countryCode: 'AF', orchestratorFunction: fetchAfghanistanNews },
  AL: { countryCode: 'AL', orchestratorFunction: fetchAlbaniaNews },
  DZ: { countryCode: 'DZ', orchestratorFunction: fetchAlgeriaNews },
  AD: { countryCode: 'AD', orchestratorFunction: fetchAndorraNews },
  AO: { countryCode: 'AO', orchestratorFunction: fetchAngolaNews },
  AG: { countryCode: 'AG', orchestratorFunction: fetchAntiguaAndBarbudaNews },
  AR: { countryCode: 'AR', orchestratorFunction: fetchArgentinaNews },
  AM: { countryCode: 'AM', orchestratorFunction: fetchArmeniaNews },
  AU: { countryCode: 'AU', orchestratorFunction: fetchAustraliaNews },
  AT: { countryCode: 'AT', orchestratorFunction: fetchAustriaNews },
  AZ: { countryCode: 'AZ', orchestratorFunction: fetchAzerbaijanNews },
  BS: { countryCode: 'BS', orchestratorFunction: fetchBahamasNews },
  BH: { countryCode: 'BH', orchestratorFunction: fetchBahrainNews },
  BD: { countryCode: 'BD', orchestratorFunction: fetchBangladeshNews },
  BB: { countryCode: 'BB', orchestratorFunction: fetchBarbadosNews },
  BY: { countryCode: 'BY', orchestratorFunction: fetchBelarusNews },
  BE: { countryCode: 'BE', orchestratorFunction: fetchBelgiumNews },
  BZ: { countryCode: 'BZ', orchestratorFunction: fetchBelizeNews },
  BJ: { countryCode: 'BJ', orchestratorFunction: fetchBeninNews },
  CA: { countryCode: 'CA', orchestratorFunction: fetchCanadaNews },
  CV: { countryCode: 'CV', orchestratorFunction: fetchCapeVerdeNews },
  CF: { countryCode: 'CF', orchestratorFunction: fetchCentralAfricanRepublicNews },
  TD: { countryCode: 'TD', orchestratorFunction: fetchChadNews },
  CL: { countryCode: 'CL', orchestratorFunction: fetchChileNews },
  CN: { countryCode: 'CN', orchestratorFunction: fetchChinaNews },
  CO: { countryCode: 'CO', orchestratorFunction: fetchColombiaNews },
  KM: { countryCode: 'KM', orchestratorFunction: fetchComorosNews },
  CG: { countryCode: 'CG', orchestratorFunction: fetchCongoBrazzavilleNews },
  CD: { countryCode: 'CD', orchestratorFunction: fetchDRCongoNews },
  CR: { countryCode: 'CR', orchestratorFunction: fetchCostaRicaNews },
  HR: { countryCode: 'HR', orchestratorFunction: fetchCroatiaNews },
  CU: { countryCode: 'CU', orchestratorFunction: fetchCubaNews },
  CY: { countryCode: 'CY', orchestratorFunction: fetchCyprusNews },
  CZ: { countryCode: 'CZ', orchestratorFunction: fetchCzechRepublicNews },
  DK: { countryCode: 'DK', orchestratorFunction: fetchDenmarkNews },
  DJ: { countryCode: 'DJ', orchestratorFunction: fetchDjiboutiNews },
  DM: { countryCode: 'DM', orchestratorFunction: fetchDominicaNews },
  DO: { countryCode: 'DO', orchestratorFunction: fetchDominicanRepublicNews },
  EC: { countryCode: 'EC', orchestratorFunction: fetchEcuadorNews },
  EG: { countryCode: 'EG', orchestratorFunction: fetchEgyptNews },
  SV: { countryCode: 'SV', orchestratorFunction: fetchElSalvadorNews },
  EE: { countryCode: 'EE', orchestratorFunction: fetchEstoniaNews },
  ET: { countryCode: 'ET', orchestratorFunction: fetchEthiopiaNews },
  FJ: { countryCode: 'FJ', orchestratorFunction: fetchFijiNews },
  FI: { countryCode: 'FI', orchestratorFunction: fetchFinlandNews },
  FR: { countryCode: 'FR', orchestratorFunction: fetchFranceNews },
  GA: { countryCode: 'GA', orchestratorFunction: fetchGabonNews },
  GM: { countryCode: 'GM', orchestratorFunction: fetchGambiaNews },
  GE: { countryCode: 'GE', orchestratorFunction: fetchGeorgiaNews },
  DE: { countryCode: 'DE', orchestratorFunction: fetchGermanyNews },
  GH: { countryCode: 'GH', orchestratorFunction: fetchGhanaNews },
  GR: { countryCode: 'GR', orchestratorFunction: fetchGreeceNews },
  GD: { countryCode: 'GD', orchestratorFunction: fetchGrenadaNews },
  GT: { countryCode: 'GT', orchestratorFunction: fetchGuatemalaNews },
  GN: { countryCode: 'GN', orchestratorFunction: fetchGuineaNews },
  GW: { countryCode: 'GW', orchestratorFunction: fetchGuineaBissauNews },
  GY: { countryCode: 'GY', orchestratorFunction: fetchGuyanaNews },
  HT: { countryCode: 'HT', orchestratorFunction: fetchHaitiNews },
  HN: { countryCode: 'HN', orchestratorFunction: fetchHondurasNews },
  HU: { countryCode: 'HU', orchestratorFunction: fetchHungaryNews },
  IS: { countryCode: 'IS', orchestratorFunction: fetchIcelandNews },
  IN: { countryCode: 'IN', orchestratorFunction: fetchIndiaNews },
  ID: { countryCode: 'ID', orchestratorFunction: fetchIndonesiaNews },
  IR: { countryCode: 'IR', orchestratorFunction: fetchIranNews },
  IQ: { countryCode: 'IQ', orchestratorFunction: fetchIraqNews },
  IE: { countryCode: 'IE', orchestratorFunction: fetchIrelandNews },
  IL: { countryCode: 'IL', orchestratorFunction: fetchIsraelNews },
  IT: { countryCode: 'IT', orchestratorFunction: fetchItalyNews },
  JM: { countryCode: 'JM', orchestratorFunction: fetchJamaicaNews },
  JP: { countryCode: 'JP', orchestratorFunction: fetchJapanNews },
  JO: { countryCode: 'JO', orchestratorFunction: fetchJordanNews },
  KZ: { countryCode: 'KZ', orchestratorFunction: fetchKazakhstanNews },
  KE: { countryCode: 'KE', orchestratorFunction: fetchKenyaNews },
  KI: { countryCode: 'KI', orchestratorFunction: fetchKiribatiNews },
  XK: { countryCode: 'XK', orchestratorFunction: fetchKosovoNews },
  KW: { countryCode: 'KW', orchestratorFunction: fetchKuwaitNews },
  KG: { countryCode: 'KG', orchestratorFunction: fetchKyrgyzstanNews },
  LA: { countryCode: 'LA', orchestratorFunction: fetchLaosNews },
  LV: { countryCode: 'LV', orchestratorFunction: fetchLatviaNews },
  LB: { countryCode: 'LB', orchestratorFunction: fetchLebanonNews },
  LS: { countryCode: 'LS', orchestratorFunction: fetchLesothoNews },
  LR: { countryCode: 'LR', orchestratorFunction: fetchLiberiaNews },
  LY: { countryCode: 'LY', orchestratorFunction: fetchLibyaNews },
  LI: { countryCode: 'LI', orchestratorFunction: fetchLiechtensteinNews },
  LT: { countryCode: 'LT', orchestratorFunction: fetchLithuaniaNews },
  LU: { countryCode: 'LU', orchestratorFunction: fetchLuxembourgNews },
  MG: { countryCode: 'MG', orchestratorFunction: fetchMadagascarNews },
  MW: { countryCode: 'MW', orchestratorFunction: fetchMalawiNews },
  MY: { countryCode: 'MY', orchestratorFunction: fetchMalaysiaNews },
  MV: { countryCode: 'MV', orchestratorFunction: fetchMaldivesNews },
  ML: { countryCode: 'ML', orchestratorFunction: fetchMaliNews },
  MT: { countryCode: 'MT', orchestratorFunction: fetchMaltaNews },
  MH: { countryCode: 'MH', orchestratorFunction: fetchMarshallIslandsNews },
  MR: { countryCode: 'MR', orchestratorFunction: fetchMauritaniaNews },
  MU: { countryCode: 'MU', orchestratorFunction: fetchMauritiusNews },
  MX: { countryCode: 'MX', orchestratorFunction: fetchMexicoNews },
  FM: { countryCode: 'FM', orchestratorFunction: fetchMicronesiaNews },
  MD: { countryCode: 'MD', orchestratorFunction: fetchMoldovaNews },
  MC: { countryCode: 'MC', orchestratorFunction: fetchMonacoNews },
  MN: { countryCode: 'MN', orchestratorFunction: fetchMongoliaNews },
  ME: { countryCode: 'ME', orchestratorFunction: fetchMontenegroNews },
  MA: { countryCode: 'MA', orchestratorFunction: fetchMoroccoNews },
  MZ: { countryCode: 'MZ', orchestratorFunction: fetchMozambiqueNews },
  MM: { countryCode: 'MM', orchestratorFunction: fetchMyanmarNews },
  NA: { countryCode: 'NA', orchestratorFunction: fetchNamibiaNews },
  NR: { countryCode: 'NR', orchestratorFunction: fetchNauruNews },
  NP: { countryCode: 'NP', orchestratorFunction: fetchNepalNews },
  NL: { countryCode: 'NL', orchestratorFunction: fetchNetherlandsNews },
  NZ: { countryCode: 'NZ', orchestratorFunction: fetchNewZealandNews },
  NI: { countryCode: 'NI', orchestratorFunction: fetchNicaraguaNews },
  NE: { countryCode: 'NE', orchestratorFunction: fetchNigerNews },
  NG: { countryCode: 'NG', orchestratorFunction: fetchNigeriaNews },
  KP: { countryCode: 'KP', orchestratorFunction: fetchNorthKoreaNews },
  MK: { countryCode: 'MK', orchestratorFunction: fetchNorthMacedoniaNews },
  NO: { countryCode: 'NO', orchestratorFunction: fetchNorwayNews },
  OM: { countryCode: 'OM', orchestratorFunction: fetchOmanNews },
  PK: { countryCode: 'PK', orchestratorFunction: fetchPakistanNews },
  PW: { countryCode: 'PW', orchestratorFunction: fetchPalauNews },
  PS: { countryCode: 'PS', orchestratorFunction: fetchPalestineStateNews },
  PA: { countryCode: 'PA', orchestratorFunction: fetchPanamaNews },
  PG: { countryCode: 'PG', orchestratorFunction: fetchPapuaNewGuineaNews },
  PY: { countryCode: 'PY', orchestratorFunction: fetchParaguayNews },
  PE: { countryCode: 'PE', orchestratorFunction: fetchPeruNews },
  PH: { countryCode: 'PH', orchestratorFunction: fetchPhilippinesNews },
  PL: { countryCode: 'PL', orchestratorFunction: fetchPolandNews },
  PT: { countryCode: 'PT', orchestratorFunction: fetchPortugalNews },
  QA: { countryCode: 'QA', orchestratorFunction: fetchQatarNews },
  RO: { countryCode: 'RO', orchestratorFunction: fetchRomaniaNews },
  RU: { countryCode: 'RU', orchestratorFunction: fetchRussiaNews },
  RW: { countryCode: 'RW', orchestratorFunction: fetchRwandaNews },
  KN: { countryCode: 'KN', orchestratorFunction: fetchSaintKittsAndNevisNews },
  LC: { countryCode: 'LC', orchestratorFunction: fetchSaintLuciaNews },
  VC: { countryCode: 'VC', orchestratorFunction: fetchSaintVincentAndTheGrenadinesNews },
  WS: { countryCode: 'WS', orchestratorFunction: fetchSamoaNews },
  SM: { countryCode: 'SM', orchestratorFunction: fetchSanMarinoNews },
  ST: { countryCode: 'ST', orchestratorFunction: fetchSaoTomeAndPrincipeNews },
  SA: { countryCode: 'SA', orchestratorFunction: fetchSaudiArabiaNews },
  SN: { countryCode: 'SN', orchestratorFunction: fetchSenegalNews },
  RS: { countryCode: 'RS', orchestratorFunction: fetchSerbiaNews },
  SC: { countryCode: 'SC', orchestratorFunction: fetchSeychellesNews },
  SL: { countryCode: 'SL', orchestratorFunction: fetchSierraLeoneNews },
  SG: { countryCode: 'SG', orchestratorFunction: fetchSingaporeNews },
  SK: { countryCode: 'SK', orchestratorFunction: fetchSlovakiaNews },
  SI: { countryCode: 'SI', orchestratorFunction: fetchSloveniaNews },
  SB: { countryCode: 'SB', orchestratorFunction: fetchSolomonIslandsNews },
  SO: { countryCode: 'SO', orchestratorFunction: fetchSomaliaNews },
  ZA: { countryCode: 'ZA', orchestratorFunction: fetchSouthAfricaNews },
  KR: { countryCode: 'KR', orchestratorFunction: fetchSouthKoreaNews },
  SS: { countryCode: 'SS', orchestratorFunction: fetchSouthSudanNews },
  ES: { countryCode: 'ES', orchestratorFunction: fetchSpainNews },
  LK: { countryCode: 'LK', orchestratorFunction: fetchSriLankaNews },
  SD: { countryCode: 'SD', orchestratorFunction: fetchSudanNews },
  SR: { countryCode: 'SR', orchestratorFunction: fetchSurinameNews },
  SE: { countryCode: 'SE', orchestratorFunction: fetchSwedenNews },
  CH: { countryCode: 'CH', orchestratorFunction: fetchSwitzerlandNews },
  SY: { countryCode: 'SY', orchestratorFunction: fetchSyriaNews },
  TW: { countryCode: 'TW', orchestratorFunction: fetchTaiwanNews },
  TJ: { countryCode: 'TJ', orchestratorFunction: fetchTajikistanNews },
  TZ: { countryCode: 'TZ', orchestratorFunction: fetchTanzaniaNews },
  TH: { countryCode: 'TH', orchestratorFunction: fetchThailandNews },
  TL: { countryCode: 'TL', orchestratorFunction: fetchTimorLesteNews },
  TG: { countryCode: 'TG', orchestratorFunction: fetchTogoNews },
  TO: { countryCode: 'TO', orchestratorFunction: fetchTongaNews },
  TT: { countryCode: 'TT', orchestratorFunction: fetchTrinidadAndTobagoNews },
  TN: { countryCode: 'TN', orchestratorFunction: fetchTunisiaNews },
  TR: { countryCode: 'TR', orchestratorFunction: fetchTurkeyNews },
  TM: { countryCode: 'TM', orchestratorFunction: fetchTurkmenistanNews },
  TV: { countryCode: 'TV', orchestratorFunction: fetchTuvaluNews },
  UG: { countryCode: 'UG', orchestratorFunction: fetchUgandaNews },
  UA: { countryCode: 'UA', orchestratorFunction: fetchUkraineNews },
  AE: { countryCode: 'AE', orchestratorFunction: fetchUnitedArabEmiratesNews },
  GB: { countryCode: 'GB', orchestratorFunction: fetchUnitedKingdomNews },
  US: { countryCode: 'US', orchestratorFunction: fetchUnitedStatesNews },
  UY: { countryCode: 'UY', orchestratorFunction: fetchUruguayNews },
  UZ: { countryCode: 'UZ', orchestratorFunction: fetchUzbekistanNews },
  VU: { countryCode: 'VU', orchestratorFunction: fetchVanuatuNews },
  VA: { countryCode: 'VA', orchestratorFunction: fetchVaticanCityNews },
  VE: { countryCode: 'VE', orchestratorFunction: fetchVenezuelaNews },
  VN: { countryCode: 'VN', orchestratorFunction: fetchVietnamNews },
  EH: { countryCode: 'EH', orchestratorFunction: fetchWesternSaharaNews },
  YE: { countryCode: 'YE', orchestratorFunction: fetchYemenNews },
  ZM: { countryCode: 'ZM', orchestratorFunction: fetchZambiaNews },
  ZW: { countryCode: 'ZW', orchestratorFunction: fetchZimbabweNews },
};

export async function GET() {
  console.log('Cron job starting: fetch-all-news');
  let countriesProcessed = 0;
  let successfulCountryFetches = 0;
  let failedCountryFetches = 0;

  // Iterate through all countries in the config
  for (const countryConfig of newsSourcesConfig) {
    const orchestratorEntry = countryOrchestratorMap[countryConfig.countryCode];

    if (orchestratorEntry) {
      console.log(`Processing news for ${orchestratorEntry.countryCode} (${countryConfig.countryName})...`);
      countriesProcessed++;
      try {
        await orchestratorEntry.orchestratorFunction();
        console.log(`Successfully processed news for ${orchestratorEntry.countryCode}.`);
        successfulCountryFetches++;
      } catch (error) {
        console.error(`Error processing news for ${orchestratorEntry.countryCode}:`, error);
        failedCountryFetches++;
      }
    } else {
      console.log(`Orchestrator for ${countryConfig.countryCode} (${countryConfig.countryName}) not implemented. Skipping.`);
    }
  }

  const message = `Cron job finished. Countries attempted (with implemented orchestrators): ${countriesProcessed}. Successful country orchestrations: ${successfulCountryFetches}. Failed country orchestrations: ${failedCountryFetches}.`;
  console.log(message);
  return NextResponse.json({ message });
}
    
