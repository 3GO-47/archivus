/* ============================================================
   ARCHIVUS — TOTAL WAR · the Conquests (v20)
   Who held what land, when: the map of war as land changing hands.

   Asked for on 2026-11-27: "id really prefer to be able to see it in the form of land grabs the way
   ww1 and ww2 are shown." The War Room paints today's countries by whose hands they are in on a given
   day. This does the same for thirty-three centuries, by the year.

   HOW TO READ IT — and how far to trust it
   · It is drawn on TODAY'S BORDERS, because those are the only shapes the map has. A country is painted
     for a power when that power held it, or most of it. It is HATCHED (a leading "~" below) when the
     power held part of it, or held it through a vassal, a protectorate or an occupation zone.
   · It is SCHEMATIC, like the War Room's fronts. The years are the conventional ones for each conquest
     and loss; before about 1500 many are good to a decade, not a year. No frontier is claimed.
   · It is a map of EMPIRE: powers that took other people's land. A country ruling only itself is not
     painted, so most of the map is dark today. That is the finding, not a gap.
   · When two powers hold the same country in the same year, the one that holds all of it is shown over
     one that holds part; between equals, the later arrival is shown.

   SCHEMA
     powers: [id, name, colour, [lat, lon] where its name is written, Chronicle event id or null]
     holds:  id → "Country:from:to" separated by ";"   ("~" = in part / vassal / sphere;
             "@war" = the war on the String that took it, so the card can lead there)
     raids:  [year, power, lat, lon, name] — a blow struck where no land was kept
   Country names are the map's own (assets/world2.js).
   ============================================================ */
