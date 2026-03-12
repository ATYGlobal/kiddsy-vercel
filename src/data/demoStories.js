/**
 * src/data/demoStories.js — Kiddsy
 * ─────────────────────────────────────────────────────────────────────────
 * Cuentos de muestra precargados (no requieren API).
 * Las imágenes van en:  public/stories/<story-id>/
 *
 * Para añadir un cuento nuevo:
 *  1. Añade un objeto al array DEMO_STORIES
 *  2. Pon las imágenes en public/stories/<id>/  (page_1.png, page_2.png…)
 *  3. Referencia cada imagen con  dalle_url: "/stories/<id>/page_N.png"
 * ─────────────────────────────────────────────────────────────────────────
 */

export const DEMO_STORIES = [
  // ══════════════════════════════════════════════════════════════════════
  // 1. Mia and the Musical Forest
  // ══════════════════════════════════════════════════════════════════════
  {
    id:    "demo-mia-forest",
    title: "Mia and the Musical Forest",
    emoji: "🌳",
    color: "from-green-400 to-emerald-300",
    accentColor: "#2E7D32",

    // Cover image shown on the book card shelf
    // → place file at: public/stories/mia/cover.png
    coverImage: "/stories/mia/cover.png",

    pages: [
      // ── Page 1 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/mia/page_2.png",   // Mia_2 → silent forest
        en: "Mia lived near a forest with purple trees. She loved to hear the trees talk. It was a very magical and quiet place.",
        es: "Mia vivía cerca de un bosque con árboles morados. Le encantaba escuchar a los árboles hablar. Era un lugar muy mágico y tranquilo.",
        fr: "Mia vivait près d'une forêt aux arbres violets. Elle adorait entendre les arbres parler. C'était un endroit très magique et calme.",
        ar: "عاشت ميا بالقرب من غابة بها أشجار أرجوانية. كانت تحب سماع الأشجار تتحدث. كان مكانًا سحريًا وهادئًا للغاية.",
        pt: "Mia morava perto de uma floresta com árvores roxas. Ela adorava ouvir as árvores falarem. Era um lugar muito mágico e tranquilo.",
        de: "Mia lebte in der Nähe eines Waldes mit lila Bäumen. Sie liebte es, den Bäumen beim Reden zuzuhören. Es war ein sehr magischer und ruhiger Ort.",
        it: "Mia viveva vicino a una foresta con alberi viola. Amava sentire gli alberi parlare. Era un posto molto magico e tranquillo.",
        zh: "米娅住在附近有紫色树木的森林里。她喜欢听树木说话。这是一个非常神奇而安静的地方。",
        ja: "ミアは紫色の木々がある森の近くに住んでいました。彼女は木々が話すのを聞くのが大好きでした。とても魔法のような静かな場所でした。",
        ko: "미아는 보라색 나무들이 있는 숲 근처에 살았습니다. 그녀는 나무들이 말하는 것을 듣는 것을 좋아했습니다. 아주 마법 같고 조용한 곳이었습니다.",
        ru: "Мия жила рядом с лесом, где росли фиолетовые деревья. Ей нравилось слушать, как деревья разговаривают. Это было очень волшебное и тихое место.",
        hi: "मिया बैंगनी पेड़ों वाले जंगल के पास रहती थी। उसे पेड़ों को बात करते सुनना बहुत पसंद था। यह बहुत जादुई और शांत जगह थी।",
        tr: "Mia mor ağaçları olan bir ormanın yakınında yaşıyordu. Ağaçların konuşmasını duymayı çok severdi. Burası çok büyülü ve sessiz bir yerdi.",
        nl: "Mia woonde vlakbij een bos met paarse bomen. Ze hield ervan om de bomen te horen praten. Het was een heel magische en stille plek.",
        pl: "Mia mieszkała niedaleko lasu z fioletowymi drzewami. Uwielbiała słuchać, jak drzewa rozmawiają. To było bardzo magiczne i ciche miejsce.",
        sv: "Mia bodde nära en skog med lila träd. Hon älskade att höra träden prata. Det var en mycket magisk och tyst plats.",
      },
      // ── Page 2 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/mia/page_2.png",   // Mia_2 → Mia notices silence
        en: "One morning, the forest was too silent. The birds were not singing. The wind was not whistling through the tall, green leaves today.",
        es: "Una mañana, el bosque estaba demasiado silencioso. Los pájaros no cantaban. El viento no silbaba entre las hojas verdes y altas hoy.",
        fr: "Un matin, la forêt était trop silencieuse. Les oiseaux ne chantaient pas. Le vent ne sifflait pas à travers les hautes feuilles vertes aujourd'hui.",
        ar: "في صباح أحد الأيام، كانت الغابة صامتة للغاية. لم تكن الطيور تغرد. لم يكن الريح يصفر عبر الأوراق الخضراء الطويلة اليوم.",
        pt: "Certa manhã, a floresta estava muito silenciosa. Os pássaros não cantavam. O vento não assobiava através das folhas verdes e altas hoje.",
        de: "Eines Morgens war der Wald zu still. Die Vögel sangen nicht. Der Wind pfiff heute nicht durch die hohen, grünen Blätter.",
        it: "Una mattina, la foresta era troppo silenziosa. Gli uccelli non cantavano. Il vento non fischiava tra le alte foglie verdi oggi.",
        zh: "一天早上，森林太安静了。鸟儿不在歌唱。风今天没有吹过高高的绿叶。",
        ja: "ある朝、森はとても静かでした。鳥は歌っていませんでした。風は今日、高い緑の葉を通り抜けて口笛を吹いていませんでした。",
        ko: "어느 날 아침, 숲은 너무 조용했습니다. 새들은 노래하지 않았습니다. 바람은 오늘 키 큰 푸른 나뭇잎 사이로 휘파람을 불지 않았습니다.",
        ru: "Однажды утром лес был слишком тихим. Птицы не пели. Ветер не свистел сквозь высокие зеленые листья сегодня.",
        hi: "एक सुबह, जंगल बहुत शांत था। पक्षी नहीं गा रहे थे। हवा आज ऊंची हरी पत्तियों के बीच से सीटी नहीं बजा रही थी।",
        tr: "Bir sabah, orman çok sessizdi. Kuşlar şarkı söylemiyordu. Rüzgar bugün uzun, yeşil yaprakların arasından ıslık çalmıyordu.",
        nl: "Op een ochtend was het bos te stil. De vogels zongen niet. De wind floot vandaag niet door de hoge, groene bladeren.",
        pl: "Pewnego ranka las był zbyt cichy. Ptaki nie śpiewały. Wiatr nie gwizdał dzisiaj przez wysokie, zielone liście.",
        sv: "En morgon var skogen för tyst. Fåglarna sjöng inte. Vinden visslade inte genom de höga, gröna löven idag.",
      },
      // ── Page 3 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/mia/page_3.png",   // Mia_3 → Mia plays flute
        en: "Mia felt a little bit scared. But she took her small wooden flute. She wanted to find the missing music for her friends.",
        es: "Mia se sintió un poco asustada. Pero tomó su pequeña flauta de madera. Quería encontrar la música perdida para sus amigos.",
        fr: "Mia se sentit un peu effrayée. Mais elle prit sa petite flûte en bois. Elle voulait retrouver la musique manquante pour ses amis.",
        ar: "شعرت ميا بالخوف قليلاً. لكنها أخذت فلوتها الخشبية الصغيرة. أرادت العثور على الموسيقى المفقودة لأصدقائها.",
        pt: "Mia sentiu um pouco de medo. Mas ela pegou sua pequena flauta de madeira. Ela queria encontrar a música perdida para seus amigos.",
        de: "Mia hatte ein wenig Angst. Aber sie nahm ihre kleine Holzflöte. Sie wollte die fehlende Musik für ihre Freunde finden.",
        it: "Mia si sentì un po' spaventata. Ma prese il suo piccolo flauto di legno. Voleva trovare la musica mancante per i suoi amici.",
        zh: "米娅感到有点害怕。但她拿起了她的小木笛。她想为她的朋友们找到丢失的音乐。",
        ja: "ミアは少し怖くなりました。しかし、彼女は小さな木製の笛を取りました。彼女は友達のために失われた音楽を見つけたかったのです。",
        ko: "미아는 조금 무서웠습니다. 하지만 그녀는 작은 나무 피리를 집었습니다. 그녀는 친구들을 위해 사라진 음악을 찾고 싶었습니다.",
        ru: "Мия немного испугалась. Но она взяла свою маленькую деревянную флейту. Она хотела найти пропавшую музыку для своих друзей.",
        hi: "मिया को थोड़ा डर लगा। लेकिन उसने अपनी छोटी लकड़ी की बांसुरी ले ली। वह अपने दोस्तों के लिए खोया हुआ संगीत ढूंढना चाहती थी।",
        tr: "Mia biraz korktu. Ama küçük tahta flütünü aldı. Arkadaşları için kayıp müziği bulmak istedi.",
        nl: "Mia was een beetje bang. Maar ze pakte haar kleine houten fluit. Ze wilde de ontbrekende muziek voor haar vrienden vinden.",
        pl: "Mia poczuła się trochę przestraszona. Ale wzięła swój mały drewniany flet. Chciała znaleźć brakującą muzykę dla swoich przyjaciół.",
        sv: "Mia kände sig lite rädd. Men hon tog sin lilla träflöjt. Hon ville hitta den försvunna musiken för sina vänner.",
      },
      // ── Page 4 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/mia/page_4.png",   // Mia_4 → walking through forest
        en: "She walked deep into the thick woods. She found a giant frog by a pond. The frog looked very grumpy and very sleepy.",
        es: "Caminó profundo en el espeso bosque. Encontró una rana gigante junto a un estanque. La rana se veía muy gruñona y somnolienta.",
        fr: "Elle marcha profondément dans les bois épais. Elle trouva une grenouille géante près d'un étang. La grenouille avait l'air très grognon et très endormie.",
        ar: "سارت عميقًا في الغابة الكثيفة. وجدت ضفدعًا عملاقًا بجانب بركة. بدا الضفدع غاضبًا جدًا ونعسانًا جدًا.",
        pt: "Ela caminhou para dentro da floresta densa. Ela encontrou um sapo gigante perto de um lago. O sapo parecia muito rabugento e muito sonolento.",
        de: "Sie ging tief in den dichten Wald. Sie fand einen riesigen Frosch an einem Teich. Der Frosch sah sehr mürrisch und sehr schläfrig aus.",
        it: "Camminò nel folto del bosco. Trovò una rana gigante vicino a uno stagno. La rana sembrava molto scontrosa e molto assonnata.",
        zh: "她深入茂密的树林。她在池塘边发现了一只巨大的青蛙。青蛙看起来很暴躁，很困倦。",
        ja: "彼女は深い森の中へ歩いていきました。池のそばで巨大なカエルを見つけました。カエルはとても不機嫌で、とても眠そうでした。",
        ko: "그녀는 울창한 숲 속으로 깊이 걸어 들어갔습니다. 연못 옆에서 거대한 개구리를 발견했습니다. 개구리는 매우 심술궂고 매우 졸려 보였습니다.",
        ru: "Она пошла глубоко в густой лес. Она нашла гигантскую лягушку у пруда. Лягушка выглядела очень сердитой и очень сонной.",
        hi: "वह घने जंगल में गहरी चली गई। उसे एक तालाब के पास एक विशाल मेंढक मिला। मेंढक बहुत चिड़चिड़ा और बहुत नींद में लग रहा था।",
        tr: "Sık ormanın derinliklerine yürüdü. Bir göletin yanında dev bir kurbağa buldu. Kurbağa çok huysuz ve çok uykulu görünüyordu.",
        nl: "Ze liep diep het dichte bos in. Ze vond een gigantische kikker bij een vijver. De kikker zag er erg chagrijnig en erg slaperig uit.",
        pl: "Poszła głęboko w gęsty las. Znalazła gigantyczną żabę przy stawie. Żaba wyglądała na bardzo zrzędliwą i bardzo śpiącą.",
        sv: "Hon gick djupt in i den täta skogen. Hon hittade en jättegroda vid en damm. Grodan såg väldigt grinig och väldigt sömnig ut.",
      },
      // ── Page 5 ─────────────────────────────────────────────────────
      {
        en: "'The music is stuck in my throat,' the frog croaked. Mia played a soft, happy song. She danced on the soft green grass.",
        es: "—La música está atrapada en mi garganta —croó la rana. Mia tocó una canción suave y feliz. Bailó sobre la hierba verde y suave.",
        fr: "« La musique est coincée dans ma gorge », coassa la grenouille. Mia joua une chanson douce et joyeuse. Elle dansa sur l'herbe verte et tendre.",
        ar: "قال الضفدع بصوت أجش: 'الموسيقى عالقة في حلقي'. عزفت ميا لحنًا ناعمًا وسعيدًا. رقصت على العشب الأخضر الناعم.",
        pt: "'A música está presa na minha garganta', coaxou o sapo. Mia tocou uma música suave e feliz. Ela dançou na grama verde e macia.",
        de: "„Die Musik steckt in meinem Hals fest", quakte der Frosch. Mia spielte ein sanftes, fröhliches Lied. Sie tanzte auf dem weichen grünen Gras.",
        it: "'La musica è bloccata nella mia gola', gracchiò la rana. Mia suonò una canzone dolce e felice. Ballò sull'erba verde e morbida.",
        zh: "'音乐卡在我的喉咙里了，'青蛙呱呱地说。米娅演奏了一首轻柔快乐的歌曲。她在柔软的绿草地上跳舞。",
        ja: "「音楽が喉に詰まっているんだ」とカエルはしわがれ声で言いました。ミアは柔らかくて幸せな歌を演奏しました。彼女は柔らかい緑の草の上で踊りました。",
        ko: "'음악이 내 목에 갇혔어' 개구리가 울부짖었습니다. 미아는 부드럽고 행복한 노래를 연주했습니다. 그녀는 부드러운 푸른 풀밭에서 춤을 췄습니다.",
        ru: "«Музыка застряла у меня в горле», — прохрипела лягушка. Мия сыграла мягкую, счастливую песню. Она танцевала на мягкой зеленой траве.",
        hi: "'संगीत मेरे गले में फंस गया है,' मेंढक ने टर्राया। मिया ने एक मृदु, खुशनुमा गाना बजाया। वह मुलायम हरी घास पर नाची।",
        tr: "'Müzik boğazıma takıldı,' diye vırakladı kurbağa. Mia yumuşak, mutlu bir şarkı çaldı. Yumuşak yeşil çimenlerin üzerinde dans etti.",
        nl: "'De muziek zit vast in mijn keel,' kwaakte de kikker. Mia speelde een zacht, vrolijk liedje. Ze danste op het zachte groene gras.",
        pl: "'Muzyka utkwiła mi w gardle', zarechotała żaba. Mia zagrała łagodną, wesołą piosenkę. Tańczyła na miękkiej zielonej trawie.",
        sv: "'Musiken har fastnat i min hals', kväkade grodan. Mia spelade en mjuk, glad sång. Hon dansade på det mjuka gröna gräset.",
      },
      // ── Page 6 ─────────────────────────────────────────────────────
      {
        en: "The frog started to hum along. Soon, it let out a big, musical chirp. All the birds started to sing their pretty songs.",
        es: "La rana empezó a tararear. Pronto, soltó un gran chirrido musical. Todos los pájaros empezaron a cantar sus hermosas canciones.",
        fr: "La grenouille se mit à fredonner. Bientôt, elle émit un grand gazouillis musical. Tous les oiseaux se mirent à chanter leurs jolies chansons.",
        ar: "بدأ الضفدع في الهمهمة. وسرعان ما أطلق زقزقة موسيقية كبيرة. بدأت جميع الطيور في غناء أغانيها الجميلة.",
        pt: "O sapo começou a cantarolar. Logo, ele soltou um grande chilrear musical. Todos os pássaros começaram a cantar suas lindas canções.",
        de: "Der Frosch begann mitzusingen. Bald ließ er ein großes, musikalisches Zwitschern los. Alle Vögel begannen ihre schönen Lieder zu singen.",
        it: "La rana iniziò a canticchiare. Presto, emise un grande cinguettio musicale. Tutti gli uccelli iniziarono a cantare le loro belle canzoni.",
        zh: "青蛙开始哼唱。很快，它发出了一个巨大的音乐鸣叫声。所有的鸟儿开始唱它们美丽的歌曲。",
        ja: "カエルはハミングを始めました。すぐに、大きな音楽的なさえずりを放ちました。すべての鳥が美しい歌を歌い始めました。",
        ko: "개구리가 함께 흥얼거리기 시작했습니다. 곧, 그것은 크고 음악적인 지저귐을 터뜨렸습니다. 모든 새들이 그들의 아름다운 노래를 부르기 시작했습니다.",
        ru: "Лягушка начала напевать. Вскоре она издала громкий музыкальный щебет. Все птицы начали петь свои красивые песни.",
        hi: "मेंढक गुनगुनाने लगा। जल्द ही, उसने एक बड़ी, संगीतमय चहचहाहट की। सभी पक्षियों ने अपने सुंदर गीत गाना शुरू कर दिया।",
        tr: "Kurbağa mırıldanmaya başladı. Kısa süre sonra, büyük, müzikal bir cıvıltı çıkardı. Bütün kuşlar güzel şarkılarını söylemeye başladı.",
        nl: "De kikker begon mee te neuriën. Al snel liet hij een groot, muzikaal getjilp horen. Alle vogels begonnen hun mooie liedjes te zingen.",
        pl: "Żaba zaczęła nucić. Wkrótce wydała z siebie wielki, muzyczny ćwierk. Wszystkie ptaki zaczęły śpiewać swoje piękne piosenki.",
        sv: "Grodan började nynna med. Snart gav den ifrån sig ett stort, musikaliskt kvitter. Alla fåglar började sjunga sina vackra sånger.",
      },
      // ── Page 7 ─────────────────────────────────────────────────────
      {
        en: "The forest was full of joy again. The trees swayed and clapped. Mia felt like a brave hero in her colorful kingdom.",
        es: "El bosque se llenó de alegría otra vez. Los árboles se mecían y aplaudían. Mia se sintió como una heroína valiente en su reino colorido.",
        fr: "La forêt était à nouveau pleine de joie. Les arbres se balançaient et applaudissaient. Mia se sentait comme une héroïne courageuse dans son royaume coloré.",
        ar: "عادت الغابة مليئة بالفرح مرة أخرى. تمايلت الأشجار وصفقت. شعرت ميا وكأنها بطلة شجاعة في مملكتها الملونة.",
        pt: "A floresta estava cheia de alegria novamente. As árvores balançavam e batiam palmas. Mia se sentiu como uma heroína corajosa em seu reino colorido.",
        de: "Der Wald war wieder voller Freude. Die Bäume wiegten sich und klatschten. Mia fühlte sich wie eine mutige Heldin in ihrem farbenfrohen Königreich.",
        it: "La foresta era di nuovo piena di gioia. Gli alberi ondeggiavano e applaudivano. Mia si sentiva come un'eroina coraggiosa nel suo regno colorato.",
        zh: "森林又充满了欢乐。树木摇摆着，鼓掌着。米娅觉得自己像是一个勇敢的英雄，在她多彩的王国里。",
        ja: "森は再び喜びに満ちていました。木々は揺れ、拍手をしました。ミアは自分のカラフルな王国で勇敢なヒーローになったように感じました。",
        ko: "숲은 다시 기쁨으로 가득 찼습니다. 나무들은 흔들리며 박수를 쳤습니다. 미아는 자신의 다채로운 왕국에서 용감한 영웅이 된 기분이었습니다.",
        ru: "Лес снова был полон радости. Деревья качались и хлопали. Мия чувствовала себя храброй героиней в своем красочном королевстве.",
        hi: "जंगल फिर से खुशी से भर गया। पेड़ झूम रहे थे और तालियाँ बजा रहे थे। मिया को अपने रंगीन साम्राज्य में एक बहादुर नायिका जैसा महसूस हुआ।",
        tr: "Orman yeniden neşeyle doldu. Ağaçlar sallanıyor ve alkışlıyordu. Mia, rengarenk krallığında cesur bir kahraman gibi hissetti.",
        nl: "Het was weer vol vreugde in het bos. De bomen zwaaiden en klapten. Mia voelde zich een dappere heldin in haar kleurrijke koninkrijk.",
        pl: "Las znów był pełen radości. Drzewa kołysały się i klaskały. Mia poczuła się jak odważna bohaterka w swoim kolorowym królestwie.",
        sv: "Skogen var återigen full av glädje. Träden svajade och klappade. Mia kände sig som en modig hjälte i sitt färgglada kungarike.",
      },
      // ── Page 8 ─────────────────────────────────────────────────────
      {
        en: "Mia went home for dinner. Her heart was full of melodies. She knew her courage saved the music for everyone she loved.",
        es: "Mia fue a casa a cenar. Su corazón estaba lleno de melodías. Sabía que su valentía salvó la música para todos sus seres queridos.",
        fr: "Mia rentra chez elle pour dîner. Son cœur était plein de mélodies. Elle savait que son courage avait sauvé la musique pour tous ceux qu'elle aimait.",
        ar: "ذهبت ميا إلى المنزل لتناول العشاء. كان قلبها مليئًا بالألحان. عرفت أن شجاعتها أنقذت الموسيقى لكل من تحب.",
        pt: "Mia foi para casa jantar. Seu coração estava cheio de melodias. Ela sabia que sua coragem salvou a música para todos que amava.",
        de: "Mia ging nach Hause zum Abendessen. Ihr Herz war voller Melodien. Sie wusste, dass ihr Mut die Musik für alle, die sie liebte, gerettet hatte.",
        it: "Mia andò a casa per cena. Il suo cuore era pieno di melodie. Sapeva che il suo coraggio aveva salvato la musica per tutti coloro che amava.",
        zh: "米娅回家吃晚饭。她的心里充满了旋律。她知道她的勇气为她所爱的每个人拯救了音乐。",
        ja: "ミアは夕食のために家に帰りました。彼女の心はメロディーでいっぱいでした。彼女は自分の勇気が愛するすべての人のために音楽を救ったことを知っていました。",
        ko: "미아는 저녁 식사를 위해 집에 갔습니다. 그녀의 마음은 멜로디로 가득 찼습니다. 그녀는 자신의 용기가 사랑하는 모든 사람을 위해 음악을 구했다는 것을 알았습니다.",
        ru: "Мия пошла домой ужинать. Ее сердце было полно мелодий. Она знала, что ее храбрость спасла музыку для всех, кого она любила.",
        hi: "मिया रात के खाने के लिए घर गई। उसका दिल धुनों से भर गया था। वह जानती थी कि उसकी बहादुरी ने उसके सभी प्रियजनों के लिए संगीत बचा लिया था।",
        tr: "Mia akşam yemeği için eve gitti. Kalbi melodilerle doluydu. Cesaretinin, sevdiği herkes için müziği kurtardığını biliyordu.",
        nl: "Mia ging naar huis voor het avondeten. Haar hart was vol melodieën. Ze wist dat haar moed de muziek had gered voor iedereen van wie ze hield.",
        pl: "Mia poszła do domu na obiad. Jej serce było pełne melodii. Wiedziała, że jej odwaga ocaliła muzykę dla wszystkich, których kochała.",
        sv: "Mia gick hem för middag. Hennes hjärta var fullt av melodier. Hon visste att hennes mod räddade musiken för alla hon älskade.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // 2. Coming soon — placeholder (replace with real story data)
  // ══════════════════════════════════════════════════════════════════════
  // {
  //   id:          "demo-story-2",
  //   title:       "...",
  //   emoji:       "🦋",
  //   color:       "from-purple-400 to-pink-300",
  //   accentColor: "#7B1FA2",
  //   coverImage:  "/stories/story2/cover.png",
  //   pages: [ ... ],
  // },
];
