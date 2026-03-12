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
        dalle_url: "/stories/mia/page_1.png",   // Mia_2 → silent forest
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
        dalle_url: "/stories/mia/page_5.png",   
        en: "'The music is stuck in my throat,' the frog croaked. Mia played a soft, happy song. She danced on the soft green grass.",
        es: "—La música está atrapada en mi garganta —croó la rana. Mia tocó una canción suave y feliz. Bailó sobre la hierba verde y suave.",
        fr: "« La musique est coincée dans ma gorge », coassa la grenouille. Mia joua une chanson douce et joyeuse. Elle dansa sur l'herbe verte et tendre.",
        ar: "قال الضفدع بصوت أجش: 'الموسيقى عالقة في حلقي'. عزفت ميا لحنًا ناعمًا وسعيدًا. رقصت على العشب الأخضر الناعم.",
        pt: "'A música está presa na minha garganta', coaxou o sapo. Mia tocou uma música suave e feliz. Ela dançou na grama verde e macia.",
        de: "„Die Musik steckt in meinem Hals fest\", quakte der Frosch. Mia spielte ein sanftes, fröhliches Lied. Sie tanzte auf dem weichen grünen Gras.",
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
        dalle_url: "/stories/mia/page_6.png",
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
        dalle_url: "/stories/mia/page_7.png",
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
        dalle_url: "/stories/mia/page_8.png",
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
  // ══════════════════════════════════════════════════════════════════════
  // 2. Oliver and the Starry Feast
  // ══════════════════════════════════════════════════════════════════════
  {
    id:    "demo-oliver-space",
    title: "Oliver and the Starry Feast",
    emoji: "🚀",
    color: "from-blue-400 to-cyan-300",
    accentColor: "#1565C0",

    // Cover image — place at: public/stories/oliver/cover.png
    coverImage: "/stories/oliver/cover.png",

    pages: [
      // ── Page 1 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_1.png",   // TODO: add image
        en: "Oliver lived on a tiny, glowing planet made of sugar. He was the best cosmic baker in the whole universe. Every night, he made cookies.",
        es: "Oliver vivía en un planeta pequeño y brillante hecho de azúcar. Era el mejor panadero cósmico del universo. Cada noche, hacía galletas.",
        fr: "Oliver vivait sur une petite planète brillante faite de sucre. Il était le meilleur boulanger cosmique de l'univers. Chaque nuit, il faisait des biscuits.",
        ar: "عاش أوليفر على كوكب صغير ومضيء مصنوع من السكر. كان أفضل خباز كوني في الكون كله. كل ليلة، كان يصنع الكعك.",
        pt: "Oliver morava em um pequeno planeta brilhante feito de açúcar. Ele era o melhor padeiro cósmico de todo o universo. Toda noite, ele fazia biscoitos.",
        de: "Oliver lebte auf einem winzigen, leuchtenden Planeten aus Zucker. Er war der beste kosmische Bäcker im ganzen Universum. Jede Nacht backte er Kekse.",
        it: "Oliver viveva su un piccolo pianeta luminoso fatto di zucchero. Era il miglior panettiere cosmico dell'intero universo. Ogni notte faceva i biscotti.",
        zh: "奥利弗住在一个由糖做成的小小闪亮星球上。他是整个宇宙中最好的宇宙面包师。每天晚上，他都会做饼干。",
        ja: "オリバーは砂糖でできた小さな輝く星に住んでいました。彼は宇宙中で最高の宇宙パン職人でした。毎晩、彼はクッキーを作っていました。",
        ko: "올리버는 설탕으로 만들어진 작고 빛나는 행성에 살았습니다. 그는 온 우주에서 가장 뛰어난 우주 제빵사였습니다. 매일 밤 그는 쿠키를 만들었습니다.",
        ru: "Оливер жил на крошечной светящейся планете из сахара. Он был лучшим космическим пекарем во всей вселенной. Каждую ночь он делал печенье.",
        hi: "ऑलिवर चीनी से बनी एक छोटी, चमकती हुई ग्रह पर रहता था। वह पूरे ब्रह्मांड का सबसे अच्छा ब्रह्मांडीय बेकर था। हर रात वह कुकीज़ बनाता था।",
        tr: "Oliver, şekerden yapılmış küçük, parlak bir gezegende yaşıyordu. Tüm evrenin en iyi kozmik fırıncısıydı. Her gece kurabiye yapardı.",
        nl: "Oliver woonde op een kleine, gloeiende planeet gemaakt van suiker. Hij was de beste kosmische bakker in het hele universum. Elke nacht maakte hij koekjes.",
        pl: "Oliver mieszkał na maleńkiej, świecącej planecie zrobionej z cukru. Był najlepszym kosmicznym piekarzem w całym wszechświecie. Każdej nocy robił ciasteczka.",
        sv: "Oliver bodde på en liten, lysande planet gjord av socker. Han var den bästa kosmiska bagaren i hela universum. Varje natt bakade han kakor.",
      },
      // ── Page 2 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_2.png",   // TODO: add image
        en: "One evening, Oliver looked at the big moon. It looked very dark and very sad. The moon had lost its silver sparkle tonight.",
        es: "Una noche, Oliver miró a la gran luna. Parecía muy oscura y muy triste. La luna había perdido su brillo plateado esta noche.",
        fr: "Un soir, Oliver regarda la grande lune. Elle semblait très sombre et très triste. La lune avait perdu son éclat argenté ce soir-là.",
        ar: "في إحدى الأمسيات، نظر أوليفر إلى القمر الكبير. بدا مظلماً جداً وحزيناً جداً. فقد القمر بريقه الفضي الليلة.",
        pt: "Certa noite, Oliver olhou para a lua grande. Ela parecia muito escura e muito triste. A lua havia perdido seu brilho prateado esta noite.",
        de: "Eines Abends schaute Oliver auf den großen Mond. Er sah sehr dunkel und sehr traurig aus. Der Mond hatte heute Nacht seinen silbernen Glanz verloren.",
        it: "Una sera, Oliver guardò la grande luna. Sembrava molto scura e molto triste. La luna aveva perso il suo bagliore argentato quella notte.",
        zh: "一天傍晚，奥利弗望着大大的月亮。它看起来非常黑暗，非常悲伤。今晚月亮失去了它银色的光芒。",
        ja: "ある夕方、オリバーは大きな月を見上げました。月はとても暗くてとても悲しそうでした。今夜、月は銀色の輝きを失っていました。",
        ko: "어느 날 저녁, 올리버는 큰 달을 바라보았습니다. 달은 매우 어둡고 매우 슬퍼 보였습니다. 오늘 밤 달은 은빛 반짝임을 잃어버렸습니다.",
        ru: "Однажды вечером Оливер посмотрел на большую луну. Она выглядела очень тёмной и очень грустной. Этой ночью луна потеряла своё серебристое сияние.",
        hi: "एक शाम, ऑलिवर ने बड़े चंद्रमा को देखा। वह बहुत अंधेरा और बहुत दुखी दिखाई दे रहा था। आज रात चंद्रमा ने अपनी चांदी जैसी चमक खो दी थी।",
        tr: "Bir akşam Oliver büyük aya baktı. Çok karanlık ve çok üzgün görünüyordu. Ay bu gece gümüş parıltısını kaybetmişti.",
        nl: "Op een avond keek Oliver naar de grote maan. Ze zag er erg donker en erg verdrietig uit. De maan had vannacht haar zilveren glinstering verloren.",
        pl: "Pewnego wieczoru Oliver spojrzał na wielki księżyc. Wyglądał bardzo ciemno i bardzo smutno. Księżyc stracił tej nocy swój srebrny blask.",
        sv: "En kväll tittade Oliver på den stora månen. Den såg väldigt mörk och väldigt ledsen ut. Månen hade förlorat sin silvriga glans den kvällen.",
      },
      // ── Page 3 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_3.png",   // TODO: add image
        en: "Oliver grabbed his magic apron quickly. He hopped into his blue rocket ship. He had a secret mission to save the night sky.",
        es: "Oliver agarró su delantal mágico rápidamente. Saltó dentro de su cohete azul. Tenía una misión secreta para salvar el cielo nocturno.",
        fr: "Oliver attrapa rapidement son tablier magique. Il sauta dans sa fusée bleue. Il avait une mission secrète pour sauver le ciel nocturne.",
        ar: "أمسك أوليفر مئزره السحري بسرعة. قفز إلى داخل مركبته الصاروخية الزرقاء. كانت لديه مهمة سرية لإنقاذ سماء الليل.",
        pt: "Oliver pegou rapidamente seu avental mágico. Ele pulou dentro de seu foguete azul. Ele tinha uma missão secreta para salvar o céu noturno.",
        de: "Oliver griff schnell nach seiner Zauberschürze. Er hüpfte in seine blaue Rakete. Er hatte eine geheime Mission, um den Nachthimmel zu retten.",
        it: "Oliver afferrò rapidamente il suo grembiule magico. Saltò nella sua navicella spaziale blu. Aveva una missione segreta per salvare il cielo notturno.",
        zh: "奥利弗迅速抓起他的魔法围裙。他跳进了他的蓝色火箭飞船。他有一个拯救夜空的秘密任务。",
        ja: "オリバーは素早く魔法のエプロンを手に取りました。彼は青いロケット船に乗り込みました。彼には夜空を救う秘密のミッションがありました。",
        ko: "올리버는 빠르게 마법 앞치마를 잡았습니다. 그는 파란 로켓선에 올라탔습니다. 그에게는 밤하늘을 구해야 할 비밀 임무가 있었습니다.",
        ru: "Оливер быстро схватил свой волшебный фартук. Он прыгнул в свою синюю ракету. У него было секретное задание — спасти ночное небо.",
        hi: "ऑलिवर ने जल्दी से अपना जादुई एप्रन उठाया। वह अपने नीले रॉकेट जहाज में कूद गया। रात के आकाश को बचाने के लिए उसके पास एक गुप्त मिशन था।",
        tr: "Oliver sihirli önlüğünü hızla aldı. Mavi roket gemisine atladı. Gece gökyüzünü kurtarmak için gizli bir görevi vardı.",
        nl: "Oliver pakte snel zijn toverschort. Hij sprong in zijn blauwe raket. Hij had een geheime missie om de nachtelijke hemel te redden.",
        pl: "Oliver szybko chwycił swój magiczny fartuch. Wsiadł do swojego niebieskiego rakietowego statku. Miał tajną misję ratowania nocnego nieba.",
        sv: "Oliver tog snabbt tag i sitt magiska förkläde. Han hoppade in i sitt blå rymdraketskepp. Han hade ett hemligt uppdrag att rädda natthimlen.",
      },
      // ── Page 4 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_4.png",   // TODO: add image
        en: "He flew through the vast, quiet space. He saw many twinkling stars. He arrived at the moon and saw it was crying tears.",
        es: "Voló a través del espacio vasto y silencioso. Vio muchas estrellas parpadeantes. Llegó a la luna y vio que estaba llorando lágrimas.",
        fr: "Il vola à travers le vaste et silencieux espace. Il vit de nombreuses étoiles scintillantes. Il arriva sur la lune et la vit pleurer des larmes.",
        ar: "طار عبر الفضاء الواسع والهادئ. رأى نجوماً لامعة كثيرة. وصل إلى القمر ورأى أنه كان يبكي دموعاً.",
        pt: "Ele voou pelo vasto e silencioso espaço. Ele viu muitas estrelas cintilantes. Ele chegou à lua e viu que ela estava chorando lágrimas.",
        de: "Er flog durch den riesigen, stillen Weltraum. Er sah viele funkelnde Sterne. Er kam zum Mond an und sah, dass er Tränen weinte.",
        it: "Volò attraverso il vasto e silenzioso spazio. Vide molte stelle scintillanti. Arrivò sulla luna e vide che stava piangendo lacrime.",
        zh: "他飞过广阔而宁静的太空。他看到了许多闪烁的星星。他到达月亮时，看到月亮在流泪。",
        ja: "彼は広大で静かな宇宙を飛び続けました。たくさんのきらめく星が見えました。月に到着すると、月が涙を流しているのを見ました。",
        ko: "그는 광활하고 조용한 우주를 날아갔습니다. 반짝이는 별들을 많이 보았습니다. 달에 도착하자 달이 눈물을 흘리고 있는 것을 보았습니다.",
        ru: "Он летел сквозь бескрайний тихий космос. Он видел множество мерцающих звёзд. Он добрался до луны и увидел, что она плачет.",
        hi: "वह विशाल, शांत अंतरिक्ष में उड़ता रहा। उसने कई टिमटिमाते तारे देखे। वह चंद्रमा पर पहुंचा और देखा कि वह आंसू बहा रहा था।",
        tr: "Geniş ve sessiz uzayda uçtu. Pek çok parlayan yıldız gördü. Aya ulaştı ve onun gözyaşı döktüğünü gördü.",
        nl: "Hij vloog door het uitgestrekte, stille heelal. Hij zag veel fonkelende sterren. Hij arriveerde bij de maan en zag dat ze tranen huilde.",
        pl: "Leciał przez rozległy, cichy kosmos. Widział wiele migoczących gwiazd. Dotarł do księżyca i zobaczył, że płacze łzami.",
        sv: "Han flög genom det vidsträckta, tysta rymden. Han såg många glittrande stjärnor. Han anlände till månen och såg att den grät tårar.",
      },
      // ── Page 5 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_5.png",   // TODO: add image
        en: "'I will help you,' Oliver said. He baked a giant, glowing cake. He used golden stardust and sweet cosmic honey for the frosting.",
        es: "—Yo te ayudaré —dijo Oliver. Horneó un pastel gigante y brillante. Usó polvo de estrellas dorado y miel cósmica dulce para el glaseado.",
        fr: "« Je vais t'aider », dit Oliver. Il cuisit un énorme gâteau lumineux. Il utilisa de la poussière d'étoiles dorée et du miel cosmique doux pour le glaçage.",
        ar: "قال أوليفر: 'سأساعدك'. خبز كعكة عملاقة ومضيئة. استخدم غبار النجوم الذهبي والعسل الكوني الحلو للتزيين.",
        pt: "—Vou te ajudar —disse Oliver. Ele assou um bolo gigante e brilhante. Usou poeira de estrelas dourada e mel cósmico doce para a cobertura.",
        de: "„Ich werde dir helfen\", sagte Oliver. Er backte einen riesigen, leuchtenden Kuchen. Er benutzte goldenen Sternenstaub und süßen kosmischen Honig für das Frosting.",          
        it: "«Ti aiuterò», disse Oliver. Cucinò una torta gigante e luminosa. Usò polvere di stelle dorata e dolce miele cosmico per la glassa.",
        zh: "「我来帮你，」奥利弗说。他烤了一个巨大的、发光的蛋糕。他用金色的星尘和甜甜的宇宙蜂蜜做糖霜。",
        ja: "「助けてあげるよ」とオリバーは言いました。彼は巨大な輝くケーキを焼きました。フロスティングには金色のスターダストと甘い宇宙のハチミツを使いました。",
        ko: "'내가 도와줄게,' 올리버가 말했습니다. 그는 거대하고 빛나는 케이크를 구웠습니다. 프로스팅으로 황금빛 별가루와 달콤한 우주 꿀을 사용했습니다.",
        ru: "«Я помогу тебе», — сказал Оливер. Он испёк огромный светящийся торт. Для глазури он использовал золотую звёздную пыль и сладкий космический мёд.",
        hi: "मैं तुम्हारी मदद करूंगा, ऑलिवर ने कहा। उसने एक विशाल, चमकदार केक बेक किया। उसने फ्रॉस्टिंग के लिए सुनहरी स्टारडस्ट और मीठे ब्रह्मांडीय शहद का इस्तेमाल किया।",
        tr: "'Sana yardım edeceğim,' dedi Oliver. Dev, parlak bir pasta pişirdi. Krema için altın yıldız tozu ve tatlı kozmik bal kullandı.",
        nl: "'Ik zal je helpen,' zei Oliver. Hij bakte een gigantische, gloeiende taart. Hij gebruikte gouden sterrenstof en zoete kosmische honing voor het glazuur.",
        pl: "„Pomogę ci\", — powiedział Oliver. Upiekł ogromne, świecące ciasto. Do polewy użył złotego gwiazdowego pyłu i słodkiego kosmicznego miodu.",
        sv: "'Jag ska hjälpa dig,' sa Oliver. Han bakade en jättelik, lysande tårta. Han använde gyllene stjärndamm och söt kosmisk honung till frostingen.",
      },
      // ── Page 6 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_6.png",   // TODO: add image
        en: "The moon took a big bite. Suddenly, a bright light started to grow. The moon felt warm and happy inside its big heart.",
        es: "La luna dio un gran mordisco. De repente, una luz brillante comenzó a crecer. La luna se sintió cálida y feliz en su gran corazón.",
        fr: "La lune prit une grande bouchée. Soudain, une lumière vive commença à grandir. La lune se sentit chaleureuse et heureuse dans son grand cœur.",
        ar: "أخذ القمر لقمة كبيرة. فجأة، بدأ ضوء ساطع ينمو. شعر القمر بالدفء والسعادة في قلبه الكبير.",
        pt: "A lua deu uma grande mordida. De repente, uma luz brilhante começou a crescer. A lua se sentiu quente e feliz dentro de seu grande coração.",
        de: "Der Mond nahm einen großen Bissen. Plötzlich begann ein helles Licht zu wachsen. Der Mond fühlte sich warm und glücklich in seinem großen Herzen.",
        it: "La luna fece un grande morso. All'improvviso, una luce brillante cominciò a crescere. La luna si sentì calda e felice nel suo grande cuore.",
        zh: "月亮咬了一大口。突然，一道明亮的光开始扩散。月亮在它的大心脏里感到温暖和快乐。",
        ja: "月は大きな一口を食べました。突然、明るい光が広がり始めました。月はその大きな心の中で温かく幸せを感じました。",
        ko: "달이 한 입 크게 베어 물었습니다. 갑자기 밝은 빛이 커지기 시작했습니다. 달은 큰 마음 속에서 따뜻하고 행복함을 느꼈습니다.",
        ru: "Луна откусила большой кусок. Вдруг начал расти яркий свет. Луна почувствовала тепло и счастье внутри своего большого сердца.",
        hi: "चंद्रमा ने एक बड़ा काटा लिया। अचानक, एक तेज रोशनी बढ़ने लगी। चंद्रमा ने अपने बड़े दिल के अंदर गर्मी और खुशी महसूस की।",
        tr: "Ay büyük bir ısırık aldı. Aniden parlak bir ışık büyümeye başladı. Ay, büyük kalbinin içinde sıcak ve mutlu hissetti.",
        nl: "De maan nam een grote hap. Plotseling begon een helder licht te groeien. De maan voelde zich warm en blij van binnen in haar grote hart.",
        pl: "Księżyc wziął duży kęs. Nagle jasne światło zaczęło rosnąć. Księżyc poczuł ciepło i radość w swoim wielkim sercu.",
        sv: "Månen tog en stor tugga. Plötsligt började ett starkt ljus växa. Månen kände sig varm och lycklig inuti sitt stora hjärta.",
      },
      // ── Page 7 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_7.png",   // TODO: add image
        en: "The sky was silver and beautiful again. Oliver hugged his big friend. All the children on Earth could see the pretty moon now.",
        es: "El cielo volvió a ser plateado y hermoso. Oliver abrazó a su gran amiga. Todos los niños en la Tierra podían ver la luna ahora.",
        fr: "Le ciel était à nouveau argenté et beau. Oliver serra son grand ami dans ses bras. Tous les enfants de la Terre pouvaient voir la belle lune maintenant.",
        ar: "أصبحت السماء فضية وجميلة مرة أخرى. احتضن أوليفر صديقه الكبير. يمكن لجميع الأطفال على الأرض رؤية القمر الجميل الآن.",
        pt: "O céu estava prateado e bonito novamente. Oliver abraçou seu grande amigo. Todas as crianças na Terra podiam ver a lua linda agora.",
        de: "Der Himmel war wieder silbern und wunderschön. Oliver umarmte seinen großen Freund. Alle Kinder auf der Erde konnten jetzt den schönen Mond sehen.",
        it: "Il cielo era di nuovo argentato e bellissimo. Oliver abbracciò il suo grande amico. Tutti i bambini sulla Terra potevano vedere la bella luna adesso.",
        zh: "天空再次变得银白而美丽。奥利弗拥抱了他的大朋友。地球上所有的孩子现在都能看到美丽的月亮了。",
        ja: "空は再び銀色に美しく輝いていました。オリバーは大きな友達を抱きしめました。地球上のすべての子供たちが今、きれいな月を見ることができました。",
        ko: "하늘이 다시 은빛으로 아름다워졌습니다. 올리버는 큰 친구를 안아주었습니다. 지구의 모든 아이들이 이제 예쁜 달을 볼 수 있었습니다.",
        ru: "Небо снова стало серебристым и красивым. Оливер обнял своего большого друга. Все дети на Земле теперь могли видеть красивую луну.",
        hi: "आकाश फिर से चांदी जैसा और सुंदर हो गया। ऑलिवर ने अपने बड़े दोस्त को गले लगाया। पृथ्वी के सभी बच्चे अब सुंदर चंद्रमा देख सकते थे।",
        tr: "Gökyüzü yeniden gümüş ve güzeldi. Oliver büyük arkadaşını kucakladı. Dünyadaki tüm çocuklar şimdi güzel ayı görebiliyordu.",
        nl: "De hemel was weer zilver en prachtig. Oliver omhelsde zijn grote vriend. Alle kinderen op Aarde konden de mooie maan nu zien.",
        pl: "Niebo znów było srebrne i piękne. Oliver przytulił swojego wielkiego przyjaciela. Wszystkie dzieci na Ziemi mogły teraz zobaczyć piękny księżyc.",
        sv: "Himlen var silver och vacker igen. Oliver kramade sin store vän. Alla barn på jorden kunde nu se den vackra månen.",
      },
      // ── Page 8 ─────────────────────────────────────────────────────
      {
        dalle_url: "/stories/oliver/page_8.png",   // TODO: add image
        en: "Oliver returned to his soft bed. He was tired but very happy. He knew that kindness can make the whole world shine bright.",
        es: "Oliver regresó a su cama suave. Estaba cansado pero muy feliz. Sabía que la bondad puede hacer que el mundo entero brille.",
        fr: "Oliver retourna dans son lit douillet. Il était fatigué mais très heureux. Il savait que la bonté peut faire briller le monde entier.",
        ar: "عاد أوليفر إلى سريره الناعم. كان متعباً لكنه سعيد جداً. كان يعلم أن اللطف يمكنه جعل العالم بأسره يتألق.",
        pt: "Oliver voltou para sua cama macia. Ele estava cansado mas muito feliz. Ele sabia que a bondade pode fazer o mundo inteiro brilhar.",
        de: "Oliver kehrte in sein weiches Bett zurück. Er war müde, aber sehr glücklich. Er wusste, dass Güte die ganze Welt zum Strahlen bringen kann.",
        it: "Oliver tornò nel suo letto morbido. Era stanco ma molto felice. Sapeva che la gentilezza può far brillare il mondo intero.",
        zh: "奥利弗回到了他柔软的床上。他很疲惫，但非常开心。他知道善良可以让整个世界闪闪发光。",
        ja: "オリバーは柔らかいベッドに戻りました。疲れていましたが、とても幸せでした。優しさが全世界を輝かせることができると知っていました。",
        ko: "올리버는 포근한 침대로 돌아왔습니다. 그는 피곤했지만 매우 행복했습니다. 그는 친절이 온 세상을 빛나게 할 수 있다는 것을 알았습니다.",
        ru: "Оливер вернулся в свою мягкую кровать. Он был уставшим, но очень счастливым. Он знал, что доброта может заставить весь мир сиять.",
        hi: "ऑलिवर अपने नरम बिस्तर पर लौट आया। वह थका हुआ था लेकिन बहुत खुश था। वह जानता था कि दयालुता पूरी दुनिया को चमका सकती है।",
        tr: "Oliver yumuşak yatağına geri döndü. Yorgundu ama çok mutluydu. Nezaketin tüm dünyayı parlatabileceğini biliyordu.",
        nl: "Oliver keerde terug naar zijn zachte bed. Hij was moe maar erg blij. Hij wist dat vriendelijkheid de hele wereld kan laten stralen.",
        pl: "Oliver wrócił do swojego miękkiego łóżka. Był zmęczony, ale bardzo szczęśliwy. Wiedział, że dobroć może sprawić, że cały świat będzie jaśniał.",
        sv: "Oliver återvände till sin mjuka säng. Han var trött men väldigt lycklig. Han visste att vänlighet kan få hela världen att lysa klart.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // 3. Leo and the Magic Ramen
  // ══════════════════════════════════════════════════════════════════════
  {
    id:    "demo-leo-ramen",
    title: "Leo and the Magic Ramen",
    emoji: "🍜",
    color: "from-orange-400 to-amber-300",
    accentColor: "#E65100",

    // Cover image — place at: public/stories/leo/cover.png
    coverImage: "/stories/leo/cover.png",

    pages: [
      // ── Page 1 ─────────────────────────────────────────────────────
      // Small boy in chef's hat holding ceramic bowl with rainbow steam
      {
        dalle_url: "/stories/leo/page_1.png",   // TODO: add image
        en: "Leo was a little chef in a busy kitchen. He had a special bowl. This bowl could make anything feel better and happy.",
        es: "Leo era un pequeño chef en una cocina ocupada. Tenía un cuenco especial. Este cuenco podía hacer que cualquiera se sintiera mejor.",
        fr: "Leo était un petit chef dans une cuisine animée. Il avait un bol spécial. Ce bol pouvait faire se sentir mieux n'importe qui.",
        ar: "كان ليو طاهياً صغيراً في مطبخ مشغول. كان لديه وعاء خاص. كان هذا الوعاء يجعل أي شخص يشعر بتحسن وسعادة.",
        pt: "Leo era um pequeno chef em uma cozinha movimentada. Ele tinha uma tigela especial. Essa tigela podia fazer qualquer um se sentir melhor e feliz.",
        de: "Leo war ein kleiner Koch in einer geschäftigen Küche. Er hatte eine besondere Schüssel. Diese Schüssel konnte alles besser und glücklicher machen.",
        it: "Leo era un piccolo chef in una cucina animata. Aveva una ciotola speciale. Questa ciotola poteva far sentire meglio chiunque.",
        zh: "雷奥是一个繁忙厨房里的小厨师。他有一个特别的碗。这个碗能让任何人感觉更好、更快乐。",
        ja: "レオは賑やかなキッチンの小さなシェフでした。彼には特別なボウルがありました。このボウルはどんなものでも良くして幸せにすることができました。",
        ko: "레오는 바쁜 주방의 작은 요리사였습니다. 그에게는 특별한 그릇이 있었습니다. 이 그릇은 무엇이든 더 좋고 행복하게 만들 수 있었습니다.",
        ru: "Лео был маленьким поваром в оживлённой кухне. У него была особая миска. Эта миска могла сделать что угодно лучше и радостнее.",
        hi: "लियो एक व्यस्त रसोई में एक छोटा शेफ था। उसके पास एक खास कटोरा था। यह कटोरा किसी को भी बेहतर और खुश महसूस करा सकता था।",
        tr: "Leo, kalabalık bir mutfakta küçük bir aşçıydı. Özel bir kasesi vardı. Bu kase her şeyi daha iyi ve daha mutlu hissettiriyordu.",
        nl: "Leo was een kleine chef-kok in een drukke keuken. Hij had een speciale kom. Deze kom kon alles beter en gelukkiger maken.",
        pl: "Leo był małym kucharzem w ruchliwej kuchni. Miał specjalną miskę. Ta miska mogła sprawić, że wszystko stało się lepsze i szczęśliwsze.",
        sv: "Leo var en liten kock i ett livligt kök. Han hade en speciell skål. Denna skål kunde få vad som helst att kännas bättre och lyckligare.",
      },
      // ── Page 2 ─────────────────────────────────────────────────────
      // Friendly green dragon on rug by fireplace, tired with red nose
      {
        dalle_url: "/stories/leo/page_2.png",   // TODO: add image
        en: "Today, his best friend the Dragon was very sick. The Dragon had a cold. He could not even breathe tiny fire sparks.",
        es: "Hoy, su mejor amigo el Dragón estaba muy enfermo. El Dragón tenía un resfriado. Ni siquiera podía lanzar pequeñas chispas de fuego.",
        fr: "Aujourd'hui, son meilleur ami le Dragon était très malade. Le Dragon avait un rhume. Il ne pouvait même pas souffler de petites étincelles de feu.",
        ar: "اليوم، كان صديقه المفضل التنين مريضاً جداً. كان التنين مصاباً بنزلة برد. لم يستطع حتى أن يتنفس شرارات نار صغيرة.",
        pt: "Hoje, seu melhor amigo o Dragão estava muito doente. O Dragão estava resfriado. Ele não conseguia nem respirar pequenas faíscas de fogo.",
        de: "Heute war sein bester Freund, der Drache, sehr krank. Der Drache hatte eine Erkältung. Er konnte nicht einmal kleine Feuerfunken pusten.",
        it: "Oggi il suo migliore amico il Drago era molto malato. Il Drago aveva il raffreddore. Non riusciva nemmeno a soffiare piccole scintille di fuoco.",
        zh: "今天，他最好的朋友龙病得很厉害。龙感冒了。它甚至连小小的火花都吐不出来。",
        ja: "今日、彼の親友のドラゴンはとても具合が悪かったです。ドラゴンは風邪をひいていました。小さな火花すら吐けませんでした。",
        ko: "오늘 그의 가장 친한 친구 드래곤이 많이 아팠습니다. 드래곤은 감기에 걸렸습니다. 작은 불꽃조차 내뿜을 수 없었습니다.",
        ru: "Сегодня его лучший друг Дракон был очень болен. У Дракона был насморк. Он не мог выдохнуть даже маленькие искры огня.",
        hi: "आज, उसके सबसे अच्छे दोस्त ड्रैगन की तबियत बहुत खराब थी। ड्रैगन को जुकाम हो गया था। वह छोटी-छोटी आग की चिंगारियाँ भी नहीं उड़ा सकता था।",
        tr: "Bugün en iyi arkadaşı Ejderha çok hastaydı. Ejderha'nın nezlesi vardı. Küçük ateş kıvılcımları bile üfleyemiyordu.",
        nl: "Vandaag was zijn beste vriend de Draak erg ziek. De Draak had een kou gevat. Hij kon zelfs geen kleine vuurvonkjes uitblazen.",
        pl: "Dzisiaj jego najlepszy przyjaciel Smok był bardzo chory. Smok miał przeziębienie. Nie mógł nawet wydychać małych iskier ognia.",
        sv: "Idag var hans bästa vän Draken väldigt sjuk. Draken hade förkylning. Han kunde inte ens andas ut små eldgnistor.",
      },
      // ── Page 3 ─────────────────────────────────────────────────────
      // Leo in magical garden with oversized glowing golden onions
      {
        dalle_url: "/stories/leo/page_3.png",   // TODO: add image
        en: "Leo needed to make a magic ramen. He looked for the secret ingredients. He went to the Garden of Giant Golden Onions.",
        es: "Leo necesitaba cocinar un ramen mágico. Buscó los ingredientes secretos. Fue al Jardín de las Cebollas Doradas Gigantes.",
        fr: "Leo devait préparer un ramen magique. Il chercha les ingrédients secrets. Il alla au Jardin des Géants Oignons Dorés.",
        ar: "كان ليو بحاجة لصنع رامن سحري. بحث عن المكونات السرية. ذهب إلى حديقة البصل الذهبي العملاق.",
        pt: "Leo precisava fazer um ramen mágico. Ele procurou os ingredientes secretos. Ele foi ao Jardim das Cebolas Douradas Gigantes.",
        de: "Leo musste einen Zauberramen kochen. Er suchte nach den geheimen Zutaten. Er ging in den Garten der riesigen goldenen Zwiebeln.",
        it: "Leo doveva preparare un ramen magico. Cercò gli ingredienti segreti. Andò nel Giardino delle Cipolle Dorate Giganti.",
        zh: "雷奥需要做一碗魔法拉面。他寻找秘密食材。他去了巨型金色洋葱花园。",
        ja: "レオは魔法のラーメンを作らなければなりませんでした。秘密の材料を探しました。巨大な金色のタマネギの庭へ行きました。",
        ko: "레오는 마법의 라멘을 만들어야 했습니다. 비밀 재료를 찾았습니다. 그는 거대한 황금 양파 정원으로 갔습니다.",
        ru: "Лео нужно было приготовить волшебный рамен. Он искал секретные ингредиенты. Он отправился в Сад Гигантских Золотых Луковиц.",
        hi: "लियो को जादुई रामेन बनाना था। उसने गुप्त सामग्री की तलाश की। वह विशाल सुनहरे प्याजों के बगीचे में गया।",
        tr: "Leo sihirli bir ramen yapmak zorundaydı. Gizli malzemeleri aradı. Dev Altın Soğanlar Bahçesi'ne gitti.",
        nl: "Leo moest een magische ramen maken. Hij zocht naar de geheime ingrediënten. Hij ging naar de Tuin van de Reuzenachtige Gouden Uien.",
        pl: "Leo musiał zrobić magiczny ramen. Szukał tajnych składników. Poszedł do Ogrodu Olbrzymich Złotych Cebul.",
        sv: "Leo behövde laga en magisk ramen. Han letade efter de hemliga ingredienserna. Han gick till Trädgården med Jättestora Gyllene Lökar.",
      },
      // ── Page 4 ─────────────────────────────────────────────────────
      // Leo holding glowing red chili + floating blue noodles
      {
        dalle_url: "/stories/leo/page_4.png",   // TODO: add image
        en: "He found a spicy pepper that glowed like the sun. He also found noodles that could sing a very sweet lullaby.",
        es: "Encontró un pimiento picante que brillaba como el sol. También encontró fideos que podían cantar una canción de cuna muy dulce.",
        fr: "Il trouva un piment épicé qui brillait comme le soleil. Il trouva aussi des nouilles qui pouvaient chanter une très douce berceuse.",
        ar: "وجد فلفلاً حاراً يتوهج مثل الشمس. وجد أيضاً مكروناً يمكنه غناء أغنية مهد حلوة جداً.",
        pt: "Ele encontrou uma pimenta picante que brilhava como o sol. Ele também encontrou macarrão que podia cantar uma canção de ninar muito doce.",
        de: "Er fand eine scharfe Paprika, die wie die Sonne leuchtete. Er fand auch Nudeln, die ein sehr süßes Wiegenlied singen konnten.",
        it: "Trovò un peperoncino piccante che brillava come il sole. Trovò anche tagliolini che potevano cantare una ninna nanna molto dolce.",
        zh: "他发现了一个像太阳一样发光的辣椒。他还发现了能唱甜甜摇篮曲的面条。",
        ja: "太陽のように輝く辛いピーマンを見つけました。また、とても甘い子守唄を歌える麺も見つけました。",
        ko: "그는 태양처럼 빛나는 매운 고추를 발견했습니다. 또한 아주 달콤한 자장가를 부를 수 있는 국수도 찾았습니다.",
        ru: "Он нашёл острый перец, светившийся как солнце. Он также нашёл лапшу, которая умела петь очень нежную колыбельную.",
        hi: "उसे एक मसालेदार मिर्च मिली जो सूरज की तरह चमक रही थी। उसे ऐसे नूडल्स भी मिले जो बहुत मीठी लोरी गा सकते थे।",
        tr: "Güneş gibi parlayan acı bir biber buldu. Ayrıca çok tatlı bir ninni söyleyebilen erişte de buldu.",
        nl: "Hij vond een pittige peper die gloeide als de zon. Hij vond ook noedels die een heel zoet slaapliedje konden zingen.",
        pl: "Znalazł pikantną paprykę, która świeciła jak słońce. Znalazł też makaron, który potrafił śpiewać bardzo słodką kołysankę.",
        sv: "Han hittade en stark paprika som lyste som solen. Han hittade också nudlar som kunde sjunga en mycket söt vaggvisa.",
      },
      // ── Page 5 ─────────────────────────────────────────────────────
      // Leo stirring pot, musical notes and flower petals rising from steam
      {
        dalle_url: "/stories/leo/page_5.png",   // TODO: add image
        en: "Leo cooked the soup with lots of care. The kitchen smelled like flowers and rain. He sang to the pot while it boiled.",
        es: "Leo cocinó la sopa con mucho cuidado. La cocina olía a flores y lluvia. Le cantó a la olla mientras hervía.",
        fr: "Leo cuisina la soupe avec beaucoup de soin. La cuisine sentait les fleurs et la pluie. Il chanta à la casserole pendant qu'elle bouillait.",
        ar: "طهى ليو الحساء باهتمام كبير. كانت المطبخ يفوح برائحة الزهور والمطر. غنى للقدر بينما كان يغلي.",
        pt: "Leo cozinhou a sopa com muito cuidado. A cozinha cheirava a flores e chuva. Ele cantou para a panela enquanto ela fervia.",
        de: "Leo kochte die Suppe mit viel Sorgfalt. Die Küche roch nach Blumen und Regen. Er sang der Suppe zu, während sie kochte.",
        it: "Leo cucinò la zuppa con molta cura. La cucina profumava di fiori e pioggia. Cantò alla pentola mentre bolliva.",
        zh: "雷奥用心地烹制汤品。厨房里弥漫着花朵和雨水的香气。他一边煮一边对锅子唱歌。",
        ja: "レオは丁寧にスープを料理しました。キッチンは花と雨の香りがしました。沸騰している鍋に向かって歌を歌いました。",
        ko: "레오는 정성껏 수프를 요리했습니다. 주방은 꽃과 비 냄새가 났습니다. 그는 냄비가 끓는 동안 노래를 불렀습니다.",
        ru: "Лео варил суп с большой заботой. На кухне пахло цветами и дождём. Он пел кастрюле, пока суп кипел.",
        hi: "लियो ने बड़े प्यार से सूप पकाया। रसोई में फूलों और बारिश की महक आ रही थी। वह उबलते हुए बर्तन को गाना गाता रहा।",
        tr: "Leo çorbayı büyük bir özenle pişirdi. Mutfak çiçek ve yağmur gibi kokuyordu. Tencere kaynarken ona şarkı söyledi.",
        nl: "Leo kookte de soep met veel zorg. De keuken rook naar bloemen en regen. Hij zong voor de pot terwijl hij kookte.",
        pl: "Leo gotował zupę z dużą troską. Kuchnia pachniała kwiatami i deszczem. Śpiewał do garnka, kiedy gotował.",
        sv: "Leo lagade soppan med stor omsorg. Köket doftade av blommor och regn. Han sjöng till grytan medan den kokade.",
      },
      // ── Page 6 ─────────────────────────────────────────────────────
      // Dragon slurping noodles, scales turning from dull to bright emerald
      {
        dalle_url: "/stories/leo/page_6.png",   // TODO: add image
        en: "The Dragon slurped the warm, delicious soup. Slowly, his scales started to glow. He felt a warm fire growing in his belly.",
        es: "El Dragón sorbió la sopa cálida y deliciosa. Poco a poco, sus escamas brillaron. Sintió un fuego cálido crecer en su barriga.",
        fr: "Le Dragon slurpa la soupe chaude et délicieuse. Lentement, ses écailles commencèrent à briller. Il sentit un feu chaud grandir dans son ventre.",
        ar: "تجرع التنين الحساء الدافئ اللذيذ. ببطء، بدأت حراشفه تتوهج. شعر بنار دافئة تنمو في بطنه.",
        pt: "O Dragão sorveu a sopa quente e deliciosa. Aos poucos, suas escamas começaram a brilhar. Ele sentiu um fogo quente crescendo em sua barriga.",
        de: "Der Drache schlürfte die warme, köstliche Suppe. Langsam begannen seine Schuppen zu leuchten. Er fühlte ein warmes Feuer in seinem Bauch wachsen.",
        it: "Il Drago slurpò la zuppa calda e deliziosa. Lentamente, le sue scaglie iniziarono a brillare. Sentì un fuoco caldo crescere nella sua pancia.",
        zh: "龙呼噜噜地喝着温热美味的汤。慢慢地，它的鳞片开始发光。它感觉到腹中一股温暖的火焰在生长。",
        ja: "ドラゴンは温かくおいしいスープをすすりました。ゆっくりと、鱗が光り始めました。お腹の中で温かい炎が育つのを感じました。",
        ko: "드래곤은 따뜻하고 맛있는 수프를 후루룩 마셨습니다. 천천히 비늘이 빛나기 시작했습니다. 배 속에서 따뜻한 불꽃이 자라나는 것을 느꼈습니다.",
        ru: "Дракон с удовольствием прихлёбывал тёплый вкусный суп. Медленно его чешуя начала светиться. Он почувствовал, как в животе разгорается тёплый огонь.",
        hi: "ड्रैगन ने गर्म, स्वादिष्ट सूप को चुस्की लेते हुए पिया। धीरे-धीरे, उसके शल्क चमकने लगे। उसने अपने पेट में एक गर्म आग को बढ़ते हुए महसूस किया।",
        tr: "Ejderha sıcak, lezzetli çorbayı yudumladı. Yavaş yavaş pulları parlamaya başladı. Karnında sıcak bir ateşin büyüdüğünü hissetti.",
        nl: "De Draak slurpte de warme, heerlijke soep op. Langzaam begonnen zijn schubben te gloeien. Hij voelde een warm vuur groeien in zijn buik.",
        pl: "Smok chlipał ciepłą, pyszną zupę. Powoli jego łuski zaczęły się świecić. Poczuł, jak w brzuchu rośnie ciepły ogień.",
        sv: "Draken slurpade i sig den varma, läckra soppan. Långsamt började hans fjäll lysa. Han kände en varm eld växa i sin mage.",
      },
      // ── Page 7 ─────────────────────────────────────────────────────
      // Dragon flying inside kitchen, heart-shaped smoke, Leo laughing
      {
        dalle_url: "/stories/leo/page_7.png",   // TODO: add image
        en: "The Dragon let out a happy puff of smoke. He was finally healed. Leo and the Dragon shared a big, warm hug.",
        es: "El Dragón soltó una bocanada de humo feliz. Finalmente estaba curado. Leo y el Dragón se dieron un gran y cálido abrazo.",
        fr: "Le Dragon laissa échapper un nuage de fumée joyeux. Il était enfin guéri. Leo et le Dragon échangèrent un grand câlin chaleureux.",
        ar: "أطلق التنين نفثة دخان سعيدة. كان قد شُفي أخيراً. تبادل ليو والتنين عناقاً كبيراً دافئاً.",
        pt: "O Dragão soltou uma baforada feliz de fumaça. Ele estava finalmente curado. Leo e o Dragão trocaram um grande e caloroso abraço.",
        de: "Der Drache ließ eine fröhliche Rauchfahne aus. Er war endlich geheilt. Leo und der Drache teilten eine große, warme Umarmung.",
        it: "Il Drago emise una gioiosa boccata di fumo. Era finalmente guarito. Leo e il Drago si scambiarono un grande abbraccio caldo.",
        zh: "龙喷出了一口快乐的烟雾。它终于痊愈了。雷奥和龙分享了一个大大的温暖拥抱。",
        ja: "ドラゴンは幸せな煙をぷかっと吐き出しました。ついに治りました。レオとドラゴンは大きな温かい抱擁を交わしました。",
        ko: "드래곤은 행복한 연기를 한 줄기 내뿜었습니다. 드디어 나았습니다. 레오와 드래곤은 크고 따뜻한 포옹을 나눴습니다.",
        ru: "Дракон выпустил счастливое облачко дыма. Он наконец-то выздоровел. Лео и Дракон обнялись крепко и тепло.",
        hi: "ड्रैगन ने खुशी से धुएं का एक गुबार छोड़ा। वह आखिरकार ठीक हो गया था। लियो और ड्रैगन ने एक बड़ा, गर्म आलिंगन साझा किया।",
        tr: "Ejderha mutlu bir duman bulutu üfledi. Sonunda iyileşmişti. Leo ve Ejderha büyük ve sıcak bir kucaklaşma paylaştı.",
        nl: "De Draak liet een gelukkige rookwolk ontsnappen. Hij was eindelijk genezen. Leo en de Draak deelden een grote, warme knuffel.",
        pl: "Smok wypuścił szczęśliwą chmurę dymu. W końcu wyzdrowiał. Leo i Smok wymienili wielki, ciepły uścisk.",
        sv: "Draken pustade ut ett glatt rökmoln. Han var äntligen botad. Leo och Draken delade en stor, varm kram.",
      },
      // ── Page 8 ─────────────────────────────────────────────────────
      // Leo and dragon by window, empty ramen bowl, pure friendship
      {
        dalle_url: "/stories/leo/page_8.png",   // TODO: add image
        en: "The kitchen was peaceful once again. Leo smiled at his magic bowl. Making someone feel better is the best recipe in life.",
        es: "La cocina estaba en paz una vez más. Leo sonrió a su cuenco mágico. Hacer que alguien se sienta mejor es la mejor receta.",
        fr: "La cuisine était à nouveau paisible. Leo sourit à son bol magique. Rendre quelqu'un heureux est la meilleure recette de la vie.",
        ar: "كانت المطبخ هادئة مرة أخرى. ابتسم ليو على وعائه السحري. جعل شخص ما يشعر بتحسن هو أفضل وصفة في الحياة.",
        pt: "A cozinha estava em paz novamente. Leo sorriu para sua tigela mágica. Fazer alguém se sentir melhor é a melhor receita da vida.",
        de: "Die Küche war wieder friedlich. Leo lächelte seine magische Schüssel an. Jemanden besser fühlen zu lassen ist das beste Rezept im Leben.",
        it: "La cucina era di nuovo tranquilla. Leo sorrise alla sua ciotola magica. Far sentire meglio qualcuno è la miglior ricetta della vita.",
        zh: "厨房再次恢复了平静。雷奥对着他的魔法碗微笑。让某人感觉更好，是生命中最好的食谱。",
        ja: "キッチンは再び穏やかになりました。レオは魔法のボウルに微笑みました。誰かを元気にすることが人生で最高のレシピです。",
        ko: "주방은 다시 평화로워졌습니다. 레오는 마법의 그릇을 보며 미소 지었습니다. 누군가를 기분 좋게 만드는 것이 인생 최고의 레시피입니다.",
        ru: "На кухне снова стало тихо. Лео улыбнулся своей волшебной миске. Сделать кому-то лучше — это лучший рецепт в жизни.",
        hi: "रसोई एक बार फिर शांत हो गई। लियो ने अपने जादुई कटोरे की ओर मुस्कुराया। किसी को बेहतर महसूस कराना ही जीवन की सबसे अच्छी रेसिपी है।",
        tr: "Mutfak yeniden huzurluydu. Leo sihirli kasesine gülümsedi. Birini iyi hissettirmek hayattaki en iyi tariftir.",
        nl: "De keuken was weer vredig. Leo glimlachte naar zijn magische kom. Iemand beter laten voelen is het beste recept in het leven.",
        pl: "Kuchnia znów była spokojna. Leo uśmiechnął się do swojej magicznej miski. Sprawienie, by ktoś poczuł się lepiej, to najlepsza recepta w życiu.",
        sv: "Köket var fridfullt igen. Leo log mot sin magiska skål. Att få någon att må bättre är livets bästa recept.",
      },
    ],
  },

];