window.ARCHIVUS_CONQUESTS = {
  meta: { asOf: "2026-11-27", open: 1914, openNote: "the high tide of empire" },
  powers: [
    ["egypt", "Egypt of the pharaohs", "#d9b44a", [26, 31]],
    ["hittite", "The Hittites", "#b8743a", [39.5, 34.6]],
    ["assyria", "Assyria", "#b04a3c", [36.3, 43.1]],
    ["babylon", "Babylon", "#c18a3a", [32.5, 44.4]],
    ["persia", "Achaemenid Persia", "#8a5fc0", [30.5, 53]],
    ["macedon", "Macedon and Alexander", "#3f9fc0", [40.6, 22.5]],
    ["seleucid", "The Seleucids", "#4f9a9a", [35.5, 40]],
    ["ptolemy", "Ptolemaic Egypt", "#e0c060", [28, 30]],
    ["maurya", "The Maurya", "#d08a2e", [23, 80]],
    ["carthage", "Carthage", "#a070b8", [35.5, 9.5]],
    ["han", "Qin and Han China", "#c8483c", [33, 108]],
    ["rome", "Rome", "#c0392b", [42.5, 12.5]],
    ["byzantium", "Eastern Rome (Byzantium)", "#a8456f", [39.5, 32]],
    ["parthia", "Parthia", "#6f74c0", [34, 54]],
    ["sasan", "Sasanian Persia", "#8a5fc0", [32.5, 53]],
    ["gupta", "The Gupta", "#d08a2e", [24.5, 82]],
    ["huns", "The Huns", "#8a9a3a", [47, 21]],
    ["franks", "The Franks", "#3f6fc0", [48.5, 5]],
    ["caliphate", "The Caliphate", "#2e9a5a", [27, 43]],
    ["andalus", "Al-Andalus", "#3aa07a", [38.5, -4]],
    ["tang", "Sui and Tang China", "#c8483c", [33, 108]],
    ["khmer", "The Khmer Empire", "#8a9a3a", [13, 104.5]],
    ["fatimid", "The Fatimids", "#4a9a8a", [28, 29]],
    ["song", "Song China", "#d05a4a", [31, 112]],
    ["seljuk", "The Seljuks", "#3a9ab0", [33.5, 53]],
    ["crusader", "The Crusader states", "#b8b0d8", [33.5, 35.6]],
    ["ayyubid", "Saladin and the Mamluks", "#5aa04a", [27.5, 30]],
    ["mongol", "The Mongol Empire", "#e0a82e", [47, 100]],
    ["mali", "Mali and Songhai", "#c0903a", [16, -3]],
    ["delhi", "The Delhi Sultanate", "#4a9a6a", [24, 79]],
    ["timur", "Timur and his heirs", "#c06a3a", [39.5, 64]],
    ["ottoman", "The Ottoman Empire", "#2f8f6a", [39.3, 33]],
    ["ming", "Ming China", "#c8483c", [33, 108]],
    ["aztec", "The Aztec Empire", "#3a9a8a", [20, -100]],
    ["inca", "The Inca Empire", "#b09a2e", [-12, -74]],
    ["poland", "Poland–Lithuania", "#c85a7a", [52.3, 22]],
    ["spain", "The Spanish Empire", "#d0a02e", [40, -3.8]],
    ["portugal", "The Portuguese Empire", "#3a9ad0", [39.6, -8.2]],
    ["mughal", "The Mughal Empire", "#3aa06a", [24, 79]],
    ["safavid", "Safavid Persia", "#8a5fc0", [32.5, 53]],
    ["sweden", "The Swedish Empire", "#4aa0d8", [62, 16]],
    ["habsburg", "The Habsburg monarchy", "#c8b04a", [47.6, 15]],
    ["qing", "Qing China", "#d0603c", [35, 104]],
    ["russia", "The Russian Empire", "#6aa84f", [58, 60]],
    ["dutch", "The Dutch Empire", "#b07a2e", [52.3, 5.3]],
    ["britain", "The British Empire", "#d05a8a", [53.5, -1.8]],
    ["france", "The French Empire", "#3f5fd8", [46.8, 2.4]],
    ["napoleon", "Napoleon's Empire", "#6f8af8", [46.8, 2.4]],
    ["usa", "The United States", "#4aa0e0", [39.5, -98]],
    ["belgium", "Belgium's empire", "#b0a03a", [50.6, 4.6]],
    ["germany", "Imperial Germany", "#8f949e", [51, 10.3]],
    ["italy", "Italy's empire", "#6aa06a", [42.8, 12.6]],
    ["ethiopia", "The Ethiopian Empire", "#9a7a3a", [8.5, 39.5]],
    ["mahdi", "The Mahdist state", "#3a8a5a", [15.5, 30]],
    ["japan", "The Empire of Japan", "#ff8a3a", [36.2, 138.3]],
    ["ussr", "The Soviet Union", "#d8433a", [58, 60]],
    ["reich", "The Third Reich", "#a8a0a0", [51, 10.3]],
    ["russiafed", "Russia", "#6aa84f", [58, 60]]
  ],
  holds: {
    egypt: "Egypt:-1550:-1070;~Sudan:-1500:-1070;Israel:-1458:-1150;Palestine:-1458:-1150;Lebanon:-1458:-1200;~Syria:-1458:-1270",
    hittite: "Turkey:-1600:-1180;~Syria:-1340:-1180",
    assyria: "Iraq:-911:-609;Kuwait:-911:-609;~Turkey:-860:-609;~Iran:-744:-609;Syria:-740:-609;Lebanon:-740:-609;~Jordan:-732:-609;Israel:-722:-609;~Palestine:-701:-609;Egypt:-671:-655",
    babylon: "Iraq:-609:-539;Kuwait:-609:-539;Syria:-605:-539;Lebanon:-605:-539;Israel:-597:-539;Palestine:-597:-539;Jordan:-597:-539",
    persia: "Iran:-550:-330;Armenia:-547:-331;Azerbaijan:-547:-331;~Georgia:-547:-331;Turkey:-546:-334;Afghanistan:-545:-330;Turkmenistan:-545:-330;Cyprus:-545:-333;Uzbekistan:-540:-329;Tajikistan:-540:-329;Iraq:-539:-331;Kuwait:-539:-331;Syria:-539:-333;Lebanon:-539:-332;Israel:-539:-332;Palestine:-539:-332;Jordan:-539:-332;Egypt:-525:-404;~Libya:-525:-404;~Pakistan:-518:-327;~Bulgaria:-513:-479;~Macedonia:-512:-479;~Greece:-492:-479;Egypt:-343:-332",
    macedon: "Macedonia:-359:-168;~Albania:-358:-168;~Bulgaria:-341:-281;Greece:-338:-146;Turkey:-334:-281@alexander;Syria:-333:-312@alexander;Cyprus:-333:-294;Lebanon:-332:-301@alexander;Israel:-332:-301@alexander;Palestine:-332:-301@alexander;Egypt:-332:-305@alexander;Iraq:-331:-312@alexander;Kuwait:-331:-312;Iran:-330:-312@alexander;Turkmenistan:-330:-312@alexander;Afghanistan:-329:-312@alexander;Uzbekistan:-329:-312@alexander;Tajikistan:-329:-312@alexander;~Pakistan:-326:-316@alexander",
    seleucid: "Syria:-312:-63;Iraq:-312:-141;Kuwait:-312:-141;Iran:-312:-148;Afghanistan:-312:-250;Turkmenistan:-312:-247;Uzbekistan:-312:-250;Tajikistan:-312:-250;~Turkey:-281:-188;Lebanon:-200:-64;Israel:-200:-141;Palestine:-200:-141",
    ptolemy: "Egypt:-305:-30;~Libya:-305:-96;Israel:-301:-200;Palestine:-301:-200;Lebanon:-301:-200;Cyprus:-294:-58",
    maurya: "India:-322:-185;Bangladesh:-322:-185;Pakistan:-305:-185;~Afghanistan:-305:-185;~Nepal:-300:-185",
    carthage: "Tunisia:-650:-146;~Libya:-550:-146;~Algeria:-500:-146;~Morocco:-500:-146;~Spain:-237:-206",
    han: "China:-221:220@warringstates;~Vietnam:-111:220;~North Korea:-108:220",
    rome: "Italy:-272:476;~Spain:-206:-19@punic2;Albania:-167:395;Macedonia:-148:395;Greece:-146:395;Tunisia:-146:439@punic3;~Turkey:-133:-63;~France:-121:-50;Libya:-74:395;Turkey:-63:395;Syria:-63:395;Lebanon:-63:395;Israel:-63:395@jewishroman;Palestine:-63:395;Cyprus:-58:395;France:-50:476@gallic;Belgium:-50:406@gallic;Luxembourg:-50:406@gallic;~Algeria:-46:430;Egypt:-30:395;Spain:-19:409;Portugal:-19:409;Switzerland:-15:406;Austria:-15:433;Slovenia:-15:476;~Netherlands:-12:406;~Germany:-12:406@romangermanic;Croatia:9:476;Bosnia and Herz.:9:476;Serbia:9:395;Montenegro:9:395;Kosovo:9:395;~Hungary:9:433;~United Kingdom:43:410;~Morocco:44:429;Bulgaria:46:395;Jordan:106:395;Romania:106:271",
    byzantium: "Turkey:395:1071;Greece:395:1204;Bulgaria:395:681;Macedonia:395:1204;Albania:395:1204;Serbia:395:620;Syria:395:636;Lebanon:395:636;Israel:395:636;Palestine:395:636;Jordan:395:636;Egypt:395:641;Libya:395:643;Cyprus:395:1191;Tunisia:534:698;~Algeria:534:698;~Spain:552:624;~Italy:554:1071;Bulgaria:1018:1185;~Turkey:1071:1453;~Greece:1261:1460",
    parthia: "Turkmenistan:-247:224;Iran:-148:224;Iraq:-141:224;Kuwait:-141:224;~Afghanistan:-140:224;Azerbaijan:-140:224",
    sasan: "Iran:224:651;Iraq:224:637;Kuwait:224:637;Turkmenistan:224:651;~Afghanistan:224:651;Azerbaijan:224:651;~Oman:224:630;~Pakistan:240:480;~Armenia:252:651;~Georgia:363:627;Yemen:575:628",
    gupta: "~India:320:550;Bangladesh:335:550;~Nepal:335:550;~Pakistan:380:480",
    huns: "~Ukraine:376:454;Moldova:376:454;Hungary:434:454;Romania:434:454;Slovakia:434:454;~Austria:434:454;~Serbia:441:454",
    franks: "Belgium:486:843;Luxembourg:486:843;~France:486:507;~Germany:496:774;France:507:843;Switzerland:534:843;Netherlands:734:843;Germany:774:843;~Italy:774:843;Austria:788:843;Slovenia:788:843;~Spain:795:843",
    caliphate: "Saudi Arabia:632:945;Yemen:632:870;Oman:632:750;United Arab Emirates:632:900;Qatar:632:900;Kuwait:633:945;Syria:636:878;Jordan:636:878;Lebanon:636:878;Israel:636:878;Palestine:636:878;Iraq:637:945;Egypt:641:868;Libya:643:800;Iran:651:861;Turkmenistan:651:821;Armenia:654:885;Azerbaijan:654:890;~Georgia:654:900;~Afghanistan:661:861;Tunisia:698:800;Algeria:702:777;Morocco:709:788;Spain:711:756;Portugal:711:756;Uzbekistan:712:819;~Pakistan:712:871;Tajikistan:715:819;~Iraq:945:1258",
    andalus: "Spain:756:1085;Portugal:756:1147;~Spain:1085:1492@reconquista;~Portugal:1147:1249@reconquista",
    tang: "China:589:907;~Vietnam:602:907;~Mongolia:630:682;~Kyrgyzstan:657:751;~North Korea:668:676",
    khmer: "Cambodia:802:1431;~Thailand:900:1300;~Vietnam:900:1300;~Laos:1000:1350",
    fatimid: "Tunisia:909:972;~Algeria:909:972;Libya:913:1050;Egypt:969:1171;~Syria:970:1076;Palestine:970:1073;Israel:970:1073;~Lebanon:970:1100;~Saudi Arabia:970:1070",
    song: "China:960:1127;~China:1127:1279",
    seljuk: "Turkmenistan:1037:1194;Iran:1040:1194;~Afghanistan:1040:1150;~Uzbekistan:1040:1141;Azerbaijan:1054:1194;Iraq:1055:1194;Armenia:1064:1194;~Turkey:1071:1243;Syria:1078:1128",
    crusader: "~Syria:1098:1268@crusades;~Turkey:1098:1144@crusades;Israel:1099:1187@crusades;Palestine:1099:1187@crusades;~Lebanon:1109:1289@crusades;~Jordan:1115:1189@crusades;~Israel:1187:1291@crusades;Cyprus:1191:1489;~Greece:1204:1261",
    ayyubid: "Egypt:1171:1517;Syria:1174:1516;~Saudi Arabia:1174:1517;~Yemen:1174:1229;Palestine:1187:1516;Jordan:1189:1516;Lebanon:1289:1516;Israel:1291:1516",
    mongol: "Mongolia:1206:1368@mongol;~China:1215:1279@mongol;Kyrgyzstan:1218:1370@mongol;Kazakhstan:1220:1370@mongol;Uzbekistan:1220:1370@mongol;Tajikistan:1220:1370@mongol;Turkmenistan:1221:1335@mongol;Afghanistan:1221:1370@mongol;Iran:1221:1335@mongol;~Pakistan:1221:1320@mongol;Azerbaijan:1231:1335@mongol;Georgia:1236:1335@mongol;Armenia:1236:1335@mongol;~Russia:1240:1480@mongol;Ukraine:1240:1362@mongol;Moldova:1241:1340@mongol;~Romania:1241:1345@mongol;~Bulgaria:1242:1300@mongol;~Turkey:1243:1335@mongol;Iraq:1258:1335@mongol;Kuwait:1258:1335;~North Korea:1259:1356@mongol;~South Korea:1259:1356@mongol;China:1279:1368@mongol;~Myanmar:1287:1303@mongol",
    mali: "Mali:1235:1591;~Guinea:1235:1500;~Senegal:1250:1500;Gambia:1250:1500;~Mauritania:1250:1500;~Niger:1325:1591",
    delhi: "Bangladesh:1204:1338@delhi;~India:1206:1310@delhi;Pakistan:1206:1526@delhi;India:1310:1398@delhi;~India:1398:1526",
    timur: "Uzbekistan:1370:1507@timur;Tajikistan:1370:1507@timur;~Kyrgyzstan:1375:1405@timur;Turkmenistan:1381:1507@timur;Afghanistan:1381:1507@timur;Azerbaijan:1386:1405@timur;Armenia:1386:1405@timur;~Georgia:1386:1405@timur;Iran:1387:1452@timur;Iraq:1393:1405@timur;~Pakistan:1398:1405@timur;~Turkey:1402:1405@timur",
    ottoman: "~Turkey:1299:1461;Macedonia:1392:1912;Bulgaria:1396:1878;Kosovo:1455:1912;Serbia:1459:1815;Greece:1460:1830;Turkey:1461:1922;Bosnia and Herz.:1463:1878;~Ukraine:1475:1774;~Romania:1476:1878;Albania:1479:1912;~Montenegro:1496:1878;Syria:1516:1918;Lebanon:1516:1918;Israel:1516:1917;Palestine:1516:1917;Jordan:1516:1918;Algeria:1516:1830;Egypt:1517:1805;~Saudi Arabia:1517:1918;~Croatia:1526:1699;Iraq:1534:1917;Moldova:1538:1812;~Yemen:1538:1635;~Hungary:1541:1699;~Kuwait:1550:1899;Libya:1551:1912;Cyprus:1571:1878;Tunisia:1574:1881;~Georgia:1578:1829;~Egypt:1805:1882;~Serbia:1815:1878;~Greece:1830:1913;~Yemen:1872:1918",
    ming: "China:1368:1644;~Vietnam:1407:1427",
    aztec: "~Mexico:1428:1521",
    inca: "Peru:1438:1533;~Bolivia:1450:1538;~Ecuador:1463:1534;~Chile:1480:1541;~Argentina:1480:1536",
    poland: "Poland:1386:1795;Lithuania:1386:1795;Belarus:1386:1795;~Ukraine:1386:1793;~Latvia:1561:1772",
    spain: "Spain:1492:1898;Dominican Rep.:1496:1795;Haiti:1496:1697;Trinidad and Tobago:1498:1797;~Italy:1504:1714;Puerto Rico:1508:1898;Jamaica:1509:1655;Cuba:1511:1898;Panama:1513:1821;Mexico:1521:1821@mexico1519;Venezuela:1522:1821@newgranada;Guatemala:1524:1821;Nicaragua:1524:1821;El Salvador:1525:1821;Honduras:1525:1821;Peru:1533:1824@inca;Ecuador:1534:1822@inca;Paraguay:1537:1811;Colombia:1538:1819@newgranada;Bolivia:1538:1825@inca;Chile:1541:1818;Belgium:1556:1714;Luxembourg:1556:1714;Netherlands:1556:1581@eightyyears;Costa Rica:1561:1821;Philippines:1565:1898;~United States of America:1565:1821;Argentina:1580:1816;Portugal:1580:1640;Uruguay:1726:1814;Eq. Guinea:1778:1968;W. Sahara:1884:1975;~Morocco:1912:1956",
    portugal: "Portugal:1415:1580;~Morocco:1415:1541;~Brazil:1500:1700;~Mozambique:1505:1890;~Sri Lanka:1505:1658;~Oman:1507:1650;~Malaysia:1511:1641;~Angola:1575:1890;Guinea-Bissau:1588:1974;Portugal:1640:1975;Brazil:1700:1822;Timor-Leste:1702:1975;Angola:1890:1975;Mozambique:1890:1975",
    mughal: "~India:1526:1576@akbar;Pakistan:1526:1752;~Afghanistan:1526:1738;India:1576:1757@akbar;Bangladesh:1576:1757@akbar;~India:1757:1857",
    safavid: "Iran:1501:1736;Azerbaijan:1501:1736;~Armenia:1502:1736;Iraq:1508:1534;~Afghanistan:1510:1709;~Turkmenistan:1510:1736;~Georgia:1518:1736;~Iraq:1623:1638",
    sweden: "Sweden:1560:1721;Finland:1560:1809;Estonia:1561:1721@northern;~Latvia:1629:1721@northern;~Germany:1648:1720@thirtyyears",
    habsburg: "Austria:1526:1918;Czechia:1526:1918;Slovakia:1526:1918;Slovenia:1526:1918;~Hungary:1526:1699;~Croatia:1527:1699;Hungary:1699:1918;Croatia:1699:1918;~Romania:1699:1918;~Italy:1714:1866@spanishsuccession;Belgium:1714:1795@spanishsuccession;Luxembourg:1714:1795@spanishsuccession;~Poland:1772:1918;~Ukraine:1772:1918;Bosnia and Herz.:1878:1918",
    qing: "~China:1618:1644@mingqing;China:1644:1912@mingqing;Taiwan:1683:1895;Mongolia:1691:1911",
    russia: "Russia:1547:1917;~Ukraine:1654:1795;Estonia:1721:1917@greatnorthern;~Latvia:1721:1795@greatnorthern;~Kazakhstan:1731:1860;Ukraine:1795:1917;Belarus:1795:1917;Lithuania:1795:1915;Latvia:1795:1917;~Poland:1795:1815;Georgia:1801:1917@caucasian;Finland:1809:1917;Moldova:1812:1917;Azerbaijan:1813:1917@caucasian;Poland:1815:1915;Armenia:1828:1917@caucasian;Kazakhstan:1860:1917;Uzbekistan:1868:1917;Tajikistan:1868:1917;Kyrgyzstan:1876:1917;Turkmenistan:1881:1917",
    dutch: "Netherlands:1581:1795;~Indonesia:1619:1800;~Taiwan:1624:1662;~Brazil:1630:1654;~Malaysia:1641:1795;~South Africa:1652:1806;~Sri Lanka:1658:1796;Suriname:1667:1975;Indonesia:1800:1942;Netherlands:1815:1940;Belgium:1815:1830;Indonesia:1945:1949",
    britain: "United Kingdom:1600:1997;Ireland:1603:1922;~United States of America:1607:1783;Jamaica:1655:1962;~Canada:1670:1763;Bahamas:1718:1973;~India:1757:1818;Bangladesh:1757:1947;Canada:1763:1931@sevenyears;Belize:1783:1981;~Malaysia:1786:1874;Australia:1788:1901;Sri Lanka:1796:1948;Trinidad and Tobago:1797:1962;~South Africa:1806:1902;Sierra Leone:1808:1961;Guyana:1814:1966;Gambia:1816:1965;India:1818:1947;~United Arab Emirates:1820:1971;~Myanmar:1826:1886;~Yemen:1839:1967;New Zealand:1840:1907;Pakistan:1849:1947;Lesotho:1868:1966;Fiji:1874:1970;Ghana:1874:1957;Malaysia:1874:1957;Cyprus:1878:1960;~Afghanistan:1879:1919;Egypt:1882:1922;Somaliland:1884:1960;~Papua New Guinea:1884:1975;Botswana:1885:1966;Myanmar:1886:1948;Brunei:1888:1984;Zimbabwe:1890:1965;Zambia:1891:1964;Malawi:1891:1964;~Oman:1891:1970;Solomon Is.:1893:1978;Uganda:1894:1962;Kenya:1895:1963;Sudan:1899:1956@mahdist;S. Sudan:1899:1956;Kuwait:1899:1961;Nigeria:1900:1960;South Africa:1902:1910;eSwatini:1903:1968;~Vanuatu:1906:1980;~Qatar:1916:1971;Iraq:1917:1932@ww1;Israel:1917:1948@ww1;Palestine:1917:1948@ww1;Jordan:1918:1946@ww1;Tanzania:1919:1961@ww1;~Cameroon:1919:1961@ww1;~Egypt:1922:1956",
    france: "France:1534:1962;~Canada:1608:1763;~Senegal:1659:1895;Haiti:1697:1804;Algeria:1830:1962@algeria1830;New Caledonia:1853:2026;~Vietnam:1862:1885;Cambodia:1863:1953;Tunisia:1881:1956;Congo:1882:1960;Djibouti:1884:1977;Vietnam:1885:1954;Gabon:1885:1960;Guinea:1891:1958;Mali:1892:1960;Laos:1893:1953;Côte d'Ivoire:1893:1960;Benin:1894:1960;Central African Rep.:1894:1960;Senegal:1895:1960;Burkina Faso:1896:1960;Madagascar:1896:1960;Niger:1900:1960;Chad:1900:1960;Mauritania:1903:1960;Morocco:1912:1956;Cameroon:1919:1960@ww1;Togo:1919:1960@ww1;Syria:1920:1946@ww1;Lebanon:1920:1943@ww1",
    napoleon: "Belgium:1795:1814@napoleon;Luxembourg:1795:1814@napoleon;Netherlands:1795:1813@napoleon;~Italy:1797:1806@napoleon;Switzerland:1798:1813@napoleon;~Egypt:1798:1801@napoleon;France:1799:1814@napoleon;Italy:1806:1814@napoleon;~Germany:1806:1813@napoleon;~Poland:1807:1813@napoleon;~Portugal:1807:1808@napoleon;Spain:1808:1813@napoleon;Croatia:1809:1813@napoleon;Slovenia:1809:1813@napoleon",
    usa: "United States of America:1783:2026;Philippines:1898:1942;Puerto Rico:1898:2026;Cuba:1898:1902;~Panama:1903:1979;~Nicaragua:1912:1933;Haiti:1915:1934;Dominican Rep.:1916:1924;Philippines:1945:1946;Japan:1945:1952@ww2;~South Korea:1945:1948@ww2;~Germany:1945:1949@ww2;~Afghanistan:2001:2021;~Iraq:2003:2011",
    belgium: "Dem. Rep. Congo:1885:1960;Rwanda:1916:1962@ww1;Burundi:1916:1962@ww1",
    germany: "Germany:1871:1918;~Poland:1871:1915;Namibia:1884:1915;Cameroon:1884:1916;Togo:1884:1914;~Papua New Guinea:1884:1914;Tanzania:1885:1918;Rwanda:1894:1916;Burundi:1894:1916;Belgium:1914:1918@ww1;Luxembourg:1914:1918@ww1;~France:1914:1918@ww1;Poland:1915:1918@ww1;Lithuania:1915:1918@ww1;~Latvia:1915:1918@ww1;Serbia:1915:1918@ww1;~Romania:1916:1918@ww1",
    italy: "Italy:1861:1943;Somalia:1889:1941;Eritrea:1890:1941;Libya:1912:1943;Ethiopia:1936:1941;Albania:1939:1943@ww2",
    ethiopia: "Ethiopia:1889:1936@menelik;Ethiopia:1941:1974;Eritrea:1952:1993@ethiopiancivil",
    mahdi: "Sudan:1885:1898@mahdist;~S. Sudan:1885:1898@mahdist",
    japan: "Japan:1868:1945;Taiwan:1895:1945;North Korea:1910:1945;South Korea:1910:1945;~China:1931:1945@ww2;Vietnam:1940:1945@ww2;Cambodia:1941:1945@ww2;Laos:1941:1945@ww2;~Thailand:1941:1945@ww2;Philippines:1942:1945@ww2;Malaysia:1942:1945@ww2;Brunei:1942:1945@ww2;Indonesia:1942:1945@ww2;Myanmar:1942:1945@ww2;Timor-Leste:1942:1945@ww2;~Papua New Guinea:1942:1945@ww2;~Solomon Is.:1942:1943@ww2",
    ussr: "Russia:1922:1991@russiancivil;Ukraine:1922:1991@russiancivil;Belarus:1922:1991@russiancivil;Georgia:1922:1991@russiancivil;Armenia:1922:1991@russiancivil;Azerbaijan:1922:1991@russiancivil;Kazakhstan:1922:1991@russiancivil;Uzbekistan:1924:1991;Turkmenistan:1924:1991;Kyrgyzstan:1924:1991;Tajikistan:1924:1991;~Mongolia:1924:1990;Estonia:1940:1941@ww2;Latvia:1940:1941@ww2;Lithuania:1940:1941@ww2;Moldova:1940:1941@ww2;Estonia:1944:1991@ww2;Latvia:1944:1991@ww2;Lithuania:1944:1991@ww2;Moldova:1944:1991@ww2;~Poland:1945:1989@ww2;~Germany:1945:1990@ww2;~Hungary:1945:1989@ww2;~Romania:1945:1989@ww2;~Bulgaria:1945:1989@ww2;~North Korea:1945:1948@ww2;~Czechia:1948:1989;~Slovakia:1948:1989;~Afghanistan:1979:1989@sovietafghan",
    reich: "Germany:1933:1945;Austria:1938:1945@ww2;Czechia:1939:1945@ww2;~Slovakia:1939:1945@ww2;Poland:1939:1945@ww2;Denmark:1940:1945@ww2;Norway:1940:1945@ww2;Netherlands:1940:1945@ww2;Belgium:1940:1944@ww2;Luxembourg:1940:1944@ww2;France:1940:1944@ww2;~Romania:1940:1944@ww2;Serbia:1941:1944@ww2;Greece:1941:1944@ww2;~Croatia:1941:1945@ww2;~Bosnia and Herz.:1941:1945@ww2;Slovenia:1941:1945@ww2;Macedonia:1941:1944@ww2;Montenegro:1941:1944@ww2;Kosovo:1941:1944@ww2;Lithuania:1941:1944@ww2;Latvia:1941:1944@ww2;Estonia:1941:1944@ww2;Belarus:1941:1944@ww2;Ukraine:1941:1944@ww2;Moldova:1941:1944@ww2;~Russia:1941:1944@ww2;~Hungary:1941:1944@ww2;~Bulgaria:1941:1944@ww2;~Finland:1941:1944@ww2;~Libya:1941:1943@ww2;~Tunisia:1942:1943@ww2;Albania:1943:1944@ww2;~Italy:1943:1945@ww2;Hungary:1944:1945@ww2",
    russiafed: "~Georgia:2008:2026;~Ukraine:2014:2026@russoukraine"
  },
  raids: [
    [-490, "persia", 38.15, 23.96, "Marathon"], [-480, "persia", 37.95, 23.5, "Salamis"], [-326, "macedon", 32.8, 73.6, "The Hydaspes"],
    [-218, "carthage", 45.07, 7.69, "Hannibal crosses the Alps"], [9, "rome", 52.41, 8.13, "The Teutoburg Forest"], [451, "huns", 48.95, 4.36, "The Catalaunian Plains"],
    [732, "caliphate", 46.8, 0.5, "Tours"], [1241, "mongol", 47.5, 19.05, "Mohi and Legnica"], [1274, "mongol", 33.6, 130.4, "The invasions of Japan"],
    [1398, "timur", 28.6, 77.2, "The sack of Delhi"], [1529, "ottoman", 48.2, 16.37, "The siege of Vienna"], [1588, "spain", 50.2, -1.5, "The Armada"],
    [1683, "ottoman", 48.2, 16.37, "Vienna again"], [1812, "napoleon", 55.75, 37.6, "Moscow"], [1941, "reich", 55.75, 37.6, "Moscow"], [1942, "reich", 48.7, 44.5, "Stalingrad"]
  ]
};
