// Nepal Administrative Divisions Data - Complete Dataset
// Province → District → Local Body → Ward
// Data source: Official Nepal Government Administrative Structure

export interface LocalBody {
  name: string;
  nameNepali: string;
  type: 'Metropolitan' | 'Sub-Metropolitan' | 'Municipality' | 'Rural Municipality';
  wards: number; // Number of wards
}

export interface District {
  name: string;
  nameNepali: string;
  localBodies: LocalBody[];
}

export interface Province {
  name: string;
  nameNepali: string;
  districts: District[];
}

export const nepalAdministrativeDivisions: Province[] = [
  {
    name: 'Koshi Province',
    nameNepali: 'कोशी प्रदेश',
    districts: [
      {
        name: 'Bhojpur',
        nameNepali: 'भोजपुर',
        localBodies: [
          { name: 'Bhojpur Municipality', nameNepali: 'भोजपुर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Shadananda Municipality', nameNepali: 'षडानन्द नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Temkemayung Rural Municipality', nameNepali: 'टेम्केमैयुङ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Ram Prasad Rai Rural Municipality', nameNepali: 'रामप्रसाद राई गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Arun Rural Municipality', nameNepali: 'अरुण गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Pauwadungma Rural Municipality', nameNepali: 'पौवादुङमा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Salpasilicho Rural Municipality', nameNepali: 'साल्पासिलिछो गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Amchok Rural Municipality', nameNepali: 'आमचोक गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Hatuwagadhi Rural Municipality', nameNepali: 'हतुवागढी गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Dhankuta',
        nameNepali: 'धनकुटा',
        localBodies: [
          { name: 'Pakhribash Municipality', nameNepali: 'पाख्रिबास नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Dhankuta Municipality', nameNepali: 'धनकुटा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Mahalakshmi Municipality', nameNepali: 'महालक्ष्मी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Sangurigadhi Rural Municipality', nameNepali: 'साँगुरीगढी गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Sahidbhoomi Rural Municipality', nameNepali: 'सहिदभूमि गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Chhathar Jorpati Rural Municipality', nameNepali: 'छथर जोरपाटी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Chaubise Rural Municipality', nameNepali: 'चौविसे गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Ilam',
        nameNepali: 'इलाम',
        localBodies: [
          { name: 'Ilam Municipality', nameNepali: 'ईलाम नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Deumai Municipality', nameNepali: 'देउमाई नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Mai Municipality', nameNepali: 'माई नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Suryoday Municipality', nameNepali: 'सूर्योदय नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Fakphokathum Rural Municipality', nameNepali: 'फाकफोकथुम गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Chulachuli Rural Municipality', nameNepali: 'चुलाचुली गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Maijogmai Rural Municipality', nameNepali: 'माईजोगमाई गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Mangsebung Rural Municipality', nameNepali: 'माङसेबुङ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rong Rural Municipality', nameNepali: 'रोङ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Sandakpur Rural Municipality', nameNepali: 'सन्दकपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Jhapa',
        nameNepali: 'झापा',
        localBodies: [
          { name: 'Mechinagar Municipality', nameNepali: 'मेचीनगर नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Damak Municipality', nameNepali: 'दमक नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Kankai Municipality', nameNepali: 'कन्काई नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhadrapur Municipality', nameNepali: 'भद्रपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Arjundhara Municipality', nameNepali: 'अर्जुनधारा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Shivshatakshi Municipality', nameNepali: 'शिवशताक्षी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Gauradaha Municipality', nameNepali: 'गौरादह नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Virtamod Municipality', nameNepali: 'विर्तामोड नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Kamal Rural Municipality', nameNepali: 'कमल गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gauriganj Rural Municipality', nameNepali: 'गौरीगंज गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bahardashi Rural Municipality', nameNepali: 'बाह्रदशी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Jhapa Rural Municipality', nameNepali: 'झापा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Buddhashanti Rural Municipality', nameNepali: 'बुद्धशान्ति गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Haldiwari Rural Municipality', nameNepali: 'हल्दिवारी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kachankawal Rural Municipality', nameNepali: 'कचनकवल गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Khotang',
        nameNepali: 'खोटाँग',
        localBodies: [
          { name: 'Halesi Tuvachung Municipality', nameNepali: 'हलेसी तुवाचुङ नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Diktel Rupakot Mazhuwagadi Municipality', nameNepali: 'दिक्तेल रुपाकोट मझुवागढी नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Aiselukharka Rural Municipality', nameNepali: 'ऐसेलुखर्क गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Rawa Besi Rural Municipality', nameNepali: 'रावा बेसी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Jantedhunga Rural Municipality', nameNepali: 'जन्तेढुंगा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Khotehang Rural Municipality', nameNepali: 'खोटेहाङ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Kepilasgadhi Rural Municipality', nameNepali: 'केपिलासगढी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Diprung Chuichumma Rural Municipality', nameNepali: 'दिप्रुङ चुइचुम्मा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sakela Rural Municipality', nameNepali: 'साकेला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Barahpokhari Rural Municipality', nameNepali: 'वराहपोखरी गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Morang',
        nameNepali: 'मोरंग',
        localBodies: [
          { name: 'Biratnagar Metropolitan City', nameNepali: 'विराटनगर महानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Belwari Municipality', nameNepali: 'बेलवारी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Letang Municipality', nameNepali: 'लेटाङ नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Pathari Shanischare Municipality', nameNepali: 'पथरी शनिश्चरे नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Rangeli Municipality', nameNepali: 'रंगेली नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Ratuwamai Municipality', nameNepali: 'रतुवामाई नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Sunvarshi Municipality', nameNepali: 'सुनवर्षि नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Urlavari Municipality', nameNepali: 'उर्लावारी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Sundaraharaicha Municipality', nameNepali: 'सुन्दरहरैचा नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Budhiganga Rural Municipality', nameNepali: 'बुढीगंगा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Dhanpalathan Rural Municipality', nameNepali: 'धनपालथान गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gramthan Rural Municipality', nameNepali: 'ग्रामथान गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Jahada Rural Municipality', nameNepali: 'जहदा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Kanepokhari Rural Municipality', nameNepali: 'कानेपोखरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Katahari Rural Municipality', nameNepali: 'कटहरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Kerabari Rural Municipality', nameNepali: 'केरावारी गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Miklajung Rural Municipality', nameNepali: 'मिक्लाजुङ गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Okhaldhunga',
        nameNepali: 'ओखलढुंगा',
        localBodies: [
          { name: 'Siddicharan Municipality', nameNepali: 'सिद्दिचरण नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Khijidemba Rural Municipality', nameNepali: 'खिजिदेम्बा गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Champadevi Rural Municipality', nameNepali: 'चम्पादेवी गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Chishankhugadhi Rural Municipality', nameNepali: 'चिशंखुगढी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Manebhanyang Rural Municipality', nameNepali: 'मानेभञ्याङ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Molung Rural Municipality', nameNepali: 'मोलुङ गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Likhu Rural Municipality', nameNepali: 'लिखु गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Sunkoshi Rural Municipality', nameNepali: 'सुनकोशी गाउँपालिका', type: 'Rural Municipality', wards: 10 }
        ]
      },
      {
        name: 'Panchthar',
        nameNepali: 'पांचथर',
        localBodies: [
          { name: 'Phidim Municipality', nameNepali: 'फिदिम नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Phalelung Rural Municipality', nameNepali: 'फालेलुङ गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Falgunand Rural Municipality', nameNepali: 'फाल्गुनन्द गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Hilihang Rural Municipality', nameNepali: 'हिलिहाङ गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Kummayak Rural Municipality', nameNepali: 'कुम्मायक गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Miklajung Rural Municipality', nameNepali: 'मिक्लाजुङ गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Tumbewa Rural Municipality', nameNepali: 'तुम्बेवा गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Yangwarak Rural Municipality', nameNepali: 'याङवरक गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Sankhuwasabha',
        nameNepali: 'संखुवासभा',
        localBodies: [
          { name: 'Chainpur Municipality', nameNepali: 'चैनपुर नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dharmadevi Municipality', nameNepali: 'धर्मदेवी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Khandwari Municipality', nameNepali: 'खाँदवारी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Madi Municipality', nameNepali: 'मादी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Panchkhapan Municipality', nameNepali: 'पाँचखपन नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhotkhola Rural Municipality', nameNepali: 'भोटखोला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Chichila Rural Municipality', nameNepali: 'चिचिला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Makalu Rural Municipality', nameNepali: 'मकालु गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Sabhapokhari Rural Municipality', nameNepali: 'सभापोखरी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Silichong Rural Municipality', nameNepali: 'सिलीचोङ गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Solukhumbu',
        nameNepali: 'सोलुखुम्बू',
        localBodies: [
          { name: 'Solududhakunda Municipality', nameNepali: 'सोलुदुधकुण्ड नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Mapya Rural Municipality', nameNepali: 'माप्य गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Khumvu Pasanglhamu Rural Municipality', nameNepali: 'खुम्वु पासाङल्हमु गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Thulung Dudhkoshi Rural Municipality', nameNepali: 'थुलुङ दुधकोशी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Nechasalyan Rural Municipality', nameNepali: 'नेचासल्यान गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Mahakulung Rural Municipality', nameNepali: 'माहाकुलुङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Likhu Pike Rural Municipality', nameNepali: 'लिखु पिके गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sotang Rural Municipality', nameNepali: 'सोताङ गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Sunsari',
        nameNepali: 'सुनसरी',
        localBodies: [
          { name: 'Itahari Sub-metropolitan', nameNepali: 'ईटहरी उपमहानगरपालिका', type: 'Metropolitan', wards: 20 },
          { name: 'Dharan Sub-metropolitan', nameNepali: 'धरान उपमहानगरपालिका', type: 'Metropolitan', wards: 20 },
          { name: 'Inaruwa Municipality', nameNepali: 'ईनरुवा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Duhavi Municipality', nameNepali: 'दुहवी नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Ramdhuni Municipality', nameNepali: 'रामधुनी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Barakhshetra Municipality', nameNepali: 'बराहक्षेत्र नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dewanganj Rural Municipality', nameNepali: 'देवानगञ्ज गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Koshi Rural Municipality', nameNepali: 'कोशी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Gadhi Rural Municipality', nameNepali: 'गढी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Barju Rural Municipality', nameNepali: 'बर्जु गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bhokraha Narasimha Rural Municipality', nameNepali: 'भोक्राहा नरसिंह गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Harinagar Rural Municipality', nameNepali: 'हरिनगर गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Taplejung',
        nameNepali: 'ताप्लेजुंग',
        localBodies: [
          { name: 'Phungling Municipality', nameNepali: 'फुङलिङ नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Atharai Triveni Rural Municipality', nameNepali: 'आठराई त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sidingwa Rural Municipality', nameNepali: 'सिदिङ्वा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Phaktanglung Rural Municipality', nameNepali: 'फक्ताङलुङ गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mikwakhola Rural Municipality', nameNepali: 'मिक्वाखोला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Meringden Rural Municipality', nameNepali: 'मेरिङदेन गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Maiwakhola Rural Municipality', nameNepali: 'मैवाखोला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Pathibhara Yangwarak Rural Municipality', nameNepali: 'पाथीभरा याङवरक गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Sirijangha Rural Municipality', nameNepali: 'सिरीजङ्घा गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Terhathum',
        nameNepali: 'तेह्रथुम',
        localBodies: [
          { name: 'Manglung Municipality', nameNepali: 'म्याङलुङ नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Laligurans Municipality', nameNepali: 'लालीगुराँस नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Atharai Rural Municipality', nameNepali: 'आठराई गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Chhathar Rural Municipality', nameNepali: 'छथर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Phedap Rural Municipality', nameNepali: 'फेदाप गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Menchyayem Rural Municipality', nameNepali: 'मेन्छयायेम गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Udayapur',
        nameNepali: 'उदयपुर',
        localBodies: [
          { name: 'Katari Municipality', nameNepali: 'कटारी नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Chaudandigarhi Municipality', nameNepali: 'चौदण्डीगढी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Triyuga Municipality', nameNepali: 'त्रियुगा नगरपालिका', type: 'Municipality', wards: 16 },
          { name: 'Belka Municipality', nameNepali: 'वेलका नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Udayapurgadhi Rural Municipality', nameNepali: 'उदयपुरगढी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Tapli Rural Municipality', nameNepali: 'ताप्ली गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Rautamai Rural Municipality', nameNepali: 'रौतामाई गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Limchungbung Rural Municipality', nameNepali: 'लिम्चुङ्बुङ गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      }
    ]
  },
  {
    name: 'Madhesh Province',
    nameNepali: 'मदेश प्रदेश',
    districts: [
      {
        name: 'Parsa',
        nameNepali: 'पर्सा',
        localBodies: [
          { name: 'Birgunj Metropolitan', nameNepali: 'बिरगंज महानगरपालिका', type: 'Metropolitan', wards: 32 },
          { name: 'Pokhariya Municipality', nameNepali: 'पोखरिया नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Bahudarmai Municipality', nameNepali: 'बहुदरमाई  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Parsagadhi Municipality', nameNepali: 'पर्सागढी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Thori Rural Municipality', nameNepali: 'ठोरी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Jagarnathpur Rural Municipality', nameNepali: 'जगरनाथपुर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dhobini Rural Municipality', nameNepali: 'धोबीनी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Chhipaharmai Rural Municipality', nameNepali: 'छिपहरमाईगाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Pakaha Mainpur Rural Municipality', nameNepali: 'पकाहा मैनपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Bindabasini Rural Municipality', nameNepali: 'बिन्दबासिनी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sakhuwa Prasauni Rural Municipality', nameNepali: 'सखुवा प्रसौनी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Paterwa Sugauli Rural Municipality', nameNepali: 'पटेर्वा सुगौली गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kalikamai Rural Municipality', nameNepali: 'कालिकामाई  गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Jira Bhawani Rural Municipality', nameNepali: 'जिरा भवानी  गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Bara',
        nameNepali: 'बारा',
        localBodies: [
          { name: 'Kalaiya Sub-Metropolitan', nameNepali: 'कलैया उपमहानगरपालिका', type: 'Metropolitan', wards: 27 },
          { name: 'Jitpur Simara Sub-Metropolitan', nameNepali: 'जीतपुर सिमरा उपमहानगरपालिका', type: 'Metropolitan', wards: 24 },
          { name: 'Kolhavi Municipality', nameNepali: 'कोल्हवी  नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Nijgadh Municipality', nameNepali: 'निजगढ नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Mahagadhimai Municipality', nameNepali: 'महागढीमाई नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Simraungadh Municipality', nameNepali: 'सिम्रौनगढ नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Pacharauta Municipality', nameNepali: 'पचरौता नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Adarsh Kotwal Rural Municipality', nameNepali: 'आदर्श कोटवाल गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Karaiyamai Rural Municipality', nameNepali: 'करैयामाई गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Devtal Rural Municipality', nameNepali: 'देवताल  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Parwanipur Rural Municipality', nameNepali: 'परवानीपुर  गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Prasauni Rural Municipality', nameNepali: 'प्रसौनी  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Pheta Rural Municipality', nameNepali: 'फेटा  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Baragadhi Rural Municipality', nameNepali: 'बारागढी  गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Suwarn Rural Municipality', nameNepali: 'सुवर्ण   गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Vishrampur Rural Municipality', nameNepali: 'विश्रामपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Rautahat',
        nameNepali: 'रौतहट',
        localBodies: [
          { name: 'Chandrapur Municipality', nameNepali: 'चन्द्रपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Garuda Municipality ', nameNepali: 'गरुडा नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Gour Municipality', nameNepali: 'गौर  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Baudhimai Municipality', nameNepali: 'बौधीमाई नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Brindavan Municipality', nameNepali: 'बृन्दावन  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Devahi Gonahi Municipality', nameNepali: 'देवाही गोनाही नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Gadhimai Municipality', nameNepali: 'गढीमाई नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Gajura Municipality', nameNepali: 'गुजरा  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Katahariya Municipality', nameNepali: 'कटहरिया नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Madhav Narayan Municipality', nameNepali: 'माधव नारायण नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Maulapur Municipality', nameNepali: 'मौलापुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Phatuwabijaypur Municipality', nameNepali: 'फतुवाबिजयपुर नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Ishnath Municipality', nameNepali: 'ईशनाथ नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Paroha Municipality', nameNepali: 'परोहा नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Rajpur Municipality', nameNepali: 'राजपुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Rajdevi Municipality', nameNepali: 'राजदेवी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Durga Bhagawati Rural Municipality', nameNepali: 'दुर्गा भगवती गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Yamunamai Rural Municipality', nameNepali: 'यमुनामाई गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Sarlahi',
        nameNepali: 'सर्लाही',
        localBodies: [
          { name: 'Ishworpur Municipality', nameNepali: 'ईश्वरपुर नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Mangawa Municipality ', nameNepali: 'मलंगवा नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Lalbandi Municipality', nameNepali: 'लालबन्दी  नगरपालिका', type: 'Municipality', wards: 17 },
          { name: 'Haripur Municipality', nameNepali: 'हरिपुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Haripurwa Municipality', nameNepali: 'हरिपुर्वा  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Hariwan Municipality', nameNepali: 'हरिवन नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Barhathawa Municipality', nameNepali: 'बरहथवा नगरपालिका', type: 'Municipality', wards: 18 },
          { name: 'Balara Municipality', nameNepali: 'बलरा  नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Godaita Municipality', nameNepali: 'गोडैटा नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Bagmati Municipality', nameNepali: 'बागमती नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Kawilasi Municipality', nameNepali: 'कविलासीनगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Chakraghatta Rural Municipality', nameNepali: 'चक्रघट्टा गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Chandranagar Rural Municipality', nameNepali: 'चन्द्रनगर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Dhankoul Rural Municipality', nameNepali: 'धनकौल गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Brahmapuri Rural Municipality', nameNepali: 'ब्रह्मपुरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Ramnagar Rural Municipality', nameNepali: 'रामनगर  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Bishnu Rural Municipality', nameNepali: 'विष्णु गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Kaudena Rural Municipality', nameNepali: 'कौडेना  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Parsa Rural Municipality', nameNepali: 'पर्सा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Basbariya Rural Municipality', nameNepali: 'बसबरीया गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Dhanusha',
        nameNepali: 'धनुषा',
        localBodies: [
          { name: 'Janakpurdham Sub-Metropolitan', nameNepali: 'जनकपुरधाम उपमहानगरपालिका', type: 'Metropolitan', wards: 25 },
          { name: 'Kshireshwar Nath Municipality ', nameNepali: 'क्षिरेश्वरनाथ नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Ganeshman Charnath Municipality', nameNepali: 'गणेशमान चारनाथ नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dhanushadham Municipality', nameNepali: 'धनुषाधाम नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Nagarain Municipality', nameNepali: 'नगराइन  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Wideha Municipality', nameNepali: 'विदेह नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Mithila Municipality', nameNepali: 'मिथिला नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Shahidnagar Municipality', nameNepali: 'शहीदनगर  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Sabaila Municipality', nameNepali: 'सबैला नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Kamala Municipality', nameNepali: 'कमला नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Mithila Bihari Municipality', nameNepali: 'मिथिला बिहारी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Hansapur Municipality', nameNepali: 'हंसपुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'janakandani Rural Municipality', nameNepali: 'जनकनन्दिनी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bateshwar Rural Municipality', nameNepali: 'बटेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Mukhiyapatti Musaharmiya Rural Municipality', nameNepali: 'मुखियापट्टी मुसहरमिया गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Laxminiya Rural Municipality', nameNepali: 'लक्ष्मीनिया  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Aurahi Rural Municipality', nameNepali: 'औरही गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dhanauji Rural Municipality', nameNepali: 'धनौजी गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Siraha',
        nameNepali: 'सिराहा',
        localBodies: [
          { name: 'Lahan Municipality', nameNepali: 'लहान नगरपालिका', type: 'Municipality', wards: 24 },
          { name: 'Dhangadhimai Municipality ', nameNepali: 'धनगढीमाई नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Siraha Municipality', nameNepali: 'सिरहा  नगरपालिका', type: 'Municipality', wards: 22 },
          { name: 'Golbazar Municipality', nameNepali: 'गोलबजार नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Mirchaiya Municipality', nameNepali: 'मिर्चैयाँ   नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Kalyanpur Municipality', nameNepali: 'कल्याणपुर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Karjanha Municipality', nameNepali: 'कर्जन्हा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Sukhipur Municipality', nameNepali: 'सुखीपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Bhagawanpur Rural Municipality', nameNepali: 'भगवानपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Aurahi Rural Municipality', nameNepali: 'औरही गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Bishnupur Rural Municipality', nameNepali: 'विष्णुपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Bariyarpatti Rural Municipality', nameNepali: 'बरियारपट्टी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Laxmipur Patari Rural Municipality', nameNepali: 'लक्ष्मीपुर पतारी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Naraha Rural Municipality', nameNepali: 'नरहा गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sakhuvanankarkatti Rural Municipality', nameNepali: 'सखुवानान्कारकट्टी  गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Arnama Rural Municipality', nameNepali: 'अर्नमा   गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Nawarajpur Rural Municipality', nameNepali: 'नवराजपुर गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Mahottari',
        nameNepali: 'महोत्तरी',
        localBodies: [
          { name: 'Jaleshwar Municipality', nameNepali: 'जलेश्वर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Bardibas Municipality ', nameNepali: 'बर्दिबास नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Gaushala Municipality', nameNepali: 'गौशाला  नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Loharpatti Municipality', nameNepali: 'लोहरपट्टी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Ramgopalpur Municipality', nameNepali: 'रामगोपालपुर   नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Manara Shisawa Municipality', nameNepali: 'मनरा शिसवा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Matihani Municipality', nameNepali: 'मटिहानी  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhangaha Municipality', nameNepali: 'भँगाहा  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Balawa Municipality', nameNepali: 'बलवा   नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Aurahi Municipality', nameNepali: 'औरही  नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Yekdara Rural Municipality', nameNepali: 'एकडारा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Sonama Rural Municipality', nameNepali: 'सोनमा  गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Samsi Rural Municipality', nameNepali: 'साम्सी   गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mahottari Rural Municipality', nameNepali: 'महोत्तरी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Pipara Rural Municipality', nameNepali: 'पिपरा गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Saptari',
        nameNepali: 'सप्तरी',
        localBodies: [
          { name: 'Rajviraj Municipality', nameNepali: 'राजविराज नगरपालिका', type: 'Municipality', wards: 16 },
          { name: 'Kanchanrup Municipality ', nameNepali: 'कञ्चनरुप नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Dakneshwori Municipality', nameNepali: 'डाक्नेश्वरी  नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Bodebarsain Municipality', nameNepali: 'बोदेबरसाईननगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Khadak Municipality', nameNepali: 'खडक   नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Shanbhunath Municipality', nameNepali: 'शम्भुनाथ नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Surunga Municipality', nameNepali: 'सुरुङ्‍गा  नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Hanuman Nagar Kangkalini Municipality', nameNepali: 'हनुमाननगर कङ्‌कालिनी   नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Saptakoshi Municipality', nameNepali: 'सप्तकोशी   नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Agnisair Krishnasaravan Rural Municipality', nameNepali: 'अग्निसाइर कृष्णासरवन गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Chhinnamasta Rural Municipality', nameNepali: 'छिन्नमस्ता  गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mahadewa Rural Municipality', nameNepali: 'महादेवा   गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Tirhut Rural Municipality', nameNepali: 'तिरहुत गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Tilathi Koiladi Rural Municipality', nameNepali: 'तिलाठी कोईलाडी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Rupani Rural Municipality', nameNepali: 'रुपनी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rajgadh Rural Municipality', nameNepali: 'राजगढ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bishnupur Rural Municipality', nameNepali: 'बिष्णुपुर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Balan-Bihul Rural Municipality', nameNepali: 'बलान-बिहुल गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      }
    ]
  },
  {
    name: 'Bagmati Province',
    nameNepali: 'वाग्मती प्रदेश',
    districts: [
      {
        name: 'Sindhuli',
        nameNepali: 'सिन्धुली',
        localBodies: [
          { name: 'Kamalamai Municipality', nameNepali: 'कमलामाई नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Dudhauli Municipality', nameNepali: ' दुधौली  नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Golanjar Rural municipality', nameNepali: 'गोलन्जर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Ghyanglekh Rural municipality', nameNepali: 'घ्याङलेख गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Tinpatan Rural municipality', nameNepali: 'तीनपाटन गाउँपालिका', type: 'Rural Municipality', wards: 11 },
          { name: 'phikkal Rural municipality', nameNepali: 'फिक्कल गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Marin  Rural municipality', nameNepali: 'मरिण गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sunkoshi  Rural municipality', nameNepali: 'सुनकोशी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Hariharpurgadhi Rural municipality', nameNepali: 'हरिहरपुरगढी गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Ramechhap',
        nameNepali: 'रामेछाप',
        localBodies: [
          { name: 'Mnthaly Municipality', nameNepali: 'मन्थली नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Ramechhap Municipality', nameNepali: 'रामेछाप नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Umakunda Rural municipality', nameNepali: 'उमाकुण्ड गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Khandadevi Rural municipality', nameNepali: 'खाँडादेवी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Gokulganga Rural municipality', nameNepali: 'गोकुलगङ्गा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Doramba Shanlung Rural municipality', nameNepali: 'दोरम्बा शैंलुङ गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Likhu Tamakoshi Rural municipality', nameNepali: ' लिखु तामाकोशी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sunapati Rural municipality', nameNepali: 'सुनापती गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Dolakha',
        nameNepali: 'दोलखा',
        localBodies: [
          { name: 'Jiri Municipality', nameNepali: 'जिरी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhimeshwar Municipality', nameNepali: 'भिमेश्वर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Kalinchok Rural municipality', nameNepali: 'कालिन्चोक गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Gaurishankar Rural municipality', nameNepali: 'गौरीशङ्कर गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Tamakoshi Rural municipality', nameNepali: 'तामाकोशी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Melung Rural municipality', nameNepali: 'मेलुङ्ग गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Vigu Rural municipality', nameNepali: 'विगु गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Vaiteshwar Rural municipality', nameNepali: 'वैतेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Shailung Rural municipality', nameNepali: 'शैलुङ्ग गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Bhaktapur',
        nameNepali: 'भक्तपुर',
        localBodies: [
          { name: 'Changunarayan Municipality', nameNepali: 'चाँगुनारायण नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhaktapur Municipality', nameNepali: 'भक्तपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: ' Madhyapur Thimi Municipality', nameNepali: 'मध्यपुर थिमी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Suryabinayak Municipality', nameNepali: 'सूर्यविनायक नगरपालिका', type: 'Municipality', wards: 10 }
        ]
      },
      {
        name: 'Dhading',
        nameNepali: 'धादिङ',
        localBodies: [
          { name: 'Dhunibenshi Municipality', nameNepali: 'धुनीबेंशी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Nilkantha Municipality', nameNepali: 'निलकण्ठ नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Khaniyabas Rural municipality', nameNepali: 'खनियाबास गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Gajuri Rural municipality', nameNepali: 'गजुरी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Galchi Rural municipality', nameNepali: 'गल्छी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Gangajmuna Rural municipality', nameNepali: 'गङ्गाजमुना गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Jwalamukhi Rural municipality', nameNepali: 'ज्वालामूखी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Thakre Rural municipality', nameNepali: 'थाक्रे गाउँपालिका', type: 'Rural Municipality', wards: 11 },
          { name: 'Netravati Dabjong Rural municipality', nameNepali: ' नेत्रावती डबजोङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Benighat Rorang Rural municipality', nameNepali: 'बेनीघाट रोराङ्ग गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Rubi Valley Rural municipality', nameNepali: 'रुवी भ्याली गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Siddhalek Rural municipality', nameNepali: 'सिद्धलेक गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Tripura Sundari Rural municipality', nameNepali: 'त्रिपुरासुन्दरी गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Kathmandu',
        nameNepali: 'काठमाडौँ',
        localBodies: [
          { name: 'Kathmandu Metropolitan', nameNepali: 'काठमाण्डौं महानगरपालिका', type: 'Metropolitan', wards: 32 },
          { name: 'Kageshwari Manohara Municipality', nameNepali: 'कागेश्वरी मनोहरा नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Kirtipur Municipality', nameNepali: 'कीर्तिपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Gokarneshwar Municipality', nameNepali: 'गोकर्णेश्वर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Chandragiri Municipality', nameNepali: 'चन्द्रागिरी नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Tokha Municipality', nameNepali: 'टोखा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Tarkeshwar Municipality', nameNepali: 'तारकेश्वर नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dakshinkali Municipality', nameNepali: 'दक्षिणकाली नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Nagarjuna Municipality', nameNepali: 'नागार्जुन नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Budhanilkantha Municipality', nameNepali: 'बुढानिलकण्ठ नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Shankharapur Municipality', nameNepali: 'शङ्खरापुर नगरपालिका', type: 'Municipality', wards: 9 }
        ]
      },
      {
        name: 'Kavrepalanchok',
        nameNepali: 'काभ्रेपलान्चोक',
        localBodies: [
          { name: 'Dhulikhel Municipality', nameNepali: 'धुलिखेल नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Banepa Municipality', nameNepali: 'बनेपा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Panauti Municipality', nameNepali: 'पनौती नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Panchkhal Municipality', nameNepali: 'पाँचखाल नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Namobuddha Municipality', nameNepali: 'नमोबुद्ध नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Mandandeupur Municipality', nameNepali: 'मण्डनदेउपुर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Khanikhola Rural municipality', nameNepali: 'खानीखोला गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Chaurideurali Rural municipality', nameNepali: 'चौंरीदेउराली गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Temal Rural municipality', nameNepali: 'तेमाल गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Bethanchowk Rural municipality', nameNepali: 'बेथानचोक गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bhumlu Rural municipality', nameNepali: 'भुम्लु गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Mahabharat Rural municipality', nameNepali: 'महाभारत गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Roshi Rural municipality', nameNepali: 'रोशी गाउँपालिका', type: 'Rural Municipality', wards: 12 }
        ]
      },
      {
        name: 'Lalitpur',
        nameNepali: 'ललितपुर',
        localBodies: [
          { name: 'Lalitpur Metropolitan', nameNepali: 'ललितपुर महानगरपालिका', type: 'Metropolitan', wards: 29 },
          { name: 'Godavari Municipality', nameNepali: 'गोदावरी नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Mahalakshmi Municipality', nameNepali: 'महालक्ष्मी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Konjyosom Rural municipality', nameNepali: 'कोन्ज्योसोम गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Bagmati Rural municipality', nameNepali: 'बागमती गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mahankal Rural municipality', nameNepali: 'महाङ्काल गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Nuwakot',
        nameNepali: 'नुवाकोट',
        localBodies: [
          { name: 'Vidur Municipality', nameNepali: 'विदुर नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Belkotgadhi Municipality', nameNepali: 'बेलकोटगढी नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Kakani Rural municipality', nameNepali: 'ककनी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Kispang Rural municipality', nameNepali: 'किस्पाङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Tadi Rural municipality', nameNepali: 'तादी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Tarkeshwar Rural municipality', nameNepali: 'तारकेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dupcheshwor Rural municipality', nameNepali: 'दुप्चेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Panchakanya Rural municipality', nameNepali: 'पञ्चकन्या गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Likhu Rural municipality', nameNepali: 'लिखु गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Myagang Rural municipality', nameNepali: 'म्यगङ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Shivpuri Rural municipality', nameNepali: 'शिवपुरी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Suryagadhi Rural municipality', nameNepali: 'सुर्यगढी गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Rasuwa',
        nameNepali: 'रसुवा',
        localBodies: [
          { name: 'Uttargaya Rural municipality', nameNepali: 'उत्तरगया गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kalika Rural municipality', nameNepali: 'कालिका गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Gosaikunda Rural municipality', nameNepali: 'गोसाईकुण्ड गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Naukunda Rural municipality', nameNepali: 'नौकुण्ड गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Amachhoding Rural municipality', nameNepali: 'आमाछोदिङमो गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Sindhupalchok',
        nameNepali: 'सिन्धुपाल्चोक',
        localBodies: [
          { name: 'Chautara Sangachokgadhi Municipality', nameNepali: 'चौतारा साँगाचोकगढी नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Barhavise Municipality', nameNepali: 'बाह्रविसे नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Melamchi Municipality', nameNepali: 'मेलम्ची नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Indravati Rural municipality', nameNepali: 'ईन्द्रावती गाउँपालिका', type: 'Rural Municipality', wards: 12 },
          { name: 'Jugal Rural municipality', nameNepali: 'जुगल गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: ' Panchpokhari Thangpal Rural municipality', nameNepali: 'पाँचपोखरी थाङपाल गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Balefi Rural municipality', nameNepali: 'बलेफी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Bhotekoshi Rural municipality', nameNepali: 'भोटेकोशी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Lisankhu Pakhar Rural municipality', nameNepali: 'लिसङ्खु पाखर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sunkoshi Rural municipality', nameNepali: 'सुनकोशी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Helambu Rural municipality', nameNepali: 'हेलम्बु गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Tripura Sundari Rural municipality', nameNepali: 'त्रिपुरासुन्दरी गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Chitwan',
        nameNepali: 'चितवन',
        localBodies: [
          { name: 'Bharatpur Metropolitan', nameNepali: 'भरतपुर महानगरपालिका', type: 'Metropolitan', wards: 29 },
          { name: 'Kalika Municipality', nameNepali: 'कालिका नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Khairhani Municipality', nameNepali: 'खैरहनी नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Madi Municipality', nameNepali: 'माडी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Ratnanagar Municipality', nameNepali: 'रत्ननगर नगरपालिका', type: 'Municipality', wards: 16 },
          { name: 'Rapti Municipality', nameNepali: 'राप्ती नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Ichhakamana Rural municipality', nameNepali: 'इच्छाकामना गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Makwanpur',
        nameNepali: 'मकवानपुर',
        localBodies: [
          { name: 'Hetauda Metropolitan', nameNepali: 'हेटौडा महानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Thaha Municipality', nameNepali: 'थाहा नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Indrasarobar Rural municipality', nameNepali: 'इन्द्रसरोबर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kailash Rural municipality', nameNepali: 'कैलाश गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Bakaiya Rural municipality', nameNepali: 'बकैया गाउँपालिका', type: 'Rural Municipality', wards: 12 },
          { name: 'Bagmati Rural municipality', nameNepali: 'बाग्मति गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Bhimphedi Rural municipality', nameNepali: 'भिमफेदी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Makwanpurgadhi Rural municipality', nameNepali: 'मकवानपुरगढी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Manhari Rural municipality', nameNepali: 'मनहरी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Raksirang Rural municipality', nameNepali: 'राक्सिराङ्ग गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      }
    ]
  },
  {
    name: 'Gandaki Province',
    nameNepali: 'गण्डकी प्रदेश',
    districts: [
      {
        name: 'Baglung',
        nameNepali: 'बागलुङ',
        localBodies: [
          { name: 'Baglung Municipality', nameNepali: 'बागलुङ नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Galkot Municipality', nameNepali: 'गल्कोट नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Jaimuni Municipality', nameNepali: 'जैमूनी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Dhorpatan Municipality', nameNepali: 'ढोरपाटन नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Wareng Rural municipality', nameNepali: 'वरेङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kathekhola Rural municipality', nameNepali: 'काठेखोला गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Tamankhola Rural municipality', nameNepali: 'तमानखोला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Tarakhola Rural municipality', nameNepali: 'ताराखोला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Nisikhola Rural municipality', nameNepali: 'निसीखोला गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Wadigad Rural municipality', nameNepali: 'वडिगाड गाउँपालिका', type: 'Rural Municipality', wards: 10 }
        ]
      },
      {
        name: 'Gorkha',
        nameNepali: 'गोरखा',
        localBodies: [
          { name: 'Gorkha Municipality', nameNepali: 'गोरखा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Palungtar Municipality', nameNepali: 'पालुङटार नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Barpak Sulikot Rural municipality', nameNepali: 'बारपाक सुलिकोट गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Siranchowk Rural municipality', nameNepali: 'सिरानचोक गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Ajirkot Rural municipality', nameNepali: 'अजिरकोट गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Arughat Rural municipality', nameNepali: 'आरूघाट गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Gandaki Rural municipality', nameNepali: 'गण्डकी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Chumanuvri Rural municipality', nameNepali: 'चुमनुव्री गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Dharche Rural municipality', nameNepali: 'धार्चे गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Bhimsenthapa Rural municipality', nameNepali: 'भिमसेनथापा गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Shahid Lakhan Rural municipality', nameNepali: 'शहिद लखन गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Kaski',
        nameNepali: 'कास्की',
        localBodies: [
          { name: 'Pokhara Metropolitan', nameNepali: 'पोखरा महानगरपालिका', type: 'Metropolitan', wards: 33 },
          { name: 'Annapurna Rural municipality', nameNepali: 'अन्नपूर्ण गाउँपालिका', type: 'Rural Municipality', wards: 11 },
          { name: 'Machhapuchhre Rural municipality', nameNepali: 'माछापुच्छ्रे गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Madi Rural municipality', nameNepali: 'मादी गाउँपालिका', type: 'Rural Municipality', wards: 12 },
          { name: 'Rupa Rural municipality', nameNepali: 'रूपा गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Lamjung',
        nameNepali: 'लमजुङ',
        localBodies: [
          { name: 'Besishahar Municipality', nameNepali: 'बेसीशहर नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Central Nepal Municipality', nameNepali: 'मध्यनेपाल नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Rarinas Municipality', nameNepali: 'रार्इनास नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Sunderbazar Municipality', nameNepali: 'सुन्दरबजार नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Kwalasothar Rural municipality', nameNepali: 'क्व्होलासोथार गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Dudhpokhari Rural municipality', nameNepali: 'दूधपोखरी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dordi Rural municipality', nameNepali: 'दोर्दी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Marsyangdi Rural municipality', nameNepali: 'मर्स्याङदी गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Manang',
        nameNepali: 'मनाङ',
        localBodies: [
          { name: 'Chame Rural Municipality', nameNepali: 'चामे गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Narp Bhumi Rural Municipality', nameNepali: 'नार्पा भूमि गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Nason Rural Municipality', nameNepali: 'नासोँ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Manang Ngisyang Rural Municipality', nameNepali: 'मनाङ ङिस्याङ गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Mustang',
        nameNepali: 'मुस्ताङ',
        localBodies: [
          { name: 'Gharpajhong Rural Municipality', nameNepali: 'घरपझोङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Thasang Rural Municipality', nameNepali: 'थासाङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: ' Lo-Ghekar Damodarkund Rural Municipality', nameNepali: 'लो-घेकर दामोदरकुण्ड गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Lomanthang Rural Municipality', nameNepali: 'लोमन्थाङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Waragung Muktichhetra Rural Municipality', nameNepali: 'वारागुङ मुक्तिक्षेत्र गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Myagdi',
        nameNepali: 'म्याग्दी',
        localBodies: [
          { name: 'Beni Municipality', nameNepali: 'बेनी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Annapurna Rural Municipality', nameNepali: 'अन्नपुर्ण गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Dhawalagiri Rural Municipality', nameNepali: 'धवलागिरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mangala Rural Municipality', nameNepali: 'मंगला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Malika Rural Municipality', nameNepali: 'मालिका गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Raghuganga Rural Municipality', nameNepali: 'रघुगंगा गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Nawalpur',
        nameNepali: 'नवलपुर',
        localBodies: [
          { name: 'Kawasoti Municipality', nameNepali: 'कावासोती नगरपालिका', type: 'Municipality', wards: 17 },
          { name: 'Gaidakot Municipality', nameNepali: 'गैडाकोट नगरपालिका', type: 'Municipality', wards: 18 },
          { name: 'Devachuli Municipality', nameNepali: 'देवचुली नगरपालिका', type: 'Municipality', wards: 17 },
          { name: 'Madhyabindu Municipality', nameNepali: 'मध्यविन्दु नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Baudikali Rural Municipality', nameNepali: 'बौदीकाली गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bulingtar Rural Municipality', nameNepali: 'बुलिङटार गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Binai Triveni Rural Municipality', nameNepali: 'विनयी त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Hupsekot Rural Municipality', nameNepali: 'हुप्सेकोट गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Parbat',
        nameNepali: 'पर्वत',
        localBodies: [
          { name: 'Kushma Municipality', nameNepali: 'कुश्मा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Phalewas Municipality', nameNepali: 'फलेवास नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Jaljala Rural Municipality', nameNepali: 'जलजला गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Paiyun Rural Municipality', nameNepali: 'पैयूं गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mahashila Rural Municipality', nameNepali: 'महाशिला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Modi Rural Municipality', nameNepali: 'मोदी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Vihadi Rural Municipality', nameNepali: 'विहादी गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Syangja',
        nameNepali: 'स्याङग्जा',
        localBodies: [
          { name: 'Galyang Municipality', nameNepali: 'गल्याङ नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Chapakot Municipality', nameNepali: 'चापाकोट नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Putlibazar Municipality', nameNepali: 'पुतलीबजार नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Bhirkot Municipality', nameNepali: 'भीरकोट नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Waling Municipality', nameNepali: 'वालिङ नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Arjunchaupari Rural Municipality', nameNepali: 'अर्जुनचौपारी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Andhikhola Rural Municipality', nameNepali: 'आँधिखोला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Kaligandaki Rural Municipality', nameNepali: 'कालीगण्डकी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Fedikhola Rural Municipality', nameNepali: 'फेदीखोला गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Biruwa Rural Municipality', nameNepali: 'बिरुवा गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Harinas Rural Municipality', nameNepali: 'हरिनास गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Tanahun',
        nameNepali: 'तनहुँ',
        localBodies: [
          { name: 'Bhanu Municipality', nameNepali: 'भानु नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Bhimad Municipality', nameNepali: 'भिमाद नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Vyas Municipality', nameNepali: 'व्यास नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Shuklagand Municipality', nameNepali: 'शुक्लागण्डकी नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Aabukhaireni Rural Municipality', nameNepali: 'आँबुखैरेनी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rishing Rural Municipality', nameNepali: 'ऋषिङ्ग गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Ghiring Rural Municipality', nameNepali: 'घिरिङ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Devghat Rural Municipality', nameNepali: 'देवघाट गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Rural Municipality', nameNepali: 'म्याग्दे गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Vandipur Rural Municipality', nameNepali: 'वन्दिपुर गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      }
    ]
  },
  {
    name: 'Lumbini Province',
    nameNepali: 'लुम्बिनी प्रदेश',
    districts: [
      {
        name: 'Kapilvastu',
        nameNepali: 'कपिलवस्तु',
        localBodies: [
          { name: 'Kapilvastu Municipality', nameNepali: 'कपिलवस्तु नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Buddhabhumi Municipality', nameNepali: 'बुद्धभुमी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Shivraj Municipality', nameNepali: 'शिवराज नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Maharajganj Municipality', nameNepali: 'महाराजगंज नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Krishnanagar Municipality', nameNepali: 'कृष्णनगर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Banganga Municipality', nameNepali: 'बाणगंगा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Mayadevi Rural Municipality', nameNepali: 'मायादेवी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Yasodhara Rural Municipality', nameNepali: 'यसोधरा गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Suddhodhan Rural Municipality', nameNepali: 'सुद्धोधन गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Vijayanagar Rural Municipality', nameNepali: 'विजयनगर गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Parasi',
        nameNepali: 'परासी',
        localBodies: [
          { name: 'Bardaghat Municipality', nameNepali: 'बर्दघाट नगरपालिका', type: 'Municipality', wards: 16 },
          { name: 'Ramgram Municipality', nameNepali: 'रामग्राम नगरपालिका', type: 'Municipality', wards: 18 },
          { name: 'Sunwal Municipality', nameNepali: 'सुनवल नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Susta Rural Municipality', nameNepali: 'सुस्ता गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Palhinandan Rural Municipality', nameNepali: 'पाल्हीनन्दन गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Pratappur Rural Municipality', nameNepali: 'प्रतापपुर गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Sarawal Rural Municipality', nameNepali: 'सरावल गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Rupandehi',
        nameNepali: 'रुपन्देही',
        localBodies: [
          { name: 'Butwal Sub-metropolitan', nameNepali: 'बुटवल उपमहानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Devadaha Municipality', nameNepali: 'देवदह नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Lumbini Cultural Municipality', nameNepali: 'लुम्बिनी सांस्कृतिक नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Sainamina Municipality', nameNepali: 'सैनामैना नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Siddharthnagar Municipality', nameNepali: 'सिद्धार्थनगर नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Tilotta Municipality', nameNepali: 'तिलोत्तमा नगरपालिका', type: 'Municipality', wards: 17 },
          { name: 'Gaidhawa Rural Municipality', nameNepali: 'गैडहवा गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Kanchan Rural Municipality', nameNepali: 'कन्चन गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kothimai Rural Municipality', nameNepali: 'कोटहीमाई गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Marchwari Rural Municipality', nameNepali: 'मर्चवारी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mayadevi Rural Municipality', nameNepali: 'मायादेवी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Omastiya Rural Municipality', nameNepali: 'ओमसतिया गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rohini Rural Municipality', nameNepali: 'रोहिणी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sammarimai Rural Municipality', nameNepali: 'सम्मरीमाई गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Siyari Rural Municipality', nameNepali: 'सियारी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Shuddhodhan Rural Municipality', nameNepali: 'शुद्धोधन गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Arghakhanchi',
        nameNepali: 'अर्घाखाँची',
        localBodies: [
          { name: 'Sandhikharka Municipality', nameNepali: 'सन्धिखर्क नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Shitganga Municipality', nameNepali: 'शितगंगा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Bhumikasthan Municipality', nameNepali: 'भूमिकास्थान नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Chhatradev Rural Municipality', nameNepali: 'छत्रदेव गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Panini Rural Municipality', nameNepali: 'पाणिनी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Malarani Rural Municipality', nameNepali: 'मालारानी गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Gulmi',
        nameNepali: 'गुल्मी',
        localBodies: [
          { name: 'Musikot Municipality', nameNepali: 'मुसिकोट नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Resunga Municipality', nameNepali: 'रेसुङ्गा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Isma Rural Municipality', nameNepali: 'ईस्मा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Kaligandaki Rural Municipality', nameNepali: 'कालीगण्डकी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gulmi Durbar Rural Municipality', nameNepali: 'गुल्मी दरबार गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Satyawati Rural Municipality', nameNepali: 'सत्यवती गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Chandrakot Rural Municipality', nameNepali: 'चन्द्रकोट गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Rurukshetra Rural Municipality', nameNepali: 'रुरुक्षेत्र गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Chhatrakot Rural Municipality', nameNepali: 'छत्रकोट गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dhurkot Rural Municipality', nameNepali: 'धुर्कोट गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Madane Rural Municipality', nameNepali: 'मदाने गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Malika Rural Municipality', nameNepali: 'मालिका गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Palpa',
        nameNepali: 'पाल्पा',
        localBodies: [
          { name: 'Rampur Municipality', nameNepali: 'रामपुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Tansen Municipality', nameNepali: 'तानसेन नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Nisdi Rural Municipality', nameNepali: 'निस्दी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Purbakhola Rural Municipality', nameNepali: 'पूर्वखोला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rambha Rural Municipality', nameNepali: 'रम्भा गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Mathagadhi Rural Municipality', nameNepali: 'माथागढी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Tinau Rural Municipality', nameNepali: 'तिनाउ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Baganaskali Rural Municipality', nameNepali: 'बगनासकाली गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Ribdikot Rural Municipality', nameNepali: 'रिब्दिकोट गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Rainadevi Chhahra Rural Municipality', nameNepali: 'रैनादेवी छहरा गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Dang',
        nameNepali: 'दाङ',
        localBodies: [
          { name: 'Tulsipur Sub-metropolitan', nameNepali: 'तुल्सीपुर उपमहानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Ghorahi Sub-metropolitan', nameNepali: 'घोराही उपमहानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Lamahi Municipality', nameNepali: 'लमही नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bangalachuli Rural Municipality', nameNepali: 'बंगलाचुली गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Dangisharan Rural Municipality', nameNepali: 'दंगीशरण गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gadhwa Rural Municipality', nameNepali: 'गढवा गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Rajpur Rural Municipality', nameNepali: 'राजपुर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Rapti Rural Municipality', nameNepali: 'राप्ती गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Shantinagar Rural Municipality', nameNepali: 'शान्तिनगर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Babai Rural Municipality', nameNepali: 'बबई गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Pyuthan',
        nameNepali: 'प्युठान',
        localBodies: [
          { name: 'Pyuthan Municipality', nameNepali: 'प्यूठान नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Swargadwari Municipality', nameNepali: 'स्वर्गद्वारी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Gaumukhi Rural Municipality', nameNepali: 'गौमुखी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mandvi Rural Municipality', nameNepali: 'माण्डवी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sarumarani Rural Municipality', nameNepali: 'सरुमारानी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Mallarani Rural Municipality', nameNepali: 'मल्लरानी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Nauvahini Rural Municipality', nameNepali: 'नौवहिनी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Zhimruk Rural Municipality', nameNepali: 'झिमरुक गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Airavati Rural Municipality', nameNepali: 'ऐरावती गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Rolpa',
        nameNepali: 'रोल्पा',
        localBodies: [
          { name: 'Rolpa Municipality', nameNepali: 'रोल्पा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Triveni Rural Municipality', nameNepali: 'त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Parivartan Rural Municipality', nameNepali: 'परिवर्तन गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Madi Rural Municipality', nameNepali: 'माडी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Runtigadhi Rural Municipality', nameNepali: 'रुन्टीगढी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Lungri Rural Municipality', nameNepali: 'लुङग्री गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gangadev Rural Municipality', nameNepali: 'गंगादेव गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sunchahari Rural Municipality', nameNepali: 'सुनछहरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Sunil Smriti Rural Municipality', nameNepali: 'सुनिल स्मृति गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Thawang Rural Municipality', nameNepali: 'थवाङ गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Eastern Rukum',
        nameNepali: 'पूर्वी रूकुम',
        localBodies: [
          { name: 'Putha Uttarganga Rural Municipality', nameNepali: 'पुथा उत्तरगंगा गाउँपालिका', type: 'Rural Municipality', wards: 14 },
          { name: 'Bhume Rural Municipality', nameNepali: 'भूमे गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Sisne Rural Municipality', nameNepali: 'सिस्ने गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Banke',
        nameNepali: 'बाँके',
        localBodies: [
          { name: 'Nepalganj Sub-metropolitan', nameNepali: 'नेपालगंज उपमहानगरपालिका', type: 'Metropolitan', wards: 23 },
          { name: 'Kohalpur Municipality', nameNepali: 'कोहलपुर नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Narainapur Rural Municipality', nameNepali: 'नरैनापुर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Rapti Sonari Rural Municipality', nameNepali: 'राप्ती सोनारी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Baijnath Rural Municipality', nameNepali: 'बैजनाथ गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Khajura Rural Municipality', nameNepali: 'खजुरा गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Duduwa Rural Municipality', nameNepali: 'डुडुवा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Janaki Rural Municipality', nameNepali: 'जानकी गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Bardiya',
        nameNepali: 'बर्दिया',
        localBodies: [
          { name: 'Gulariya Municipality', nameNepali: 'गुलरिया नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Madhuvan Municipality', nameNepali: 'मधुवन नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Rajapur Municipality', nameNepali: 'राजापुर नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Thakur Baba Municipality', nameNepali: 'ठाकुरबाबा नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bansgadhi Municipality', nameNepali: 'बाँसगढी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Barbardia Municipality', nameNepali: 'बारबर्दिया नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Badaiyatal Rural Municipality', nameNepali: 'बढैयाताल गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Geruwa Rural Municipality', nameNepali: 'गेरुवा गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      }
    ]
  },
  {
    name: 'Karnali Province',
    nameNepali: 'कर्णाली प्रदेश',
    districts: [
      {
        name: 'Western Rukum',
        nameNepali: 'पश्चिमी रूकुम',
        localBodies: [
          { name: 'Musikot Municipality', nameNepali: 'मुसिकोट नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Chaurajahari Municipality', nameNepali: 'चौरजहारी नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Athabiscot Municipality', nameNepali: 'आठबिसकोट नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Banfikot Rural Municipality', nameNepali: 'बाँफिकोट गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Triveni Rural Municipality', nameNepali: 'त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Sani Bheri Rural Municipality', nameNepali: 'सानी भेरी गाउँपालिका', type: 'Rural Municipality', wards: 11 }
        ]
      },
      {
        name: 'Salyan',
        nameNepali: 'सल्यान',
        localBodies: [
          { name: 'Sharda Municipality', nameNepali: 'शारदा नगरपालिका', type: 'Municipality', wards: 15 },
          { name: 'Bagchaur Municipality', nameNepali: 'बागचौर नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Bangad Kupinde Municipality', nameNepali: 'बनगाड कुपिण्डे नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Kalimati Rural Municipality', nameNepali: 'कालिमाटी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Triveni Rural Municipality', nameNepali: 'त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Kapurkot Rural Municipality', nameNepali: 'कपुरकोट गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Chhatreswari Rural Municipality', nameNepali: 'छत्रेश्वरी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Siddha Kumakh Rural Municipality', nameNepali: 'सिद्ध कुमाख गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Kumakh Rural Municipality', nameNepali: 'कुमाख गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Darma Rural Municipality', nameNepali: 'दार्मा गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Dolpa',
        nameNepali: 'डोल्पा',
        localBodies: [
          { name: 'Thuli Bheri Municipality', nameNepali: 'ठूली भेरी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Tripura Sundari Municipality', nameNepali: 'त्रिपुरासुन्दरी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dolpo Buddha Rural Municipality', nameNepali: 'डोल्पो बुद्ध गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Shey Foksundo Rural Municipality', nameNepali: 'शे फोक्सुन्डो गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Jagadulla Rural Municipality', nameNepali: 'जगदुल्ला गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Mudkechula Rural Municipality', nameNepali: 'मुड्केचुला गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Kaike Rural Municipality', nameNepali: 'काईके गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: ' Charka Tangsong Rural Municipality', nameNepali: 'छार्का ताङसोङ गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Humla',
        nameNepali: 'हुम्ला',
        localBodies: [
          { name: 'Simkot Rural Municipality', nameNepali: 'सिमकोट गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Namkha Rural Municipality', nameNepali: 'नाम्खा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Kharpunath Rural Municipality', nameNepali: 'खार्पुनाथ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Sarkegad Rural Municipality', nameNepali: 'सर्केगाड गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Chankheli Rural Municipality', nameNepali: 'चंखेली गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Adanchuli Rural Municipality', nameNepali: 'अदानचुली गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Tanjakot Rural Municipality', nameNepali: 'ताँजाकोट गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Jumla',
        nameNepali: 'जुम्ला',
        localBodies: [
          { name: 'Chandannath Municipality', nameNepali: 'चन्दननाथ नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Kankasundari Rural Municipality', nameNepali: 'कनकासुन्दरी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Sinja Rural Municipality', nameNepali: 'सिंजा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Hima Rural Municipality', nameNepali: 'हिमा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Tila Rural Municipality', nameNepali: 'तिला गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Guthichaur Rural Municipality', nameNepali: 'गुठिचौर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Tatopani Rural Municipality', nameNepali: 'तातोपानी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Patarasi Rural Municipality', nameNepali: 'पातारासी गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Kalikot',
        nameNepali: 'कालिकोट',
        localBodies: [
          { name: 'Khandachakra Municipality', nameNepali: 'खाँडाचक्र नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Raskot Municipality', nameNepali: 'रास्कोट नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Tilagufa Municipality', nameNepali: 'तिलागुफा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Pachaljharna Rural Municipality', nameNepali: 'पचालझरना गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Sanni Triveni Rural Municipality', nameNepali: 'सान्नी त्रिवेणी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Narharinath Rural Municipality', nameNepali: 'नरहरिनाथ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Shubh Kalika Rural Municipality', nameNepali: ' शुभ कालीका गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Mahawai Rural Municipality', nameNepali: 'महावै गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Palata Rural Municipality', nameNepali: 'पलाता गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Mugu',
        nameNepali: 'मुगु',
        localBodies: [
          { name: 'Chhayannath Rara Municipality', nameNepali: 'छायाँनाथ रारा नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Mugum Karmarong Rural Municipality', nameNepali: 'मुगुम कार्मारोंग गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Soru Rural Municipality', nameNepali: 'सोरु गाउँपालिका', type: 'Rural Municipality', wards: 11 },
          { name: 'Khatyad Rural Municipality', nameNepali: 'खत्याड गाउँपालिका', type: 'Rural Municipality', wards: 11 }
        ]
      },
      {
        name: 'Surkhet',
        nameNepali: 'सुर्खेत',
        localBodies: [
          { name: 'Birendranagar Municipality', nameNepali: 'बीरेन्द्रनगर नगरपालिका', type: 'Municipality', wards: 16 },
          { name: 'Bheriganga Municipality', nameNepali: 'भेरीगंगा नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Gurbhakot Municipality', nameNepali: 'गुर्भाकोट नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Panchpuri Municipality', nameNepali: 'पञ्चपुरी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Lekveshi Municipality', nameNepali: 'लेकवेशी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Chowkune Rural Municipality', nameNepali: 'चौकुने गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Barahatal Rural Municipality', nameNepali: 'बराहताल गाउँपालिका', type: 'Rural Municipality', wards: 10 },
          { name: 'Chingad Rural Municipality', nameNepali: 'चिङ्गाड गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Simta Rural Municipality', nameNepali: 'सिम्ता गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      },
      {
        name: 'Dailekh',
        nameNepali: 'दैलेख',
        localBodies: [
          { name: 'Narayan Municipality', nameNepali: 'नारायण नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Dullu Municipality', nameNepali: 'दुल्लु नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Chamunda Bindrasaini Municipality', nameNepali: 'चामुण्डा विन्द्रासैनी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Aathbise Municipality', nameNepali: 'आठबीस नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Bhagwatimai Rural Municipality', nameNepali: 'भगवतीमाई गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Gurans Rural Municipality', nameNepali: 'गुराँस गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Dungeshwar Rural Municipality', nameNepali: 'डुंगेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Naumule Rural Municipality', nameNepali: 'नौमुले गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Mahavu Rural Municipality', nameNepali: 'महावु गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Bhairavi Rural Municipality', nameNepali: 'भैरवी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Thantikandh Rural Municipality', nameNepali: 'ठाँटीकाँध गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Jajarkot',
        nameNepali: 'जाजरकोट',
        localBodies: [
          { name: 'Bheri Municipality', nameNepali: 'भेरी नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Chhedagad Municipality', nameNepali: 'छेडागाड नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Nalgad Municipality', nameNepali: 'नलगाड नगरपालिका', type: 'Municipality', wards: 13 },
          { name: 'Barekot Rural Municipality', nameNepali: 'बारेकोट गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Kuse Rural Municipality', nameNepali: 'कुसे गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Junichande Rural Municipality', nameNepali: 'जुनीचाँदे गाउँपालिका', type: 'Rural Municipality', wards: 11 },
          { name: 'Shivalaya Rural Municipality', nameNepali: 'शिवालय गाउँपालिका', type: 'Rural Municipality', wards: 9 }
        ]
      }
    ]
  },
  {
    name: 'Sudurpashchim Province',
    nameNepali: 'सुदूर-पश्चिम प्रदेश',
    districts: [
      {
        name: 'Kailali',
        nameNepali: 'कैलाली',
        localBodies: [
          { name: 'Dhangadhi Sub-metropolitan', nameNepali: 'धनगढी उपमहानगरपालिका', type: 'Metropolitan', wards: 19 },
          { name: 'Tikapur Municipality', nameNepali: 'टिकापुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Ghodaghodi Municipality', nameNepali: 'घोडाघोडी नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Lamkichuha Municipality', nameNepali: 'लम्कीचुहा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Bhajani Municipality', nameNepali: 'भजनी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Godavari Municipality', nameNepali: 'गोदावरी नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Gauriganga Municipality', nameNepali: 'गौरीगंगा नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Janaki Rural Municipality', nameNepali: 'जानकी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Bardagoria Rural Municipality', nameNepali: 'बर्दगोरिया गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Mohanyal Rural Municipality', nameNepali: 'मोहन्याल गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Kailari Rural Municipality', nameNepali: 'कैलारी गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Joshipur Rural Municipality', nameNepali: 'जोशीपुर गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Chure Rural Municipality', nameNepali: 'चुरे गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Achham',
        nameNepali: 'अछाम',
        localBodies: [
          { name: 'Mangalsen Municipality', nameNepali: 'मंगलसेन नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Kamal Bazar Municipality', nameNepali: 'कमलबजार नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Sanphebgar Municipality', nameNepali: 'साँफेबगर नगरपालिका', type: 'Municipality', wards: 14 },
          { name: 'Panchdewal Binayak Municipality', nameNepali: 'पन्चदेवल विनायक नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Chaurpati Rural Municipality', nameNepali: 'चौरपाटी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mellekh Rural Municipality', nameNepali: 'मेल्लेख गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Bannigadhi Jayagarh Rural Municipality', nameNepali: 'बान्निगढी जयगढ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Ramaroshan Rural Municipality', nameNepali: 'रामारोशन गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Dhakari Rural Municipality', nameNepali: 'ढकारी गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Turmakhand Rural Municipality', nameNepali: 'तुर्माखाँद गाउँपालिका', type: 'Rural Municipality', wards: 8 }
        ]
      },
      {
        name: 'Doti',
        nameNepali: 'डोटी',
        localBodies: [
          { name: 'Dipayal Silgadhi Municipality', nameNepali: 'दिपायल सिलगढी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Shikhar Municipality', nameNepali: 'शिखर नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Purvichowki Rural Municipality', nameNepali: 'पूर्वीचौकी गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Badikedar Rural Municipality', nameNepali: 'बडीकेदार गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Jorayal Rural Municipality', nameNepali: 'जोरायल गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Sayal Rural Municipality', nameNepali: 'सायल गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Adarsh Rural Municipality', nameNepali: 'आदर्श गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'K.I.C. Rural Municipality', nameNepali: 'के.आई.सिं. गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Bogtan Foodsil Rural Municipality', nameNepali: 'बोगटान फुड्सिल गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Bajhang',
        nameNepali: 'बझाङ',
        localBodies: [
          { name: 'Jaya Prithvi Municipality', nameNepali: 'जयपृथ्वी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Bungal Municipality', nameNepali: 'बुंगल नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Talkot Rural Municipality', nameNepali: 'तलकोट गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Mashta Rural Municipality', nameNepali: 'मष्टा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Khaptadchanna Rural Municipality', nameNepali: 'खप्तडछान्ना गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Thalara Rural Municipality', nameNepali: 'थलारा गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Vithadachir Rural Municipality', nameNepali: 'वित्थडचिर गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Surma Rural Municipality', nameNepali: 'सूर्मा गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Chhabispathibhera Rural Municipality', nameNepali: 'छबिसपाथिभेरा गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Durgathali Rural Municipality', nameNepali: 'दुर्गाथली गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Kedarsyun Rural Municipality', nameNepali: 'केदारस्युँ गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Saipal Rural Municipality', nameNepali: 'साइपाल गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Bajura',
        nameNepali: 'बाजुरा',
        localBodies: [
          { name: 'Badimalika Municipality', nameNepali: 'बडीमालिका नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Triveni Municipality', nameNepali: 'त्रिवेणी नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Budhiganga Municipality', nameNepali: 'बुढीगंगा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Budhinanda Municipality', nameNepali: 'बुढीनन्दा नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Gaumul Rural Municipality', nameNepali: 'गौमुल गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Jagannath Rural Municipality', nameNepali: 'जगन्‍नाथ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Swamikartik Khapar Rural Municipality', nameNepali: 'स्वामीकार्तिक खापर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Khaptad Chhededah Rural Municipality', nameNepali: 'खप्तड छेडेदह गाउँपालिका', type: 'Rural Municipality', wards: 7 },
          { name: 'Himali Rural Municipality', nameNepali: 'हिमाली गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Kanchanpur',
        nameNepali: 'कंचनपुर',
        localBodies: [
          { name: 'Bhimdatta Municipality', nameNepali: 'भीमदत्त नगरपालिका', type: 'Municipality', wards: 19 },
          { name: 'Punarbas Municipality', nameNepali: 'पुर्नवास नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Bedkot Municipality', nameNepali: 'वेदकोट नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Dodhara Chadani Municipality', nameNepali: 'दोधारा चादँनी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Shuklaphanta Municipality', nameNepali: 'शुक्लाफाँटा नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Belauri Municipality', nameNepali: 'बेलौरी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Krishnapur Municipality', nameNepali: 'कृष्णपुर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Beldadi Rural Municipality', nameNepali: 'बेलडाडी गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Laljhadi Rural Municipality', nameNepali: 'लालझाडी गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      },
      {
        name: 'Dadeldhura',
        nameNepali: 'डडेलधुरा',
        localBodies: [
          { name: 'Amargadhi Municipality', nameNepali: 'अमरगढी नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Parashuram Municipality', nameNepali: 'परशुराम नगरपालिका', type: 'Municipality', wards: 12 },
          { name: 'Alital Rural Municipality', nameNepali: 'आलिताल गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Bhageshwor Rural Municipality', nameNepali: 'भागेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Nawadurga Rural Municipality', nameNepali: 'नवदुर्गा गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Ajaymeru Rural Municipality', nameNepali: 'अजयमेरु गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Ganyapadhura Rural Municipality', nameNepali: 'गन्यापधुरा गाउँपालिका', type: 'Rural Municipality', wards: 5 }
        ]
      },
      {
        name: 'Baitadi',
        nameNepali: 'बैतडी',
        localBodies: [
          { name: 'Dasharathchanda Municipality', nameNepali: 'दशरथचन्द नगरपालिका', type: 'Municipality', wards: 11 },
          { name: 'Patan Municipality', nameNepali: 'पाटन नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Melauli Municipality', nameNepali: 'मेलौली नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Purchaudi Municipality', nameNepali: 'पुर्चौडी नगरपालिका', type: 'Municipality', wards: 10 },
          { name: 'Surnaya Rural Municipality', nameNepali: 'सुर्नया गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Sigas Rural Municipality', nameNepali: 'सिगास गाउँपालिका', type: 'Rural Municipality', wards: 9 },
          { name: 'Shivnath Rural Municipality', nameNepali: 'शिवनाथ गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Pancheshwar Rural Municipality', nameNepali: 'पञ्चेश्वर गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Dogadakedar Rural Municipality', nameNepali: 'दोगडाकेदार गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Dilasaini Rural Municipality', nameNepali: 'डीलासैनी गाउँपालिका', type: 'Rural Municipality', wards: 7 }
        ]
      },
      {
        name: 'Darchula',
        nameNepali: 'दार्चुला',
        localBodies: [
          { name: 'Mahakali Municipality', nameNepali: 'महाकाली नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Shailyashikhar Municipality', nameNepali: 'शैल्यशिखर नगरपालिका', type: 'Municipality', wards: 9 },
          { name: 'Malikarjun Rural Municipality', nameNepali: 'मालिकार्जुन गाउँपालिका', type: 'Rural Municipality', wards: 8 },
          { name: 'Apihimal Rural Municipality', nameNepali: 'अपिहिमाल गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Duhun Rural Municipality', nameNepali: 'दुहुँ गाउँपालिका', type: 'Rural Municipality', wards: 5 },
          { name: 'Naugad Rural Municipality', nameNepali: 'नौगाड गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Marma Rural Municipality', nameNepali: 'मार्मा गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Lekam Rural Municipality', nameNepali: 'लेकम गाउँपालिका', type: 'Rural Municipality', wards: 6 },
          { name: 'Byans Rural Municipality', nameNepali: 'ब्याँस गाउँपालिका', type: 'Rural Municipality', wards: 6 }
        ]
      }
    ]
  }
];
