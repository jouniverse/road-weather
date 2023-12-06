// Municipalities 2023 - https://www.stat.fi/en/luokitukset/kunta/
// JSON - https://data.stat.fi/api/classifications/v2/classifications/kunta_1_20230101/classificationItems?content=data&meta=max&lang=en&format=json

const municipality = {

     name: 
     [
        "Akaa",
        "Alajärvi",
        "Alavieska",
        "Alavus",
        "Asikkala",
        "Askola",
        "Aura",
        "Brändö",
        "Eckerö",
        "Enonkoski",
        "Enontekiö",
        "Espoo",
        "Eura",
        "Eurajoki",
        "Evijärvi",
        "Finström",
        "Forssa",
        "Föglö",
        "Geta",
        "Haapajärvi",
        "Haapavesi",
        "Hailuoto",
        "Halsua",
        "Hamina",
        "Hammarland",
        "Hankasalmi",
        "Hanko",
        "Harjavalta",
        "Hartola",
        "Hattula",
        "Hausjärvi",
        "Heinola",
        "Heinävesi",
        "Helsinki",
        "Hirvensalmi",
        "Hollola",
        "Huittinen",
        "Humppila",
        "Hyrynsalmi",
        "Hyvinkää",
        "Hämeenkyrö",
        "Hämeenlinna",
        "Ii",
        "Iisalmi",
        "Iitti",
        "Ikaalinen",
        "Ilmajoki",
        "Ilomantsi",
        "Imatra",
        "Inari",
        "Ingå",
        "Isojoki",
        "Isokyrö",
        "Janakkala",
        "Joensuu",
        "Jokioinen",
        "Jomala",
        "Joroinen",
        "Joutsa",
        "Juuka",
        "Juupajoki",
        "Juva",
        "Jyväskylä",
        "Jämijärvi",
        "Jämsä",
        "Järvenpää",
        "Kaarina",
        "Kaavi",
        "Kajaani",
        "Kalajoki",
        "Kangasala",
        "Kangasniemi",
        "Kankaanpää",
        "Kannonkoski",
        "Kannus",
        "Karijoki",
        "Karkkila",
        "Karstula",
        "Karvia",
        "Kaskinen",
        "Kauhajoki",
        "Kauhava",
        "Kauniainen",
        "Kaustinen",
        "Keitele",
        "Kemi",
        "Kemijärvi",
        "Keminmaa",
        "Kimitoön",
        "Kempele",
        "Kerava",
        "Keuruu",
        "Kihniö",
        "Kinnula",
        "Kirkkonummi",
        "Kitee",
        "Kittilä",
        "Kiuruvesi",
        "Kivijärvi",
        "Kokemäki",
        "Kokkola",
        "Kolari",
        "Konnevesi",
        "Kontiolahti",
        "Korsnäs",
        "Koski  Tl",
        "Kotka",
        "Kouvola",
        "Kristinestad",
        "Kronoby",
        "Kuhmo",
        "Kuhmoinen",
        "Kumlinge",
        "Kuopio",
        "Kuortane",
        "Kurikka",
        "Kustavi",
        "Kuusamo",
        "Kyyjärvi",
        "Kärkölä",
        "Kärsämäki",
        "Kökar",
        "Lahti",
        "Laihia",
        "Laitila",
        "Lapinjärvi",
        "Lapinlahti",
        "Lappajärvi",
        "Lappeenranta",
        "Lapua",
        "Laukaa",
        "Lemi",
        "Lemland",
        "Lempäälä",
        "Leppävirta",
        "Lestijärvi",
        "Lieksa",
        "Lieto",
        "Liminka",
        "Liperi",
        "Lohja",
        "Loimaa",
        "Loppi",
        "Loviisa",
        "Luhanka",
        "Lumijoki",
        "Lumparland",
        "Luoto",
        "Luumäki",
        "Maalahti",
        "Maarianhamina",
        "Marttila",
        "Masku",
        "Merijärvi",
        "Merikarvia",
        "Miehikkälä",
        "Mikkeli",
        "Muhos",
        "Multia",
        "Muonio",
        "Korsholm",
        "Muurame",
        "Mynämäki",
        "Myrskylä",
        "Mäntsälä",
        "Mänttä-Vilppula",
        "Mäntyharju",
        "Naantali",
        "Nakkila",
        "Nivala",
        "Nokia",
        "Nousiainen",
        "Nurmes",
        "Nurmijärvi",
        "Närpes",
        "Orimattila",
        "Oripää",
        "Orivesi",
        "Oulainen",
        "Oulu",
        "Outokumpu",
        "Padasjoki",
        "Paimio",
        "Paltamo",
        "Parainen",
        "Parikkala",
        "Parkano",
        "Pedersöre",
        "Pelkosenniemi",
        "Pello",
        "Perho",
        "Pertunmaa",
        "Petäjävesi",
        "Pieksämäki",
        "Pielavesi",
        "Jakobstad",
        "Pihtipudas",
        "Pirkkala",
        "Polvijärvi",
        "Pomarkku",
        "Pori",
        "Pornainen",
        "Porvoo",
        "Posio",
        "Pudasjärvi",
        "Pukkila",
        "Punkalaidun",
        "Puolanka",
        "Puumala",
        "Pyhtää",
        "Pyhäjoki",
        "Pyhäjärvi",
        "Pyhäntä",
        "Pyhäranta",
        "Pälkäne",
        "Pöytyä",
        "Raahe",
        "Raasepori",
        "Raisio",
        "Rantasalmi",
        "Ranua",
        "Rauma",
        "Rautalampi",
        "Rautavaara",
        "Rautjärvi",
        "Reisjärvi",
        "Riihimäki",
        "Ristijärvi",
        "Rovaniemi",
        "Ruokolahti",
        "Ruovesi",
        "Rusko",
        "Rääkkylä",
        "Saarijärvi",
        "Salla",
        "Salo",
        "Saltvik",
        "Sastamala",
        "Sauvo",
        "Savitaipale",
        "Savonlinna",
        "Savukoski",
        "Seinäjoki",
        "Sievi",
        "Siikainen",
        "Siikajoki",
        "Siikalatva",
        "Siilinjärvi",
        "Simo",
        "Sipoo",
        "Siuntio",
        "Sodankylä",
        "Soini",
        "Somero",
        "Sonkajärvi",
        "Sotkamo",
        "Sottunga",
        "Sulkava",
        "Sund",
        "Suomussalmi",
        "Suonenjoki",
        "Sysmä",
        "Säkylä",
        "Taipalsaari",
        "Taivalkoski",
        "Taivassalo",
        "Tammela",
        "Tampere",
        "Tervo",
        "Tervola",
        "Teuva",
        "Tohmajärvi",
        "Toholampi",
        "Toivakka",
        "Tornio",
        "Turku",
        "Tuusniemi",
        "Tuusula",
        "Tyrnävä",
        "Ulvila",
        "Urjala",
        "Utajärvi",
        "Utsjoki",
        "Uurainen",
        "Uusikaarlepyy",
        "Uusikaupunki",
        "Vaala",
        "Vaasa",
        "Valkeakoski",
        "Vantaa",
        "Varkaus",
        "Vehmaa",
        "Vesanto",
        "Vesilahti",
        "Veteli",
        "Vieremä",
        "Vihti",
        "Viitasaari",
        "Vimpeli",
        "Virolahti",
        "Virrat",
        "Vårdö",
        "Vörå",
        "Ylitornio",
        "Ylivieska",
        "Ylöjärvi",
        "Ypäjä",
        "Ähtäri",
        "Äänekoski"
    ],

    code:
    [

        "020",
        "005",
        "009",
        "010",
        "016",
        "018",
        "019",
        "035",
        "043",
        "046",
        "047",
        "049",
        "050",
        "051",
        "052",
        "060",
        "061",
        "062",
        "065",
        "069",
        "071",
        "072",
        "074",
        "075",
        "076",
        "077",
        "078",
        "079",
        "081",
        "082",
        "086",
        "111",
        "090",
        "091",
        "097",
        "098",
        "102",
        "103",
        "105",
        "106",
        "108",
        "109",
        "139",
        "140",
        "142",
        "143",
        "145",
        "146",
        "153",
        "148",
        "149",
        "151",
        "152",
        "165",
        "167",
        "169",
        "170",
        "171",
        "172",
        "176",
        "177",
        "178",
        "179",
        "181",
        "182",
        "186",
        "202",
        "204",
        "205",
        "208",
        "211",
        "213",
        "214",
        "216",
        "217",
        "218",
        "224",
        "226",
        "230",
        "231",
        "232",
        "233",
        "235",
        "236",
        "239",
        "240",
        "320",
        "241",
        "322",
        "244",
        "245",
        "249",
        "250",
        "256",
        "257",
        "260",
        "261",
        "263",
        "265",
        "271",
        "272",
        "273",
        "275",
        "276",
        "280",
        "284",
        "285",
        "286",
        "287",
        "288",
        "290",
        "291",
        "295",
        "297",
        "300",
        "301",
        "304",
        "305",
        "312",
        "316",
        "317",
        "318",
        "398",
        "399",
        "400",
        "407",
        "402",
        "403",
        "405",
        "408",
        "410",
        "416",
        "417",
        "418",
        "420",
        "421",
        "422",
        "423",
        "425",
        "426",
        "444",
        "430",
        "433",
        "434",
        "435",
        "436",
        "438",
        "440",
        "441",
        "475",
        "478",
        "480",
        "481",
        "483",
        "484",
        "489",
        "491",
        "494",
        "495",
        "498",
        "499",
        "500",
        "503",
        "504",
        "505",
        "508",
        "507",
        "529",
        "531",
        "535",
        "536",
        "538",
        "541",
        "543",
        "545",
        "560",
        "561",
        "562",
        "563",
        "564",
        "309",
        "576",
        "577",
        "578",
        "445",
        "580",
        "581",
        "599",
        "583",
        "854",
        "584",
        "588",
        "592",
        "593",
        "595",
        "598",
        "601",
        "604",
        "607",
        "608",
        "609",
        "611",
        "638",
        "614",
        "615",
        "616",
        "619",
        "620",
        "623",
        "624",
        "625",
        "626",
        "630",
        "631",
        "635",
        "636",
        "678",
        "710",
        "680",
        "681",
        "683",
        "684",
        "686",
        "687",
        "689",
        "691",
        "694",
        "697",
        "698",
        "700",
        "702",
        "704",
        "707",
        "729",
        "732",
        "734",
        "736",
        "790",
        "738",
        "739",
        "740",
        "742",
        "743",
        "746",
        "747",
        "748",
        "791",
        "749",
        "751",
        "753",
        "755",
        "758",
        "759",
        "761",
        "762",
        "765",
        "766",
        "768",
        "771",
        "777",
        "778",
        "781",
        "783",
        "831",
        "832",
        "833",
        "834",
        "837",
        "844",
        "845",
        "846",
        "848",
        "849",
        "850",
        "851",
        "853",
        "857",
        "858",
        "859",
        "886",
        "887",
        "889",
        "890",
        "892",
        "893",
        "895",
        "785",
        "905",
        "908",
        "092",
        "915",
        "918",
        "921",
        "922",
        "924",
        "925",
        "927",
        "931",
        "934",
        "935",
        "936",
        "941",
        "946",
        "976",
        "977",
        "980",
        "981",
        "989",
        "992",
    ]
}

export {municipality};


















































































































































































































































































































