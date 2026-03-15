export const PACKS = [
  {
    name: "Animals", emoji:"1f981",
    words: [
      { en:"CAT", es:"Gato", fr:"Chat", ar:"قطة", pt:"Gato", de:"Katze", it:"Gatto", zh:"猫", ja:"ねこ", ko:"고양이", ru:"Кошка", hi:"बिल्ली", tr:"Kedi", nl:"Kat", pl:"Kot", sv:"Katt" },
      { en:"DOG", es:"Perro", fr:"Chien", ar:"كلب", pt:"Cachorro", de:"Hund", it:"Cane", zh:"狗", ja:"いぬ", ko:"개", ru:"Собаka", hi:"कुत्ता", tr:"Köpek", nl:"Hond", pl:"Pies", sv:"Hund" },
      { en:"FISH", es:"Pez", fr:"Poisson", ar:"سمكة", pt:"Peixe", de:"Fisch", it:"Pesce", zh:"鱼", ja:"さかな", ko:"물고기", ru:"Рыба", hi:"मछली", tr:"Balık", nl:"Vis", pl:"Ryba", sv:"Fisk" },
      { en:"BIRD", es:"Pájaro", fr:"Oiseau", ar:"طائر", pt:"Pássaro", de:"Vogel", it:"Uccello", zh:"鸟", ja:"とり", ko:"새", ru:"Птица", hi:"पक्षी", tr:"Kuş", nl:"Vogel", pl:"Ptak", sv:"Fågel" },
      { en:"LION", es:"León", fr:"Lion", ar:"أسد", pt:"Leão", de:"Löwe", it:"Leone", zh:"狮子", ja:"ライオン", ko:"사자", ru:"Лев", hi:"शेर", tr:"Aslan", nl:"Leeuw", pl:"Lew", sv:"Lejon" },
      { en:"BEAR", es:"Oso", fr:"Ours", ar:"دب", pt:"Urso", de:"Bär", it:"Orso", zh:"熊", ja:"くま", ko:"곰", ru:"Медведь", hi:"भालू", tr:"Ayı", nl:"Beer", pl:"Niedźwiedź", sv:"Björn" },
      { en:"WOLF", es:"Lobo", fr:"Loup", ar:"ذئب", pt:"Lobo", de:"Wolf", it:"Lupo", zh:"狼", ja:"おおかみ", ko:"늑대", ru:"Волк", hi:"भेड़िया", tr:"Kurt", nl:"Wolf", pl:"Wilk", sv:"Varg" },
      { en:"DUCK", es:"Pato", fr:"Canard", ar:"بطة", pt:"Pato", de:"Ente", it:"Anatra", zh:"鸭子", ja:"あひる", ko:"오리", ru:"Утка", hi:"बतख", tr:"Ördek", nl:"Eend", pl:"Kaczka", sv:"Anka" },
      { en:"FROG", es:"Rana", fr:"Grenouille", ar:"ضفدع", pt:"Sapo", de:"Frosch", it:"Rana", zh:"青蛙", ja:"かえる", ko:"개구리", ru:"Лягушка", hi:"मेंढक", tr:"Kurbağa", nl:"Kikker", pl:"空中", sv:"Groda" },
      { en:"DEER", es:"Ciervo", fr:"Cerf", ar:"غزال", pt:"Veado", de:"Hirsch", it:"Cervo", zh:"鹿", ja:"しか", ko:"사슴", ru:"Олень", hi:"हिरण", tr:"Geyik", nl:"Hert", pl:"Jeleń", sv:"Hjort" },
      { en:"HORSE", es:"Caballo", fr:"Cheval", ar:"حصان", pt:"Cavalo", de:"Pferd", it:"Cavallo", zh:"马", ja:"うま", ko:"말", ru:"Лошадь", hi:"घोड़ा", tr:"At", nl:"Paard", pl:"Koń", sv:"Häst" },
      { en:"TIGER", es:"Tigre", fr:"Tigre", ar:"نمر", pt:"Tigre", de:"Tiger", it:"Tigre", zh:"老虎", ja:"とら", ko:"호랑이", ru:"Тигр", hi:"बाघ", tr:"Kaplan", nl:"Tijger", pl:"Tygrys", sv:"Tiger" },
      { en:"EAGLE", es:"Águila", fr:"Aigle", ar:"نسر", pt:"Águia", de:"Adler", it:"Aquila", zh:"老鹰", ja:"わし", ko:"독수리", ru:"Орёл", hi:"चील", tr:"Kartal", nl:"Adelaar", pl:"Orzeł", sv:"Örn" },
      { en:"SHARK", es:"Tiburón", fr:"Requin", ar:"قرش", pt:"Tubarão", de:"Hai", it:"Squalo", zh:"鲨鱼", ja:"さめ", ko:"상어", ru:"Акула", hi:"शार्क", tr:"Köpekbalığı", nl:"Haai", pl:"Rekin", sv:"Haj" },
      { en:"CAMEL", es:"Camello", fr:"Chameau", ar:"جمل", pt:"Camelo", de:"Kamel", it:"Cammello", zh:"骆驼", ja:"らくだ", ko:"낙타", ru:"Верблюд", hi:"ऊँट", tr:"Deve", nl:"Kameel", pl:"Wielbłąd", sv:"Kamel" },
      { en:"KOALA", es:"Koala", fr:"Koala", ar:"كوالا", pt:"Coala", de:"Koala", it:"Koala", zh:"考拉", ja:"コアラ", ko:"코알라", ru:"Koala", hi:"कोआला", tr:"Koala", nl:"Koala", pl:"Koala", sv:"Koala" },
      { en:"WHALE", es:"Ballena", fr:"Baleine", ar:"حوت", pt:"Baleia", de:"Wal", it:"Balena", zh:"鲸鱼", ja:"くじら", ko:"고래", ru:"Кит", hi:"व्हेल", tr:"Balina", nl:"Walvis", pl:"Wieloryb", sv:"Val" },
      { en:"ZEBRA", es:"Cebra", fr:"Zèbre", ar:"حمار وحشي", pt:"Zebra", de:"Zebra", it:"Zebra", zh:"斑马", ja:"しまうま", ko:"얼룩말", ru:"Зебра", hi:"जेब्रा", tr:"Zebra", nl:"Zebra", pl:"Zebra", sv:"Zebra" },
      { en:"RABBIT", es:"Conejo", fr:"Lapin", ar:"أرنب", pt:"Coelho", de:"Kaninchen", it:"Coniglio", zh:"兔子", ja:"うさぎ", ko:"토끼", ru:"Кролик", hi:"खरगोश", tr:"Tavşan", nl:"Konijn", pl:"Królik", sv:"Kanin" },
      { en:"MONKEY", es:"Mono", fr:"Singe", ar:"قرد", pt:"Macaco", de:"Affe", it:"Scimmia", zh:"猴子", ja:"さる", ko:"원숭이", ru:"Обезьяна", hi:"बंदर", tr:"Maymun", nl:"Aap", pl:"Małpa", sv:"Apa" }
    ]
  },
  {
    name: "Colors", emoji:"1f3a8",
    words: [
      { en:"RED", es:"Rojo", fr:"Rouge", ar:"أحمر", pt:"Vermelho", de:"Rot", it:"Rosso", zh:"红色", ja:"あか", ko:"빨간색", ru:"Красный", hi:"लाल", tr:"Kırmızı", nl:"Rood", pl:"Czerwony", sv:"Röd" },
      { en:"BLUE", es:"Azul", fr:"Bleu", ar:"أزرق", pt:"Azul", de:"Blau", it:"Blu", zh:"蓝色", ja:"あお", ko:"파란색", ru:"Синий", hi:"नीला", tr:"Mavi", nl:"Blauw", pl:"Niebieski", sv:"Blå" },
      { en:"GREEN", es:"Verde", fr:"Vert", ar:"أخضر", pt:"Verde", de:"Grün", it:"Verde", zh:"绿色", ja:"みどり", ko:"초록색", ru:"Зелёный", hi:"हरा", tr:"Yeşil", nl:"Groen", pl:"Zielony", sv:"Grön" },
      { en:"PINK", es:"Rosa", fr:"Rose", ar:"وردي", pt:"Rosa", de:"Rosa", it:"Rosa", zh:"粉色", ja:"ピンク", ko:"분홍색", ru:"Розовый", hi:"गुलाबी", tr:"Pembe", nl:"Roze", pl:"Różowy", sv:"Rosa" },
      { en:"GOLD", es:"Oro", fr:"Or", ar:"ذهبي", pt:"Dourado", de:"Gold", it:"Oro", zh:"金色", ja:"きん", ko:"금색", ru:"Золотой", hi:"सोना", tr:"Altın", nl:"Goud", pl:"Złoty", sv:"Guld" },
      { en:"GREY", es:"Gris", fr:"Gris", ar:"رمادي", pt:"Cinza", de:"Grau", it:"Grigio", zh:"灰色", ja:"はいいろ", ko:"회색", ru:"Серый", hi:"धूसर", tr:"Gri", nl:"Grijs", pl:"Szary", sv:"Grå" },
      { en:"CYAN", es:"Cian", fr:"Cyan", ar:"سماوي", pt:"Ciano", de:"Cyan", it:"Ciano", zh:"青色", ja:"シアン", ko:"청록색", ru:"Циан", hi:"नीलाभ", tr:"Camgöbeği", nl:"Cyaan", pl:"Cyjan", sv:"Cyan" },
      { en:"NAVY", es:"Marino", fr:"Marine", ar:"أزرق داكن", pt:"Marinho", de:"Marineblau", it:"Blu navy", zh:"海军蓝", ja:"ネイビー", ko:"남색", ru:"Тёмно-синий", hi:"गहरा नीला", tr:"Lacivert", nl:"Marineblauw", pl:"Granatowy", sv:"Mörkblå" },
      { en:"BLACK", es:"Negro", fr:"Noir", ar:"أسود", pt:"Preto", de:"Schwarz", it:"Nero", zh:"黑色", ja:"くろ", ko:"검은색", ru:"Чёрный", hi:"काला", tr:"Siyah", nl:"Zwart", pl:"Czarny", sv:"Svart" },
      { en:"WHITE", es:"Blanco", fr:"Blanc", ar:"أبيض", pt:"Branco", de:"Weiß", it:"Bianco", zh:"白色", ja:"しろ", ko:"흰색", ru:"Белый", hi:"सफेद", tr:"Beyaz", nl:"Wit", pl:"Biały", sv:"Vit" },
      { en:"BROWN", es:"Marrón", fr:"Marron", ar:"بني", pt:"Marrom", de:"Braun", it:"Marrone", zh:"棕色", ja:"ちゃいろ", ko:"갈색", ru:"Коричневый", hi:"भूरा", tr:"Kahverengi", nl:"Bruin", pl:"Brązowy", sv:"Brun" },
      { en:"CORAL", es:"Coral", fr:"Corail", ar:"مرجاني", pt:"Coral", de:"Koralle", it:"Corallo", zh:"珊瑚色", ja:"コーラル", ko:"산호색", ru:"Коралловый", hi:"मूँगा", tr:"Mercan", nl:"Koraal", pl:"Koralowy", sv:"Korall" },
      { en:"IVORY", es:"Marfil", fr:"Ivoire", ar:"عاجي", pt:"Marfim", de:"Elfenbein", it:"Avorio", zh:"象牙色", ja:"アイボリー", ko:"아이보리", ru:"Слоновая кость", hi:"हाथीदाँत", tr:"Fildişi", nl:"Ivoor", pl:"Kość słoniowa", sv:"Elfenben" },
      { en:"LILAC", es:"Lila", fr:"Lilas", ar:"ليلكي", pt:"Lilás", de:"Lila", it:"Lilla", zh:"淡紫色", ja:"ライラック", ko:"라일락", ru:"Сиреневый", hi:"बकाइन", tr:"Leylak", nl:"Lila", pl:"Liliowy", sv:"Lila" },
      { en:"OLIVE", es:"Oliva", fr:"Olive", ar:"زيتوني", pt:"Oliva", de:"Olivgrün", it:"Oliva", zh:"橄榄色", ja:"オリーブ", ko:"올리브색", ru:"Оливковый", hi:"जैतून", tr:"Zeytin yeşili", nl:"Olijf", pl:"Oliwkowy", sv:"Oliv" },
      { en:"AMBER", es:"Ámbar", fr:"Ambre", ar:"كهرماني", pt:"Âmbar", de:"Bernstein", it:"Ambra", zh:"琥珀色", ja:"アンバー", ko:"호박색", ru:"Янтарный", hi:"अम्बर", tr:"Kehribar", nl:"Amber", pl:"Bursztynowy", sv:"Bärnsten" },
      { en:"CREAM", es:"Crema", fr:"Crème", ar:"كريمي", pt:"Creme", de:"Cremefarben", it:"Crema", zh:"奶油色", ja:"クリーム", ko:"크림색", ru:"Кремовый", hi:"मलाई", tr:"Krem", nl:"Crème", pl:"Kremowy", sv:"Grädde" },
      { en:"TEAL", es:"Verde azul", fr:"Sarcelle", ar:"أزرق مخضر", pt:"Azul-petróleo", de:"Blaugrün", it:"Verde acqua", zh:"水鸭色", ja:"ティール", ko:"청록", ru:"Бирюзовый", hi:"हरे-नीले", tr:"Teal", nl:"Blauwgroen", pl:"Morski", sv:"Blågrön" },
      { en:"LIME", es:"Lima", fr:"Citron vert", ar:"ليموني", pt:"Lima", de:"Limette", it:"Lime", zh:"黄绿色", ja:"ライム", ko:"라임색", ru:"Лаймовый", hi:"नींबू हरा", tr:"Limon yeşili", nl:"Limoen", pl:"Limonka", sv:"Lime" },
      { en:"ROSE", es:"Rosa oscuro", fr:"Rose vif", ar:"وردي داكن", pt:"Rosê", de:"Rosenrot", it:"Rosa vivo", zh:"玫瑰色", ja:"ばら色", ko:"장밋빛", ru:"Розовый", hi:"गुलाब", tr:"Gül rengi", nl:"Donkerroze", pl:"Różany", sv:"Rosröd" }
    ]
  },
  {
    name: "Fruits", emoji:"1f34e",
    words: [
      { en:"APPLE", es:"Manzana", fr:"Pomme", ar:"تفاحة", pt:"Maçã", de:"Apfel", it:"Mela", zh:"苹果", ja:"りんご", ko:"사과", ru:"Яблоко", hi:"सेब", tr:"Elma", nl:"Appel", pl:"Jabłko", sv:"Äpple" },
      { en:"MANGO", es:"Mango", fr:"Mangue", ar:"مانجو", pt:"Manga", de:"Mango", it:"Mango", zh:"芒果", ja:"マンゴー", ko:"망고", ru:"Манго", hi:"आम", tr:"Mango", nl:"Mango", pl:"Mango", sv:"Mango" },
      { en:"GRAPE", es:"Uva", fr:"Raisin", ar:"عنب", pt:"Uva", de:"Traube", it:"Uva", zh:"葡萄", ja:"ぶどう", ko:"포도", ru:"Виноград", hi:"अंगूर", tr:"Üzüm", nl:"Druif", pl:"Winogrono", sv:"Druva" },
      { en:"LEMON", es:"Limón", fr:"Citron", ar:"ليمون", pt:"Limão", de:"Zitrone", it:"Limone", zh:"柠檬", ja:"レモン", ko:"레몬", ru:"Лимон", hi:"नींबू", tr:"Limon", nl:"Citroen", pl:"Cytryna", sv:"Citron" },
      { en:"PEACH", es:"Melocotón", fr:"Pêche", ar:"خوخ", pt:"Pêssego", de:"Pfirsich", it:"Pesca", zh:"桃子", ja:"もも", ko:"복숭아", ru:"Персик", hi:"आड़ू", tr:"Şeftali", nl:"Perzik", pl:"Brzoskwinia", sv:"Persika" },
      { en:"PEAR", es:"Pera", fr:"Poire", ar:"كمثرى", pt:"Pêra", de:"Birne", it:"Pera", zh:"梨", ja:"なし", ko:"배", ru:"Груша", hi:"नाशपाती", tr:"Armut", nl:"Peer", pl:"Gruszka", sv:"Päron" },
      { en:"PLUM", es:"Ciruela", fr:"Prune", ar:"برقوق", pt:"Ameixa", de:"Pflaume", it:"Prugna", zh:"李子", ja:"すもも", ko:"자두", ru:"Слива", hi:"बेر", tr:"Erik", nl:"Pruim", pl:"Śliwka", sv:"Plommon" },
      { en:"LIME", es:"Lima", fr:"Citron vert", ar:"ليم", pt:"Lima", de:"Limette", it:"Lime", zh:"青柠", ja:"ライム", ko:"라임", ru:"Лайм", hi:"नीम्बू", tr:"Misket limonu", nl:"Limoen", pl:"Limonka", sv:"Lime" },
      { en:"KIWI", es:"Kiwi", fr:"Kiwi", ar:"كيوي", pt:"Kiwi", de:"Kiwi", it:"Kiwi", zh:"猕猴桃", ja:"キウイ", ko:"키위", ru:"Киви", hi:"कीवी", tr:"Kivi", nl:"Kiwi", pl:"Kiwi", sv:"Kiwi" },
      { en:"MELON", es:"Melón", fr:"Melon", ar:"بطيخ", pt:"Melão", de:"Melone", it:"Melone", zh:"甜瓜", ja:"メロン", ko:"멜론", ru:"Дыня", hi:"खरबूजा", tr:"Kavun", nl:"Meloen", pl:"Melon", sv:"Melon" },
      { en:"CHERRY", es:"Cereza", fr:"Cerise", ar:"كرز", pt:"Cereja", de:"Kirsche", it:"Ciliegia", zh:"樱桃", ja:"さくらんぼ", ko:"체리", ru:"Вишня", hi:"चेरी", tr:"Kiraz", nl:"Kers", pl:"Wiśnia", sv:"Körsbär" },
      { en:"PAPAYA", es:"Papaya", fr:"Papaye", ar:"بابايا", pt:"Mamão", de:"Papaya", it:"Papaia", zh:"木瓜", ja:"パパイヤ", ko:"파파야", ru:"Папайя", hi:"पपीता", tr:"Papaya", nl:"Papaja", pl:"Papaja", sv:"Papaya" },
      { en:"COCONUT", es:"Coco", fr:"Noix de coco", ar:"جوز الهند", pt:"Coco", de:"Kokosnuss", it:"Cocco", zh:"椰子", ja:"ココナツ", ko:"코코넛", ru:"Кокос", hi:"नारियल", tr:"Hindistan cevizi", nl:"Kokosnoot", pl:"Kokos", sv:"Kokosnöt" },
      { en:"BANANA", es:"Plátano", fr:"Banane", ar:"موزة", pt:"Banana", de:"Banane", it:"Banana", zh:"香蕉", ja:"バナナ", ko:"바나나", ru:"Банан", hi:"केला", tr:"Muz", nl:"Banaan", pl:"Banan", sv:"Banan" },
      { en:"ORANGE", es:"Naranja", fr:"Orange", ar:"برتقال", pt:"Laranja", de:"Orange", it:"Arancia", zh:"橙子", ja:"オレンジ", ko:"오렌지", ru:"Апельсин", hi:"संतरा", tr:"Portakal", nl:"Sinaasappel", pl:"Pomarańcza", sv:"Apelsin" },
      { en:"MELON", es:"Sandía", fr:"Pastèque", ar:"بطيخ أحمر", pt:"Melancia", de:"Wassermelone", it:"Anguria", zh:"西瓜", ja:"すいか", ko:"수박", ru:"Арбуз", hi:"तरबूज़", tr:"Karpuz", nl:"Watermeloen", pl:"Arbuz", sv:"Vattenmelon" },
      { en:"APRICOT", es:"Albaricoque", fr:"Abricot", ar:"مشمش", pt:"Damasco", de:"Aprikose", it:"Albicocca", zh:"杏子", ja:"あんず", ko:"살구", ru:"Абрикос", hi:"खुबानी", tr:"Kayısı", nl:"Abrikoos", pl:"Morela", sv:"Apricot" },
      { en:"FIG", es:"Higo", fr:"Figue", ar:"تين", pt:"Figo", de:"Feige", it:"Fico", zh:"无花果", ja:"いちじく", ko:"무화과", ru:"Инжир", hi:"अंजीर", tr:"İncir", nl:"Vijg", pl:"Figa", sv:"Fikon" }
    ]
  },
  {
    name: "Food", emoji:"1f35c",
    words: [
      { en:"SOUP", es:"Sopa", fr:"Soupe", ar:"حساء", pt:"Sopa", de:"Suppe", it:"Zuppa", zh:"汤", ja:"スープ", ko:"수프", ru:"Суп", hi:"सूप", tr:"Çorba", nl:"Soep", pl:"Zupa", sv:"Soppa" },
      { en:"RICE", es:"Arroz", fr:"Riz", ar:"أرز", pt:"Arroz", de:"Reis", it:"Riso", zh:"米饭", ja:"ごはん", ko:"밥", ru:"Рис", hi:"चावल", tr:"Pirinç", nl:"Rijst", pl:"Ryż", sv:"Ris" },
      { en:"BREAD", es:"Pan", fr:"Pain", ar:"خبز", pt:"Pão", de:"Brot", it:"Pane", zh:"面包", ja:"パン", ko:"빵", ru:"Хлеб", hi:"रोटी", tr:"Ekmek", nl:"Brood", pl:"Chleb", sv:"Bröd" },
      { en:"PIZZA", es:"Pizza", fr:"Pizza", ar:"بيتزا", pt:"Pizza", de:"Pizza", it:"Pizza", zh:"披萨", ja:"ピザ", ko:"피자", ru:"Пицца", hi:"पिज़्ज़ा", tr:"Pizza", nl:"Pizza", pl:"Pizza", sv:"Pizza" },
      { en:"PASTA", es:"Pasta", fr:"Pâtes", ar:"معكرونة", pt:"Macarrão", de:"Nudeln", it:"Pasta", zh:"意面", ja:"パスタ", ko:"파스타", ru:"Паста", hi:"पास्ता", tr:"Makarna", nl:"Pasta", pl:"Makaron", sv:"Pasta" },
      { en:"CAKE", es:"Pastel", fr:"Gâteau", ar:"كعكة", pt:"Bolo", de:"Kuchen", it:"Torta", zh:"蛋糕", ja:"ケーキ", ko:"케이크", ru:"Торт", hi:"केक", tr:"Pasta", nl:"Taart", pl:"Ciasto", sv:"Tårta" },
      { en:"MILK", es:"Leche", fr:"Lait", ar:"حليب", pt:"Leite", de:"Milch", it:"Latte", zh:"牛奶", ja:"ぎゅうにゅう", ko:"우유", ru:"Молоко", hi:"दूध", tr:"Süt", nl:"Melk", pl:"Mleko", sv:"Mjölk" },
      { en:"JUICE", es:"Jugo", fr:"Jus", ar:"عصير", pt:"Suco", de:"Saft", it:"Succo", zh:"果汁", ja:"ジュース", ko:"주스", ru:"Сок", hi:"जूस", tr:"Meyve suyu", nl:"Sap", pl:"Sok", sv:"Juice" },
      { en:"SALAD", es:"Ensalada", fr:"Salade", ar:"سلطة", pt:"Salada", de:"Salat", it:"Insalata", zh:"沙拉", ja:"サラダ", ko:"샐러드", ru:"Салат", hi:"सलाद", tr:"Salata", nl:"Salade", pl:"Sałatka", sv:"Sallad" },
      { en:"CHEESE", es:"Queso", fr:"Fromage", ar:"جبن", pt:"Queijo", de:"Käse", it:"Formaggio", zh:"奶酪", ja:"チーズ", ko:"치즈", ru:"Сыр", hi:"पनीर", tr:"Peynir", nl:"Kaas", pl:"Ser", sv:"Ost" },
      { en:"BUTTER", es:"Mantequilla", fr:"Beurre", ar:"زبدة", pt:"Manteiga", de:"Butter", it:"Burro", zh:"黄油", ja:"バター", ko:"버터", ru:"Масло", hi:"मक्खन", tr:"Tereyağı", nl:"Boter", pl:"Masło", sv:"Smör" },
      { en:"SUGAR", es:"Azúcar", fr:"Sucre", ar:"سكر", pt:"Açúcar", de:"Zucker", it:"Zucchero", zh:"糖", ja:"さとう", ko:"설탕", ru:"Сахар", hi:"चीनी", tr:"Şeker", nl:"Suiker", pl:"Cukier", sv:"Socker" },
      { en:"HONEY", es:"Miel", fr:"Miel", ar:"عسل", pt:"Mel", de:"Honig", it:"Miele", zh:"蜂蜜", ja:"はちみつ", ko:"꿀", ru:"Мёд", hi:"शहद", tr:"Bal", nl:"Honing", pl:"Miód", sv:"Honung" },
      { en:"EGG", es:"Huevo", fr:"Œuf", ar:"بيضة", pt:"Ovo", de:"Ei", it:"Uovo", zh:"鸡蛋", ja:"たまご", ko:"달걀", ru:"Яйцо", hi:"अंडा", tr:"Yumurta", nl:"Ei", pl:"Jajko", sv:"Ägg" },
      { en:"STEAK", es:"Filete", fr:"Steak", ar:"شريحة لحم", pt:"Bife", de:"Steak", it:"Bistecca", zh:"牛排", ja:"ステーキ", ko:"스테이크", ru:"Стейк", hi:"स्टेक", tr:"Biftek", nl:"Biefstuk", pl:"Stek", sv:"Biff" }
    ]
  },
  {
    name: "Home", emoji:"1f3e0",
    words: [
      { en:"DOOR", es:"Puerta", fr:"Porte", ar:"باب", pt:"Porta", de:"Tür", it:"Porta", zh:"门", ja:"ドア", ko:"문", ru:"Дверь", hi:"दरवाजा", tr:"Kapı", nl:"Deur", pl:"Drzwi", sv:"Dörr" },
      { en:"ROOF", es:"Techo", fr:"Toit", ar:"سقف", pt:"Telhado", de:"Dach", it:"Tetto", zh:"屋顶", ja:"やね", ko:"지붕", ru:"Крыша", hi:"छत", tr:"Çatı", nl:"Dak", pl:"Dach", sv:"Tak" },
      { en:"WALL", es:"Pared", fr:"Mur", ar:"جدار", pt:"Parede", de:"Wand", it:"Muro", zh:"墙", ja:"かべ", ko:"벽", ru:"Стена", hi:"दीवार", tr:"Duvar", nl:"Muur", pl:"Ściana", sv:"Vägg" },
      { en:"FLOOR", es:"Suelo", fr:"Sol", ar:"أرضية", pt:"Chão", de:"Boden", it:"Pavimento", zh:"地板", ja:"ゆか", ko:"바닥", ru:"Пол", hi:"फर्श", tr:"Zemin", nl:"Vloer", pl:"Podłoga", sv:"Golv" },
      { en:"CHAIR", es:"Silla", fr:"Chaise", ar:"كرسي", pt:"Cadeira", de:"Stuhl", it:"Sedia", zh:"椅子", ja:"いす", ko:"의자", ru:"Стул", hi:"कुर्सी", tr:"Sandalye", nl:"Stoel", pl:"Krzesło", sv:"Stol" },
      { en:"TABLE", es:"Mesa", fr:"Table", ar:"طاولة", pt:"Mesa", de:"Tisch", it:"Tavolo", zh:"桌子", ja:"テーブル", ko:"탁자", ru:"Стол", hi:"मेज़", tr:"Masa", nl:"Tafel", pl:"Stół", sv:"Bord" },
      { en:"LAMP", es:"Lámpara", fr:"Lampe", ar:"مصباح", pt:"Lâmpada", de:"Lampe", it:"Lampada", zh:"灯", ja:"ランプ", ko:"램프", ru:"Лампа", hi:"दीपक", tr:"Lamba", nl:"Lamp", pl:"Lampa", sv:"Lampa" },
      { en:"SOFA", es:"Sofá", fr:"Canapé", ar:"أريكة", pt:"Sofá", de:"Sofa", it:"Divano", zh:"沙发", ja:"ソファ", ko:"소파", ru:"Диван", hi:"सोफ़ा", tr:"Kanepe", nl:"Bank", pl:"Sofa", sv:"Soffa" },
      { en:"BED", es:"Cama", fr:"Lit", ar:"سرير", pt:"Cama", de:"Bett", it:"Letto", zh:"床", ja:"ベッド", ko:"침대", ru:"Кровать", hi:"बिस्तर", tr:"Yatak", nl:"Bed", pl:"Łóżko", sv:"Säng" },
      { en:"CLOCK", es:"Reloj", fr:"Horloge", ar:"ساعة حائط", pt:"Relógio", de:"Uhr", it:"Orologio", zh:"时钟", ja:"とけい", ko:"시계", ru:"Часы", hi:"घड़ी", tr:"Saat", nl:"Klok", pl:"Zegar", sv:"Klocka" },
      { en:"MIRROR", es:"Espejo", fr:"Miroir", ar:"مرآة", pt:"Espejo", de:"Spiegel", it:"Specchio", zh:"镜子", ja:"かがみ", ko:"거울", ru:"Зеркало", hi:"दर्पण", tr:"Ayna", nl:"Spiegel", pl:"Lustro", sv:"Spegel" },
      { en:"WINDOW", es:"Ventana", fr:"Fenêtre", ar:"نافذة", pt:"Janela", de:"Fenster", it:"Finestra", zh:"窗户", ja:"まど", ko:"창문", ru:"Окно", hi:"खिड़की", tr:"Pencere", nl:"Raam", pl:"Okno", sv:"Fönster" },
      { en:"BOOK", es:"Libro", fr:"Livre", ar:"كتاب", pt:"Livro", de:"Buch", it:"Libro", zh:"书", ja:"ほん", ko:"책", ru:"Книга", hi:"किताब", tr:"Kitap", nl:"Boek", pl:"Książka", sv:"Bok" },
      { en:"PILLOW", es:"Almohada", fr:"Oreiller", ar:"وسادة", pt:"Travesseiro", de:"Kissen", it:"Cuscino", zh:"枕头", ja:"まくら", ko:"배개", ru:"Подушка", hi:"तकिया", tr:"Yastık", nl:"Kussen", pl:"Poduszka", sv:"Kudde" }
    ]
  },
  {
    name: "Nature", emoji:"1f33f",
    words: [
      { en:"TREE", es:"Árbol", fr:"Arbre", ar:"شجرة", pt:"Árvore", de:"Baum", it:"Albero", zh:"树", ja:"き", ko:"나무", ru:"Дерево", hi:"पेड़", tr:"Ağaç", nl:"Boom", pl:"Drzewo", sv:"Träd" },
      { en:"LEAF", es:"Hoja", fr:"Feuille", ar:"ورقة", pt:"Folha", de:"Blatt", it:"Foglia", zh:"叶子", ja:"は", ko:"잎", ru:"Лист", hi:"पत्ती", tr:"Yaprak", nl:"Blad", pl:"Liść", sv:"Löv" },
      { en:"RIVER", es:"Río", fr:"Rivière", ar:"نهر", pt:"Rio", de:"Fluss", it:"Fiume", zh:"河流", ja:"かわ", ko:"강", ru:"Река", hi:"नदी", tr:"Nehir", nl:"Rivier", pl:"Rzeka", sv:"Flod" },
      { en:"OCEAN", es:"Océano", fr:"Océan", ar:"محيط", pt:"Oceano", de:"Ozean", it:"Oceano", zh:"海洋", ja:"うみ", ko:"바ada", ru:"Океан", hi:"महासागर", tr:"Okyanus", nl:"Oceaan", pl:"Ocean", sv:"Hav" },
      { en:"CLOUD", es:"Nube", fr:"Nuage", ar:"سحابة", pt:"Nuvem", de:"Wolke", it:"Nuvola", zh:"云", ja:"くも", ko:"구름", ru:"Облако", hi:"बादल", tr:"Bulut", nl:"Wolk", pl:"Chmura", sv:"Moln" },
      { en:"RAIN", es:"Lluvia", fr:"Pluie", ar:"مطر", pt:"Chuva", de:"Regen", it:"Pioggia", zh:"雨", ja:"あめ", ko:"비", ru:"Дождь", hi:"बारिश", tr:"Yağmur", nl:"Regen", pl:"Deszcz", sv:"Regn" },
      { en:"SNOW", es:"Nieve", fr:"Neige", ar:"ثلج", pt:"Neve", de:"Schnee", it:"Neve", zh:"雪", ja:"ゆき", ko:"눈", ru:"Снеговик", hi:"बर्फ", tr:"Kar", nl:"Sneeuw", pl:"Śnieg", sv:"Snö" },
      { en:"WIND", es:"Viento", fr:"Vent", ar:"ريح", pt:"Vento", de:"Wind", it:"Vento", zh:"风", ja:"かぜ", ko:"바람", ru:"Ветер", hi:"हवा", tr:"Rüzgar", nl:"Wind", pl:"Wiatr", sv:"Vind" },
      { en:"STONE", es:"Piedra", fr:"Pierre", ar:"حجر", pt:"Pedra", de:"Stein", it:"Pietra", zh:"石头", ja:"いし", ko:"돌", ru:"Камень", hi:"पत्थर", tr:"Taş", nl:"Steen", pl:"Kamień", sv:"Sten" },
      { en:"SAND", es:"Arena", fr:"Sable", ar:"رمل", pt:"Areia", de:"Sand", it:"Sabbia", zh:"沙子", ja:"すな", ko:"모래", ru:"Песок", hi:"रेत", tr:"Kum", nl:"Zand", pl:"Piasek", sv:"Sand" },
      { en:"MOON", es:"Luna", fr:"Lune", ar:"قمر", pt:"Lua", de:"Mond", it:"Luna", zh:"月亮", ja:"つき", ko:"달", ru:"Луна", hi:"चाँद", tr:"Ay", nl:"Maan", pl:"Księżyc", sv:"Måne" },
      { en:"STAR", es:"Estrella", fr:"Étoile", ar:"نجمة", pt:"Estrela", de:"Stern", it:"Stella", zh:"星星", ja:"ほし", ko:"별", ru:"Звезда", hi:"तारा", tr:"Yıldız", nl:"Ster", pl:"Gwiazda", sv:"Stjärna" },
      { en:"SUN", es:"Sol", fr:"Soleil", ar:"شمس", pt:"Sol", de:"Sonne", it:"Sole", zh:"太阳", ja:"たいよう", ko:"태양", ru:"Солнце", hi:"सूरज", tr:"Güneş", nl:"Zon", pl:"Słońce", sv:"Sol" },
      { en:"FIRE", es:"Fuego", fr:"Feu", ar:"نار", pt:"Fogo", de:"Feuer", it:"Fuoco", zh:"火", ja:"ひ", ko:"불", ru:"Огонь", hi:"आग", tr:"Ateş", nl:"Vuur", pl:"Ogień", sv:"Eld" }
    ]
  }
];

// Creamos los alias para compatibilidad
export const ANIMALS = PACKS.find(p => p.name === "Animals")?.words || [];
export const COLORS  = PACKS.find(p => p.name === "Colors")?.words || [];
export const FRUITS  = PACKS.find(p => p.name === "Fruits")?.words || [];