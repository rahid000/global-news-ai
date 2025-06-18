
export interface NewsSource {
  name: string;
  url: string;
}

export interface CountryNewsConfig {
  countryName: string;
  countryCode: string;
  timezone: string;
  sources: NewsSource[];
}

// Data derived from user-provided JSON, mapped with country codes from mock-data
export const newsSourcesConfig: CountryNewsConfig[] = [
  {
    countryName: "Afghanistan",
    countryCode: "AF",
    timezone: "Asia/Kabul",
    sources: [
      { name: "TOLOnews", url: "https://tolonews.com" },
      { name: "Pajhwok Afghan News", url: "https://pajhwok.com" }
    ]
  },
  {
    countryName: "Albania",
    countryCode: "AL",
    timezone: "Europe/Tirane",
    sources: [
      { name: "BalkanWeb", url: "https://www.balkanweb.com" },
      { name: "Albanian Daily News", url: "https://albaniandailynews.com" }
    ]
  },
  {
    countryName: "Algeria",
    countryCode: "DZ",
    timezone: "Africa/Algiers",
    sources: [
      { name: "Algerie Presse Service", url: "https://www.aps.dz" },
      { name: "El Moudjahid", url: "https://www.elmoudjahid.com" }
    ]
  },
  {
    countryName: "Andorra",
    countryCode: "AD",
    timezone: "Europe/Andorra",
    sources: [
      { name: "Diari d'Andorra", url: "https://www.diariandorra.ad" },
      { name: "Altaveu", url: "https://www.altaveu.com" }
    ]
  },
  {
    countryName: "Angola",
    countryCode: "AO",
    timezone: "Africa/Luanda",
    sources: [
      { name: "Jornal de Angola", url: "https://www.jornaldeangola.ao" },
      { name: "ANGOP", url: "https://www.angop.ao" }
    ]
  },
  {
    countryName: "Antigua and Barbuda",
    countryCode: "AG",
    timezone: "America/Antigua",
    sources: [
      { name: "Antigua Observer", url: "https://antiguaobserver.com" }
    ]
  },
  {
    countryName: "Argentina",
    countryCode: "AR",
    timezone: "America/Argentina/Buenos_Aires",
    sources: [
      { name: "Clarín", url: "https://www.clarin.com" },
      { name: "La Nación", url: "https://www.lanacion.com.ar" }
    ]
  },
  {
    countryName: "Armenia",
    countryCode: "AM",
    timezone: "Asia/Yerevan",
    sources: [
      { name: "Armenpress", url: "https://armenpress.am/eng" },
      { name: "PanARMENIAN.Net", url: "https://www.panarmenian.net" }
    ]
  },
  {
    countryName: "Australia",
    countryCode: "AU",
    timezone: "Australia/Sydney",
    sources: [
      { name: "ABC News Australia", url: "https://www.abc.net.au/news" },
      { name: "The Sydney Morning Herald", url: "https://www.smh.com.au" }
    ]
  },
  {
    countryName: "Austria",
    countryCode: "AT",
    timezone: "Europe/Vienna",
    sources: [
      { name: "Der Standard", url: "https://www.derstandard.at" },
      { name: "ORF", url: "https://orf.at" }
    ]
  },
  {
    countryName: "Azerbaijan",
    countryCode: "AZ",
    timezone: "Asia/Baku",
    sources: [
      { name: "AZERTAC", url: "https://azertag.az/en" },
      { name: "Trend News Agency", url: "https://en.trend.az" }
    ]
  },
  {
    countryName: "Bahamas",
    countryCode: "BS",
    timezone: "America/Nassau",
    sources: [
      { name: "The Nassau Guardian", url: "https://thenassauguardian.com" },
      { name: "The Tribune", url: "https://www.tribune242.com" }
    ]
  },
  {
    countryName: "Bahrain",
    countryCode: "BH",
    timezone: "Asia/Bahrain",
    sources: [
      { name: "Gulf Daily News", url: "https://www.gdnonline.com" },
      { name: "Bahrain News Agency", url: "https://www.bna.bh" }
    ]
  },
  {
    countryName: "Bangladesh",
    countryCode: "BD",
    timezone: "Asia/Dhaka",
    sources: [
      { name: "bdnews24", url: "https://bdnews24.com" },
      { name: "The Daily Star", url: "https://www.thedailystar.net" },
      { name: "Prothom Alo", url: "https://www.prothomalo.com" },
      // Adding other known sources for Bangladesh if they were in the old config or implied by chat
      { name: "Jamuna TV", url: "https://www.jamuna.tv" },
      { name: "Channel i", url: "https://www.channelionline.com" },
      { name: "Ittefaq", url: "https://www.ittefaq.com.bd" }
    ]
  },
  {
    countryName: "Barbados",
    countryCode: "BB",
    timezone: "America/Barbados",
    sources: [
      { name: "Nation News", url: "https://www.nationnews.com" },
      { name: "Barbados Today", url: "https://barbadostoday.bb" }
    ]
  },
  {
    countryName: "Belarus",
    countryCode: "BY",
    timezone: "Europe/Minsk",
    sources: [
      { name: "BelTA", url: "https://eng.belta.by" },
      { name: "TUT.BY", url: "https://news.tut.by" }
    ]
  },
  {
    countryName: "Belgium",
    countryCode: "BE",
    timezone: "Europe/Brussels",
    sources: [
      { name: "RTBF", url: "https://www.rtbf.be" },
      { name: "VRT", url: "https://www.vrt.be" }
    ]
  },
  {
    countryName: "Belize",
    countryCode: "BZ",
    timezone: "America/Belize",
    sources: [
      { name: "Amandala", url: "https://amandala.com.bz" },
      { name: "Breaking Belize News", url: "https://www.breakingbelizenews.com" }
    ]
  },
  {
    countryName: "Benin",
    countryCode: "BJ",
    timezone: "Africa/Porto-Novo",
    sources: [
      { name: "La Nouvelle Tribune", url: "https://lanouvelletribune.info" },
      { name: "Matin Libre", url: "https://www.matinlibre.com" }
    ]
  },
  {
    countryName: "Canada",
    countryCode: "CA",
    timezone: "America/Toronto",
    sources: [
      { name: "CBC", url: "https://www.cbc.ca/news" },
      { name: "CTV News", url: "https://www.ctvnews.ca" }
    ]
  },
  {
    countryName: "Cape Verde", // Corrected from Cabo Verde for mapping consistency
    countryCode: "CV",
    timezone: "Atlantic/Cape_Verde",
    sources: [
      { name: "A Nação", url: "https://anacao.cv" },
      { name: "Expresso das Ilhas", url: "https://expressodasilhas.cv" }
    ]
  },
  {
    countryName: "Central African Republic",
    countryCode: "CF",
    timezone: "Africa/Bangui",
    sources: [
      { name: "Radio Ndeke Luka", url: "https://www.radiondekeluka.org" },
      { name: "Journal de Bangui", url: "https://journaldebangui.com" }
    ]
  },
  {
    countryName: "Chad",
    countryCode: "TD",
    timezone: "Africa/Ndjamena",
    sources: [
      { name: "Tchad Infos", url: "https://tchadinfos.com" },
      { name: "Journal du Tchad", url: "https://journaldutchad.com" } // Corrected typo from user JSON
    ]
  },
  {
    countryName: "Chile",
    countryCode: "CL",
    timezone: "America/Santiago",
    sources: [
      { name: "El Mercurio", url: "https://www.emol.com" },
      { name: "La Tercera", url: "https://www.latercera.com" }
    ]
  },
  {
    countryName: "China",
    countryCode: "CN",
    timezone: "Asia/Shanghai",
    sources: [
      { name: "Xinhua", url: "http://www.xinhuanet.com/english" },
      { name: "China Daily", url: "https://www.chinadaily.com.cn" }
    ]
  },
  {
    countryName: "Colombia",
    countryCode: "CO",
    timezone: "America/Bogota",
    sources: [
      { name: "El Tiempo", url: "https://www.eltiempo.com" },
      { name: "Semana", url: "https://www.semana.com" }
    ]
  },
  {
    countryName: "Comoros",
    countryCode: "KM",
    timezone: "Indian/Comoro",
    sources: [
      { name: "Al-Watwan", url: "http://www.alwatwan.net" },
      { name: "Comores Infos", url: "https://comoresinfos.net" }
    ]
  },
  {
    countryName: "Congo (Congo-Brazzaville)", // Matched with mock-data name
    countryCode: "CG",
    timezone: "Africa/Brazzaville",
    sources: [
      { name: "Les Dépêches de Brazzaville", url: "https://www.adiac-congo.com" },
      { name: "Congo News", url: "https://congonews.org" }
    ]
  },
  {
    countryName: "DR Congo", // Matched with mock-data name for Congo (Kinshasa)
    countryCode: "CD",
    timezone: "Africa/Kinshasa",
    sources: [
      { name: "Radio Okapi", url: "https://radiookapi.net" },
      { name: "Digital Congo", url: "https://digitalcongo.net" }
    ]
  },
  {
    countryName: "Costa Rica",
    countryCode: "CR",
    timezone: "America/Costa_Rica",
    sources: [
      { name: "La Nación", url: "https://www.nacion.com" },
      { name: "CRHoy", url: "https://www.crhoy.com" }
    ]
  },
  {
    countryName: "Croatia",
    countryCode: "HR",
    timezone: "Europe/Zagreb",
    sources: [
      { name: "Jutarnji List", url: "https://www.jutarnji.hr" },
      { name: "Vecernji List", url: "https://www.vecernji.hr" }
    ]
  },
  {
    countryName: "Cuba",
    countryCode: "CU",
    timezone: "America/Havana",
    sources: [
      { name: "Granma", url: "http://www.granma.cu" },
      { name: "Cuba Debate", url: "https://www.cubadebate.cu" }
    ]
  },
  {
    countryName: "Cyprus",
    countryCode: "CY",
    timezone: "Asia/Nicosia",
    sources: [
      { name: "Cyprus Mail", url: "https://cyprus-mail.com" },
      { name: "In-Cyprus", url: "https://in-cyprus.philenews.com" }
    ]
  },
  {
    countryName: "Czech Republic",
    countryCode: "CZ",
    timezone: "Europe/Prague",
    sources: [
      { name: "Prague Morning", url: "https://praguemorning.cz" },
      { name: "Czech News Agency", url: "https://www.ceskenoviny.cz" }
    ]
  },
  {
    countryName: "Denmark",
    countryCode: "DK",
    timezone: "Europe/Copenhagen",
    sources: [
      { name: "DR", url: "https://www.dr.dk/nyheder" },
      { name: "The Copenhagen Post", url: "https://cphpost.dk" }
    ]
  },
  {
    countryName: "Djibouti",
    countryCode: "DJ",
    timezone: "Africa/Djibouti",
    sources: [
      { name: "La Nation", url: "https://www.lanationdj.com" },
      { name: "ADDS", url: "https://addis.djibouti" } // User provided, keeping as is.
    ]
  },
  {
    countryName: "Dominica",
    countryCode: "DM",
    timezone: "America/Dominica",
    sources: [
      { name: "Dominica News Online", url: "https://dominicanewsonline.com" },
      { name: "The Sun", url: "https://thesundominica.com" }
    ]
  },
  {
    countryName: "Dominican Republic",
    countryCode: "DO",
    timezone: "America/Santo_Domingo",
    sources: [
      { name: "Listin Diario", url: "https://listindiario.com" },
      { name: "Diario Libre", url: "https://www.diariolibre.com" }
    ]
  },
  {
    countryName: "Ecuador",
    countryCode: "EC",
    timezone: "America/Guayaquil",
    sources: [
      { name: "El Comercio", url: "https://www.elcomercio.com" },
      { name: "El Telégrafo", url: "https://www.eltelegrafo.com.ec" }
    ]
  },
  {
    countryName: "Egypt",
    countryCode: "EG",
    timezone: "Africa/Cairo",
    sources: [
      { name: "Al-Ahram", url: "http://english.ahram.org.eg" },
      { name: "Ahram Online", url: "https://english.ahram.org.eg" }
    ]
  },
  {
    countryName: "El Salvador",
    countryCode: "SV",
    timezone: "America/El_Salvador",
    sources: [
      { name: "El Diario de Hoy", url: "https://www.elsalvador.com" },
      { name: "La Prensa Gráfica", url: "https://www.laprensagrafica.com" }
    ]
  },
  {
    countryName: "Estonia",
    countryCode: "EE",
    timezone: "Europe/Tallinn",
    sources: [
      { name: "ERR", url: "https://news.err.ee" },
      { name: "Postimees", url: "https://www.postimees.ee" }
    ]
  },
  {
    countryName: "Ethiopia",
    countryCode: "ET",
    timezone: "Africa/Addis_Ababa",
    sources: [
      { name: "Ethiopian Herald", url: "https://www.press.et" },
      { name: "ENA (Ethiopian News Agency)", url: "https://www.ena.et" }
    ]
  },
  {
    countryName: "Fiji",
    countryCode: "FJ",
    timezone: "Pacific/Fiji",
    sources: [
      { name: "Fiji Sun", url: "https://fijisun.com.fj" },
      { name: "Fiji Times", url: "https://www.fijitimes.com" }
    ]
  },
  {
    countryName: "Finland",
    countryCode: "FI",
    timezone: "Europe/Helsinki",
    sources: [
      { name: "Yle News", url: "https://yle.fi/news" },
      { name: "Helsingin Sanomat", url: "https://www.hs.fi" }
    ]
  },
  {
    countryName: "France",
    countryCode: "FR",
    timezone: "Europe/Paris",
    sources: [
      { name: "Le Monde", url: "https://www.lemonde.fr/en" },
      { name: "France 24", url: "https://www.france24.com/en/" }
    ]
  },
  {
    countryName: "Gabon",
    countryCode: "GA",
    timezone: "Africa/Libreville",
    sources: [
      { name: "Gabon Review", url: "https://gabonreview.com" },
      { name: "L’Union", url: "https://www.union.sonapresse.com" }
    ]
  },
  {
    countryName: "Gambia",
    countryCode: "GM",
    timezone: "Africa/Banjul",
    sources: [
      { name: "The Point", url: "https://thepoint.gm" },
      { name: "Foroyaa", url: "https://foroyaa.net" }
    ]
  },
  {
    countryName: "Georgia",
    countryCode: "GE",
    timezone: "Asia/Tbilisi",
    sources: [
      { name: "Agenda.ge", url: "https://agenda.ge" },
      { name: "Georgia Today", url: "https://georgiatoday.ge" }
    ]
  },
  {
    countryName: "Germany",
    countryCode: "DE",
    timezone: "Europe/Berlin",
    sources: [
      { name: "Deutsche Welle", url: "https://www.dw.com/en" },
      { name: "Spiegel Online", url: "https://www.spiegel.de/international" }
    ]
  },
  {
    countryName: "Ghana",
    countryCode: "GH",
    timezone: "Africa/Accra",
    sources: [
      { name: "GhanaWeb", url: "https://www.ghanaweb.com" },
      { name: "MyJoyOnline", url: "https://www.myjoyonline.com" }
    ]
  },
  {
    countryName: "Greece",
    countryCode: "GR",
    timezone: "Europe/Athens",
    sources: [
      { name: "Ekathimerini", url: "https://www.ekathimerini.com" },
      { name: "Greek Reporter", url: "https://greekreporter.com" }
    ]
  },
  {
    countryName: "Grenada",
    countryCode: "GD",
    timezone: "America/Grenada",
    sources: [
      { name: "Now Grenada", url: "https://www.nowgrenada.com" },
      { name: "The New Today", url: "https://thenewtoday.gd" }
    ]
  },
  {
    countryName: "Guatemala",
    countryCode: "GT",
    timezone: "America/Guatemala",
    sources: [
      { name: "Prensa Libre", url: "https://www.prensalibre.com" },
      { name: "El Periódico", url: "https://elperiodico.com.gt" }
    ]
  },
  {
    countryName: "Guinea",
    countryCode: "GN",
    timezone: "Africa/Conakry",
    sources: [
      { name: "Guinee News", url: "https://www.guineenews.org" },
      { name: "VisionGuinee", url: "https://www.visionguinee.info" }
    ]
  },
  {
    countryName: "Guinea-Bissau",
    countryCode: "GW",
    timezone: "Africa/Bissau",
    sources: [
      { name: "O Democrata", url: "https://www.odemocratagb.com" },
      { name: "GBissau", url: "https://www.gbissau.com" }
    ]
  },
  {
    countryName: "Guyana",
    countryCode: "GY",
    timezone: "America/Guyana",
    sources: [
      { name: "Stabroek News", url: "https://www.stabroeknews.com" },
      { name: "Kaieteur News", url: "https://www.kaieteurnewsonline.com" }
    ]
  },
  {
    countryName: "Haiti",
    countryCode: "HT",
    timezone: "America/Port-au-Prince",
    sources: [
      { name: "Haiti Libre", url: "https://www.haitilibre.com" },
      { name: "Le Nouvelliste", url: "https://lenouvelliste.com" }
    ]
  },
  {
    countryName: "Honduras",
    countryCode: "HN",
    timezone: "America/Tegucigalpa",
    sources: [
      { name: "La Prensa", url: "https://www.laprensa.hn" },
      { name: "El Heraldo", url: "https://www.elheraldo.hn" }
    ]
  },
  {
    countryName: "Hungary",
    countryCode: "HU",
    timezone: "Europe/Budapest",
    sources: [
      { name: "Hungary Today", url: "https://hungarytoday.hu" },
      { name: "Daily News Hungary", url: "https://dailynewshungary.com" }
    ]
  },
  {
    countryName: "Iceland",
    countryCode: "IS",
    timezone: "Atlantic/Reykjavik",
    sources: [
      { name: "Iceland Review", url: "https://www.icelandreview.com" },
      { name: "Reykjavík Grapevine", url: "https://grapevine.is" }
    ]
  },
  {
    countryName: "India",
    countryCode: "IN",
    timezone: "Asia/Kolkata",
    sources: [
      { name: "The Hindu", url: "https://www.thehindu.com" },
      { name: "NDTV", url: "https://www.ndtv.com" }
    ]
  },
  {
    countryName: "Indonesia",
    countryCode: "ID",
    timezone: "Asia/Jakarta",
    sources: [
      { name: "Jakarta Post", url: "https://www.thejakartapost.com" },
      { name: "Kompas", url: "https://www.kompas.com" }
    ]
  },
  {
    countryName: "Iran",
    countryCode: "IR",
    timezone: "Asia/Tehran",
    sources: [
      { name: "Tehran Times", url: "https://www.tehrantimes.com" },
      { name: "Mehr News", url: "https://en.mehrnews.com" }
    ]
  },
  {
    countryName: "Iraq",
    countryCode: "IQ",
    timezone: "Asia/Baghdad",
    sources: [
      { name: "Iraqi News", url: "https://www.iraqinews.com" },
      { name: "Rudaw", url: "https://www.rudaw.net/english" }
    ]
  },
  {
    countryName: "Ireland",
    countryCode: "IE",
    timezone: "Europe/Dublin",
    sources: [
      { name: "Irish Times", url: "https://www.irishtimes.com" },
      { name: "RTE News", url: "https://www.rte.ie/news" }
    ]
  },
  {
    countryName: "Israel",
    countryCode: "IL",
    timezone: "Asia/Jerusalem",
    sources: [
      { name: "Haaretz", url: "https://www.haaretz.com" },
      { name: "The Times of Israel", url: "https://www.timesofisrael.com" }
    ]
  },
  {
    countryName: "Italy",
    countryCode: "IT",
    timezone: "Europe/Rome",
    sources: [
      { name: "ANSA", url: "https://www.ansa.it/english" },
      { name: "Corriere della Sera", url: "https://www.corriere.it" }
    ]
  },
  {
    countryName: "Jamaica",
    countryCode: "JM",
    timezone: "America/Jamaica",
    sources: [
      { name: "Jamaica Gleaner", url: "https://jamaica-gleaner.com" },
      { name: "Jamaica Observer", url: "https://www.jamaicaobserver.com" }
    ]
  },
  {
    countryName: "Japan",
    countryCode: "JP",
    timezone: "Asia/Tokyo",
    sources: [
      { name: "Japan Times", url: "https://www.japantimes.co.jp" },
      { name: "NHK World", url: "https://www3.nhk.or.jp/nhkworld/en/news" }
    ]
  },
  {
    countryName: "Jordan",
    countryCode: "JO",
    timezone: "Asia/Amman",
    sources: [
      { name: "Jordan Times", url: "https://www.jordantimes.com" },
      { name: "Petra News Agency", url: "https://petra.gov.jo" }
    ]
  },
  {
    countryName: "Kazakhstan",
    countryCode: "KZ",
    timezone: "Asia/Almaty",
    sources: [
      { name: "Kazinform", url: "https://www.inform.kz/en" },
      { name: "Tengrinews", url: "https://en.tengrinews.kz" }
    ]
  },
  {
    countryName: "Kenya",
    countryCode: "KE",
    timezone: "Africa/Nairobi",
    sources: [
      { name: "Daily Nation", url: "https://nation.africa" },
      { name: "The Standard", url: "https://www.standardmedia.co.ke" }
    ]
  },
  {
    countryName: "Kiribati",
    countryCode: "KI",
    timezone: "Pacific/Tarawa",
    sources: [
      { name: "Radio Kiribati", url: "https://www.rib.gov.ki" },
      { name: "Kiribati Times", url: "https://kiribatitimes.org" }
    ]
  },
  {
    countryName: "Kuwait",
    countryCode: "KW",
    timezone: "Asia/Kuwait",
    sources: [
      { name: "Kuwait Times", url: "https://www.kuwaittimes.com" },
      { name: "Arab Times", url: "https://www.arabtimesonline.com" }
    ]
  },
  {
    countryName: "Kyrgyzstan",
    countryCode: "KG",
    timezone: "Asia/Bishkek",
    sources: [
      { name: "AKIpress", url: "https://akipress.com" },
      { name: "24.kg", url: "https://24.kg/en" }
    ]
  },
  {
    countryName: "Latvia",
    countryCode: "LV",
    timezone: "Europe/Riga",
    sources: [
      { name: "The Baltic Times", url: "https://www.baltictimes.com" },
      { name: "LSM", url: "https://eng.lsm.lv" }
    ]
  },
  {
    countryName: "Lebanon",
    countryCode: "LB",
    timezone: "Asia/Beirut",
    sources: [
      { name: "The Daily Star", url: "https://www.dailystar.com.lb" },
      { name: "Naharnet", url: "https://www.naharnet.com" }
    ]
  },
  {
    countryName: "Lesotho",
    countryCode: "LS",
    timezone: "Africa/Maseru",
    sources: [
      { name: "Lesotho Times", url: "https://lestimes.com" },
      { name: "Public Eye", url: "https://www.publiceyenews.com" }
    ]
  },
  {
    countryName: "Liberia",
    countryCode: "LR",
    timezone: "Africa/Monrovia",
    sources: [
      { name: "The New Dawn Liberia", url: "https://thenewdawnliberia.com" },
      { name: "FrontPage Africa", url: "https://frontpageafricaonline.com" }
    ]
  },
  {
    countryName: "Libya",
    countryCode: "LY",
    timezone: "Africa/Tripoli",
    sources: [
      { name: "The Libya Observer", url: "https://libyaobserver.ly" },
      { name: "Libya Herald", url: "https://www.libyaherald.com" }
    ]
  },
  {
    countryName: "Liechtenstein",
    countryCode: "LI",
    timezone: "Europe/Vaduz",
    sources: [
      { name: "Liechtensteiner Vaterland", url: "https://www.vaterland.li" },
      { name: "Volksblatt", url: "https://www.volksblatt.li" }
    ]
  },
  {
    countryName: "Lithuania",
    countryCode: "LT",
    timezone: "Europe/Vilnius",
    sources: [
      { name: "Lithuanian National Radio and Television", url: "https://www.lrt.lt/en" },
      { name: "The Baltic Times", url: "https://www.baltictimes.com" }
    ]
  },
  {
    countryName: "Luxembourg",
    countryCode: "LU",
    timezone: "Europe/Luxembourg",
    sources: [
      { name: "Luxembourg Times", url: "https://luxtimes.lu" },
      { name: "RTL Today", url: "https://today.rtl.lu" }
    ]
  },
  {
    countryName: "Madagascar",
    countryCode: "MG",
    timezone: "Indian/Antananarivo",
    sources: [
      { name: "L'Express de Madagascar", url: "https://lexpress.mg" },
      { name: "Midi Madagasikara", url: "https://www.midi-madagasikara.mg" }
    ]
  },
  {
    countryName: "Malawi",
    countryCode: "MW",
    timezone: "Africa/Blantyre",
    sources: [
      { name: "The Nation", url: "https://www.mwnation.com" },
      { name: "Nyasa Times", url: "https://www.nyasatimes.com" }
    ]
  },
  {
    countryName: "Malaysia",
    countryCode: "MY",
    timezone: "Asia/Kuala_Lumpur",
    sources: [
      { name: "The Star", url: "https://www.thestar.com.my" },
      { name: "Malaysiakini", url: "https://www.malaysiakini.com" }
    ]
  },
  {
    countryName: "Maldives",
    countryCode: "MV",
    timezone: "Indian/Maldives",
    sources: [
      { name: "Sun Online", url: "https://sun.mv" },
      { name: "The Edition", url: "https://edition.mv" }
    ]
  },
  {
    countryName: "Mali",
    countryCode: "ML",
    timezone: "Africa/Bamako",
    sources: [
      { name: "Maliweb", url: "https://www.maliweb.net" },
      { name: "Journal du Mali", url: "https://www.journaldumali.com" }
    ]
  },
  {
    countryName: "Malta",
    countryCode: "MT",
    timezone: "Europe/Malta",
    sources: [
      { name: "Times of Malta", url: "https://timesofmalta.com" },
      { name: "Malta Independent", url: "https://www.independent.com.mt" }
    ]
  },
  {
    countryName: "Marshall Islands",
    countryCode: "MH",
    timezone: "Pacific/Majuro",
    sources: [
      { name: "Marianas Variety", url: "https://www.mvariety.com" },
      { name: "Radio New Zealand Pacific", url: "https://www.rnz.co.nz/international/pacific" }
    ]
  },
  {
    countryName: "Mauritania",
    countryCode: "MR",
    timezone: "Africa/Nouakchott",
    sources: [
      { name: "Sahara Media", url: "https://www.saharamedias.net" },
      { name: "Alakhbar", url: "https://alakhbar.info" }
    ]
  },
  {
    countryName: "Mauritius",
    countryCode: "MU",
    timezone: "Indian/Mauritius",
    sources: [
      { name: "Defimedia", url: "https://defimedia.info" },
      { name: "L'Express", url: "https://lexpress.mu" }
    ]
  },
  {
    countryName: "Mexico",
    countryCode: "MX",
    timezone: "America/Mexico_City",
    sources: [
      { name: "El Universal", url: "https://www.eluniversal.com.mx" },
      { name: "Milenio", url: "https://www.milenio.com" }
    ]
  },
  {
    countryName: "Micronesia",
    countryCode: "FM",
    timezone: "Pacific/Pohnpei",
    sources: [
      { name: "The Kaselehlie Press", url: "http://www.kpress.info" },
      { name: "Pacific Islands Report", url: "http://www.pireport.org" }
    ]
  },
  {
    countryName: "Moldova",
    countryCode: "MD",
    timezone: "Europe/Chisinau",
    sources: [
      { name: "Moldpres", url: "https://www.moldpres.md" },
      { name: "Unimedia", url: "https://unimedia.info" }
    ]
  },
  {
    countryName: "Monaco",
    countryCode: "MC",
    timezone: "Europe/Monaco",
    sources: [
      { name: "Monaco Tribune", url: "https://www.monaco-tribune.com" },
      { name: "Monaco Life", url: "https://monacolife.net" }
    ]
  },
  {
    countryName: "Mongolia",
    countryCode: "MN",
    timezone: "Asia/Ulaanbaatar",
    sources: [
      { name: "Montsame News Agency", url: "https://montsame.mn/en" },
      { name: "The UB Post", url: "https://theubpost.com" } // Corrected from "theubposts.com"
    ]
  },
  {
    countryName: "Montenegro",
    countryCode: "ME",
    timezone: "Europe/Podgorica",
    sources: [
      { name: "Vijesti", url: "https://www.vijesti.me" },
      { name: "CDM", url: "https://www.cdm.me" }
    ]
  },
  {
    countryName: "Morocco",
    countryCode: "MA",
    timezone: "Africa/Casablanca",
    sources: [
      { name: "Morocco World News", url: "https://www.moroccoworldnews.com" },
      { name: "Le Matin", url: "https://lematin.ma" }
    ]
  },
  {
    countryName: "Mozambique",
    countryCode: "MZ",
    timezone: "Africa/Maputo",
    sources: [
      { name: "AIM News", url: "http://www.aim.org.mz" },
      { name: "O País", url: "https://www.opais.co.mz" }
    ]
  },
  {
    countryName: "Myanmar",
    countryCode: "MM",
    timezone: "Asia/Yangon",
    sources: [
      { name: "The Irrawaddy", url: "https://www.irrawaddy.com" },
      { name: "Myanmar Times", url: "https://www.mmtimes.com" }
    ]
  },
  {
    countryName: "Namibia",
    countryCode: "NA",
    timezone: "Africa/Windhoek",
    sources: [
      { name: "The Namibian", url: "https://www.namibian.com.na" },
      { name: "New Era", url: "https://neweralive.na" }
    ]
  },
  {
    countryName: "Nauru",
    countryCode: "NR",
    timezone: "Pacific/Nauru",
    sources: [
      { name: "Radio New Zealand Pacific", url: "https://www.rnz.co.nz/international/pacific" },
      { name: "ABC Pacific", url: "https://www.abc.net.au/radio-australia" }
    ]
  },
  {
    countryName: "Nepal",
    countryCode: "NP",
    timezone: "Asia/Kathmandu",
    sources: [
      { name: "The Kathmandu Post", url: "https://kathmandupost.com" },
      { name: "The Himalayan Times", url: "https://thehimalayantimes.com" }
    ]
  },
  {
    countryName: "Netherlands",
    countryCode: "NL",
    timezone: "Europe/Amsterdam",
    sources: [
      { name: "DutchNews.nl", url: "https://www.dutchnews.nl" },
      { name: "NL Times", url: "https://nltimes.nl" }
    ]
  },
  {
    countryName: "New Zealand",
    countryCode: "NZ",
    timezone: "Pacific/Auckland",
    sources: [
      { name: "NZ Herald", url: "https://www.nzherald.co.nz" },
      { name: "Stuff", url: "https://www.stuff.co.nz" }
    ]
  },
  {
    countryName: "Nicaragua",
    countryCode: "NI",
    timezone: "America/Managua",
    sources: [
      { name: "La Prensa", url: "https://www.laprensa.com.ni" },
      { name: "Confidencial", url: "https://confidencial.digital" }
    ]
  },
  {
    countryName: "Niger",
    countryCode: "NE",
    timezone: "Africa/Niamey",
    sources: [
      { name: "ActuNiger", url: "https://www.actuniger.com" },
      { name: "Le Sahel", url: "https://www.lesahel.org" }
    ]
  },
  {
    countryName: "Nigeria",
    countryCode: "NG",
    timezone: "Africa/Lagos",
    sources: [
      { name: "The Guardian Nigeria", url: "https://guardian.ng" },
      { name: "Punch Newspapers", url: "https://punchng.com" }
    ]
  },
  {
    countryName: "North Korea",
    countryCode: "KP",
    timezone: "Asia/Pyongyang",
    sources: [
      { name: "KCNA", url: "http://www.kcna.kp" },
      { name: "Naenara", url: "http://www.naenara.com.kp" }
    ]
  },
  {
    countryName: "North Macedonia",
    countryCode: "MK",
    timezone: "Europe/Skopje",
    sources: [
      { name: "MIA", url: "https://mia.mk" },
      { name: "Nova Makedonija", url: "https://www.novamakedonija.com.mk" }
    ]
  },
  {
    countryName: "Norway",
    countryCode: "NO",
    timezone: "Europe/Oslo",
    sources: [
      { name: "The Local Norway", url: "https://www.thelocal.no" },
      { name: "NRK", url: "https://www.nrk.no" }
    ]
  },
  {
    countryName: "Oman",
    countryCode: "OM",
    timezone: "Asia/Muscat",
    sources: [
      { name: "Times of Oman", url: "https://timesofoman.com" },
      { name: "Oman Observer", url: "https://www.omanobserver.om" }
    ]
  },
  {
    countryName: "Togo",
    countryCode: "TG",
    timezone: "Africa/Lome",
    sources: [
      { name: "Togo First", url: "https://www.togofirst.com" },
      { name: "Republicoftogo.com", url: "https://www.republicoftogo.com" }
    ]
  },
  {
    countryName: "Tonga",
    countryCode: "TO",
    timezone: "Pacific/Tongatapu",
    sources: [
      { name: "Matangi Tonga", url: "https://matangitonga.to" }
    ]
  },
  {
    countryName: "Trinidad and Tobago",
    countryCode: "TT",
    timezone: "America/Port_of_Spain",
    sources: [
      { name: "Trinidad Express", url: "https://trinidadexpress.com" },
      { name: "Newsday", url: "https://newsday.co.tt" }
    ]
  },
  {
    countryName: "Tunisia",
    countryCode: "TN",
    timezone: "Africa/Tunis",
    sources: [
      { name: "Tunisie Numérique", url: "https://www.tunisienumerique.com" },
      { name: "Tunis Daily News", url: "https://www.thetunisianews.com" }
    ]
  },
  {
    countryName: "Turkey",
    countryCode: "TR",
    timezone: "Europe/Istanbul",
    sources: [
      { name: "Hürriyet Daily News", url: "https://www.hurriyetdailynews.com" },
      { name: "Daily Sabah", url: "https://www.dailysabah.com" }
    ]
  },
  {
    countryName: "Turkmenistan",
    countryCode: "TM",
    timezone: "Asia/Ashgabat",
    sources: [
      { name: "Turkmenistan.ru", url: "https://www.turkmenistan.ru/en/" }
    ]
  },
  {
    countryName: "Tuvalu",
    countryCode: "TV",
    timezone: "Pacific/Funafuti",
    sources: [
      { name: "Radio Tuvalu", url: "https://www.tuvalu.tv" }
    ]
  },
  {
    countryName: "Uganda",
    countryCode: "UG",
    timezone: "Africa/Kampala",
    sources: [
      { name: "Daily Monitor", url: "https://www.monitor.co.ug" },
      { name: "New Vision", url: "https://www.newvision.co.ug" }
    ]
  },
  {
    countryName: "Ukraine",
    countryCode: "UA",
    timezone: "Europe/Kyiv",
    sources: [
      { name: "Kyiv Independent", url: "https://kyivindependent.com" },
      { name: "Ukrinform", url: "https://www.ukrinform.net" }
    ]
  },
  {
    countryName: "United Arab Emirates",
    countryCode: "AE",
    timezone: "Asia/Dubai",
    sources: [
      { name: "The National", url: "https://www.thenationalnews.com" },
      { name: "Khaleej Times", url: "https://www.khaleejtimes.com" }
    ]
  },
  {
    countryName: "United Kingdom",
    countryCode: "GB",
    timezone: "Europe/London",
    sources: [
      { name: "BBC News", url: "https://www.bbc.com/news" },
      { name: "The Guardian", url: "https://www.theguardian.com" }
    ]
  },
  {
    countryName: "United States",
    countryCode: "US",
    timezone: "America/New_York",
    sources: [
      { name: "CNN", url: "https://www.cnn.com" },
      { name: "The New York Times", url: "https://www.nytimes.com" }
    ]
  },
  {
    countryName: "Uruguay",
    countryCode: "UY",
    timezone: "America/Montevideo",
    sources: [
      { name: "El País", url: "https://www.elpais.com.uy" },
      { name: "Montevideo Portal", url: "https://www.montevideo.com.uy" }
    ]
  },
  {
    countryName: "Uzbekistan",
    countryCode: "UZ",
    timezone: "Asia/Tashkent",
    sources: [
      { name: "UzDaily", url: "https://www.uzdaily.uz" },
      { name: "Gazeta.uz", url: "https://www.gazeta.uz/en/" }
    ]
  },
  {
    countryName: "Vanuatu",
    countryCode: "VU",
    timezone: "Pacific/Efate",
    sources: [
      { name: "Vanuatu Daily Post", url: "https://www.dailypost.vu" }
    ]
  },
  {
    countryName: "Vatican City",
    countryCode: "VA",
    timezone: "Europe/Vatican",
    sources: [
      { name: "Vatican News", url: "https://www.vaticannews.va/en.html" }
    ]
  },
  {
    countryName: "Venezuela",
    countryCode: "VE",
    timezone: "America/Caracas",
    sources: [
      { name: "El Nacional", url: "https://www.elnacional.com" },
      { name: "El Universal", url: "https://www.eluniversal.com" }
    ]
  },
  {
    countryName: "Vietnam",
    countryCode: "VN",
    timezone: "Asia/Ho_Chi_Minh",
    sources: [
      { name: "VNExpress", url: "https://e.vnexpress.net" },
      { name: "Vietnam News", url: "https://vietnamnews.vn" }
    ]
  },
  {
    countryName: "Yemen",
    countryCode: "YE",
    timezone: "Asia/Aden",
    sources: [
      { name: "Yemen Online", url: "https://www.yemenonline.info" },
      { name: "Yemen Times", url: "https://www.yementimes.com" }
    ]
  },
  {
    countryName: "Zambia",
    countryCode: "ZM",
    timezone: "Africa/Lusaka",
    sources: [
      { name: "Zambia Daily Mail", url: "https://www.daily-mail.co.zm" },
      { name: "Lusaka Times", url: "https://www.lusakatimes.com" }
    ]
  },
  {
    countryName: "Zimbabwe",
    countryCode: "ZW",
    timezone: "Africa/Harare",
    sources: [
      { name: "The Herald", url: "https://www.herald.co.zw" },
      { name: "NewsDay", url: "https://www.newsday.co.zw" }
    ]
  }
  // Note: Some countries from the user's original list might be missing if a country code couldn't be reliably mapped.
  // Example: Bhutan, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Brunei, Bulgaria, Burkina Faso, Burundi, etc.
  // were not in the initial small set, and will only be included if their names successfully map to codes from mock-data.ts
];

    