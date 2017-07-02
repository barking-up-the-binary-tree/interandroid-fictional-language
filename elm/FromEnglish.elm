module FromEnglish
  exposing(engToHexa, hexaToVisual, hexaToPhonetic)
{-| FromEnglish

# Basics
@docs

-}

import List exposing (map, member, all, range)
import String exposing (join, split, words, cons, contains, startsWith, dropLeft, foldr)
import Tuple exposing (first, second)

zip : List a -> List b -> List (a,b)
zip xs ys =
  case (xs, ys) of
    ( x :: xBack, y :: yBack ) ->
        (x,y) :: zip xBack yBack

    (_, _) ->
        []


wordJoinX: (List Word) -> String
wordJoinX list = toHexa(list) |> join "C"

wordJoinC: (List Word) -> String
wordJoinC list = toHexa(list) |> join "D"

toHexa: List(Word) -> List(String)
toHexa s = map wordToHexa s

toComposedWordsX: (List String) -> Word
toComposedWordsX list =
  X (map engToWord list)

toComposedWordsC: (List String) -> Word
toComposedWordsC list =
  C (map engToWord list)


digitOrComposed: String -> Word
digitOrComposed s =
  if startsWith "#" s then
    N (dropLeft 1 s)
  else if contains "/" s then
    toComposedWordsX (split "/" s)
  else if contains ":" s then
    toComposedWordsC (split ":" s)
  else
    Unknown

isEven: Int -> Bool
isEven n = n%2==0

engToHexa: String -> String
engToHexa s =
  (words s) |> map engToWord |> toHexa |> join " "

hexaToConsOrVowel: (String, Bool) -> String
hexaToConsOrVowel tuple =
  let
    (char, isVowel) = tuple
  in
    if isVowel then hexaToVowels char else hexaToCons char

wordToPhonetic: String -> String
wordToPhonetic s =
  let
    w = split "" s
    evenWord = if isEven (List.length w) then w else w ++ ["G"]
    index = range 1 (List.length evenWord)
    isVowel = map isEven index
    pairs = zip evenWord isVowel
  in
    pairs |> map hexaToConsOrVowel |> join ""

composedToPhonetic: String -> String
composedToPhonetic s =
  if startsWith "A" s then
    "sɑː" ++ wordToPhonetic (dropLeft 1 s)
  else if startsWith "B" s then
    "goʊ" ++ wordToPhonetic (dropLeft 1 s)
  else if contains "C" s then
    map wordToPhonetic (split "C" s) |> join "fʊ"
  else if contains "D" s then
    map wordToPhonetic (split "D" s) |> join "zaɪ"
  else
    wordToPhonetic s


hexaToPhonetic: String -> String
hexaToPhonetic s =
  map composedToPhonetic (words s) |> join " "

wordToHexa: Word -> String
wordToHexa s =
  case s of
  X w -> wordJoinX(w)
  C w -> wordJoinC(w)
  N n -> cons 'A' n
  Unknown -> "??"
  FictLang -> "0123"
  Yes -> "99"
  No -> "4"
  AboutPage -> " 6107"
  Accept -> " 2901"
  AcceptAction -> "2901224"
  AcceptedAnswer -> "2901549"
  AcceptedOffer -> " 290150"
  AcceptedPaymentMethod -> "290150341305"
  AcceptsReservations -> " 290173824"
  AccessCode -> "29925"
  AccessMode -> "29935"
  AccessModeSufficient -> " 2993590241"
  AccessibilityApi -> "299661"
  AccessibilityControl -> "29966124176"
  AccessibilityFeature -> "299661012"
  AccessibilityHazard -> " 29966135"
  AccessibilitySummary -> "299661937"
  Accommodation -> "23524"
  AccountId -> " 2415"
  AccountablePerson -> " 24166094"
  AccountingService -> " 2414989"
  AchieveAction -> " 128224"
  AcidBreaks -> "95672"
  AcidHouse -> " 959"
  AcidJazz -> "9573"
  AcidRock -> "9572"
  AcidTechno -> "95124"
  AcidTrance -> "951749"
  Acidic -> " 952"
  AcornSquash -> " 249282"
  AcquiredFrom -> "28073"
  Acrylic -> "2762"
  Actinium -> " 2143"
  Action -> " 224"
  ActionApplication -> " 22406224"
  ActionCollabClass -> "224266269"
  ActionOption -> "224024"
  ActionPlatform -> "22406103"
  ActionStatus -> "2249119"
  ActionStatusType -> " 224911910"
  ActivateAction -> "2181224"
  ActiveActionStatus -> " 2182249119"
  Actors -> " 21"
  AdditionalName -> "524643"
  AdditionalNumberOfGuests -> "5246436891"
  AdditionalProperty -> "52460701"
  AdditionalType -> "524610"
  AddressCountry -> "5792417"
  AddressLocality -> " 5796261"
  AddressRegion -> " 579774"
  AdministrativeArea -> "534917187"
  Admire -> " 53"
  Admit -> "531"
  AdultEntertainment -> "5614114341"
  AdvanceBookingRequirement -> "5849624728341"
  Advise -> " 583"
  Affiliation -> "0624"
  AggregateOffer -> "710"
  AggregateRating -> " 71714"
  AgreeAction -> " 7224"
  Aircraft -> " 2701"
  AlbumProductionType -> "66307522410"
  AlbumRelease -> "663769"
  AlbumReleaseType -> " 66376910"
  Albums -> " 663"
  Alcoholic -> "6262"
  AlfalfaSprout -> " 60609071"
  AlignmentObject -> " 643416721"
  AlignmentType -> " 6434110"
  AllWheelDriveConfiguration -> "686578240724"
  AlligatorPepper -> " 6100"
  AllocateAction -> "621224"
  Allspice -> " 6909"
  Alpaca -> " 602"
  AlternateName -> " 614143"
  AlternativeDance -> "61418549"
  AlternativeHeadline -> " 61418564"
  AlternativeMetal -> "61418316"
  AlternativeRock -> " 6141872"
  Aluminium -> "6343"
  Aluminum -> " 6343"
  Alumni -> " 6349"
  AlumniOf -> "63498"
  Amaranth -> " 3740"
  Ambient -> "3641"
  AmbientDub -> "364156"
  AmbientHouse -> "36419"
  AmbientTechno -> " 3641124"
  AmenityFeature -> "341012"
  Americium -> "37993"
  AmountOfThisGood -> "3418995"
  Amuse -> "393"
  AmusementPark -> " 39334102"
  Angelica -> " 4762"
  Angular -> "496"
  AnimalShelter -> " 436261"
  Anise -> "49"
  Announce -> " 449"
  AnnualPercentageRate -> " 4960941771"
  Answer -> " 49"
  AnswerCount -> " 49241"
  AntiFolk -> "4102"
  Apartment -> "01341"
  ApartmentComplex -> "01341230629"
  Apologise -> "0673"
  ApplicationCategory -> " 06224217"
  ApplicationSubCategory -> " 0622496217"
  ApplicationSuite -> "06224981"
  AppliesToDeliveryMethod -> " 0615687305"
  AppliesToPaymentMethod -> "0610341305"
  ApplyAction -> " 06224"
  Appreciate -> " 0721"
  Approve -> "078"
  Apricot -> "0721"
  Aquarium -> " 2873"
  AromaticGinger -> "7312747"
  Arrange -> "744"
  Arrest -> " 791"
  ArrivalAirport -> "78601"
  ArrivalBusStop -> " 78669910"
  ArrivalGate -> " 7861"
  ArrivalPlatform -> " 78606103"
  ArrivalStation -> "7869124"
  ArrivalTerminal -> " 7861346"
  ArrivalTime -> " 78613"
  Arrive -> " 78"
  ArriveAction -> "78224"
  ArtEdition -> "1524"
  ArtGallery -> "167"
  ArtMedium -> " 1353"
  ArtPunk -> " 1042"
  Artichoke -> "1122"
  Article -> "126"
  ArticleBody -> " 12665"
  ArticleSection -> "1269224"
  ArtworkSurface -> "182909"
  Asafoetida -> " 9015"
  Asbestos -> " 36919"
  AsianUnderground -> "4445745"
  AskAction -> " 92224"
  Asparagus -> "9079"
  Asphalt -> "9061"
  AssemblyVersion -> " 9366824"
  AssessAction -> "99224"
  AssignAction -> "94224"
  AssociatedArticle -> " 9215126"
  AssociatedMedia -> " 921535"
  Astringent -> " 9174441"
  Attach -> " 112"
  Attendee -> " 145"
  Attendees -> "145"
  Audience -> " 549"
  AudienceType -> "54910"
  AudioObject -> " 56721"
  AudiobookFormat -> " 562031"
  AuthorizeAction -> " 073224"
  AutoBodyShop -> " 16520"
  AutoDealer -> "156"
  AutoPartsStore -> " 10191"
  AutoRental -> "17416"
  AutoWash -> "182"
  Autolytic -> "1699"
  AutomatedTeller -> " 13116"
  AutomotiveBusiness -> "13186349"
  AutomotiveOntologyWgclass -> "13184167"
  Availability -> " 86661"
  AvailabilityEnds -> "8666145"
  AvailabilityStarts -> "86661911"
  AvailableAtOrFrom -> " 86661073"
  AvailableChannel -> "86661246"
  AvailableDeliveryMethod -> "86665687305"
  AvailableFrom -> " 8666073"
  AvailableLanguage -> " 86666487"
  AvailableOnDevice -> "86664589"
  AvailableThrough -> "866607"
  AvantGardeJazz -> " 873"
  Avocado -> "825"
  AwayTeam -> "813"
  Baked -> "621"
  Bakery -> " 627"
  Balance -> "6649"
  Balanced -> " 66491"
  BalearicBeat -> "667261"
  BallisticNylon -> "66912464"
  BaltimoreClub -> " 6613266"
  Banana -> " 644"
  BananaKetchup -> " 6442120"
  BananaSquash -> "6449282"
  BankAccount -> " 642241"
  BankOrCreditUnion -> " 64227519494"
  BarOrPub -> " 606"
  Barathea -> " 670"
  BarbecueSauce -> " 662999"
  Barcode -> "625"
  Barnyard -> " 6495"
  BaseSalary -> "69967"
  Basil -> "636"
  Bassline -> " 69646964"
  Bat -> "61"
  Battle -> " 616"
  Beach -> "612"
  BeanSprout -> "649071"
  BeatMusic -> " 613932"
  BeauMondeSeasoning -> " 69344"
  BeautySalon -> " 691964"
  Bebop -> "660"
  Bed -> "65"
  BedAndBreakfast -> "6545672091"
  BedDetails -> "65516"
  BedfordCord -> " 650756507525"
  BefriendAction -> "60745224"
  BellPepper -> "6600"
  Belong -> " 664"
  Benefits -> " 6401"
  BengalineSilk -> " 6464962"
  Berkelium -> "6263"
  Beryllium -> "6763"
  BestRating -> "691714"
  BetaCloth -> " 61260"
  BibExTerm -> "662913"
  Bilberry -> " 6667"
  BillingAddress -> "664579"
  BillingIncrement -> "664427341"
  BillingPeriod -> " 664075"
  BirthDate -> " 6051"
  BirthPlace -> "60069"
  Bismuth -> "6330"
  Bitter -> " 61"
  BizarreSilk -> " 63962"
  BlackBean -> " 66264"
  BlackCardamom -> " 6622533"
  BlackEyedPea -> " 66250"
  BlackMetal -> "662316"
  BlackMustard -> "6623915"
  BlackPeppercorn -> " 6620024"
  BlackVinegar -> "66284"
  Blackberry -> " 66267"
  Blackcurrant -> " 6622741"
  Bleach -> " 6612"
  Bless -> "669"
  Blind -> "6645"
  Blink -> "6642"
  BlogPost -> "66091"
  BlogPosting -> " 660914"
  BlogPosts -> " 66091"
  BloodOrange -> " 665744"
  Blueberry -> "6667"
  Blush -> "662"
  BoardingGroup -> " 65470"
  BoardingPolicy -> "654069"
  BoardingPolicyType -> " 65406910"
  Boast -> "691"
  Bobbinet -> " 6641"
  BodyOfWater -> "65881"
  Bohrium -> "673"
  BoiledWool -> "6686"
  Boldo -> "665"
  BolivianCoriander -> " 66842745"
  Bolt -> " 661"
  Bombazine -> "63634"
  BookEdition -> " 62524"
  BookFormat -> "62031"
  BookFormatType -> " 6203110"
  BookSeries -> "62973"
  BookingAgent -> "624741"
  BookingTime -> " 62413"
  BookmarkAction -> "6232224"
  Boolean -> "664"
  BorrowAction -> "67224"
  BossaNova -> " 48"
  Bounce -> " 649"
  BouncyHouse -> " 6499"
  BouncyTechno -> "649124"
  BowlingAlley -> "6646"
  Box -> "629"
  Boysenberry -> "63467"
  Branch -> " 6742"
  BranchCode -> "674225"
  BranchOf -> "67428"
  Brand -> "6745"
  BrazilianPepper -> " 6736400"
  Breadcrumb -> " 675273"
  BreadcrumbList -> "675273691"
  Breadfruit -> " 675071"
  Breakbeat -> "67261"
  BreakbeatHardcore -> " 67261"
  Breathe -> "679"
  Brewery -> "677"
  Bridge -> " 677"
  Bright -> " 671"
  Brilliance -> " 676949"
  Brilliantine -> " 6769414"
  BritishDance -> "6712549"
  Britpop -> "67100"
  BroadBeans -> "67564"
  BroadcastAffiliateOf -> " 6752910618"
  BroadcastChannel -> "6752911246"
  BroadcastChannelId -> " 67529112465"
  BroadcastDisplayName -> " 675291590643"
  BroadcastEvent -> "675291841"
  BroadcastOfEvent -> " 6752918841"
  BroadcastRelease -> "675291769"
  BroadcastService -> "675291989"
  BroadcastServiceTier -> " 6752919891"
  BroadcastTimezone -> " 675291"
  Broadcaster -> "675291"
  Broadcloth -> " 675260"
  Brocade -> "6725"
  Broccoflower -> " 672067672067"
  Broccoli -> " 6726"
  BrokenBeat -> "672461"
  BrownMustard -> "6743915"
  BrowserRequirements -> " 673728341"
  Bruise -> " 673"
  Brush -> "672"
  BrusselsSprout -> "679639071"
  Bubble -> " 666"
  BubblegumDance -> "6663549"
  Buckram -> "6273"
  BuddhistTemple -> "65911306"
  Bump -> " 630"
  Bunting -> "6414"
  Burlap -> " 660"
  BusName -> " 6943"
  BusNumber -> " 69436"
  BusReservation -> "6973824"
  BusStation -> "699124"
  BusStop -> " 69910"
  BusTrip -> " 69170"
  BusinessAudience -> "6349549"
  BusinessEntityType -> " 634941110"
  BusinessEvent -> " 6349841"
  BusinessFunction -> "63490424"
  ButternutSquash -> " 61419282"
  Buttery -> "617"
  ByArtist -> "6191"
  Cabbage -> "267"
  CableOrSatelliteService -> " 2669161989"
  Cadmium -> "2533"
  CafeOrCoffeeShop -> "202020"
  Calabrese -> "26679"
  Calcium -> "2693"
  Calculate -> "262961"
  Calico -> " 262"
  Californium -> "26043"
  Calories -> " 267"
  Cambric -> "23672"
  Camp -> " 230"
  Campground -> " 230745"
  CampingPitch -> "2302304012"
  Canal -> "246"
  CanaryMelon -> " 247364"
  CancelAction -> "2496224"
  Candidate -> "24551"
  Cantaloupe -> " 24160"
  CanterburyScene -> " 2416794"
  Canvas -> " 2489"
  CapeJazz -> "2073"
  Caption -> "2024"
  Caraway -> "278"
  CarbohydrateContent -> " 2657124141"
  CarbonFiber -> " 26406"
  Cardamom -> " 2533"
  CargoVolume -> " 28693"
  Carpet -> " 201"
  CarrierRequirements -> " 27728341"
  Carrot -> " 271"
  Cashmere -> " 223"
  Casino -> " 294"
  CassetteFormat -> "291031"
  Cassis -> " 299"
  CatPee -> "210"
  Catalog -> "216"
  CatalogNumber -> " 216436"
  Category -> " 217"
  CatholicChurch -> "20621212"
  Cauliflower -> "2606"
  Cause -> "23"
  CayennePepper -> " 2400"
  CedarBark -> " 9562"
  Celeriac -> " 9672"
  Celery -> " 967"
  CeleryPowder -> "96705"
  CelerySeed -> "96795"
  Celtic -> " 2612"
  CelticMetal -> " 2612316"
  CelticPunk -> "2612042"
  Cement -> " 9341"
  Cemetery -> " 9317"
  CeramicTile -> " 973216"
  Cesium -> " 933"
  ChaatMasala -> " 121396"
  Challenge -> "12644"
  ChamberJazz -> " 123673"
  Chambray -> " 2367"
  Chamomile -> "2336"
  Change -> " 1244"
  CharCloth -> " 12260"
  CharacterAttribute -> "272117691"
  CharacterName -> " 272143"
  Charcoal -> " 1226"
  Charmeuse -> "233"
  Chase -> "129"
  Cheat -> "121"
  CheatCode -> " 12125"
  CheckAction -> " 122224"
  CheckInAction -> "1224224"
  CheckOutAction -> " 1221224"
  CheckinTime -> " 122413"
  CheckoutPage -> "122107"
  CheckoutTime -> "122113"
  Cheesecloth -> "123260"
  Chenille -> " 246"
  Cherimoya -> "1273"
  Cherry -> " 127"
  Chervil -> "1286"
  Chewy -> "12"
  ChicagoHouse -> "229"
  Chickpea -> " 1220"
  Chiffon -> "204"
  ChildCare -> " 12652"
  ChildMaxAge -> "12653297"
  ChildMinAge -> "1265347"
  ChiliOil -> "1266"
  ChiliPepper -> " 12600"
  ChiliPeppers -> "12600"
  ChiliPowder -> " 12605"
  ChiliSauce -> "12699"
  ChillOut -> "1261"
  Chimichurri -> "123127"
  ChineseRock -> " 124372"
  Chino -> "124"
  Chintz -> " 1249"
  Chives -> " 1283"
  Chocolaty -> "12261"
  Choke -> "122"
  CholesterolContent -> "26917624141"
  ChooseAction -> "123224"
  Chop -> " 120"
  ChristianMetal -> "279124316"
  ChristianPunk -> " 279124042"
  ChristianRock -> " 27912472"
  Chromium -> " 2733"
  Church -> " 1212"
  Chutney -> "1214"
  Cicely -> " 996"
  CigarBox -> "9629"
  Cilantro -> " 96417"
  CinderBlock -> " 945662"
  Cinnamon -> " 9434"
  Citation -> " 9124"
  CityHall -> "916"
  CivicStructure -> "982917212"
  Claim -> "263"
  ClaimReviewed -> " 263789"
  ClassicTrance -> " 26921749"
  Clean -> "264"
  Clementine -> " 263414"
  Clip -> " 260"
  ClipNumber -> "260436"
  Closed -> " 2635"
  Closes -> " 269"
  ClothOfGold -> "260865"
  ClothingStore -> " 269491"
  Cloudberry -> " 26567"
  Clove -> "268"
  Coach -> "212"
  Cobalt -> " 2661"
  CocktailSauce -> " 221699"
  Coconut -> "2241"
  Code -> " 25"
  CodeRepository -> "2570317"
  CodeSampleType -> " 25930610"
  CollardGreen -> "26574"
  Collect -> "2621"
  Collection -> " 26224"
  CollectionPage -> "2622407"
  CollegeOrUniversity -> "26794891"
  ComedyClub -> "235266"
  ComedyEvent -> " 235841"
  Command -> "2345"
  Comment -> "2341"
  CommentAction -> " 2341224"
  CommentCount -> "2341241"
  CommentPermission -> " 23410324"
  CommentText -> " 23411291"
  CommentTime -> " 234113"
  Communicate -> "239421"
  CommunicateAction -> " 239421224"
  Compare -> "230"
  Compete -> "2301"
  Competitor -> " 23011"
  CompilationAlbum -> "230624663"
  Complain -> " 23064"
  Complete -> " 23061"
  CompletedActionStatus -> "230612249119"
  Complex -> "230629"
  Composer -> " 2303"
  CompoundPriceSpecification -> " 230450799090224"
  ComputerLanguage -> "230916487"
  ComputerStore -> " 2309191"
  Concentrate -> "2494171"
  Concentrated -> " 24941715"
  Concern -> "2494"
  Concrete -> " 24271"
  Conductive -> " 245218"
  Confess -> "2409"
  ConfirmAction -> " 2403224"
  ConfirmationNumber -> "240324436"
  Confuse -> "24093"
  Connected -> "2421"
  Consider -> " 2495"
  Consist -> "24991"
  ConsumeAction -> " 24993224"
  ContactOption -> " 24121024"
  ContactPage -> " 2412107"
  ContactPoint -> "24121041"
  ContactPointOption -> " 24121041024"
  ContactPoints -> " 24121041"
  ContactType -> " 2412110"
  Contain -> "2414"
  ContainedIn -> " 24144"
  ContainedInPlace -> " 24144069"
  ContainsPlace -> " 2414069"
  ContainsSeason -> "2414934"
  ContemporaryFolk -> "241307702"
  ContentLocation -> " 241416224"
  ContentRating -> " 24141714"
  ContentSize -> " 2414193"
  ContentType -> " 2414110"
  ContentUrl -> "24141976"
  Continent -> "241441"
  ContinentalJazz -> " 241441673"
  Continue -> " 24149"
  Contributor -> "2417691"
  ControlAction -> " 24176224"
  ConvenienceStore -> "24844991"
  Conversation -> " 248924"
  CookAction -> "22224"
  CookTime -> "2213"
  CookingMethod -> " 224305"
  CoolJazz -> "2673"
  Coolmax -> "26329"
  CopyrightHolder -> " 207165"
  CopyrightYear -> " 20719"
  Cordura -> "2597"
  Corduroy -> " 257"
  CorianderLeaf -> " 274560"
  CorianderSeed -> " 274595"
  Corked -> " 221"
  Corn -> " 24"
  CornSalad -> " 24965"
  Corporation -> "20724"
  Correct -> "2721"
  CosmicDisco -> " 2332592"
  Cotton -> " 214"
  Cough -> "20"
  CountriesNotSupported -> "241741901"
  CountriesSupported -> "2417901"
  Country -> "2417"
  CountryOfOrigin -> "24178774"
  Courgette -> "241"
  CourseCode -> "2925"
  CourseInstance -> "2949149"
  CourseMode -> "2935"
  CoursePrerequisites -> " 290772831"
  Courthouse -> " 219"
  CoverageEndTime -> "28774513"
  CoverageStartTime -> "287791113"
  Cowpunk -> "2022042"
  CrabBoil -> "27666"
  Cranberry -> "27467"
  Crape -> "270"
  Crawl -> "276"
  Creamy -> " 273"
  CreateAction -> "271224"
  CreativeWork -> "271882"
  CreativeWorkSeason -> " 271882934"
  CreativeWorkSeries -> " 271882973"
  Creator -> "271"
  CreditCard -> "275125"
  CreditedTo -> "27511"
  Crematorium -> "273173"
  Cretonne -> " 2714"
  Crimplene -> "273064"
  Crisp -> "2790"
  Cross -> "279"
  CrossoverJazz -> " 279873"
  CrossoverThrash -> " 2798072"
  Crunk -> "2742"
  Crush -> "272"
  CrushedRedPepper -> " 2727500"
  CrustPunk -> " 2791042"
  Cubeb -> "2966"
  Cucumber -> " 29236"
  Cumin -> "234"
  Curium -> " 2973"
  Currant -> "2741"
  CurrenciesAccepted -> "274929015"
  Currency -> " 2749"
  CurrencyConversionService -> "274924824989"
  CurryKetchup -> "272120"
  CurryLeaf -> " 2760"
  CurryPowder -> " 2705"
  Customer -> " 2913"
  Daikon -> " 524"
  Dam -> "53"
  Damage -> " 537"
  DamagedCondition -> "53724524"
  Damask -> " 5392"
  Damson -> " 5334"
  DanceEvent -> "549841"
  DanceGroup -> "54970"
  DancePop -> "54900"
  DancePunk -> " 549042"
  DanceRock -> " 54972"
  DarkAmbient -> " 523641"
  DarkCabaret -> " 52267"
  DarkElectro -> " 526217"
  DarkWave -> "5288"
  DarksideJungle -> "746"
  Darmstadtium -> " 539113"
  DataCatalog -> " 51216"
  DataDownload -> "515465"
  DataFeed -> "5105"
  DataFeedElement -> "51056341"
  DataFeedItem -> " 510513"
  DataType -> "5110"
  DatasetClass -> "269"
  DatasetTimeInterval -> "134186"
  DateCreated -> " 51271"
  DateDeleted -> " 51561"
  DateIssued -> "512"
  DateModified -> "51350"
  DatePosted -> "51091"
  DatePublished -> " 510662"
  DateRead -> "5175"
  DateReceived -> "51798"
  DateSent -> "51941"
  DateTime -> "5113"
  DateVehicleFirstRegistered -> "518260917791"
  DatedMoneySpecification -> "515349090224"
  Dateline -> " 5164"
  DayOfWeek -> "5882"
  Dazzle -> " 536"
  DeactivateAction -> "52181224"
  DeathDate -> " 5051"
  DeathIndustrial -> " 50459176"
  DeathMetal -> "50316"
  DeathPlace -> "50069"
  Decay -> "52"
  Deceive -> "598"
  Decide -> " 595"
  Decorate -> " 5271"
  DeepHouse -> " 509"
  DefaultValue -> "5061869"
  DefenceEstablishment -> "504991662341"
  DeleteAction -> "561224"
  Delight -> "561"
  Deliver -> "568"
  DeliveryAddress -> " 5687579"
  DeliveryChargeSpecification -> "56871279090224"
  DeliveryEvent -> " 5687841"
  DeliveryLeadTime -> " 56876513"
  DeliveryMethod -> "5687305"
  DeliveryStatus -> "56879119"
  Demand -> " 5345"
  DemoAlbum -> " 53663"
  Denim -> "543"
  Dense -> "549"
  Dentist -> "54191"
  DepartAction -> "501224"
  Department -> " 501341"
  DepartmentStore -> " 50134191"
  DepartureAirport -> "501201"
  DepartureBusStop -> " 501269910"
  DepartureGate -> " 50121"
  DeparturePlatform -> " 501206103"
  DepartureStation -> "50129124"
  DepartureTerminal -> " 50121346"
  DepartureTime -> " 501213"
  Depend -> " 5045"
  Dependencies -> " 504549"
  DepositAccount -> "5031241"
  Depth -> "500"
  Describe -> " 59276"
  Description -> "5927024"
  DesertRock -> "53172"
  Deserve -> "538"
  Destroy -> "5917"
  Detect -> " 5121"
  DetroitTechno -> " 5171124"
  Develop -> "5860"
  DiabeticDiet -> "561251"
  DigitalAudioTapeFormat -> "5716510031"
  DigitalDocument -> " 5716529341"
  DigitalDocumentPermission -> "57165293410324"
  DigitalDocumentPermissionType -> " 5716529341032410"
  DigitalFormat -> " 5716031"
  DigitalHardcore -> " 5716"
  DijonKetchup -> "72120"
  DijonMustard -> "73915"
  Dill -> " 56"
  DillSeed -> "5695"
  DimensionalLumber -> " 534246636"
  Dimity -> " 531"
  Dip -> "50"
  Director -> " 5721"
  Directors -> "5721"
  Disagree -> " 597"
  DisagreeAction -> "597224"
  DisambiguatingDescription -> " 5936915927024"
  Disappear -> "590"
  Disapprove -> " 59078"
  Disarm -> " 593"
  Disco -> "592"
  DiscoPolo -> " 59206"
  Discontinued -> " 59241495"
  Discount -> " 59241"
  DiscountCode -> "5924125"
  DiscountCurrency -> "592412749"
  Discover -> " 5928"
  DiscoverAction -> "5928224"
  Discusses -> "5929"
  DiscussionForumPosting -> " 592240730914"
  DiscussionUrl -> " 59224976"
  Dislike -> "5962"
  DislikeAction -> " 5962224"
  DissolutionDate -> " 5962451"
  Distance -> " 59149"
  Distribution -> " 59176924"
  DivaHouse -> " 589"
  Divide -> " 585"
  Dixieland -> "529645"
  DjmixAlbum -> "663"
  DonateAction -> "541224"
  DonegalTweed -> "546185"
  DoomMetal -> " 53316"
  DoorTime -> "513"
  Double -> " 566"
  DownloadAction -> "5465224"
  DownloadUrl -> " 5465976"
  DownvoteCount -> " 5481241"
  Drag -> " 57"
  DrawAction -> "57224"
  Dream -> "573"
  DreamHouse -> "5739"
  DreamPop -> "57300"
  DreamTrance -> " 5731749"
  Dress -> "579"
  DriedLime -> " 57563"
  Drill -> "576"
  DrinkAction -> " 5742224"
  DriveWheelConfiguration -> "57886240724"
  DriveWheelConfigurationValue -> "57886240724869"
  DroneMetal -> "574316"
  Drop -> " 570"
  DropoffLocation -> " 57006224"
  DropoffTime -> " 570013"
  Drown -> "574"
  Drugget -> "571"
  Drum -> " 573"
  DrumAndBass -> "5734569"
  Dry -> "57"
  DryCleaningOrLaundry -> "572646457"
  Dubnium -> "5643"
  Dubstep -> "56910"
  Duck -> " 52"
  DunedinSound -> "5454945"
  Duration -> " 59724"
  DurationOfWarranty -> " 5972488741"
  Durian -> " 574"
  Dust -> " 591"
  DutchHouse -> "5129"
  Dysprosium -> " 590733"
  ETextiles -> " 12916"
  EastAsianPepper -> "914400"
  Ebook -> "62"
  Editor -> " 51"
  Educate -> "5921"
  EducationEvent -> "59224841"
  EducationRequirements -> " 59224728341"
  EducationalAlignment -> "59224664341"
  EducationalAudience -> " 592246549"
  EducationalFramework -> "59224607382"
  EducationalOrganization -> " 5922464324"
  EducationalRole -> " 59224676"
  EducationalUse -> "59224693"
  Eggplant -> " 0641"
  Einsteinium -> "49143"
  Elderberry -> " 6567"
  Electrician -> "621724"
  Electro -> "6217"
  ElectroBackbeat -> " 62176261"
  ElectroGrime -> "621773"
  ElectroHouse -> "62179"
  ElectroIndustrial -> " 6217459176"
  Electroacoustic -> "62172912"
  ElectronicArtMusic -> " 62174213932"
  ElectronicRock -> "62174272"
  Electronica -> "621742"
  ElectronicsStore -> "621742991"
  Electropop -> " 621700"
  Elegant -> "641"
  ElementarySchool -> "63417926"
  Elevation -> "6824"
  EligibleCustomerType -> " 6766291310"
  EligibleDuration -> "676659724"
  EligibleQuantity -> "676628411"
  EligibleRegion -> "6766774"
  EligibleTransactionVolume -> "676617432248693"
  Email -> "36"
  EmailMessage -> "36397"
  Embarrass -> "3679"
  Embassy -> "369"
  EmbedUrl -> "365976"
  EmergencyService -> "3749989"
  Employee -> " 306"
  EmployeeRole -> "30676"
  Employees -> "306"
  EmploymentAgency -> "306341749"
  EmploymentType -> "30634110"
  Empty -> "31"
  EncodesCreativeWork -> "425271882"
  Encoding -> " 425"
  EncodingFormat -> "425031"
  EncodingType -> "42510"
  Encodings -> "425"
  Encourage -> "4277"
  EndTime -> " 4513"
  Endive -> " 458"
  EndorseAction -> " 459224"
  EngineSpecification -> " 4749090224"
  Entertain -> "4114"
  EntertainmentBusiness -> " 41143416349"
  EntryPoint -> "417041"
  Enumeration -> "493724"
  Epazote -> "031031"
  EpicDoom -> "0253"
  Episode -> "095"
  EpisodeNumber -> " 095436"
  Episodes -> " 095"
  Equal -> "286"
  EstimatedFlightDuration -> "913106159724"
  EtherealWave -> "07688"
  EthnicElectronica -> " 042621742"
  EuroDisco -> " 97592"
  EuropeanFreeJazz -> " 97040773"
  Europium -> " 9703"
  Event -> "841"
  EventCancelled -> "8412496"
  EventPostponed -> "8410904"
  EventRescheduled -> "84172596"
  EventReservation -> "84173824"
  EventScheduled -> "84125965"
  EventStatus -> " 8419119"
  EventStatusType -> "841911910"
  EventVenue -> "841849"
  Examine -> "334"
  ExampleOfWork -> "3306882"
  Excuse -> " 29293"
  ExecutableLibraryName -> "329166667743"
  Exercise -> " 2993"
  ExerciseAction -> "2993224"
  ExerciseCourse -> "299329"
  ExerciseGym -> " 299373"
  ExhibitionEvent -> " 29624841"
  ExifData -> "51"
  Expand -> " 29045"
  Expect -> " 29021"
  ExpectedArrivalFrom -> "29021786073"
  ExpectedArrivalUntil -> " 29021786416"
  ExpectsAcceptanceOf -> "290212901498"
  ExperienceRequirements -> "290749728341"
  ExperimentalRock -> "2907341672"
  Expires -> "290"
  Explain -> "29064"
  Explode -> "29065"
  Expressive -> " 290798"
  Extend -> " 29145"
  Extracted -> "291721"
  Fade -> " 05"
  FailedActionStatus -> " 0652249119"
  FallenOver -> "0648"
  FamilyName -> "03643"
  FastFoodRestaurant -> " 09105791741"
  FatContent -> "0124141"
  FaxNumber -> " 029436"
  FeatureList -> " 012691"
  FeesAndCommissionsSpecification -> " 04523249090224"
  Fence -> "049"
  Fennel -> " 046"
  Fenugreek -> "04972"
  Fermium -> "033"
  Festival -> " 09186"
  FiberContent -> "0624141"
  FileFormat -> "06031"
  FileSize -> "0693"
  FilmAction -> "063224"
  FinancialProduct -> "0442607521"
  FinancialService -> "04426989"
  FindAction -> "045224"
  FireStation -> " 09124"
  FirstPerformance -> "09100349"
  FishPaste -> " 02091"
  FishSauce -> " 0299"
  FiveSpicePowder -> "0890905"
  Fix -> "029"
  Flabby -> " 066"
  Flamboyant -> " 063641"
  Flannel -> "0646"
  Flap -> " 060"
  Flight -> " 061"
  FlightDistance -> "06159149"
  FlightNumber -> "061436"
  FlightReservation -> " 06173824"
  Float -> "061"
  Flood -> "065"
  FloorSize -> " 0693"
  FloridaBreaks -> " 0675672"
  Florist -> "06791"
  Fold -> " 065"
  FolkPunk -> "02042"
  Folktronica -> "021742"
  FoodEstablishment -> " 0591662341"
  FoodEstablishmentReservation -> " 059166234173824"
  FoodEvent -> " 05841"
  FoodFriendly -> "050746"
  FoodService -> " 05989"
  Form -> " 03"
  Foulard -> "06"
  Founder -> "045"
  FoundingDate -> "04551"
  FoundingLocation -> "0456224"
  FourWheelDriveConfiguration -> " 086578240724"
  Foxy -> " 029"
  Francium -> " 07493"
  FreakFolk -> " 07202"
  Freestyle -> "07916"
  FreestyleHouse -> "079169"
  FrenchHouse -> " 07429"
  Friday -> " 075"
  Frighten -> " 0714"
  Frisee -> " 073"
  FromLocation -> "0736224"
  FrontWheelDriveConfiguration -> "074186578240724"
  FruitKetchup -> "0712120"
  FruitPreserves -> "0710738"
  Fry -> "07"
  FrySauce -> "0799"
  FuelConsumption -> " 096249324"
  FuelEfficiency -> "0960249"
  FuelType -> "09610"
  FuneralDoom -> " 0947653"
  FunkMetal -> " 042316"
  FunkyHouse -> "0429"
  FurnitureStore -> "041291"
  Fustian -> "0914"
  Gadolinium -> " 5643"
  GamePlatform -> "306103"
  GamePlayMode -> " 30635"
  GameServer -> "398"
  GameServerStatus -> " 3989119"
  GameTip -> " 310"
  GaragePunk -> "74042"
  GarageRock -> "7472"
  GaramMasala -> " 396"
  GardenStore -> " 5491"
  GarlicChives -> "621283"
  GarlicPowder -> "6205"
  GarlicSalt -> "62961"
  GasStation -> "99124"
  GatedResidenceCommunity -> "157354923941"
  GemSquash -> " 739282"
  Gender -> " 745"
  GenderType -> "74510"
  GeneralContractor -> " 7476241721"
  GeoCircle -> " 9926"
  GeoCoordinates -> "92541"
  GeoMidpoint -> " 935041"
  GeoRadius -> " 9759"
  GeoShape -> "920"
  GeographicArea -> "770267"
  Georgette -> "771"
  GhettoHouse -> " 19"
  Ginger -> " 747"
  GivenName -> " 8443"
  GlamMetal -> " 63316"
  GlamRock -> "6372"
  Glass -> "69"
  GlassBrick -> "69672"
  GlassFiber -> "6906"
  GlassWool -> " 6986"
  GlobalLocationNumber -> " 6666224436"
  GlueLaminate -> "66341"
  GlutenFreeDiet -> " 6140751"
  GojiBerry -> " 67"
  GolfCourse -> "6029"
  GoodRelationsClass -> " 57624269"
  GoodRelationsTerms -> " 5762413"
  Gooseberry -> " 367"
  GothicMetal -> " 02316"
  GothicRock -> "0272"
  GovernmentBuilding -> "843416654"
  GovernmentOffice -> "8434109"
  GovernmentOrganization -> "843414324"
  GovernmentPermit -> "84341031"
  GovernmentService -> " 84341989"
  GrainsOfParadise -> " 7480759"
  GrainsOfSelim -> "748"
  Grapefruit -> " 70071"
  Gravel -> " 786"
  GreaterGalangal -> " 71646"
  GreaterOrEqual -> " 71286"
  GreenBean -> " 7464"
  GreenPepper -> " 7400"
  GreenPeppercorn -> " 740024"
  Grenadine -> "7454"
  GrenfellCloth -> " 7406260"
  GroceryStore -> "79791"
  GrooveMetal -> " 78316"
  Grosgrain -> "774"
  GroupBoardingPolicy -> "70654069"
  Guacamole -> "8236"
  Guarantee -> "741"
  Guava -> "88"
  GypsumBoard -> " 709365"
  Habanero -> " 647"
  Haircloth -> "260"
  HalalDiet -> " 6651"
  HardBop -> " 560"
  HardDance -> " 5549"
  HardRock -> "572"
  HardTrance -> "51749"
  Hardcover -> "528"
  HardwareStore -> " 5891"
  HarrisTweed -> " 79185"
  HasCourseInstance -> "82949149"
  HasDeliveryMethod -> "85687305"
  HasDigitalDocumentPermission -> "857165293410324"
  HasMap -> "830"
  HasMenu -> " 8349"
  HasMenuItem -> "834913"
  HasMenuSection -> " 83499224"
  HasOfferCatalog -> "80216"
  HasPart -> " 801"
  Headline -> " 564"
  HealthAndBeautyBusiness -> " 60456916349"
  HealthClub -> "60266"
  HearingImpairedSupported -> " 74305901"
  HeavyMetal -> "8316"
  Help -> " 60"
  Herbaceous -> " 629"
  Herbal -> " 66"
  HerbesDeProvence -> " 50789"
  HerbsAndSpice -> "645909"
  HighPrice -> " 079"
  HighSchool -> "926"
  HinduDiet -> " 4551"
  HinduTemple -> " 451306"
  HipHouse -> "09"
  HiringOrganization -> "4324"
  HobbyShop -> " 620"
  Hodden -> " 54"
  HojaSanta -> " 941263"
  Holmium -> "633"
  HolyBasil -> " 6636"
  HomeAndConstructionBusiness -> " 345249172246349"
  HomeGoodsStore -> " 3591"
  HomeLocation -> "36224"
  HomeTeam -> "313"
  HoneyDill -> " 456"
  Honeydew -> " 459"
  HonorificPrefix -> " 470207029"
  HonorificSuffix -> " 47029029"
  HorrorPunk -> "7042"
  Horseradish -> "9752"
  Hospital -> " 9016"
  HostingOrganization -> " 914324"
  HotMustard -> "13915"
  HotSauce -> "199"
  HotelRoom -> " 1673"
  Houndstooth -> "4310"
  HoursAvailable -> "8666"
  HousePainter -> "9047047"
  HttpMethod -> "12110305"
  Huckleberry -> "2667"
  IataCode -> "125"
  IceCreamShop -> " 927320"
  Identify -> " 5410"
  IdliPodi -> "56"
  IgnoreAction -> "4224"
  Illustrator -> "69171"
  ImageGallery -> "3767"
  ImageObject -> " 376721"
  Imagine -> "374"
  Impress -> "3079"
  Improve -> "3078"
  InBroadcastLineup -> "4675291640"
  InLanguage -> "46487"
  InPlaylist -> "406691"
  InStock -> " 4912"
  InStoreOnly -> "49146"
  IncentiveCompensation -> " 494182304924"
  Incentives -> " 49418"
  Include -> "4265"
  IncludedComposition -> " 42655230324"
  IncludedDataCatalog -> "4265551216"
  IncludedInDataCatalog -> " 42655451216"
  IncludesObject -> "42656721"
  Increase -> " 4279"
  IndianBayLeaf -> "454660"
  IndieFolk -> " 4502"
  IndiePop -> "4500"
  IndieRock -> " 4572"
  Indium -> " 453"
  IndividualProduct -> " 4587607521"
  Industrial -> " 459176"
  IndustrialFolk -> "45917602"
  IndustrialMetal -> " 459176316"
  IndustrialRock -> "45917672"
  Industry -> " 45917"
  IneligibleRegion -> "46766774"
  Influence -> "40649"
  Inform -> " 403"
  InformAction -> "403224"
  Ingredients -> "47541"
  Inject -> " 4721"
  Injure -> " 47"
  InsertAction -> "491224"
  InstallAction -> " 4916224"
  InstallUrl -> "4916976"
  Instructor -> " 491721"
  Instrument -> " 4917341"
  InsuranceAgency -> " 42749749"
  Intangible -> " 414466"
  Integer -> "417"
  IntellectuallySatisfying -> "416212691904"
  IntelligentDrumAndBass -> "4167415734569"
  Intend -> " 4145"
  InteractAction -> "41721224"
  InteractionCounter -> "417224241"
  InteractionService -> "417224989"
  InteractionStatistic -> "417224911912"
  InteractionType -> " 41722410"
  InteractivityType -> " 417218110"
  Interest -> " 41791"
  InterestRate -> "4179171"
  Interfere -> "410"
  InternetCafe -> "414120"
  Interrupt -> "41701"
  Introduce -> "417599"
  Invent -> " 4841"
  InventoryLevel -> "48417686"
  InvestmentOrDeposit -> "4893415031"
  Invite -> " 481"
  InviteAction -> "481224"
  Invoice -> "489"
  IrishLinen -> "72644"
  Irritate -> " 711"
  IsAccessibleForFree -> " 329966007"
  IsAccessoryOrSparePartFor -> " 3299790010"
  IsBasedOn -> "3694"
  IsBasedOnUrl -> "3694976"
  IsConsumableFor -> "324993660"
  IsFamilyFriendly -> " 30360746"
  IsGift -> "301"
  IsLiveBroadcast -> "368675291"
  IsPartOf -> " 3018"
  IsRelatedTo -> "376151"
  IsSimilarTo -> "39361"
  IsVariantOf -> "387418"
  IssueNumber -> " 2436"
  IssuedBy -> "26"
  IssuedThrough -> " 207"
  ItaloDance -> "16549"
  ItaloDisco -> "16592"
  ItaloHouse -> "169"
  ItemAvailability -> "1386661"
  ItemCondition -> " 1324524"
  ItemList -> "13691"
  ItemListElement -> "136916341"
  ItemListOrder -> "136915"
  ItemListOrderAscending -> "1369159459454"
  ItemListOrderDescending -> " 1369155945"
  ItemListOrderType -> " 13691510"
  ItemListUnordered -> "13691455"
  ItemOffered -> " 130"
  ItemPage -> "1307"
  ItemReviewed -> "13789"
  ItemShipped -> " 1320"
  Jackfruit -> "72071"
  Jalapeno -> " 6049"
  JamaicanJerkSpice -> "732472909"
  JazzBlues -> " 73663"
  JazzFunk -> "73042"
  JazzFusion -> "730944"
  JazzRap -> " 7370"
  JazzRock -> "7372"
  JerusalemArtichoke -> "779631122"
  JewelryStore -> "76791"
  Jicama -> " 23"
  JobBenefits -> " 766401"
  JobLocation -> " 766224"
  JobPosting -> "760914"
  JobTitle -> "76116"
  JoinAction -> "74224"
  Judge -> "77"
  Juicy -> "79"
  Jujube -> " 776"
  JumpUp -> "7300"
  JuniperBerry -> "74067"
  KenteCloth -> "241260"
  Kerseymere -> " 233"
  Ketchup -> "2120"
  Kevlar -> " 286"
  Keywords -> " 285"
  KhakiDrill -> "22576"
  Kick -> " 22"
  KidneyBean -> "25464"
  Kill -> " 26"
  Kimchi -> " 2312"
  Kiss -> " 29"
  KiwiFruit -> " 28071"
  Kneel -> "46"
  Knock -> "42"
  KnownVehicleDamages -> "44826537"
  Kohlrabi -> " 2676"
  KosherDiet -> "2251"
  Krautrock -> "27172"
  Kumquat -> "23281"
  Label -> "666"
  LakeBodyOfWater -> " 6265881"
  Lampas -> " 6309"
  Landform -> " 6403"
  Landlord -> " 6465"
  LandmarksOrHistoricalBuildings -> "6432917266654"
  Language -> " 6487"
  Lanthanum -> "64043"
  LaserDiscFormat -> "63592031"
  LaserLike -> " 6362"
  LastReviewed -> "691789"
  LatinHouse -> "6149"
  LatinJazz -> " 61473"
  Latitude -> " 61195"
  Laugh -> "60"
  Launch -> " 642"
  Lavender -> " 6845"
  Lawrencium -> " 67493"
  Learn -> "64"
  LearningResourceType -> " 64479910"
  Leathery -> " 697"
  LeaveAction -> " 68224"
  LeftHandDriving -> "601455784"
  LegalName -> " 6643"
  LegalService -> "66989"
  LegislativeBuilding -> " 6796186654"
  Legume -> " 693"
  LeiCode -> " 625"
  Lemon -> "634"
  LemonBalm -> " 63463"
  LemonGrass -> "63479"
  LemonMyrtle -> " 634316"
  LemonPepper -> " 63400"
  LemonVerbena -> "634864"
  LendAction -> "645224"
  Lender -> " 645"
  Lentils -> "6416"
  Lesser -> " 69"
  LesserGalangal -> "69646"
  LesserOrEqual -> "69286"
  Lettuce -> "619"
  Library -> "6677"
  License -> "6949"
  Lighten -> "614"
  LikeAction -> "62224"
  LimaBean -> "6364"
  Lime -> " 63"
  LimitedAvailability -> " 631586661"
  Linen -> "644"
  LiquidFunk -> "6285042"
  LiquorStore -> " 6291"
  Liquorice -> "6272"
  List -> " 691"
  ListItem -> "69113"
  Listen -> " 694"
  ListenAction -> "694224"
  LiteraryEvent -> " 6177841"
  Lithium -> "603"
  LiveAlbum -> " 68663"
  LiveBlogPosting -> "68660914"
  LiveBlogUpdate -> " 6866051"
  Load -> " 65"
  LoanOrCredit -> " 642751"
  LoanTerm -> "6413"
  LocalBusiness -> " 6266349"
  Location -> " 6224"
  LocationCreated -> " 6224271"
  LocationFeatureSpecification -> " 62240129090224"
  LockerDelivery -> "625687"
  Locksmith -> "62930"
  Loden -> "654"
  LodgingBusiness -> " 6746349"
  LodgingReservation -> "67473824"
  LodgingUnitDescription -> " 6749415927024"
  LodgingUnitType -> "67494110"
  LongPepper -> "6400"
  Longitude -> "64195"
  Look -> " 62"
  Loquat -> " 6281"
  LoseAction -> "63224"
  Loser -> "63"
  Lovage -> " 687"
  Love -> " 68"
  LowCalorieDiet -> " 626751"
  LowFatDiet -> " 60151"
  LowLactoseDiet -> " 6621351"
  LowPrice -> "6079"
  LowSaltDiet -> "696151"
  Lutetium -> " 6123"
  Lychee -> " 612"
  Lyricist -> " 67991"
  Lyrics -> " 672"
  MachineKnitting -> " 324414"
  Madras -> " 3579"
  Magnesium -> "3433"
  MainContentOfPage -> " 3424141807"
  MainEntity -> "34411"
  MainEntityOfPage -> "34411807"
  MainstreamJazz -> "34917373"
  MakesOffer -> "320"
  Male -> " 36"
  Mamey -> "33"
  Manage -> " 347"
  Mandarine -> "34574"
  Manganese -> "3443"
  Mangetout -> "341"
  MangoGinger -> " 34747"
  MangoPickle -> " 34026"
  Manufacturer -> " 34902127"
  MapCategoryType -> "3021710"
  MapType -> " 3010"
  Marjoram -> " 3773"
  MarryAction -> " 37224"
  Mastic -> " 3912"
  Match -> "312"
  Material -> " 3176"
  MathRock -> "3072"
  Matter -> " 31"
  MaxPrice -> "329079"
  MaxValue -> "329869"
  MaximumAttendeeCapacity -> "329331452091"
  Mayonnaise -> " 343"
  MealService -> " 36989"
  MediaObject -> " 356721"
  MedicalOrganization -> " 35264324"
  MedievalMetal -> " 3586316"
  Meitnerium -> " 31473"
  MelodicDeathMetal -> "365250316"
  Melt -> " 361"
  Member -> " 336"
  MemberOf -> "3368"
  Members -> "336"
  MembershipNumber -> "33620436"
  Memorise -> " 3373"
  MemoryRequirements -> "337728341"
  Mendelevium -> "345683"
  MensClothingStore -> "269491"
  Mentions -> " 3424"
  Menu -> " 349"
  MenuItem -> "34913"
  MenuSection -> " 3499224"
  Merchant -> " 31241"
  Mercury -> "3297"
  Mesh -> " 32"
  MessUp -> "390"
  Message -> "397"
  MessageAttachment -> " 397112341"
  Microfiber -> " 32706"
  Microhouse -> "3436"
  MiddleSchool -> "356926"
  MignonetteSauce -> " 3494199"
  MileageFromOdometer -> "367073531"
  Milk -> " 362"
  MinPrice -> "34079"
  MinValue -> "34869"
  MinimumPaymentDue -> "3433034159"
  Mint -> " 341"
  Miss -> " 39"
  Mix -> "329"
  MixedSpice -> "3291909"
  MixtapeAlbum -> "32910663"
  Moan -> " 34"
  MobileApplication -> " 36606224"
  MobilePhoneStore -> " 3660491"
  ModalJazz -> " 35673"
  Model -> "356"
  ModifiedTime -> "35013"
  Moleskin -> " 36924"
  Molybdenum -> " 366543"
  Monday -> " 345"
  MonetaryAmount -> "3417341"
  MonkeyGlandSauce -> " 34264599"
  MontrealSteakSeasoning -> " 341769129344"
  Moquette -> " 321"
  Mosque -> " 392"
  Motel -> "316"
  MotorcycleDealer -> "3192656"
  MotorcycleRepair -> "3192670"
  Mountain -> " 3414"
  Mourn -> "34"
  Move -> " 38"
  MoveAction -> "38224"
  Movie -> "38"
  MovieClip -> " 38260"
  MovieRentalStore -> " 38741691"
  MovieSeries -> " 38973"
  MovieTheater -> "3801"
  MovingCompany -> " 3842304"
  Mud -> "35"
  Muddle -> " 356"
  Mugwort -> "381"
  Mulberry -> " 3667"
  MullingSpices -> " 36909"
  MultipleValues -> "36106869"
  Multiply -> " 36106"
  MumboSauce -> "99"
  MungBean -> "3464"
  Murder -> " 35"
  Museum -> " 3933"
  Mushroom -> " 3273"
  MushroomKetchup -> " 32732120"
  MusicAlbum -> "3932663"
  MusicAlbumProductionType -> "393266307522410"
  MusicAlbumReleaseType -> " 393266376910"
  MusicArrangement -> "3932744341"
  MusicBy -> " 39326"
  MusicComposition -> "3932230324"
  MusicCompositionForm -> " 393223032403"
  MusicEvent -> "3932841"
  MusicGroup -> "393270"
  MusicGroupMember -> " 393270336"
  MusicPlaylist -> " 393206691"
  MusicRecording -> "39327254"
  MusicRelease -> "3932769"
  MusicReleaseFormat -> " 3932769031"
  MusicReleaseFormatType -> "393276903110"
  MusicStore -> "393291"
  MusicVenue -> "3932849"
  MusicVideoObject -> " 3932856721"
  MusicalKey -> "393262"
  Muslin -> " 3364"
  Mustard -> "3915"
  MustardGreen -> "391574"
  MustardOil -> "39156"
  Musty -> "391"
  NailSalon -> " 46964"
  Nainsook -> " 4492"
  NamedPosition -> " 430324"
  Nankeen -> "4424"
  Nationality -> "42461"
  NavyBean -> "4864"
  Nectarine -> "42174"
  Need -> " 45"
  NeoBopJazz -> " 46073"
  NeoPsychedelia -> "49256"
  NeoSwing -> "4984"
  Neodymium -> "4533"
  Neptunium -> "401943"
  Nest -> " 491"
  NetWorth -> "4180"
  NewAge -> "497"
  NewBeat -> " 4961"
  NewCondition -> "4924524"
  NewProg -> " 4907"
  NewRave -> " 4978"
  NewWave -> " 4988"
  NewZealandSpinach -> "4936459047"
  NewsArticle -> " 493126"
  NextItem -> "429113"
  Ngo -> "47"
  Nickel -> " 426"
  Nigella -> "476"
  NigellaSativa -> " 476"
  NightClub -> " 41266"
  Ninon -> "444"
  Niobium -> "463"
  Nobelium -> " 4663"
  NoisePop -> "4300"
  NoiseRock -> " 4372"
  NonEqual -> "44286"
  Notary -> " 417"
  Note -> " 41"
  NoteDigitalDocument -> "415716529341"
  Notice -> " 419"
  NoveltyRagtime -> "4861713"
  NuDisco -> " 49592"
  NuJazz -> "4973"
  NuMetal -> " 49316"
  NuSkoolBreaks -> "49672"
  Null -> " 46"
  NumAdults -> " 561"
  NumChildren -> " 126574"
  Number -> " 436"
  NumberOfAirbags -> "43686"
  NumberOfAxles -> "4368296"
  NumberOfBeds -> " 436865"
  NumberOfDoors -> "436853"
  NumberOfEmployees -> "4368306"
  NumberOfEpisodes -> " 4368095"
  NumberOfForwardGears -> "4368085"
  NumberOfItems -> "436813"
  NumberOfPages -> "436807"
  NumberOfPlayers -> "436806"
  NumberOfPreviousOwners -> "436807894"
  NumberOfRooms -> "436873"
  NumberOfSeasons -> "4368934"
  NumberedPosition -> "4360324"
  Nut -> "41"
  Nutmeg -> " 413"
  Nutrition -> "491724"
  NutritionInformation -> "49172440324"
  NutritionalYeast -> "4917246991"
  Nylon -> "464"
  Oaked -> "21"
  Object -> " 6721"
  Observe -> "638"
  Obtain -> " 614"
  Occupancy -> "29049"
  OccupationalCategory -> "290246217"
  OceanBodyOfWater -> "2465881"
  OfferCatalog -> "0216"
  OfferCount -> "0241"
  OfferItemCondition -> " 01324524"
  OfficeEquipmentStore -> " 0928034191"
  OfflinePermanently -> "064034416"
  OfflineTemporarily -> "064130776"
  Oilskin -> "6924"
  Okra -> " 27"
  OldBaySeasoning -> "6569344"
  OldschoolJungle -> " 746"
  Olefin -> " 604"
  Olive -> "68"
  OliveOil -> "686"
  OnDemandEvent -> "45345841"
  OnSitePickup -> " 491020"
  Onion -> "494"
  OnionPowder -> " 49405"
  Online -> " 464"
  OnlineFull -> "46406"
  OnlineOnly -> "46446"
  OpeningHours -> "044"
  OpeningHoursSpecification -> "0449090224"
  OperatingSystem -> " 0719913"
  Opponent -> " 0441"
  Option -> " 024"
  Opulent -> "09641"
  Orange -> " 744"
  OrchestralJazz -> "2917673"
  OrchestralUplifting -> " 2917606014"
  OrderAction -> " 5224"
  OrderCancelled -> "52496"
  OrderDate -> " 551"
  OrderDelivered -> "5568"
  OrderDelivery -> " 55687"
  OrderInTransit -> " 5417491"
  OrderItemNumber -> "513436"
  OrderItemStatus -> "5139119"
  OrderNumber -> " 5436"
  OrderPaymentDue -> "5034159"
  OrderPickupAvailable -> " 50208666"
  OrderProblem -> "507663"
  OrderProcessing -> " 50799"
  OrderQuantity -> " 528411"
  OrderReturned -> " 5714"
  OrderStatus -> " 59119"
  OrderedItem -> " 513"
  Organdy -> "45"
  Organization -> " 4324"
  OrganizationRole -> "432476"
  OrganizeAction -> "43224"
  Organza -> "43"
  OrientedStrandBoard -> "7419174565"
  OriginAddress -> " 774579"
  Osmium -> " 333"
  Osnaburg -> " 346"
  Ottoman -> "134"
  OutOfStock -> " 18912"
  OutletStore -> " 16191"
  Overflow -> " 806"
  OwnedFrom -> " 4073"
  OwnedThrough -> "407"
  OwnershipInfo -> " 42040"
  Oxford -> " 2905"
  Oxidized -> " 2953"
  Paddle -> " 056"
  Paduasoy -> " 0599"
  PageEnd -> " 0745"
  PageStart -> " 07911"
  Pagination -> " 07424"
  PaintAction -> " 041224"
  Painting -> " 0414"
  Paisley -> "036"
  PaisleyUnderground -> "03645745"
  Palladium -> "0653"
  Paperback -> "0062"
  Paprika -> "0072"
  ParallelStrandLumber -> " 076691745636"
  ParcelDelivery -> "0965687"
  ParcelService -> " 096989"
  Parent -> " 0741"
  ParentAudience -> "0741549"
  ParentItem -> "074113"
  ParentOrganization -> "07414324"
  ParentService -> " 0741989"
  ParkingFacility -> " 020961"
  ParkingMap -> "0230"
  Parsley -> "096"
  Parsnip -> "0940"
  PartOfEpisode -> "018095"
  PartOfInvoice -> "018489"
  PartOfOrder -> "0185"
  PartOfSeason -> " 018934"
  PartOfSeries -> " 018973"
  PartOfTvseries -> " 018"
  Participant -> "019041"
  PartySize -> " 0193"
  Pashmina -> " 0234"
  Pass -> " 09"
  PassengerPriorityStatus -> "094707719119"
  PassengerSequenceNumber -> "094792849436"
  PattyPan -> "0104"
  Pause -> "03"
  PawnShop -> "0420"
  PayAction -> " 0224"
  PaymentAccepted -> " 034129015"
  PaymentAutomaticallyApplied -> "034113126065"
  PaymentCard -> " 034125"
  PaymentChargeSpecification -> " 03411279090224"
  PaymentComplete -> " 034123061"
  PaymentDeclined -> " 03415264"
  PaymentDue -> "034159"
  PaymentDueDate -> " 03415951"
  PaymentMethod -> " 0341305"
  PaymentMethodId -> "03413055"
  PaymentPastDue -> " 034109159"
  PaymentService -> "0341989"
  PaymentStatus -> " 03419119"
  PaymentStatusType -> "0341911910"
  PaymentUrl -> "0341976"
  Peach -> "012"
  Pedal -> "056"
  Peep -> " 00"
  PeopleAudience -> "006549"
  PepperJelly -> " 0076"
  Percale -> "026"
  PerformAction -> " 003224"
  PerformanceRole -> " 0034976"
  Performer -> "003"
  PerformerIn -> " 0034"
  Performers -> " 003"
  PerformingArtsTheater -> "003101"
  PerformingGroup -> " 00370"
  Perilla -> "076076"
  Periodical -> " 07526"
  PermissionType -> "032410"
  Permit -> " 031"
  PermitAudience -> "031549"
  PermittedUsage -> "031997"
  Persimmon -> "0934"
  Person -> " 094"
  PeruvianPepper -> "078400"
  PetStore -> "0191"
  PetsAllowed -> " 016"
  Pharmacy -> " 039"
  Photo -> "01"
  Photograph -> " 0170"
  PhotographAction -> "0170224"
  Photos -> " 01"
  Physalis -> " 0969"
  Piccalilli -> " 0266"
  PickledCucumber -> " 026529236"
  PickledFruit -> "0265071"
  PickledOnion -> "0265494"
  PickledPepper -> " 026500"
  PickupLocation -> "0206224"
  PickupTime -> "02013"
  PicoDeGallo -> "0256"
  PinStripes -> "049170"
  Pine -> " 04"
  Pineapple -> "0406"
  PintoBean -> " 04164"
  Place -> "069"
  PlaceOfWorship -> " 0698820"
  Plan -> " 064"
  PlanAction -> "064224"
  Plant -> "0641"
  Plastic -> "06912"
  PlasticLaminate -> " 069126341"
  Platinum -> " 06143"
  PlayAction -> "06224"
  PlayMode -> "0635"
  PlayerType -> "0610"
  PlayersOnline -> " 06464"
  Playground -> " 06745"
  Plush -> "062"
  Plutonium -> "06143"
  Plywood -> "0685"
  Point -> "041"
  PolarFleece -> " 06069"
  PoliceStation -> " 0699124"
  Polish -> " 062"
  Polonium -> " 0643"
  Polyester -> "0691"
  Polygon -> "064"
  Polystyrene -> "069174"
  Polyurethane -> " 069704"
  Pomegranate -> "03741"
  PomegranateSeed -> " 0374195"
  Pomelo -> " 036"
  Pond -> " 045"
  Pongee -> " 047"
  Pop -> "00"
  PopPunk -> " 00042"
  PopRock -> " 0072"
  PopcornSeasoning -> "00249344"
  Poplin -> " 0064"
  PoppySeed -> " 0095"
  Position -> " 0324"
  Possess -> "039"
  Post -> " 091"
  PostBop -> " 09160"
  PostBritpop -> " 09167100"
  PostDisco -> " 091592"
  PostGrunge -> "091744"
  PostHardcore -> "091"
  PostMetal -> " 091316"
  PostOffice -> "09109"
  PostOfficeBoxNumber -> " 09109629436"
  PostPunk -> "091042"
  PostPunkRevival -> "0910427886"
  PostRock -> "09172"
  PostalAddress -> " 0916579"
  PostalCode -> "091625"
  Potassium -> "0193"
  Potato -> " 011"
  PotentialAction -> " 01426224"
  PotentialActionStatus -> "014262249119"
  PowderDouce -> " 0559"
  PowerElectronics -> "06217429"
  PowerMetal -> "0316"
  PowerNoise -> "043"
  PowerPop -> "000"
  Powerful -> " 006"
  Practise -> " 07219"
  Praseodymium -> " 073533"
  Pray -> " 07"
  PreOrder -> "075"
  PreSale -> " 0796"
  Preach -> " 0712"
  Precede -> "0795"
  PredecessorOf -> " 075998"
  Prefer -> " 070"
  PrepTime -> "07013"
  Prepare -> "070"
  PrependAction -> " 07045224"
  Preschool -> "07926"
  Present -> "07341"
  PresentationDigitalDocument -> "07341245716529341"
  Preserve -> " 0738"
  Pretend -> "07145"
  Prevent -> "07841"
  PreviousItem -> "078913"
  PreviousStartDate -> "078991151"
  Price -> "079"
  PriceComponent -> "079230441"
  PriceCurrency -> " 0792749"
  PriceRange -> "079744"
  PriceSpecification -> "0799090224"
  PriceType -> " 07910"
  PriceValidUntil -> "079865416"
  Prick -> "072"
  PrimaryImageOfPage -> "073737807"
  Print -> "0741"
  PrintColumn -> " 0741263"
  PrintEdition -> "0741524"
  PrintPage -> " 074107"
  PrintSection -> "07419224"
  ProcessingTime -> "079913"
  ProcessorRequirements -> " 0799728341"
  Produce -> "07599"
  Produces -> " 07599"
  Product -> "07521"
  ProductId -> " 075215"
  ProductModel -> "07521356"
  ProductSupported -> "07521901"
  ProductionCompany -> " 0752242304"
  ProductionDate -> "07522451"
  ProfessionalService -> " 070246989"
  ProficiencyLevel -> "070249686"
  ProfilePage -> " 070607"
  ProgramMembership -> " 33620"
  ProgramMembershipUsed -> "33620935"
  ProgramName -> " 43"
  ProgrammingLanguage -> " 077346487"
  ProgrammingModel -> "07734356"
  Progressive -> "07798"
  ProgressiveBreaks -> " 07798672"
  ProgressiveDrumBass -> "0779857369"
  ProgressiveFolk -> " 0779802"
  ProgressiveHouse -> "077989"
  ProgressiveMetal -> "07798316"
  ProgressiveRock -> " 0779872"
  ProgressiveTechno -> " 07798124"
  Promethium -> " 07303"
  Promise -> "0739"
  PropertyId -> "07015"
  PropertyValue -> " 0701869"
  PropertyValueSpecification -> " 07018699090224"
  Protactinium -> " 0712143"
  Protect -> "07121"
  ProteinContent -> "071424141"
  Provide -> "0785"
  Provider -> " 0785"
  ProviderMobility -> "07853661"
  ProvidesBroadcastService -> " 0785675291989"
  ProvidesService -> " 0785989"
  PsychedelicFolk -> " 9256202"
  PsychedelicRock -> " 9256272"
  PsychedelicTrance -> " 925621749"
  PublicHolidays -> "066265"
  PublicSwimmingPool -> " 0662983406"
  Publication -> "066224"
  PublicationEvent -> "066224841"
  PublicationIssue -> "0662242"
  PublicationVolume -> " 0662248693"
  PublishedOn -> " 06624"
  Publisher -> "0662"
  PublishingPrinciples -> "06624074906"
  Pull -> " 06"
  Pump -> " 030"
  Pumpkin -> "0324"
  PumpkinPieSpice -> "03240909"
  Puncture -> " 0412"
  Punish -> " 042"
  PunkJazz -> "04273"
  PunkRock -> "04272"
  PurchaseDate -> "012951"
  PurpleMangosteen -> "00634914"
  Push -> " 02"
  Qualifications -> " 2860224"
  QualitativeValue -> "286118869"
  QuantitativeValue -> " 2841118869"
  Quantity -> " 28411"
  Query -> "287"
  Quest -> "2891"
  Question -> " 289124"
  Quince -> " 2849"
  QuoteAction -> " 281224"
  RNews -> " 493"
  Race -> " 79"
  Radiate -> "751"
  Radicchio -> "752"
  RadioChannel -> "751246"
  RadioClip -> " 75260"
  RadioEpisode -> "75095"
  RadioSeason -> " 75934"
  RadioSeries -> " 75973"
  RadioStation -> "759124"
  Radish -> " 752"
  Radium -> " 753"
  RagaRock -> "772"
  RaggaJungle -> " 7746"
  Ragtime -> "713"
  Raisiny -> "734"
  Rambutan -> " 73614"
  RammedEarth -> " 730"
  RapMetal -> "70316"
  RapRock -> " 7072"
  Raspberry -> "7367"
  RatingCount -> " 714241"
  RatingValue -> " 714869"
  Reach -> "712"
  ReactAction -> " 721224"
  ReadAction -> "75224"
  ReadPermission -> "750324"
  ReadonlyValue -> " 869"
  RealEstateAgent -> "76911741"
  Realise -> "763"
  RearWheelDriveConfiguration -> " 786578240724"
  Receive -> "798"
  ReceiveAction -> " 798224"
  Recipe -> " 790"
  RecipeCategory -> "790217"
  RecipeCuisine -> " 7902834"
  RecipeIngredient -> "79047541"
  RecipeInstructions -> "7904917224"
  RecipeYield -> " 790965"
  Recipient -> "79041"
  Recognise -> "7243"
  Record -> " 725"
  RecordLabel -> " 725666"
  RecordedAs -> "7253"
  RecordedAt -> "7251"
  RecordedIn -> "7254"
  RecordingOf -> " 72548"
  RecyclingCenter -> " 7926941"
  Redcurrant -> " 752741"
  Reduce -> " 7599"
  ReferenceQuantity -> " 7074928411"
  ReferencesOrder -> " 707495"
  Refined -> "7045"
  Reflect -> "70621"
  RefurbishedCondition -> "706224524"
  Refuse -> " 7093"
  RegionsAllowed -> "7746"
  RegisterAction -> "7791224"
  Regret -> " 771"
  Reign -> "74"
  Reject -> " 7721"
  RejectAction -> "7721224"
  Rejoice -> "779"
  RelatedLink -> " 7615642"
  RelatedTo -> " 76151"
  Relax -> "7629"
  Release -> "769"
  ReleaseDate -> " 76951"
  ReleaseNotes -> "76941"
  ReleaseOf -> " 7698"
  ReleasedEvent -> " 769841"
  Relish -> " 762"
  Remain -> " 734"
  RemainingAttendeeCapacity -> "73441452091"
  Remember -> " 7336"
  Remind -> " 7345"
  RemixAlbum -> "7329663"
  Remoulade -> "7365"
  Remove -> " 738"
  RentAction -> "741224"
  RentalCarReservation -> " 7416273824"
  Replace -> "7069"
  ReplaceAction -> " 7069224"
  Replacer -> " 7069"
  Reply -> "706"
  ReplyAction -> " 706224"
  ReplyToUrl -> " 7061976"
  Report -> " 701"
  ReportNumber -> "701436"
  RepresentativeOfPage -> " 70734118807"
  Reproduce -> "707599"
  Request -> "72891"
  RequiredCollateral -> "728526176"
  RequiredGender -> "7285745"
  RequiredMaxAge -> " 72853297"
  RequiredMinAge -> " 7285347"
  Requirements -> " 728341"
  RequiresSubscription -> "72896927024"
  Rescue -> " 7929"
  Researcher -> " 7912"
  Reservation -> "73824"
  ReservationCancelled -> "738242496"
  ReservationConfirmed -> "7382424035"
  ReservationFor -> "738240"
  ReservationHold -> " 7382465"
  ReservationId -> " 738245"
  ReservationPackage -> "73824027"
  ReservationPending -> "738240454"
  ReservationStatus -> " 738249119"
  ReservationStatusType -> "73824911910"
  ReserveAction -> " 738224"
  ReservedTicket -> "7385121"
  Reservoir -> "7388"
  Residence -> "73549"
  Resort -> " 731"
  Responsibilities -> " 79049661"
  Restaurant -> " 791741"
  RestrictedDiet -> "791721551"
  Result -> " 7361"
  ResultComment -> " 73612341"
  ResultReview -> "7361789"
  ResumeAction -> "7393224"
  Reticent -> " 71941"
  Retire -> " 71"
  Return -> " 714"
  ReturnAction -> "714224"
  Review -> " 789"
  ReviewAction -> "789224"
  ReviewBody -> "78965"
  ReviewCount -> " 789241"
  ReviewRating -> "789714"
  ReviewedBy -> "7896"
  Reviews -> "789"
  Rhenium -> "743"
  Rhodium -> "753"
  Rhubarb -> "766"
  Rhyme -> "73"
  Rich -> " 712"
  RightHandDriving -> " 71455784"
  Rinse -> "749"
  RiotGrrrl -> " 71776"
  Ripstop -> "70910"
  Risk -> " 792"
  RiverBodyOfWater -> "7865881"
  RockAndRoll -> "724576"
  RockInOpposition -> " 7240324"
  RockMelon -> " 72364"
  Roentgenium -> "74143"
  RoleName -> "7643"
  RoofingContractor -> " 704241721"
  Rose -> " 73"
  Rosemary -> " 7337"
  Rot -> "71"
  Rough -> "70"
  Round -> "745"
  RsvpAction -> "7980224"
  RsvpResponse -> "798079049"
  RsvpResponseMaybe -> "79807904936"
  RsvpResponseNo -> " 7980790494"
  RsvpResponseType -> " 79807904910"
  RsvpResponseYes -> "79807904999"
  Rubidium -> " 7653"
  Ruin -> " 74"
  Rule -> " 76"
  RunnerBean -> "7464"
  Runtime -> "7413"
  RuntimePlatform -> " 741306103"
  Rush -> " 72"
  RussellCord -> " 79625"
  Rutabaga -> " 716"
  Ruthenium -> "7043"
  Rutherfordium -> "79053"
  Saffron -> "9074"
  Sage -> " 97"
  SaladCream -> "965273"
  SaladDressing -> " 9655794"
  SalalBerry -> "96667"
  SalaryCurrency -> "9672749"
  Salsa -> "969"
  SalsaGolf -> " 96960"
  Salt -> " 961"
  SaltAndPepper -> "9614500"
  Samarium -> " 9373"
  Sambal -> " 9366"
  SameAs -> "933"
  Samite -> " 931"
  SampleType -> "930610"
  Sarsaparilla -> " 99076"
  Sassafras -> "99079"
  Sateen -> " 914"
  Satisfy -> "9190"
  Satsuma -> "9193"
  SaturatedFatContent -> "9127150124141"
  Saturday -> " 915"
  Sauerkraut -> " 9271"
  Save -> " 98"
  Savory -> " 987"
  Scallion -> " 9264"
  Scandium -> " 92453"
  Scarlet -> "9261"
  Scatter -> "921"
  ScheduleAction -> "2596224"
  ScheduledPaymentDate -> " 25965034151"
  ScheduledTime -> " 2596513"
  SchemaVersion -> " 923824"
  ScholarlyArticle -> "9266126"
  Scold -> "9265"
  Scorch -> " 9212"
  Scrape -> " 9270"
  Scratch -> "92712"
  ScreenCount -> " 9274241"
  ScreeningEvent -> "92744841"
  Screenshot -> " 927421"
  Screw -> "927"
  Scribble -> " 92766"
  Scrim -> "9273"
  Scrub -> "9276"
  Sculpture -> "926012"
  SeaBodyOfWater -> "965881"
  SeaSilk -> " 9962"
  Seaborgium -> " 963"
  Search -> " 912"
  SearchAction -> "912224"
  SearchResultsPage -> "912736107"
  Season -> " 934"
  SeasonNumber -> "934436"
  Seasons -> "934"
  SeatNumber -> "91436"
  SeatRow -> " 917"
  SeatSection -> " 919224"
  SeatingMap -> "91430"
  SeatingType -> " 91410"
  SecurityScreening -> " 9297192744"
  Seersucker -> " 992"
  SelfStorage -> " 9609177"
  SellAction -> "96224"
  SendAction -> "945224"
  Serge -> "97"
  SerialNumber -> "976436"
  Series -> " 973"
  Serve -> "98"
  ServerStatus -> "989119"
  ServesCuisine -> " 982834"
  Service -> "989"
  ServiceArea -> " 9897"
  ServiceAudience -> " 989549"
  ServiceChannel -> "9891246"
  ServiceLocation -> " 9896224"
  ServiceOperator -> " 989071"
  ServiceOutput -> " 989101"
  ServicePhone -> "98904"
  ServicePostalAddress -> " 9890916579"
  ServiceSmsNumber -> " 989939436"
  ServiceType -> " 98910"
  ServiceUrl -> "989976"
  ServingSize -> " 98493"
  Sesame -> " 993"
  SesameOil -> " 9936"
  Shade -> "25"
  ShareAction -> " 2224"
  SharedContent -> " 224141"
  SharenaSol -> "9696"
  Shave -> "28"
  Shelter -> "261"
  Shiplap -> "2060"
  Shiso -> "29"
  Shiver -> " 28"
  Shock -> "22"
  ShoeStore -> " 291"
  Shoegaze -> " 234"
  Shop -> " 20"
  ShoppingCenter -> "204941"
  ShotSilk -> "21962"
  Shrug -> "27"
  Sibling -> "9664"
  Siblings -> " 9664"
  SichuanPepper -> " 9128400"
  Signal -> " 946"
  SignificantLink -> " 940241642"
  SignificantLinks -> "9402416429"
  Silk -> " 962"
  Silky -> "962"
  Silver -> " 968"
  SingleFamilyResidence -> "94603673549"
  SinglePlayer -> "94606"
  SingleRelease -> " 946769"
  Sisal -> "996"
  SiteNavigationElement -> "9148246341"
  SkaJazz -> " 9273"
  SkaPunk -> " 92042"
  SkatePunk -> " 921042"
  Ski -> "92"
  SkiResort -> " 92731"
  Skills -> " 926"
  Skip -> " 920"
  Skirret -> "9271"
  Sku -> "92929"
  Slip -> " 960"
  SludgeMetal -> " 967316"
  Smile -> "936"
  Smokey -> " 932"
  SmokingAllowed -> "93246"
  Smooth -> " 939"
  SmoothJazz -> "93973"
  SnapPea -> " 9400"
  Snatch -> " 9412"
  Sneeze -> " 943"
  Sniff -> "940"
  SocialEvent -> " 926841"
  SocialMediaPosting -> " 926350914"
  Sodium -> " 953"
  SodiumContent -> " 95324141"
  SoftRock -> "90172"
  SoftwareAddOn -> "90854"
  SoftwareApplication -> " 90806224"
  SoftwareHelp -> "90860"
  SoftwareRequirements -> "908728341"
  SoftwareSourceCode -> " 9089925"
  SoftwareVersion -> " 908824"
  SoldOut -> " 9651"
  SomeProducts -> "9307521"
  Sorrel -> " 976"
  SoulJazz -> "9673"
  Sound -> "945"
  SoundArt -> "9451"
  SoundtrackAlbum -> " 94172663"
  SourceOrganization -> "994324"
  SouthernRock -> "99472"
  SoyBean -> " 964"
  SoySauce -> "999"
  SpaceDisco -> "909592"
  SpaceHouse -> "9099"
  SpaceRock -> " 90972"
  SpaghettiSquash -> " 9019282"
  Spandex -> "904529"
  Spare -> "90"
  Spark -> "902"
  Spatial -> "9026"
  SpatialCoverage -> " 90262877"
  SpecialCommitments -> "9026231341"
  SpecialOpeningHoursSpecification -> "90260449090224"
  Specialty -> "90261"
  SpeedGarage -> " 90574"
  SpeedMetal -> "905316"
  SpiderSilk -> "905962"
  Spinach -> "9047"
  Spoil -> "906"
  SpokenWordAlbum -> "902485663"
  Sponsor -> "9049"
  SportingGoodsStore -> " 9014591"
  SportsActivityLocation -> " 90121816224"
  SportsClub -> "901266"
  SportsEvent -> " 901841"
  SportsOrganization -> "9014324"
  SportsTeam -> "90113"
  Spot -> " 901"
  Spouse -> " 903"
  Spray -> "907"
  SpreadsheetDigitalDocument -> " 9075215716529341"
  Sprout -> " 9071"
  Squeak -> " 9282"
  Squeal -> " 9286"
  Squeeze -> "9283"
  Sriracha -> " 9712"
  StackExchange -> " 912291247"
  StadiumOrArena -> " 915374"
  Stamp -> "9130"
  StarAnise -> " 9149"
  StarFruit -> " 91071"
  StarRating -> "91714"
  StartDate -> " 91151"
  StartTime -> " 91113"
  State -> "911"
  SteakSauce -> "91299"
  SteeringPosition -> "91740324"
  SteeringPositionValue -> "91740324869"
  StepValue -> " 910869"
  StiAccommodationOntology -> " 235244167"
  Stitch -> " 9112"
  Stone -> "914"
  StonerRock -> "91472"
  Stop -> " 910"
  StorageRequirements -> " 9177728341"
  Store -> "91"
  StraightAheadJazz -> "9171573"
  Strawberry -> " 91767"
  StreetAddress -> " 9171579"
  StreetPunk -> "9171042"
  Strengthen -> " 917404"
  Stretch -> "91712"
  StrideJazz -> "917573"
  Strip -> "9170"
  Strontium -> "917413"
  Structured -> " 917212"
  StructuredValue -> " 917212869"
  StubTex -> " 916"
  StudioAlbum -> " 9195663"
  Stuff -> "910"
  Styrofoam -> "91703"
  SubEvent -> "96841"
  SubEvents -> " 96841"
  SubOrganization -> " 964324"
  SubReservation -> "9673824"
  SubscribeAction -> " 969276224"
  SubtitleLanguage -> "961166487"
  Subtract -> " 961721"
  SubwayStation -> " 9689124"
  Succeed -> "9295"
  SuccessorOf -> " 92998"
  Suck -> " 92"
  Suffer -> " 90"
  SugarContent -> "224141"
  Suggest -> "9791"
  SuggestedAnswer -> " 979149"
  SuggestedGender -> " 9791745"
  SuggestedMaxAge -> "97913297"
  SuggestedMinAge -> "9791347"
  Suit -> " 91"
  SuitableForDiet -> "9166051"
  Sumac -> "932"
  Sunday -> " 945"
  SungPoetry -> "94017"
  SuperEvent -> "90841"
  Supply -> " 906"
  Support -> "901"
  SupportingData -> "90151"
  Suppose -> "903"
  SurfRock -> "9072"
  Surface -> "909"
  Surprise -> " 9073"
  Surround -> " 9745"
  Suspect -> "99021"
  Suspend -> "99045"
  SuspendAction -> " 99045224"
  Sweet -> "981"
  SweetChilliSauce -> " 98112699"
  SweetPotato -> " 981011"
  Swing -> "984"
  SwingHouse -> "9849"
  Switch -> " 9812"
  SymphonicMetal -> "93042316"
  Synagogue -> "94"
  Syrup -> "970"
  TabascoPepper -> " 169200"
  Table -> "166"
  Taffeta -> "101"
  TakeAction -> "12224"
  Tamarillo -> "1376"
  Tamarind -> " 13745"
  TandooriMasala -> "1457396"
  Tangerine -> "14474"
  Tannic -> " 142"
  Tantalum -> " 14163"
  TargetCollection -> "1126224"
  TargetDescription -> " 115927024"
  TargetName -> "1143"
  TargetPlatform -> "1106103"
  TargetProduct -> " 1107521"
  TargetUrl -> " 11976"
  Taro -> " 17"
  Tarragon -> " 174"
  Tart -> " 11"
  Tartan -> " 114"
  TartarSauce -> " 1199"
  TasmanianPepper -> " 1334400"
  Tattersall -> " 1196"
  TattooParlor -> "1106"
  TaxId -> " 1295"
  TaxiReservation -> " 12973824"
  TaxiService -> " 129989"
  TaxiStand -> " 1299145"
  TechArticle -> " 12126"
  TechHouse -> " 129"
  TechTrance -> "121749"
  Technetium -> " 12423"
  TechnicalDeathMetal -> "1242650316"
  TechnoDnb -> " 124"
  TechnoFolk -> "12402"
  Telephone -> "1604"
  TelevisionChannel -> " 168441246"
  TelevisionStation -> " 168449124"
  Temporal -> " 13076"
  TemporalCoverage -> "130762877"
  Tempt -> "131"
  TennisComplex -> " 149230629"
  TeriyakiSauce -> " 179299"
  TerraCotta -> "1721"
  Terrazzo -> " 1719"
  Terrify -> "170"
  TewkesburyMustard -> " 3915"
  Text -> " 1291"
  TextDigitalDocument -> "12915716529341"
  ThaiBasil -> " 1636"
  Thallium -> " 063"
  Thank -> "042"
  TheaterEvent -> "01841"
  TheaterGroup -> "0170"
  Thing -> "04"
  ThirdStream -> " 059173"
  Thorium -> "073"
  ThrashMetal -> " 072316"
  Thulium -> "063"
  Thumbnail -> "0346"
  ThumbnailUrl -> "0346976"
  Thursday -> " 035"
  Thyme -> "13"
  Tick -> " 12"
  TickerSymbol -> "129366"
  Ticket -> " 121"
  TicketNumber -> "121436"
  TicketToken -> " 121124"
  TicketedSeat -> "12191"
  Tickle -> " 126"
  TieAction -> " 1224"
  Tight -> "11"
  Timber -> " 136"
  Time -> " 13"
  TimeRequired -> "137285"
  Tin -> "14"
  Tip -> "10"
  TipAction -> " 10224"
  TireShop -> "120"
  Titanium -> " 1143"
  Title -> "116"
  ToLocation -> "16224"
  Toasty -> " 191"
  TollFree -> "1607"
  Tomato -> " 131"
  TonkaBean -> " 64"
  TotalPaymentDue -> "116034159"
  TotalPrice -> "116079"
  TotalTime -> " 11613"
  Touch -> "112"
  TouristAttraction -> " 179117224"
  TouristInformationCenter -> " 179140324941"
  ToyStore -> "191"
  ToytownTechno -> " 114124"
  Trace -> "179"
  TrackAction -> " 172224"
  TrackingNumber -> "1724436"
  TrackingUrl -> " 1724976"
  Tracks -> " 172"
  TradJazz -> "17573"
  Trade -> "175"
  TradeAction -> " 175224"
  TraditionalDoom -> " 17524653"
  Trailer -> "176"
  Train -> "174"
  TrainName -> " 17443"
  TrainNumber -> " 174436"
  TrainReservation -> "17473824"
  TrainStation -> "1749124"
  TrainTrip -> " 174170"
  Trance -> " 1749"
  TransFatContent -> "17430124141"
  Transcript -> " 17492701"
  TransferAction -> "17490224"
  TransitMap -> "1749130"
  Translator -> " 174961"
  Transparent -> "17490741"
  Transport -> "174901"
  Travel -> " 1786"
  TravelAction -> "1786224"
  TravelAgency -> "1786749"
  Treat -> "171"
  Tremble -> "17366"
  TribalHouse -> " 17669"
  Trick -> "172"
  Trip -> " 170"
  TripHop -> " 1700"
  Trot -> " 171"
  Trouble -> "1766"
  Trust -> "1791"
  Try -> "17"
  Tubers -> " 196"
  Tuesday -> "1935"
  Tulle -> "16"
  Tumble -> " 1366"
  Tungsten -> " 14914"
  Turmeric -> " 1372"
  Turn -> " 14"
  Turnip -> " 140"
  TweePop -> " 1800"
  Tweed -> "185"
  Twill -> "186"
  Twist -> "1891"
  Type -> " 10"
  TypeAndQuantityNode -> " 10452841145"
  TypeOfBed -> "10865"
  TypeOfGood -> " 1085"
  TypicalAgeRange -> "10267744"
  UgliFruit -> " 071"
  UnRegisterAction -> " 47791224"
  Unctuous -> " 4199"
  UnderName -> " 4543"
  Undress -> "4579"
  Unfasten -> " 4094"
  UnitCode -> "94125"
  UnitPriceSpecification -> " 9410799090224"
  UnitText -> "9411291"
  Unite -> "941"
  Unlock -> " 462"
  Unpack -> " 402"
  UnsaturatedFatContent -> "49127150124141"
  Untidy -> " 415"
  UpdateAction -> "051224"
  UpliftingTrance -> " 060141749"
  UploadDate -> "06551"
  UpvoteCount -> " 081241"
  Uranium -> "9743"
  Urbanite -> " 641"
  Url -> "976"
  UrlTemplate -> " 97613061"
  UseAction -> " 93224"
  UsedCondition -> " 93524524"
  UserBlocks -> "93662"
  UserCheckins -> "931224"
  UserComments -> "932341"
  UserDownloads -> " 935465"
  UserInteraction -> " 93417224"
  UserInteractionCount -> " 93417224241"
  UserLikes -> " 9362"
  UserPageVisits -> " 9307831"
  UserPlays -> " 9306"
  UserPlusOnes -> " 9306984"
  UserTweets -> "93181"
  ValidFor -> "8650"
  ValidFrom -> " 865073"
  ValidIn -> " 8654"
  ValidThrough -> "86507"
  ValidUntil -> "865416"
  Value -> "869"
  ValueAddedTaxIncluded -> " 869512942655"
  ValueMaxLength -> " 869329640"
  ValueMinLength -> " 86934640"
  ValueName -> " 86943"
  ValuePattern -> "869014"
  ValueReference -> "86970749"
  ValueRequired -> " 8697285"
  Vanadium -> " 8453"
  Vanilla -> "846"
  Vanillin -> " 8464"
  VatId -> " 815"
  VeganDiet -> " 8451"
  VegetableFlannel -> "871660646"
  Vegetal -> "8716"
  VegetarianDiet -> "8717451"
  Vehicle -> "826"
  VehicleConfiguration -> "826240724"
  VehicleEngine -> " 826474"
  VehicleIdentificationNumber -> "8265410224436"
  VehicleInteriorColor -> " 82641726"
  VehicleInteriorType -> "82641710"
  VehicleModelDate -> " 82635651"
  VehicleSeatingCapacity -> " 8269142091"
  VehicleSpecialUsage -> "8269026997"
  VehicleTransmission -> " 8261743324"
  Velvet -> " 8681"
  Velveteen -> "86814"
  Velvety -> "8681"
  VenueMap -> "84930"
  Version -> "824"
  Video -> "85"
  VideoFormat -> " 85031"
  VideoFrameSize -> " 8507393"
  VideoGallery -> "8567"
  VideoGame -> " 853"
  VideoGameClip -> "853260"
  VideoGameSeries -> "853973"
  VideoObject -> " 856721"
  VideoQuality -> "852861"
  VietnameseCoriander -> " 814332745"
  ViewAction -> "89224"
  VikingMetal -> " 824316"
  VinoCotto -> " 8484"
  VinylCoatedPolyester -> " 846210691"
  VinylFormat -> " 846031"
  Visit -> "831"
  VisualArtsEvent -> "8461841"
  VisualArtwork -> " 846182"
  VocalHouse -> "8269"
  VocalJazz -> " 82673"
  VocalTrance -> " 8261749"
  Volcano -> "8624"
  VolumeNumber -> "8693436"
  VoteAction -> "81224"
  Wallpaper -> "8600"
  Want -> " 841"
  WantAction -> "841224"
  Warm -> " 83"
  Warranty -> " 8741"
  WarrantyPromise -> " 87410739"
  WarrantyScope -> " 8741920"
  Wasabi -> " 896"
  Waste -> "891"
  Watch -> "812"
  WatchAction -> " 812224"
  Water -> "81"
  WaterChestnut -> " 8112941"
  Watercress -> " 81279"
  Waterfall -> "8106"
  Watermelon -> " 81364"
  WatermelonRindPreserves -> "813647450738"
  Wave -> " 88"
  WearAction -> "8224"
  WebApplication -> "8606224"
  WebCheckinTime -> " 86122413"
  WebPage -> " 8607"
  WebPageElement -> " 86076341"
  WebSite -> " 8691"
  Wednesday -> "8435"
  Weight -> " 81"
  Welcome -> "8623"
  WestCoastJazz -> "89129173"
  Western -> "8914"
  Whipcord -> " 8025"
  Whirl -> "86"
  Whisper -> "890"
  Whistle -> "896"
  WhiteMustard -> "813915"
  WhitePeppercorn -> " 810024"
  WhiteRadish -> " 81752"
  WholesaleStore -> "69691"
  Width -> "810"
  Wigan -> "84"
  WikiDoc -> " 8252"
  WinAction -> " 84224"
  Winery -> " 847"
  Wink -> " 842"
  Winner -> " 84"
  Wipe -> " 80"
  WireRope -> "870"
  WitchHouse -> "81257"
  Wobble -> " 866"
  Wonder -> " 845"
  Wood -> " 85"
  Woodruff -> " 8570"
  Wool -> " 86"
  WordCount -> " 85241"
  WorkExample -> " 823306"
  WorkFeatured -> "820125"
  WorkHours -> " 82"
  WorkLocation -> "826224"
  WorkPerformed -> " 82003"
  WorkPresented -> " 8207341"
  WorksFor -> "820"
  WorldFusion -> " 8650944"
  Worry -> "87"
  WorstRating -> " 891714"
  WpadBlock -> " 662"
  Wrap -> " 70"
  Wreck -> "72"
  Wrestle -> "796"
  Wriggle -> "76"
  WriteAction -> " 71224"
  WritePermission -> " 710324"
  XRay -> "37"
  XoSauce -> " 99"
  YachtRock -> " 9172"
  Yam -> "93"
  Yawn -> " 94"
  YearlyRevenue -> " 967849"
  YearsInOperation -> " 940724"
  Yell -> " 96"
  YorkshireBleepsAndBass -> "9226604569"
  Ytterbium -> "163"
  Yttrium -> "173"
  Yuzu -> " 93"
  Zedoary -> "357"
  Zephyr -> " 30"
  Zest -> " 391"
  Zibeline -> " 3664"
  Zinc -> " 342"
  Zip -> "30"
  Zirconium -> "3243"
  ZoneBoardingPolicy -> " 34654069"
  Zoom -> " 33"
  Zucchini -> " 324"

engToWord: String -> Word
engToWord s =
  case s of
  "unknown" -> Unknown
  "yes" -> Yes
  "no" -> No
  "fictlang" -> FictLang
  "about_page" -> AboutPage
  "accept" -> Accept
  "accept_action" -> AcceptAction
  "accepted_answer" -> AcceptedAnswer
  "accepted_offer" -> AcceptedOffer
  "accepted_payment_method" -> AcceptedPaymentMethod
  "accepts_reservations" -> AcceptsReservations
  "access_code" -> AccessCode
  "access_mode" -> AccessMode
  "access_mode_sufficient" -> AccessModeSufficient
  "accessibility_api" -> AccessibilityApi
  "accessibility_control" -> AccessibilityControl
  "accessibility_feature" -> AccessibilityFeature
  "accessibility_hazard" -> AccessibilityHazard
  "accessibility_summary" -> AccessibilitySummary
  "accommodation" -> Accommodation
  "account_id" -> AccountId
  "accountable_person" -> AccountablePerson
  "accounting_service" -> AccountingService
  "achieve_action" -> AchieveAction
  "acid_breaks" -> AcidBreaks
  "acid_house" -> AcidHouse
  "acid_jazz" -> AcidJazz
  "acid_rock" -> AcidRock
  "acid_techno" -> AcidTechno
  "acid_trance" -> AcidTrance
  "acidic" -> Acidic
  "acorn_squash" -> AcornSquash
  "acquired_from" -> AcquiredFrom
  "acrylic" -> Acrylic
  "actinium" -> Actinium
  "action" -> Action
  "action_application" -> ActionApplication
  "action_collab_class" -> ActionCollabClass
  "action_option" -> ActionOption
  "action_platform" -> ActionPlatform
  "action_status" -> ActionStatus
  "action_status_type" -> ActionStatusType
  "activate_action" -> ActivateAction
  "active_action_status" -> ActiveActionStatus
  "actors" -> Actors
  "additional_name" -> AdditionalName
  "additional_number_of_guests" -> AdditionalNumberOfGuests
  "additional_property" -> AdditionalProperty
  "additional_type" -> AdditionalType
  "address_country" -> AddressCountry
  "address_locality" -> AddressLocality
  "address_region" -> AddressRegion
  "administrative_area" -> AdministrativeArea
  "admire" -> Admire
  "admit" -> Admit
  "adult_entertainment" -> AdultEntertainment
  "advance_booking_requirement" -> AdvanceBookingRequirement
  "advise" -> Advise
  "affiliation" -> Affiliation
  "aggregate_offer" -> AggregateOffer
  "aggregate_rating" -> AggregateRating
  "agree_action" -> AgreeAction
  "aircraft" -> Aircraft
  "album_production_type" -> AlbumProductionType
  "album_release" -> AlbumRelease
  "album_release_type" -> AlbumReleaseType
  "albums" -> Albums
  "alcoholic" -> Alcoholic
  "alfalfa_sprout" -> AlfalfaSprout
  "alignment_object" -> AlignmentObject
  "alignment_type" -> AlignmentType
  "all_wheel_drive_configuration" -> AllWheelDriveConfiguration
  "alligator_pepper" -> AlligatorPepper
  "allocate_action" -> AllocateAction
  "allspice" -> Allspice
  "alpaca" -> Alpaca
  "alternate_name" -> AlternateName
  "alternative_dance" -> AlternativeDance
  "alternative_headline" -> AlternativeHeadline
  "alternative_metal" -> AlternativeMetal
  "alternative_rock" -> AlternativeRock
  "aluminium" -> Aluminium
  "aluminum" -> Aluminum
  "alumni" -> Alumni
  "alumni_of" -> AlumniOf
  "amaranth" -> Amaranth
  "ambient" -> Ambient
  "ambient_dub" -> AmbientDub
  "ambient_house" -> AmbientHouse
  "ambient_techno" -> AmbientTechno
  "amenity_feature" -> AmenityFeature
  "americium" -> Americium
  "amount_of_this_good" -> AmountOfThisGood
  "amuse" -> Amuse
  "amusement_park" -> AmusementPark
  "angelica" -> Angelica
  "angular" -> Angular
  "animal_shelter" -> AnimalShelter
  "anise" -> Anise
  "announce" -> Announce
  "annual_percentage_rate" -> AnnualPercentageRate
  "answer" -> Answer
  "answer_count" -> AnswerCount
  "anti_folk" -> AntiFolk
  "apartment" -> Apartment
  "apartment_complex" -> ApartmentComplex
  "apologise" -> Apologise
  "application_category" -> ApplicationCategory
  "application_sub_category" -> ApplicationSubCategory
  "application_suite" -> ApplicationSuite
  "applies_to_delivery_method" -> AppliesToDeliveryMethod
  "applies_to_payment_method" -> AppliesToPaymentMethod
  "apply_action" -> ApplyAction
  "appreciate" -> Appreciate
  "approve" -> Approve
  "apricot" -> Apricot
  "aquarium" -> Aquarium
  "aromatic_ginger" -> AromaticGinger
  "arrange" -> Arrange
  "arrest" -> Arrest
  "arrival_airport" -> ArrivalAirport
  "arrival_bus_stop" -> ArrivalBusStop
  "arrival_gate" -> ArrivalGate
  "arrival_platform" -> ArrivalPlatform
  "arrival_station" -> ArrivalStation
  "arrival_terminal" -> ArrivalTerminal
  "arrival_time" -> ArrivalTime
  "arrive" -> Arrive
  "arrive_action" -> ArriveAction
  "art_edition" -> ArtEdition
  "art_gallery" -> ArtGallery
  "art_medium" -> ArtMedium
  "art_punk" -> ArtPunk
  "artichoke" -> Artichoke
  "article" -> Article
  "article_body" -> ArticleBody
  "article_section" -> ArticleSection
  "artwork_surface" -> ArtworkSurface
  "asafoetida" -> Asafoetida
  "asbestos" -> Asbestos
  "asian_underground" -> AsianUnderground
  "ask_action" -> AskAction
  "asparagus" -> Asparagus
  "asphalt" -> Asphalt
  "assembly_version" -> AssemblyVersion
  "assess_action" -> AssessAction
  "assign_action" -> AssignAction
  "associated_article" -> AssociatedArticle
  "associated_media" -> AssociatedMedia
  "astringent" -> Astringent
  "attach" -> Attach
  "attendee" -> Attendee
  "attendees" -> Attendees
  "audience" -> Audience
  "audience_type" -> AudienceType
  "audio_object" -> AudioObject
  "audiobook_format" -> AudiobookFormat
  "authorize_action" -> AuthorizeAction
  "auto_body_shop" -> AutoBodyShop
  "auto_dealer" -> AutoDealer
  "auto_parts_store" -> AutoPartsStore
  "auto_rental" -> AutoRental
  "auto_wash" -> AutoWash
  "autolytic" -> Autolytic
  "automated_teller" -> AutomatedTeller
  "automotive_business" -> AutomotiveBusiness
  "automotive_ontology_wgclass" -> AutomotiveOntologyWgclass
  "availability" -> Availability
  "availability_ends" -> AvailabilityEnds
  "availability_starts" -> AvailabilityStarts
  "available_at_or_from" -> AvailableAtOrFrom
  "available_channel" -> AvailableChannel
  "available_delivery_method" -> AvailableDeliveryMethod
  "available_from" -> AvailableFrom
  "available_language" -> AvailableLanguage
  "available_on_device" -> AvailableOnDevice
  "available_through" -> AvailableThrough
  "avant_garde_jazz" -> AvantGardeJazz
  "avocado" -> Avocado
  "away_team" -> AwayTeam
  "baked" -> Baked
  "bakery" -> Bakery
  "balance" -> Balance
  "balanced" -> Balanced
  "balearic_beat" -> BalearicBeat
  "ballistic_nylon" -> BallisticNylon
  "baltimore_club" -> BaltimoreClub
  "banana" -> Banana
  "banana_ketchup" -> BananaKetchup
  "banana_squash" -> BananaSquash
  "bank_account" -> BankAccount
  "bank_or_credit_union" -> BankOrCreditUnion
  "bar_or_pub" -> BarOrPub
  "barathea" -> Barathea
  "barbecue_sauce" -> BarbecueSauce
  "barcode" -> Barcode
  "barnyard" -> Barnyard
  "base_salary" -> BaseSalary
  "basil" -> Basil
  "bassline" -> Bassline
  "bat" -> Bat
  "battle" -> Battle
  "beach" -> Beach
  "bean_sprout" -> BeanSprout
  "beat_music" -> BeatMusic
  "beau_monde_seasoning" -> BeauMondeSeasoning
  "beauty_salon" -> BeautySalon
  "bebop" -> Bebop
  "bed" -> Bed
  "bed_and_breakfast" -> BedAndBreakfast
  "bed_details" -> BedDetails
  "bedford_cord" -> BedfordCord
  "befriend_action" -> BefriendAction
  "bell_pepper" -> BellPepper
  "belong" -> Belong
  "benefits" -> Benefits
  "bengaline_silk" -> BengalineSilk
  "berkelium" -> Berkelium
  "beryllium" -> Beryllium
  "best_rating" -> BestRating
  "beta_cloth" -> BetaCloth
  "bib_ex_term" -> BibExTerm
  "bilberry" -> Bilberry
  "billing_address" -> BillingAddress
  "billing_increment" -> BillingIncrement
  "billing_period" -> BillingPeriod
  "birth_date" -> BirthDate
  "birth_place" -> BirthPlace
  "bismuth" -> Bismuth
  "bitter" -> Bitter
  "bizarre_silk" -> BizarreSilk
  "black_bean" -> BlackBean
  "black_cardamom" -> BlackCardamom
  "black_eyed_pea" -> BlackEyedPea
  "black_metal" -> BlackMetal
  "black_mustard" -> BlackMustard
  "black_peppercorn" -> BlackPeppercorn
  "black_vinegar" -> BlackVinegar
  "blackberry" -> Blackberry
  "blackcurrant" -> Blackcurrant
  "bleach" -> Bleach
  "bless" -> Bless
  "blind" -> Blind
  "blink" -> Blink
  "blog_post" -> BlogPost
  "blog_posting" -> BlogPosting
  "blog_posts" -> BlogPosts
  "blood_orange" -> BloodOrange
  "blueberry" -> Blueberry
  "blush" -> Blush
  "boarding_group" -> BoardingGroup
  "boarding_policy" -> BoardingPolicy
  "boarding_policy_type" -> BoardingPolicyType
  "boast" -> Boast
  "bobbinet" -> Bobbinet
  "body_of_water" -> BodyOfWater
  "bohrium" -> Bohrium
  "boiled_wool" -> BoiledWool
  "boldo" -> Boldo
  "bolivian_coriander" -> BolivianCoriander
  "bolt" -> Bolt
  "bombazine" -> Bombazine
  "book_edition" -> BookEdition
  "book_format" -> BookFormat
  "book_format_type" -> BookFormatType
  "book_series" -> BookSeries
  "booking_agent" -> BookingAgent
  "booking_time" -> BookingTime
  "bookmark_action" -> BookmarkAction
  "boolean" -> Boolean
  "borrow_action" -> BorrowAction
  "bossa_nova" -> BossaNova
  "bounce" -> Bounce
  "bouncy_house" -> BouncyHouse
  "bouncy_techno" -> BouncyTechno
  "bowling_alley" -> BowlingAlley
  "box" -> Box
  "boysenberry" -> Boysenberry
  "branch" -> Branch
  "branch_code" -> BranchCode
  "branch_of" -> BranchOf
  "brand" -> Brand
  "brazilian_pepper" -> BrazilianPepper
  "breadcrumb" -> Breadcrumb
  "breadcrumb_list" -> BreadcrumbList
  "breadfruit" -> Breadfruit
  "breakbeat" -> Breakbeat
  "breakbeat_hardcore" -> BreakbeatHardcore
  "breathe" -> Breathe
  "brewery" -> Brewery
  "bridge" -> Bridge
  "bright" -> Bright
  "brilliance" -> Brilliance
  "brilliantine" -> Brilliantine
  "british_dance" -> BritishDance
  "britpop" -> Britpop
  "broad_beans" -> BroadBeans
  "broadcast_affiliate_of" -> BroadcastAffiliateOf
  "broadcast_channel" -> BroadcastChannel
  "broadcast_channel_id" -> BroadcastChannelId
  "broadcast_display_name" -> BroadcastDisplayName
  "broadcast_event" -> BroadcastEvent
  "broadcast_of_event" -> BroadcastOfEvent
  "broadcast_release" -> BroadcastRelease
  "broadcast_service" -> BroadcastService
  "broadcast_service_tier" -> BroadcastServiceTier
  "broadcast_timezone" -> BroadcastTimezone
  "broadcaster" -> Broadcaster
  "broadcloth" -> Broadcloth
  "brocade" -> Brocade
  "broccoflower" -> Broccoflower
  "broccoli" -> Broccoli
  "broken_beat" -> BrokenBeat
  "brown_mustard" -> BrownMustard
  "browser_requirements" -> BrowserRequirements
  "bruise" -> Bruise
  "brush" -> Brush
  "brussels_sprout" -> BrusselsSprout
  "bubble" -> Bubble
  "bubblegum_dance" -> BubblegumDance
  "buckram" -> Buckram
  "buddhist_temple" -> BuddhistTemple
  "bump" -> Bump
  "bunting" -> Bunting
  "burlap" -> Burlap
  "bus_name" -> BusName
  "bus_number" -> BusNumber
  "bus_reservation" -> BusReservation
  "bus_station" -> BusStation
  "bus_stop" -> BusStop
  "bus_trip" -> BusTrip
  "business_audience" -> BusinessAudience
  "business_entity_type" -> BusinessEntityType
  "business_event" -> BusinessEvent
  "business_function" -> BusinessFunction
  "butternut_squash" -> ButternutSquash
  "buttery" -> Buttery
  "by_artist" -> ByArtist
  "cabbage" -> Cabbage
  "cable_or_satellite_service" -> CableOrSatelliteService
  "cadmium" -> Cadmium
  "cafe_or_coffee_shop" -> CafeOrCoffeeShop
  "calabrese" -> Calabrese
  "calcium" -> Calcium
  "calculate" -> Calculate
  "calico" -> Calico
  "californium" -> Californium
  "calories" -> Calories
  "cambric" -> Cambric
  "camp" -> Camp
  "campground" -> Campground
  "camping_pitch" -> CampingPitch
  "canal" -> Canal
  "canary_melon" -> CanaryMelon
  "cancel_action" -> CancelAction
  "candidate" -> Candidate
  "cantaloupe" -> Cantaloupe
  "canterbury_scene" -> CanterburyScene
  "canvas" -> Canvas
  "cape_jazz" -> CapeJazz
  "caption" -> Caption
  "caraway" -> Caraway
  "carbohydrate_content" -> CarbohydrateContent
  "carbon_fiber" -> CarbonFiber
  "cardamom" -> Cardamom
  "cargo_volume" -> CargoVolume
  "carpet" -> Carpet
  "carrier_requirements" -> CarrierRequirements
  "carrot" -> Carrot
  "cashmere" -> Cashmere
  "casino" -> Casino
  "cassette_format" -> CassetteFormat
  "cassis" -> Cassis
  "cat_pee" -> CatPee
  "catalog" -> Catalog
  "catalog_number" -> CatalogNumber
  "category" -> Category
  "catholic_church" -> CatholicChurch
  "cauliflower" -> Cauliflower
  "cause" -> Cause
  "cayenne_pepper" -> CayennePepper
  "cedar_bark" -> CedarBark
  "celeriac" -> Celeriac
  "celery" -> Celery
  "celery_powder" -> CeleryPowder
  "celery_seed" -> CelerySeed
  "celtic" -> Celtic
  "celtic_metal" -> CelticMetal
  "celtic_punk" -> CelticPunk
  "cement" -> Cement
  "cemetery" -> Cemetery
  "ceramic_tile" -> CeramicTile
  "cesium" -> Cesium
  "chaat_masala" -> ChaatMasala
  "challenge" -> Challenge
  "chamber_jazz" -> ChamberJazz
  "chambray" -> Chambray
  "chamomile" -> Chamomile
  "change" -> Change
  "char_cloth" -> CharCloth
  "character_attribute" -> CharacterAttribute
  "character_name" -> CharacterName
  "charcoal" -> Charcoal
  "charmeuse" -> Charmeuse
  "chase" -> Chase
  "cheat" -> Cheat
  "cheat_code" -> CheatCode
  "check_action" -> CheckAction
  "check_in_action" -> CheckInAction
  "check_out_action" -> CheckOutAction
  "checkin_time" -> CheckinTime
  "checkout_page" -> CheckoutPage
  "checkout_time" -> CheckoutTime
  "cheesecloth" -> Cheesecloth
  "chenille" -> Chenille
  "cherimoya" -> Cherimoya
  "cherry" -> Cherry
  "chervil" -> Chervil
  "chewy" -> Chewy
  "chicago_house" -> ChicagoHouse
  "chickpea" -> Chickpea
  "chiffon" -> Chiffon
  "child_care" -> ChildCare
  "child_max_age" -> ChildMaxAge
  "child_min_age" -> ChildMinAge
  "chili_oil" -> ChiliOil
  "chili_pepper" -> ChiliPepper
  "chili_peppers" -> ChiliPeppers
  "chili_powder" -> ChiliPowder
  "chili_sauce" -> ChiliSauce
  "chill_out" -> ChillOut
  "chimichurri" -> Chimichurri
  "chinese_rock" -> ChineseRock
  "chino" -> Chino
  "chintz" -> Chintz
  "chives" -> Chives
  "chocolaty" -> Chocolaty
  "choke" -> Choke
  "cholesterol_content" -> CholesterolContent
  "choose_action" -> ChooseAction
  "chop" -> Chop
  "christian_metal" -> ChristianMetal
  "christian_punk" -> ChristianPunk
  "christian_rock" -> ChristianRock
  "chromium" -> Chromium
  "church" -> Church
  "chutney" -> Chutney
  "cicely" -> Cicely
  "cigar_box" -> CigarBox
  "cilantro" -> Cilantro
  "cinder_block" -> CinderBlock
  "cinnamon" -> Cinnamon
  "citation" -> Citation
  "city_hall" -> CityHall
  "civic_structure" -> CivicStructure
  "claim" -> Claim
  "claim_reviewed" -> ClaimReviewed
  "classic_trance" -> ClassicTrance
  "clean" -> Clean
  "clementine" -> Clementine
  "clip" -> Clip
  "clip_number" -> ClipNumber
  "closed" -> Closed
  "closes" -> Closes
  "cloth_of_gold" -> ClothOfGold
  "clothing_store" -> ClothingStore
  "cloudberry" -> Cloudberry
  "clove" -> Clove
  "coach" -> Coach
  "cobalt" -> Cobalt
  "cocktail_sauce" -> CocktailSauce
  "coconut" -> Coconut
  "code" -> Code
  "code_repository" -> CodeRepository
  "code_sample_type" -> CodeSampleType
  "collard_green" -> CollardGreen
  "collect" -> Collect
  "collection" -> Collection
  "collection_page" -> CollectionPage
  "college_or_university" -> CollegeOrUniversity
  "comedy_club" -> ComedyClub
  "comedy_event" -> ComedyEvent
  "command" -> Command
  "comment" -> Comment
  "comment_action" -> CommentAction
  "comment_count" -> CommentCount
  "comment_permission" -> CommentPermission
  "comment_text" -> CommentText
  "comment_time" -> CommentTime
  "communicate" -> Communicate
  "communicate_action" -> CommunicateAction
  "compare" -> Compare
  "compete" -> Compete
  "competitor" -> Competitor
  "compilation_album" -> CompilationAlbum
  "complain" -> Complain
  "complete" -> Complete
  "completed_action_status" -> CompletedActionStatus
  "complex" -> Complex
  "composer" -> Composer
  "compound_price_specification" -> CompoundPriceSpecification
  "computer_language" -> ComputerLanguage
  "computer_store" -> ComputerStore
  "concentrate" -> Concentrate
  "concentrated" -> Concentrated
  "concern" -> Concern
  "concrete" -> Concrete
  "conductive" -> Conductive
  "confess" -> Confess
  "confirm_action" -> ConfirmAction
  "confirmation_number" -> ConfirmationNumber
  "confuse" -> Confuse
  "connected" -> Connected
  "consider" -> Consider
  "consist" -> Consist
  "consume_action" -> ConsumeAction
  "contact_option" -> ContactOption
  "contact_page" -> ContactPage
  "contact_point" -> ContactPoint
  "contact_point_option" -> ContactPointOption
  "contact_points" -> ContactPoints
  "contact_type" -> ContactType
  "contain" -> Contain
  "contained_in" -> ContainedIn
  "contained_in_place" -> ContainedInPlace
  "contains_place" -> ContainsPlace
  "contains_season" -> ContainsSeason
  "contemporary_folk" -> ContemporaryFolk
  "content_location" -> ContentLocation
  "content_rating" -> ContentRating
  "content_size" -> ContentSize
  "content_type" -> ContentType
  "content_url" -> ContentUrl
  "continent" -> Continent
  "continental_jazz" -> ContinentalJazz
  "continue" -> Continue
  "contributor" -> Contributor
  "control_action" -> ControlAction
  "convenience_store" -> ConvenienceStore
  "conversation" -> Conversation
  "cook_action" -> CookAction
  "cook_time" -> CookTime
  "cooking_method" -> CookingMethod
  "cool_jazz" -> CoolJazz
  "coolmax" -> Coolmax
  "copyright_holder" -> CopyrightHolder
  "copyright_year" -> CopyrightYear
  "cordura" -> Cordura
  "corduroy" -> Corduroy
  "coriander_leaf" -> CorianderLeaf
  "coriander_seed" -> CorianderSeed
  "corked" -> Corked
  "corn" -> Corn
  "corn_salad" -> CornSalad
  "corporation" -> Corporation
  "correct" -> Correct
  "cosmic_disco" -> CosmicDisco
  "cotton" -> Cotton
  "cough" -> Cough
  "countries_not_supported" -> CountriesNotSupported
  "countries_supported" -> CountriesSupported
  "country" -> Country
  "country_of_origin" -> CountryOfOrigin
  "courgette" -> Courgette
  "course_code" -> CourseCode
  "course_instance" -> CourseInstance
  "course_mode" -> CourseMode
  "course_prerequisites" -> CoursePrerequisites
  "courthouse" -> Courthouse
  "coverage_end_time" -> CoverageEndTime
  "coverage_start_time" -> CoverageStartTime
  "cowpunk" -> Cowpunk
  "crab_boil" -> CrabBoil
  "cranberry" -> Cranberry
  "crape" -> Crape
  "crawl" -> Crawl
  "creamy" -> Creamy
  "create_action" -> CreateAction
  "creative_work" -> CreativeWork
  "creative_work_season" -> CreativeWorkSeason
  "creative_work_series" -> CreativeWorkSeries
  "creator" -> Creator
  "credit_card" -> CreditCard
  "credited_to" -> CreditedTo
  "crematorium" -> Crematorium
  "cretonne" -> Cretonne
  "crimplene" -> Crimplene
  "crisp" -> Crisp
  "cross" -> Cross
  "crossover_jazz" -> CrossoverJazz
  "crossover_thrash" -> CrossoverThrash
  "crunk" -> Crunk
  "crush" -> Crush
  "crushed_red_pepper" -> CrushedRedPepper
  "crust_punk" -> CrustPunk
  "cubeb" -> Cubeb
  "cucumber" -> Cucumber
  "cumin" -> Cumin
  "curium" -> Curium
  "currant" -> Currant
  "currencies_accepted" -> CurrenciesAccepted
  "currency" -> Currency
  "currency_conversion_service" -> CurrencyConversionService
  "curry_ketchup" -> CurryKetchup
  "curry_leaf" -> CurryLeaf
  "curry_powder" -> CurryPowder
  "customer" -> Customer
  "daikon" -> Daikon
  "dam" -> Dam
  "damage" -> Damage
  "damaged_condition" -> DamagedCondition
  "damask" -> Damask
  "damson" -> Damson
  "dance_event" -> DanceEvent
  "dance_group" -> DanceGroup
  "dance_pop" -> DancePop
  "dance_punk" -> DancePunk
  "dance_rock" -> DanceRock
  "dark_ambient" -> DarkAmbient
  "dark_cabaret" -> DarkCabaret
  "dark_electro" -> DarkElectro
  "dark_wave" -> DarkWave
  "darkside_jungle" -> DarksideJungle
  "darmstadtium" -> Darmstadtium
  "data_catalog" -> DataCatalog
  "data_download" -> DataDownload
  "data_feed" -> DataFeed
  "data_feed_element" -> DataFeedElement
  "data_feed_item" -> DataFeedItem
  "data_type" -> DataType
  "dataset_class" -> DatasetClass
  "dataset_time_interval" -> DatasetTimeInterval
  "date_created" -> DateCreated
  "date_deleted" -> DateDeleted
  "date_issued" -> DateIssued
  "date_modified" -> DateModified
  "date_posted" -> DatePosted
  "date_published" -> DatePublished
  "date_read" -> DateRead
  "date_received" -> DateReceived
  "date_sent" -> DateSent
  "date_time" -> DateTime
  "date_vehicle_first_registered" -> DateVehicleFirstRegistered
  "dated_money_specification" -> DatedMoneySpecification
  "dateline" -> Dateline
  "day_of_week" -> DayOfWeek
  "dazzle" -> Dazzle
  "deactivate_action" -> DeactivateAction
  "death_date" -> DeathDate
  "death_industrial" -> DeathIndustrial
  "death_metal" -> DeathMetal
  "death_place" -> DeathPlace
  "decay" -> Decay
  "deceive" -> Deceive
  "decide" -> Decide
  "decorate" -> Decorate
  "deep_house" -> DeepHouse
  "default_value" -> DefaultValue
  "defence_establishment" -> DefenceEstablishment
  "delete_action" -> DeleteAction
  "delight" -> Delight
  "deliver" -> Deliver
  "delivery_address" -> DeliveryAddress
  "delivery_charge_specification" -> DeliveryChargeSpecification
  "delivery_event" -> DeliveryEvent
  "delivery_lead_time" -> DeliveryLeadTime
  "delivery_method" -> DeliveryMethod
  "delivery_status" -> DeliveryStatus
  "demand" -> Demand
  "demo_album" -> DemoAlbum
  "denim" -> Denim
  "dense" -> Dense
  "dentist" -> Dentist
  "depart_action" -> DepartAction
  "department" -> Department
  "department_store" -> DepartmentStore
  "departure_airport" -> DepartureAirport
  "departure_bus_stop" -> DepartureBusStop
  "departure_gate" -> DepartureGate
  "departure_platform" -> DeparturePlatform
  "departure_station" -> DepartureStation
  "departure_terminal" -> DepartureTerminal
  "departure_time" -> DepartureTime
  "depend" -> Depend
  "dependencies" -> Dependencies
  "deposit_account" -> DepositAccount
  "depth" -> Depth
  "describe" -> Describe
  "description" -> Description
  "desert_rock" -> DesertRock
  "deserve" -> Deserve
  "destroy" -> Destroy
  "detect" -> Detect
  "detroit_techno" -> DetroitTechno
  "develop" -> Develop
  "diabetic_diet" -> DiabeticDiet
  "digital_audio_tape_format" -> DigitalAudioTapeFormat
  "digital_document" -> DigitalDocument
  "digital_document_permission" -> DigitalDocumentPermission
  "digital_document_permission_type" -> DigitalDocumentPermissionType
  "digital_format" -> DigitalFormat
  "digital_hardcore" -> DigitalHardcore
  "dijon_ketchup" -> DijonKetchup
  "dijon_mustard" -> DijonMustard
  "dill" -> Dill
  "dill_seed" -> DillSeed
  "dimensional_lumber" -> DimensionalLumber
  "dimity" -> Dimity
  "dip" -> Dip
  "director" -> Director
  "directors" -> Directors
  "disagree" -> Disagree
  "disagree_action" -> DisagreeAction
  "disambiguating_description" -> DisambiguatingDescription
  "disappear" -> Disappear
  "disapprove" -> Disapprove
  "disarm" -> Disarm
  "disco" -> Disco
  "disco_polo" -> DiscoPolo
  "discontinued" -> Discontinued
  "discount" -> Discount
  "discount_code" -> DiscountCode
  "discount_currency" -> DiscountCurrency
  "discover" -> Discover
  "discover_action" -> DiscoverAction
  "discusses" -> Discusses
  "discussion_forum_posting" -> DiscussionForumPosting
  "discussion_url" -> DiscussionUrl
  "dislike" -> Dislike
  "dislike_action" -> DislikeAction
  "dissolution_date" -> DissolutionDate
  "distance" -> Distance
  "distribution" -> Distribution
  "diva_house" -> DivaHouse
  "divide" -> Divide
  "dixieland" -> Dixieland
  "djmix_album" -> DjmixAlbum
  "donate_action" -> DonateAction
  "donegal_tweed" -> DonegalTweed
  "doom_metal" -> DoomMetal
  "door_time" -> DoorTime
  "double" -> Double
  "download_action" -> DownloadAction
  "download_url" -> DownloadUrl
  "downvote_count" -> DownvoteCount
  "drag" -> Drag
  "draw_action" -> DrawAction
  "dream" -> Dream
  "dream_house" -> DreamHouse
  "dream_pop" -> DreamPop
  "dream_trance" -> DreamTrance
  "dress" -> Dress
  "dried_lime" -> DriedLime
  "drill" -> Drill
  "drink_action" -> DrinkAction
  "drive_wheel_configuration" -> DriveWheelConfiguration
  "drive_wheel_configuration_value" -> DriveWheelConfigurationValue
  "drone_metal" -> DroneMetal
  "drop" -> Drop
  "dropoff_location" -> DropoffLocation
  "dropoff_time" -> DropoffTime
  "drown" -> Drown
  "drugget" -> Drugget
  "drum" -> Drum
  "drum_and_bass" -> DrumAndBass
  "dry" -> Dry
  "dry_cleaning_or_laundry" -> DryCleaningOrLaundry
  "dubnium" -> Dubnium
  "dubstep" -> Dubstep
  "duck" -> Duck
  "dunedin_sound" -> DunedinSound
  "duration" -> Duration
  "duration_of_warranty" -> DurationOfWarranty
  "durian" -> Durian
  "dust" -> Dust
  "dutch_house" -> DutchHouse
  "dysprosium" -> Dysprosium
  "e_textiles" -> ETextiles
  "east_asian_pepper" -> EastAsianPepper
  "ebook" -> Ebook
  "editor" -> Editor
  "educate" -> Educate
  "education_event" -> EducationEvent
  "education_requirements" -> EducationRequirements
  "educational_alignment" -> EducationalAlignment
  "educational_audience" -> EducationalAudience
  "educational_framework" -> EducationalFramework
  "educational_organization" -> EducationalOrganization
  "educational_role" -> EducationalRole
  "educational_use" -> EducationalUse
  "eggplant" -> Eggplant
  "einsteinium" -> Einsteinium
  "elderberry" -> Elderberry
  "electrician" -> Electrician
  "electro" -> Electro
  "electro_backbeat" -> ElectroBackbeat
  "electro_grime" -> ElectroGrime
  "electro_house" -> ElectroHouse
  "electro_industrial" -> ElectroIndustrial
  "electroacoustic" -> Electroacoustic
  "electronic_art_music" -> ElectronicArtMusic
  "electronic_rock" -> ElectronicRock
  "electronica" -> Electronica
  "electronics_store" -> ElectronicsStore
  "electropop" -> Electropop
  "elegant" -> Elegant
  "elementary_school" -> ElementarySchool
  "elevation" -> Elevation
  "eligible_customer_type" -> EligibleCustomerType
  "eligible_duration" -> EligibleDuration
  "eligible_quantity" -> EligibleQuantity
  "eligible_region" -> EligibleRegion
  "eligible_transaction_volume" -> EligibleTransactionVolume
  "email" -> Email
  "email_message" -> EmailMessage
  "embarrass" -> Embarrass
  "embassy" -> Embassy
  "embed_url" -> EmbedUrl
  "emergency_service" -> EmergencyService
  "employee" -> Employee
  "employee_role" -> EmployeeRole
  "employees" -> Employees
  "employment_agency" -> EmploymentAgency
  "employment_type" -> EmploymentType
  "empty" -> Empty
  "encodes_creative_work" -> EncodesCreativeWork
  "encoding" -> Encoding
  "encoding_format" -> EncodingFormat
  "encoding_type" -> EncodingType
  "encodings" -> Encodings
  "encourage" -> Encourage
  "end_time" -> EndTime
  "endive" -> Endive
  "endorse_action" -> EndorseAction
  "engine_specification" -> EngineSpecification
  "entertain" -> Entertain
  "entertainment_business" -> EntertainmentBusiness
  "entry_point" -> EntryPoint
  "enumeration" -> Enumeration
  "epazote" -> Epazote
  "epic_doom" -> EpicDoom
  "episode" -> Episode
  "episode_number" -> EpisodeNumber
  "episodes" -> Episodes
  "equal" -> Equal
  "estimated_flight_duration" -> EstimatedFlightDuration
  "ethereal_wave" -> EtherealWave
  "ethnic_electronica" -> EthnicElectronica
  "euro_disco" -> EuroDisco
  "european_free_jazz" -> EuropeanFreeJazz
  "europium" -> Europium
  "event" -> Event
  "event_cancelled" -> EventCancelled
  "event_postponed" -> EventPostponed
  "event_rescheduled" -> EventRescheduled
  "event_reservation" -> EventReservation
  "event_scheduled" -> EventScheduled
  "event_status" -> EventStatus
  "event_status_type" -> EventStatusType
  "event_venue" -> EventVenue
  "examine" -> Examine
  "example_of_work" -> ExampleOfWork
  "excuse" -> Excuse
  "executable_library_name" -> ExecutableLibraryName
  "exercise" -> Exercise
  "exercise_action" -> ExerciseAction
  "exercise_course" -> ExerciseCourse
  "exercise_gym" -> ExerciseGym
  "exhibition_event" -> ExhibitionEvent
  "exif_data" -> ExifData
  "expand" -> Expand
  "expect" -> Expect
  "expected_arrival_from" -> ExpectedArrivalFrom
  "expected_arrival_until" -> ExpectedArrivalUntil
  "expects_acceptance_of" -> ExpectsAcceptanceOf
  "experience_requirements" -> ExperienceRequirements
  "experimental_rock" -> ExperimentalRock
  "expires" -> Expires
  "explain" -> Explain
  "explode" -> Explode
  "expressive" -> Expressive
  "extend" -> Extend
  "extracted" -> Extracted
  "fade" -> Fade
  "failed_action_status" -> FailedActionStatus
  "fallen_over" -> FallenOver
  "family_name" -> FamilyName
  "fast_food_restaurant" -> FastFoodRestaurant
  "fat_content" -> FatContent
  "fax_number" -> FaxNumber
  "feature_list" -> FeatureList
  "fees_and_commissions_specification" -> FeesAndCommissionsSpecification
  "fence" -> Fence
  "fennel" -> Fennel
  "fenugreek" -> Fenugreek
  "fermium" -> Fermium
  "festival" -> Festival
  "fiber_content" -> FiberContent
  "file_format" -> FileFormat
  "file_size" -> FileSize
  "film_action" -> FilmAction
  "financial_product" -> FinancialProduct
  "financial_service" -> FinancialService
  "find_action" -> FindAction
  "fire_station" -> FireStation
  "first_performance" -> FirstPerformance
  "fish_paste" -> FishPaste
  "fish_sauce" -> FishSauce
  "five_spice_powder" -> FiveSpicePowder
  "fix" -> Fix
  "flabby" -> Flabby
  "flamboyant" -> Flamboyant
  "flannel" -> Flannel
  "flap" -> Flap
  "flight" -> Flight
  "flight_distance" -> FlightDistance
  "flight_number" -> FlightNumber
  "flight_reservation" -> FlightReservation
  "float" -> Float
  "flood" -> Flood
  "floor_size" -> FloorSize
  "florida_breaks" -> FloridaBreaks
  "florist" -> Florist
  "fold" -> Fold
  "folk_punk" -> FolkPunk
  "folktronica" -> Folktronica
  "food_establishment" -> FoodEstablishment
  "food_establishment_reservation" -> FoodEstablishmentReservation
  "food_event" -> FoodEvent
  "food_friendly" -> FoodFriendly
  "food_service" -> FoodService
  "form" -> Form
  "foulard" -> Foulard
  "founder" -> Founder
  "founding_date" -> FoundingDate
  "founding_location" -> FoundingLocation
  "four_wheel_drive_configuration" -> FourWheelDriveConfiguration
  "foxy" -> Foxy
  "francium" -> Francium
  "freak_folk" -> FreakFolk
  "freestyle" -> Freestyle
  "freestyle_house" -> FreestyleHouse
  "french_house" -> FrenchHouse
  "friday" -> Friday
  "frighten" -> Frighten
  "frisee" -> Frisee
  "from_location" -> FromLocation
  "front_wheel_drive_configuration" -> FrontWheelDriveConfiguration
  "fruit_ketchup" -> FruitKetchup
  "fruit_preserves" -> FruitPreserves
  "fry" -> Fry
  "fry_sauce" -> FrySauce
  "fuel_consumption" -> FuelConsumption
  "fuel_efficiency" -> FuelEfficiency
  "fuel_type" -> FuelType
  "funeral_doom" -> FuneralDoom
  "funk_metal" -> FunkMetal
  "funky_house" -> FunkyHouse
  "furniture_store" -> FurnitureStore
  "fustian" -> Fustian
  "gadolinium" -> Gadolinium
  "game_platform" -> GamePlatform
  "game_play_mode" -> GamePlayMode
  "game_server" -> GameServer
  "game_server_status" -> GameServerStatus
  "game_tip" -> GameTip
  "garage_punk" -> GaragePunk
  "garage_rock" -> GarageRock
  "garam_masala" -> GaramMasala
  "garden_store" -> GardenStore
  "garlic_chives" -> GarlicChives
  "garlic_powder" -> GarlicPowder
  "garlic_salt" -> GarlicSalt
  "gas_station" -> GasStation
  "gated_residence_community" -> GatedResidenceCommunity
  "gem_squash" -> GemSquash
  "gender" -> Gender
  "gender_type" -> GenderType
  "general_contractor" -> GeneralContractor
  "geo_circle" -> GeoCircle
  "geo_coordinates" -> GeoCoordinates
  "geo_midpoint" -> GeoMidpoint
  "geo_radius" -> GeoRadius
  "geo_shape" -> GeoShape
  "geographic_area" -> GeographicArea
  "georgette" -> Georgette
  "ghetto_house" -> GhettoHouse
  "ginger" -> Ginger
  "given_name" -> GivenName
  "glam_metal" -> GlamMetal
  "glam_rock" -> GlamRock
  "glass" -> Glass
  "glass_brick" -> GlassBrick
  "glass_fiber" -> GlassFiber
  "glass_wool" -> GlassWool
  "global_location_number" -> GlobalLocationNumber
  "glue_laminate" -> GlueLaminate
  "gluten_free_diet" -> GlutenFreeDiet
  "goji_berry" -> GojiBerry
  "golf_course" -> GolfCourse
  "good_relations_class" -> GoodRelationsClass
  "good_relations_terms" -> GoodRelationsTerms
  "gooseberry" -> Gooseberry
  "gothic_metal" -> GothicMetal
  "gothic_rock" -> GothicRock
  "government_building" -> GovernmentBuilding
  "government_office" -> GovernmentOffice
  "government_organization" -> GovernmentOrganization
  "government_permit" -> GovernmentPermit
  "government_service" -> GovernmentService
  "grains_of_paradise" -> GrainsOfParadise
  "grains_of_selim" -> GrainsOfSelim
  "grapefruit" -> Grapefruit
  "gravel" -> Gravel
  "greater_galangal" -> GreaterGalangal
  "greater_or_equal" -> GreaterOrEqual
  "green_bean" -> GreenBean
  "green_pepper" -> GreenPepper
  "green_peppercorn" -> GreenPeppercorn
  "grenadine" -> Grenadine
  "grenfell_cloth" -> GrenfellCloth
  "grocery_store" -> GroceryStore
  "groove_metal" -> GrooveMetal
  "grosgrain" -> Grosgrain
  "group_boarding_policy" -> GroupBoardingPolicy
  "guacamole" -> Guacamole
  "guarantee" -> Guarantee
  "guava" -> Guava
  "gypsum_board" -> GypsumBoard
  "habanero" -> Habanero
  "haircloth" -> Haircloth
  "halal_diet" -> HalalDiet
  "hard_bop" -> HardBop
  "hard_dance" -> HardDance
  "hard_rock" -> HardRock
  "hard_trance" -> HardTrance
  "hardcover" -> Hardcover
  "hardware_store" -> HardwareStore
  "harris_tweed" -> HarrisTweed
  "has_course_instance" -> HasCourseInstance
  "has_delivery_method" -> HasDeliveryMethod
  "has_digital_document_permission" -> HasDigitalDocumentPermission
  "has_map" -> HasMap
  "has_menu" -> HasMenu
  "has_menu_item" -> HasMenuItem
  "has_menu_section" -> HasMenuSection
  "has_offer_catalog" -> HasOfferCatalog
  "has_part" -> HasPart
  "headline" -> Headline
  "health_and_beauty_business" -> HealthAndBeautyBusiness
  "health_club" -> HealthClub
  "hearing_impaired_supported" -> HearingImpairedSupported
  "heavy_metal" -> HeavyMetal
  "help" -> Help
  "herbaceous" -> Herbaceous
  "herbal" -> Herbal
  "herbes_de_provence" -> HerbesDeProvence
  "herbs_and_spice" -> HerbsAndSpice
  "high_price" -> HighPrice
  "high_school" -> HighSchool
  "hindu_diet" -> HinduDiet
  "hindu_temple" -> HinduTemple
  "hip_house" -> HipHouse
  "hiring_organization" -> HiringOrganization
  "hobby_shop" -> HobbyShop
  "hodden" -> Hodden
  "hoja_santa" -> HojaSanta
  "holmium" -> Holmium
  "holy_basil" -> HolyBasil
  "home_and_construction_business" -> HomeAndConstructionBusiness
  "home_goods_store" -> HomeGoodsStore
  "home_location" -> HomeLocation
  "home_team" -> HomeTeam
  "honey_dill" -> HoneyDill
  "honeydew" -> Honeydew
  "honorific_prefix" -> HonorificPrefix
  "honorific_suffix" -> HonorificSuffix
  "horror_punk" -> HorrorPunk
  "horseradish" -> Horseradish
  "hospital" -> Hospital
  "hosting_organization" -> HostingOrganization
  "hot_mustard" -> HotMustard
  "hot_sauce" -> HotSauce
  "hotel_room" -> HotelRoom
  "houndstooth" -> Houndstooth
  "hours_available" -> HoursAvailable
  "house_painter" -> HousePainter
  "http_method" -> HttpMethod
  "huckleberry" -> Huckleberry
  "iata_code" -> IataCode
  "ice_cream_shop" -> IceCreamShop
  "identify" -> Identify
  "idli_podi" -> IdliPodi
  "ignore_action" -> IgnoreAction
  "illustrator" -> Illustrator
  "image_gallery" -> ImageGallery
  "image_object" -> ImageObject
  "imagine" -> Imagine
  "impress" -> Impress
  "improve" -> Improve
  "in_broadcast_lineup" -> InBroadcastLineup
  "in_language" -> InLanguage
  "in_playlist" -> InPlaylist
  "in_stock" -> InStock
  "in_store_only" -> InStoreOnly
  "incentive_compensation" -> IncentiveCompensation
  "incentives" -> Incentives
  "include" -> Include
  "included_composition" -> IncludedComposition
  "included_data_catalog" -> IncludedDataCatalog
  "included_in_data_catalog" -> IncludedInDataCatalog
  "includes_object" -> IncludesObject
  "increase" -> Increase
  "indian_bay_leaf" -> IndianBayLeaf
  "indie_folk" -> IndieFolk
  "indie_pop" -> IndiePop
  "indie_rock" -> IndieRock
  "indium" -> Indium
  "individual_product" -> IndividualProduct
  "industrial" -> Industrial
  "industrial_folk" -> IndustrialFolk
  "industrial_metal" -> IndustrialMetal
  "industrial_rock" -> IndustrialRock
  "industry" -> Industry
  "ineligible_region" -> IneligibleRegion
  "influence" -> Influence
  "inform" -> Inform
  "inform_action" -> InformAction
  "ingredients" -> Ingredients
  "inject" -> Inject
  "injure" -> Injure
  "insert_action" -> InsertAction
  "install_action" -> InstallAction
  "install_url" -> InstallUrl
  "instructor" -> Instructor
  "instrument" -> Instrument
  "insurance_agency" -> InsuranceAgency
  "intangible" -> Intangible
  "integer" -> Integer
  "intellectually_satisfying" -> IntellectuallySatisfying
  "intelligent_drum_and_bass" -> IntelligentDrumAndBass
  "intend" -> Intend
  "interact_action" -> InteractAction
  "interaction_counter" -> InteractionCounter
  "interaction_service" -> InteractionService
  "interaction_statistic" -> InteractionStatistic
  "interaction_type" -> InteractionType
  "interactivity_type" -> InteractivityType
  "interest" -> Interest
  "interest_rate" -> InterestRate
  "interfere" -> Interfere
  "internet_cafe" -> InternetCafe
  "interrupt" -> Interrupt
  "introduce" -> Introduce
  "invent" -> Invent
  "inventory_level" -> InventoryLevel
  "investment_or_deposit" -> InvestmentOrDeposit
  "invite" -> Invite
  "invite_action" -> InviteAction
  "invoice" -> Invoice
  "irish_linen" -> IrishLinen
  "irritate" -> Irritate
  "is_accessible_for_free" -> IsAccessibleForFree
  "is_accessory_or_spare_part_for" -> IsAccessoryOrSparePartFor
  "is_based_on" -> IsBasedOn
  "is_based_on_url" -> IsBasedOnUrl
  "is_consumable_for" -> IsConsumableFor
  "is_family_friendly" -> IsFamilyFriendly
  "is_gift" -> IsGift
  "is_live_broadcast" -> IsLiveBroadcast
  "is_part_of" -> IsPartOf
  "is_related_to" -> IsRelatedTo
  "is_similar_to" -> IsSimilarTo
  "is_variant_of" -> IsVariantOf
  "issue_number" -> IssueNumber
  "issued_by" -> IssuedBy
  "issued_through" -> IssuedThrough
  "italo_dance" -> ItaloDance
  "italo_disco" -> ItaloDisco
  "italo_house" -> ItaloHouse
  "item_availability" -> ItemAvailability
  "item_condition" -> ItemCondition
  "item_list" -> ItemList
  "item_list_element" -> ItemListElement
  "item_list_order" -> ItemListOrder
  "item_list_order_ascending" -> ItemListOrderAscending
  "item_list_order_descending" -> ItemListOrderDescending
  "item_list_order_type" -> ItemListOrderType
  "item_list_unordered" -> ItemListUnordered
  "item_offered" -> ItemOffered
  "item_page" -> ItemPage
  "item_reviewed" -> ItemReviewed
  "item_shipped" -> ItemShipped
  "jackfruit" -> Jackfruit
  "jalapeno" -> Jalapeno
  "jamaican_jerk_spice" -> JamaicanJerkSpice
  "jazz_blues" -> JazzBlues
  "jazz_funk" -> JazzFunk
  "jazz_fusion" -> JazzFusion
  "jazz_rap" -> JazzRap
  "jazz_rock" -> JazzRock
  "jerusalem_artichoke" -> JerusalemArtichoke
  "jewelry_store" -> JewelryStore
  "jicama" -> Jicama
  "job_benefits" -> JobBenefits
  "job_location" -> JobLocation
  "job_posting" -> JobPosting
  "job_title" -> JobTitle
  "join_action" -> JoinAction
  "judge" -> Judge
  "juicy" -> Juicy
  "jujube" -> Jujube
  "jump_up" -> JumpUp
  "juniper_berry" -> JuniperBerry
  "kente_cloth" -> KenteCloth
  "kerseymere" -> Kerseymere
  "ketchup" -> Ketchup
  "kevlar" -> Kevlar
  "keywords" -> Keywords
  "khaki_drill" -> KhakiDrill
  "kick" -> Kick
  "kidney_bean" -> KidneyBean
  "kill" -> Kill
  "kimchi" -> Kimchi
  "kiss" -> Kiss
  "kiwi_fruit" -> KiwiFruit
  "kneel" -> Kneel
  "knock" -> Knock
  "known_vehicle_damages" -> KnownVehicleDamages
  "kohlrabi" -> Kohlrabi
  "kosher_diet" -> KosherDiet
  "krautrock" -> Krautrock
  "kumquat" -> Kumquat
  "label" -> Label
  "lake_body_of_water" -> LakeBodyOfWater
  "lampas" -> Lampas
  "landform" -> Landform
  "landlord" -> Landlord
  "landmarks_or_historical_buildings" -> LandmarksOrHistoricalBuildings
  "language" -> Language
  "lanthanum" -> Lanthanum
  "laser_disc_format" -> LaserDiscFormat
  "laser_like" -> LaserLike
  "last_reviewed" -> LastReviewed
  "latin_house" -> LatinHouse
  "latin_jazz" -> LatinJazz
  "latitude" -> Latitude
  "laugh" -> Laugh
  "launch" -> Launch
  "lavender" -> Lavender
  "lawrencium" -> Lawrencium
  "learn" -> Learn
  "learning_resource_type" -> LearningResourceType
  "leathery" -> Leathery
  "leave_action" -> LeaveAction
  "left_hand_driving" -> LeftHandDriving
  "legal_name" -> LegalName
  "legal_service" -> LegalService
  "legislative_building" -> LegislativeBuilding
  "legume" -> Legume
  "lei_code" -> LeiCode
  "lemon" -> Lemon
  "lemon_balm" -> LemonBalm
  "lemon_grass" -> LemonGrass
  "lemon_myrtle" -> LemonMyrtle
  "lemon_pepper" -> LemonPepper
  "lemon_verbena" -> LemonVerbena
  "lend_action" -> LendAction
  "lender" -> Lender
  "lentils" -> Lentils
  "lesser" -> Lesser
  "lesser_galangal" -> LesserGalangal
  "lesser_or_equal" -> LesserOrEqual
  "lettuce" -> Lettuce
  "library" -> Library
  "license" -> License
  "lighten" -> Lighten
  "like_action" -> LikeAction
  "lima_bean" -> LimaBean
  "lime" -> Lime
  "limited_availability" -> LimitedAvailability
  "linen" -> Linen
  "liquid_funk" -> LiquidFunk
  "liquor_store" -> LiquorStore
  "liquorice" -> Liquorice
  "list" -> List
  "list_item" -> ListItem
  "listen" -> Listen
  "listen_action" -> ListenAction
  "literary_event" -> LiteraryEvent
  "lithium" -> Lithium
  "live_album" -> LiveAlbum
  "live_blog_posting" -> LiveBlogPosting
  "live_blog_update" -> LiveBlogUpdate
  "load" -> Load
  "loan_or_credit" -> LoanOrCredit
  "loan_term" -> LoanTerm
  "local_business" -> LocalBusiness
  "location" -> Location
  "location_created" -> LocationCreated
  "location_feature_specification" -> LocationFeatureSpecification
  "locker_delivery" -> LockerDelivery
  "locksmith" -> Locksmith
  "loden" -> Loden
  "lodging_business" -> LodgingBusiness
  "lodging_reservation" -> LodgingReservation
  "lodging_unit_description" -> LodgingUnitDescription
  "lodging_unit_type" -> LodgingUnitType
  "long_pepper" -> LongPepper
  "longitude" -> Longitude
  "look" -> Look
  "loquat" -> Loquat
  "lose_action" -> LoseAction
  "loser" -> Loser
  "lovage" -> Lovage
  "love" -> Love
  "low_calorie_diet" -> LowCalorieDiet
  "low_fat_diet" -> LowFatDiet
  "low_lactose_diet" -> LowLactoseDiet
  "low_price" -> LowPrice
  "low_salt_diet" -> LowSaltDiet
  "lutetium" -> Lutetium
  "lychee" -> Lychee
  "lyricist" -> Lyricist
  "lyrics" -> Lyrics
  "machine_knitting" -> MachineKnitting
  "madras" -> Madras
  "magnesium" -> Magnesium
  "main_content_of_page" -> MainContentOfPage
  "main_entity" -> MainEntity
  "main_entity_of_page" -> MainEntityOfPage
  "mainstream_jazz" -> MainstreamJazz
  "makes_offer" -> MakesOffer
  "male" -> Male
  "mamey" -> Mamey
  "manage" -> Manage
  "mandarine" -> Mandarine
  "manganese" -> Manganese
  "mangetout" -> Mangetout
  "mango_ginger" -> MangoGinger
  "mango_pickle" -> MangoPickle
  "manufacturer" -> Manufacturer
  "map_category_type" -> MapCategoryType
  "map_type" -> MapType
  "marjoram" -> Marjoram
  "marry_action" -> MarryAction
  "mastic" -> Mastic
  "match" -> Match
  "material" -> Material
  "math_rock" -> MathRock
  "matter" -> Matter
  "max_price" -> MaxPrice
  "max_value" -> MaxValue
  "maximum_attendee_capacity" -> MaximumAttendeeCapacity
  "mayonnaise" -> Mayonnaise
  "meal_service" -> MealService
  "media_object" -> MediaObject
  "medical_organization" -> MedicalOrganization
  "medieval_metal" -> MedievalMetal
  "meitnerium" -> Meitnerium
  "melodic_death_metal" -> MelodicDeathMetal
  "melt" -> Melt
  "member" -> Member
  "member_of" -> MemberOf
  "members" -> Members
  "membership_number" -> MembershipNumber
  "memorise" -> Memorise
  "memory_requirements" -> MemoryRequirements
  "mendelevium" -> Mendelevium
  "mens_clothing_store" -> MensClothingStore
  "mentions" -> Mentions
  "menu" -> Menu
  "menu_item" -> MenuItem
  "menu_section" -> MenuSection
  "merchant" -> Merchant
  "mercury" -> Mercury
  "mesh" -> Mesh
  "mess_up" -> MessUp
  "message" -> Message
  "message_attachment" -> MessageAttachment
  "microfiber" -> Microfiber
  "microhouse" -> Microhouse
  "middle_school" -> MiddleSchool
  "mignonette_sauce" -> MignonetteSauce
  "mileage_from_odometer" -> MileageFromOdometer
  "milk" -> Milk
  "min_price" -> MinPrice
  "min_value" -> MinValue
  "minimum_payment_due" -> MinimumPaymentDue
  "mint" -> Mint
  "miss" -> Miss
  "mix" -> Mix
  "mixed_spice" -> MixedSpice
  "mixtape_album" -> MixtapeAlbum
  "moan" -> Moan
  "mobile_application" -> MobileApplication
  "mobile_phone_store" -> MobilePhoneStore
  "modal_jazz" -> ModalJazz
  "model" -> Model
  "modified_time" -> ModifiedTime
  "moleskin" -> Moleskin
  "molybdenum" -> Molybdenum
  "monday" -> Monday
  "monetary_amount" -> MonetaryAmount
  "monkey_gland_sauce" -> MonkeyGlandSauce
  "montreal_steak_seasoning" -> MontrealSteakSeasoning
  "moquette" -> Moquette
  "mosque" -> Mosque
  "motel" -> Motel
  "motorcycle_dealer" -> MotorcycleDealer
  "motorcycle_repair" -> MotorcycleRepair
  "mountain" -> Mountain
  "mourn" -> Mourn
  "move" -> Move
  "move_action" -> MoveAction
  "movie" -> Movie
  "movie_clip" -> MovieClip
  "movie_rental_store" -> MovieRentalStore
  "movie_series" -> MovieSeries
  "movie_theater" -> MovieTheater
  "moving_company" -> MovingCompany
  "mud" -> Mud
  "muddle" -> Muddle
  "mugwort" -> Mugwort
  "mulberry" -> Mulberry
  "mulling_spices" -> MullingSpices
  "multiple_values" -> MultipleValues
  "multiply" -> Multiply
  "mumbo_sauce" -> MumboSauce
  "mung_bean" -> MungBean
  "murder" -> Murder
  "museum" -> Museum
  "mushroom" -> Mushroom
  "mushroom_ketchup" -> MushroomKetchup
  "music_album" -> MusicAlbum
  "music_album_production_type" -> MusicAlbumProductionType
  "music_album_release_type" -> MusicAlbumReleaseType
  "music_arrangement" -> MusicArrangement
  "music_by" -> MusicBy
  "music_composition" -> MusicComposition
  "music_composition_form" -> MusicCompositionForm
  "music_event" -> MusicEvent
  "music_group" -> MusicGroup
  "music_group_member" -> MusicGroupMember
  "music_playlist" -> MusicPlaylist
  "music_recording" -> MusicRecording
  "music_release" -> MusicRelease
  "music_release_format" -> MusicReleaseFormat
  "music_release_format_type" -> MusicReleaseFormatType
  "music_store" -> MusicStore
  "music_venue" -> MusicVenue
  "music_video_object" -> MusicVideoObject
  "musical_key" -> MusicalKey
  "muslin" -> Muslin
  "mustard" -> Mustard
  "mustard_green" -> MustardGreen
  "mustard_oil" -> MustardOil
  "musty" -> Musty
  "nail_salon" -> NailSalon
  "nainsook" -> Nainsook
  "named_position" -> NamedPosition
  "nankeen" -> Nankeen
  "nationality" -> Nationality
  "navy_bean" -> NavyBean
  "nectarine" -> Nectarine
  "need" -> Need
  "neo_bop_jazz" -> NeoBopJazz
  "neo_psychedelia" -> NeoPsychedelia
  "neo_swing" -> NeoSwing
  "neodymium" -> Neodymium
  "neptunium" -> Neptunium
  "nest" -> Nest
  "net_worth" -> NetWorth
  "new_age" -> NewAge
  "new_beat" -> NewBeat
  "new_condition" -> NewCondition
  "new_prog" -> NewProg
  "new_rave" -> NewRave
  "new_wave" -> NewWave
  "new_zealand_spinach" -> NewZealandSpinach
  "news_article" -> NewsArticle
  "next_item" -> NextItem
  "ngo" -> Ngo
  "nickel" -> Nickel
  "nigella" -> Nigella
  "nigella_sativa" -> NigellaSativa
  "night_club" -> NightClub
  "ninon" -> Ninon
  "niobium" -> Niobium
  "nobelium" -> Nobelium
  "noise_pop" -> NoisePop
  "noise_rock" -> NoiseRock
  "non_equal" -> NonEqual
  "notary" -> Notary
  "note" -> Note
  "note_digital_document" -> NoteDigitalDocument
  "notice" -> Notice
  "novelty_ragtime" -> NoveltyRagtime
  "nu_disco" -> NuDisco
  "nu_jazz" -> NuJazz
  "nu_metal" -> NuMetal
  "nu_skool_breaks" -> NuSkoolBreaks
  "null" -> Null
  "num_adults" -> NumAdults
  "num_children" -> NumChildren
  "number" -> Number
  "number_of_airbags" -> NumberOfAirbags
  "number_of_axles" -> NumberOfAxles
  "number_of_beds" -> NumberOfBeds
  "number_of_doors" -> NumberOfDoors
  "number_of_employees" -> NumberOfEmployees
  "number_of_episodes" -> NumberOfEpisodes
  "number_of_forward_gears" -> NumberOfForwardGears
  "number_of_items" -> NumberOfItems
  "number_of_pages" -> NumberOfPages
  "number_of_players" -> NumberOfPlayers
  "number_of_previous_owners" -> NumberOfPreviousOwners
  "number_of_rooms" -> NumberOfRooms
  "number_of_seasons" -> NumberOfSeasons
  "numbered_position" -> NumberedPosition
  "nut" -> Nut
  "nutmeg" -> Nutmeg
  "nutrition" -> Nutrition
  "nutrition_information" -> NutritionInformation
  "nutritional_yeast" -> NutritionalYeast
  "nylon" -> Nylon
  "oaked" -> Oaked
  "object" -> Object
  "observe" -> Observe
  "obtain" -> Obtain
  "occupancy" -> Occupancy
  "occupational_category" -> OccupationalCategory
  "ocean_body_of_water" -> OceanBodyOfWater
  "offer_catalog" -> OfferCatalog
  "offer_count" -> OfferCount
  "offer_item_condition" -> OfferItemCondition
  "office_equipment_store" -> OfficeEquipmentStore
  "offline_permanently" -> OfflinePermanently
  "offline_temporarily" -> OfflineTemporarily
  "oilskin" -> Oilskin
  "okra" -> Okra
  "old_bay_seasoning" -> OldBaySeasoning
  "oldschool_jungle" -> OldschoolJungle
  "olefin" -> Olefin
  "olive" -> Olive
  "olive_oil" -> OliveOil
  "on_demand_event" -> OnDemandEvent
  "on_site_pickup" -> OnSitePickup
  "onion" -> Onion
  "onion_powder" -> OnionPowder
  "online" -> Online
  "online_full" -> OnlineFull
  "online_only" -> OnlineOnly
  "opening_hours" -> OpeningHours
  "opening_hours_specification" -> OpeningHoursSpecification
  "operating_system" -> OperatingSystem
  "opponent" -> Opponent
  "option" -> Option
  "opulent" -> Opulent
  "orange" -> Orange
  "orchestral_jazz" -> OrchestralJazz
  "orchestral_uplifting" -> OrchestralUplifting
  "order_action" -> OrderAction
  "order_cancelled" -> OrderCancelled
  "order_date" -> OrderDate
  "order_delivered" -> OrderDelivered
  "order_delivery" -> OrderDelivery
  "order_in_transit" -> OrderInTransit
  "order_item_number" -> OrderItemNumber
  "order_item_status" -> OrderItemStatus
  "order_number" -> OrderNumber
  "order_payment_due" -> OrderPaymentDue
  "order_pickup_available" -> OrderPickupAvailable
  "order_problem" -> OrderProblem
  "order_processing" -> OrderProcessing
  "order_quantity" -> OrderQuantity
  "order_returned" -> OrderReturned
  "order_status" -> OrderStatus
  "ordered_item" -> OrderedItem
  "organdy" -> Organdy
  "organization" -> Organization
  "organization_role" -> OrganizationRole
  "organize_action" -> OrganizeAction
  "organza" -> Organza
  "oriented_strand_board" -> OrientedStrandBoard
  "origin_address" -> OriginAddress
  "osmium" -> Osmium
  "osnaburg" -> Osnaburg
  "ottoman" -> Ottoman
  "out_of_stock" -> OutOfStock
  "outlet_store" -> OutletStore
  "overflow" -> Overflow
  "owned_from" -> OwnedFrom
  "owned_through" -> OwnedThrough
  "ownership_info" -> OwnershipInfo
  "oxford" -> Oxford
  "oxidized" -> Oxidized
  "paddle" -> Paddle
  "paduasoy" -> Paduasoy
  "page_end" -> PageEnd
  "page_start" -> PageStart
  "pagination" -> Pagination
  "paint_action" -> PaintAction
  "painting" -> Painting
  "paisley" -> Paisley
  "paisley_underground" -> PaisleyUnderground
  "palladium" -> Palladium
  "paperback" -> Paperback
  "paprika" -> Paprika
  "parallel_strand_lumber" -> ParallelStrandLumber
  "parcel_delivery" -> ParcelDelivery
  "parcel_service" -> ParcelService
  "parent" -> Parent
  "parent_audience" -> ParentAudience
  "parent_item" -> ParentItem
  "parent_organization" -> ParentOrganization
  "parent_service" -> ParentService
  "parking_facility" -> ParkingFacility
  "parking_map" -> ParkingMap
  "parsley" -> Parsley
  "parsnip" -> Parsnip
  "part_of_episode" -> PartOfEpisode
  "part_of_invoice" -> PartOfInvoice
  "part_of_order" -> PartOfOrder
  "part_of_season" -> PartOfSeason
  "part_of_series" -> PartOfSeries
  "part_of_tvseries" -> PartOfTvseries
  "participant" -> Participant
  "party_size" -> PartySize
  "pashmina" -> Pashmina
  "pass" -> Pass
  "passenger_priority_status" -> PassengerPriorityStatus
  "passenger_sequence_number" -> PassengerSequenceNumber
  "patty_pan" -> PattyPan
  "pause" -> Pause
  "pawn_shop" -> PawnShop
  "pay_action" -> PayAction
  "payment_accepted" -> PaymentAccepted
  "payment_automatically_applied" -> PaymentAutomaticallyApplied
  "payment_card" -> PaymentCard
  "payment_charge_specification" -> PaymentChargeSpecification
  "payment_complete" -> PaymentComplete
  "payment_declined" -> PaymentDeclined
  "payment_due" -> PaymentDue
  "payment_due_date" -> PaymentDueDate
  "payment_method" -> PaymentMethod
  "payment_method_id" -> PaymentMethodId
  "payment_past_due" -> PaymentPastDue
  "payment_service" -> PaymentService
  "payment_status" -> PaymentStatus
  "payment_status_type" -> PaymentStatusType
  "payment_url" -> PaymentUrl
  "peach" -> Peach
  "pedal" -> Pedal
  "peep" -> Peep
  "people_audience" -> PeopleAudience
  "pepper_jelly" -> PepperJelly
  "percale" -> Percale
  "perform_action" -> PerformAction
  "performance_role" -> PerformanceRole
  "performer" -> Performer
  "performer_in" -> PerformerIn
  "performers" -> Performers
  "performing_arts_theater" -> PerformingArtsTheater
  "performing_group" -> PerformingGroup
  "perilla" -> Perilla
  "periodical" -> Periodical
  "permission_type" -> PermissionType
  "permit" -> Permit
  "permit_audience" -> PermitAudience
  "permitted_usage" -> PermittedUsage
  "persimmon" -> Persimmon
  "person" -> Person
  "peruvian_pepper" -> PeruvianPepper
  "pet_store" -> PetStore
  "pets_allowed" -> PetsAllowed
  "pharmacy" -> Pharmacy
  "photo" -> Photo
  "photograph" -> Photograph
  "photograph_action" -> PhotographAction
  "photos" -> Photos
  "physalis" -> Physalis
  "piccalilli" -> Piccalilli
  "pickled_cucumber" -> PickledCucumber
  "pickled_fruit" -> PickledFruit
  "pickled_onion" -> PickledOnion
  "pickled_pepper" -> PickledPepper
  "pickup_location" -> PickupLocation
  "pickup_time" -> PickupTime
  "pico_de_gallo" -> PicoDeGallo
  "pin_stripes" -> PinStripes
  "pine" -> Pine
  "pineapple" -> Pineapple
  "pinto_bean" -> PintoBean
  "place" -> Place
  "place_of_worship" -> PlaceOfWorship
  "plan" -> Plan
  "plan_action" -> PlanAction
  "plant" -> Plant
  "plastic" -> Plastic
  "plastic_laminate" -> PlasticLaminate
  "platinum" -> Platinum
  "play_action" -> PlayAction
  "play_mode" -> PlayMode
  "player_type" -> PlayerType
  "players_online" -> PlayersOnline
  "playground" -> Playground
  "plush" -> Plush
  "plutonium" -> Plutonium
  "plywood" -> Plywood
  "point" -> Point
  "polar_fleece" -> PolarFleece
  "police_station" -> PoliceStation
  "polish" -> Polish
  "polonium" -> Polonium
  "polyester" -> Polyester
  "polygon" -> Polygon
  "polystyrene" -> Polystyrene
  "polyurethane" -> Polyurethane
  "pomegranate" -> Pomegranate
  "pomegranate_seed" -> PomegranateSeed
  "pomelo" -> Pomelo
  "pond" -> Pond
  "pongee" -> Pongee
  "pop" -> Pop
  "pop_punk" -> PopPunk
  "pop_rock" -> PopRock
  "popcorn_seasoning" -> PopcornSeasoning
  "poplin" -> Poplin
  "poppy_seed" -> PoppySeed
  "position" -> Position
  "possess" -> Possess
  "post" -> Post
  "post_bop" -> PostBop
  "post_britpop" -> PostBritpop
  "post_disco" -> PostDisco
  "post_grunge" -> PostGrunge
  "post_hardcore" -> PostHardcore
  "post_metal" -> PostMetal
  "post_office" -> PostOffice
  "post_office_box_number" -> PostOfficeBoxNumber
  "post_punk" -> PostPunk
  "post_punk_revival" -> PostPunkRevival
  "post_rock" -> PostRock
  "postal_address" -> PostalAddress
  "postal_code" -> PostalCode
  "potassium" -> Potassium
  "potato" -> Potato
  "potential_action" -> PotentialAction
  "potential_action_status" -> PotentialActionStatus
  "powder_douce" -> PowderDouce
  "power_electronics" -> PowerElectronics
  "power_metal" -> PowerMetal
  "power_noise" -> PowerNoise
  "power_pop" -> PowerPop
  "powerful" -> Powerful
  "practise" -> Practise
  "praseodymium" -> Praseodymium
  "pray" -> Pray
  "pre_order" -> PreOrder
  "pre_sale" -> PreSale
  "preach" -> Preach
  "precede" -> Precede
  "predecessor_of" -> PredecessorOf
  "prefer" -> Prefer
  "prep_time" -> PrepTime
  "prepare" -> Prepare
  "prepend_action" -> PrependAction
  "preschool" -> Preschool
  "present" -> Present
  "presentation_digital_document" -> PresentationDigitalDocument
  "preserve" -> Preserve
  "pretend" -> Pretend
  "prevent" -> Prevent
  "previous_item" -> PreviousItem
  "previous_start_date" -> PreviousStartDate
  "price" -> Price
  "price_component" -> PriceComponent
  "price_currency" -> PriceCurrency
  "price_range" -> PriceRange
  "price_specification" -> PriceSpecification
  "price_type" -> PriceType
  "price_valid_until" -> PriceValidUntil
  "prick" -> Prick
  "primary_image_of_page" -> PrimaryImageOfPage
  "print" -> Print
  "print_column" -> PrintColumn
  "print_edition" -> PrintEdition
  "print_page" -> PrintPage
  "print_section" -> PrintSection
  "processing_time" -> ProcessingTime
  "processor_requirements" -> ProcessorRequirements
  "produce" -> Produce
  "produces" -> Produces
  "product" -> Product
  "product_id" -> ProductId
  "product_model" -> ProductModel
  "product_supported" -> ProductSupported
  "production_company" -> ProductionCompany
  "production_date" -> ProductionDate
  "professional_service" -> ProfessionalService
  "proficiency_level" -> ProficiencyLevel
  "profile_page" -> ProfilePage
  "program_membership" -> ProgramMembership
  "program_membership_used" -> ProgramMembershipUsed
  "program_name" -> ProgramName
  "programming_language" -> ProgrammingLanguage
  "programming_model" -> ProgrammingModel
  "progressive" -> Progressive
  "progressive_breaks" -> ProgressiveBreaks
  "progressive_drum_bass" -> ProgressiveDrumBass
  "progressive_folk" -> ProgressiveFolk
  "progressive_house" -> ProgressiveHouse
  "progressive_metal" -> ProgressiveMetal
  "progressive_rock" -> ProgressiveRock
  "progressive_techno" -> ProgressiveTechno
  "promethium" -> Promethium
  "promise" -> Promise
  "property_id" -> PropertyId
  "property_value" -> PropertyValue
  "property_value_specification" -> PropertyValueSpecification
  "protactinium" -> Protactinium
  "protect" -> Protect
  "protein_content" -> ProteinContent
  "provide" -> Provide
  "provider" -> Provider
  "provider_mobility" -> ProviderMobility
  "provides_broadcast_service" -> ProvidesBroadcastService
  "provides_service" -> ProvidesService
  "psychedelic_folk" -> PsychedelicFolk
  "psychedelic_rock" -> PsychedelicRock
  "psychedelic_trance" -> PsychedelicTrance
  "public_holidays" -> PublicHolidays
  "public_swimming_pool" -> PublicSwimmingPool
  "publication" -> Publication
  "publication_event" -> PublicationEvent
  "publication_issue" -> PublicationIssue
  "publication_volume" -> PublicationVolume
  "published_on" -> PublishedOn
  "publisher" -> Publisher
  "publishing_principles" -> PublishingPrinciples
  "pull" -> Pull
  "pump" -> Pump
  "pumpkin" -> Pumpkin
  "pumpkin_pie_spice" -> PumpkinPieSpice
  "puncture" -> Puncture
  "punish" -> Punish
  "punk_jazz" -> PunkJazz
  "punk_rock" -> PunkRock
  "purchase_date" -> PurchaseDate
  "purple_mangosteen" -> PurpleMangosteen
  "push" -> Push
  "qualifications" -> Qualifications
  "qualitative_value" -> QualitativeValue
  "quantitative_value" -> QuantitativeValue
  "quantity" -> Quantity
  "query" -> Query
  "quest" -> Quest
  "question" -> Question
  "quince" -> Quince
  "quote_action" -> QuoteAction
  "r_news" -> RNews
  "race" -> Race
  "radiate" -> Radiate
  "radicchio" -> Radicchio
  "radio_channel" -> RadioChannel
  "radio_clip" -> RadioClip
  "radio_episode" -> RadioEpisode
  "radio_season" -> RadioSeason
  "radio_series" -> RadioSeries
  "radio_station" -> RadioStation
  "radish" -> Radish
  "radium" -> Radium
  "raga_rock" -> RagaRock
  "ragga_jungle" -> RaggaJungle
  "ragtime" -> Ragtime
  "raisiny" -> Raisiny
  "rambutan" -> Rambutan
  "rammed_earth" -> RammedEarth
  "rap_metal" -> RapMetal
  "rap_rock" -> RapRock
  "raspberry" -> Raspberry
  "rating_count" -> RatingCount
  "rating_value" -> RatingValue
  "reach" -> Reach
  "react_action" -> ReactAction
  "read_action" -> ReadAction
  "read_permission" -> ReadPermission
  "readonly_value" -> ReadonlyValue
  "real_estate_agent" -> RealEstateAgent
  "realise" -> Realise
  "rear_wheel_drive_configuration" -> RearWheelDriveConfiguration
  "receive" -> Receive
  "receive_action" -> ReceiveAction
  "recipe" -> Recipe
  "recipe_category" -> RecipeCategory
  "recipe_cuisine" -> RecipeCuisine
  "recipe_ingredient" -> RecipeIngredient
  "recipe_instructions" -> RecipeInstructions
  "recipe_yield" -> RecipeYield
  "recipient" -> Recipient
  "recognise" -> Recognise
  "record" -> Record
  "record_label" -> RecordLabel
  "recorded_as" -> RecordedAs
  "recorded_at" -> RecordedAt
  "recorded_in" -> RecordedIn
  "recording_of" -> RecordingOf
  "recycling_center" -> RecyclingCenter
  "redcurrant" -> Redcurrant
  "reduce" -> Reduce
  "reference_quantity" -> ReferenceQuantity
  "references_order" -> ReferencesOrder
  "refined" -> Refined
  "reflect" -> Reflect
  "refurbished_condition" -> RefurbishedCondition
  "refuse" -> Refuse
  "regions_allowed" -> RegionsAllowed
  "register_action" -> RegisterAction
  "regret" -> Regret
  "reign" -> Reign
  "reject" -> Reject
  "reject_action" -> RejectAction
  "rejoice" -> Rejoice
  "related_link" -> RelatedLink
  "related_to" -> RelatedTo
  "relax" -> Relax
  "release" -> Release
  "release_date" -> ReleaseDate
  "release_notes" -> ReleaseNotes
  "release_of" -> ReleaseOf
  "released_event" -> ReleasedEvent
  "relish" -> Relish
  "remain" -> Remain
  "remaining_attendee_capacity" -> RemainingAttendeeCapacity
  "remember" -> Remember
  "remind" -> Remind
  "remix_album" -> RemixAlbum
  "remoulade" -> Remoulade
  "remove" -> Remove
  "rent_action" -> RentAction
  "rental_car_reservation" -> RentalCarReservation
  "replace" -> Replace
  "replace_action" -> ReplaceAction
  "replacer" -> Replacer
  "reply" -> Reply
  "reply_action" -> ReplyAction
  "reply_to_url" -> ReplyToUrl
  "report" -> Report
  "report_number" -> ReportNumber
  "representative_of_page" -> RepresentativeOfPage
  "reproduce" -> Reproduce
  "request" -> Request
  "required_collateral" -> RequiredCollateral
  "required_gender" -> RequiredGender
  "required_max_age" -> RequiredMaxAge
  "required_min_age" -> RequiredMinAge
  "requirements" -> Requirements
  "requires_subscription" -> RequiresSubscription
  "rescue" -> Rescue
  "researcher" -> Researcher
  "reservation" -> Reservation
  "reservation_cancelled" -> ReservationCancelled
  "reservation_confirmed" -> ReservationConfirmed
  "reservation_for" -> ReservationFor
  "reservation_hold" -> ReservationHold
  "reservation_id" -> ReservationId
  "reservation_package" -> ReservationPackage
  "reservation_pending" -> ReservationPending
  "reservation_status" -> ReservationStatus
  "reservation_status_type" -> ReservationStatusType
  "reserve_action" -> ReserveAction
  "reserved_ticket" -> ReservedTicket
  "reservoir" -> Reservoir
  "residence" -> Residence
  "resort" -> Resort
  "responsibilities" -> Responsibilities
  "restaurant" -> Restaurant
  "restricted_diet" -> RestrictedDiet
  "result" -> Result
  "result_comment" -> ResultComment
  "result_review" -> ResultReview
  "resume_action" -> ResumeAction
  "reticent" -> Reticent
  "retire" -> Retire
  "return" -> Return
  "return_action" -> ReturnAction
  "review" -> Review
  "review_action" -> ReviewAction
  "review_body" -> ReviewBody
  "review_count" -> ReviewCount
  "review_rating" -> ReviewRating
  "reviewed_by" -> ReviewedBy
  "reviews" -> Reviews
  "rhenium" -> Rhenium
  "rhodium" -> Rhodium
  "rhubarb" -> Rhubarb
  "rhyme" -> Rhyme
  "rich" -> Rich
  "right_hand_driving" -> RightHandDriving
  "rinse" -> Rinse
  "riot_grrrl" -> RiotGrrrl
  "ripstop" -> Ripstop
  "risk" -> Risk
  "river_body_of_water" -> RiverBodyOfWater
  "rock_and_roll" -> RockAndRoll
  "rock_in_opposition" -> RockInOpposition
  "rock_melon" -> RockMelon
  "roentgenium" -> Roentgenium
  "role_name" -> RoleName
  "roofing_contractor" -> RoofingContractor
  "rose" -> Rose
  "rosemary" -> Rosemary
  "rot" -> Rot
  "rough" -> Rough
  "round" -> Round
  "rsvp_action" -> RsvpAction
  "rsvp_response" -> RsvpResponse
  "rsvp_response_maybe" -> RsvpResponseMaybe
  "rsvp_response_no" -> RsvpResponseNo
  "rsvp_response_type" -> RsvpResponseType
  "rsvp_response_yes" -> RsvpResponseYes
  "rubidium" -> Rubidium
  "ruin" -> Ruin
  "rule" -> Rule
  "runner_bean" -> RunnerBean
  "runtime" -> Runtime
  "runtime_platform" -> RuntimePlatform
  "rush" -> Rush
  "russell_cord" -> RussellCord
  "rutabaga" -> Rutabaga
  "ruthenium" -> Ruthenium
  "rutherfordium" -> Rutherfordium
  "saffron" -> Saffron
  "sage" -> Sage
  "salad_cream" -> SaladCream
  "salad_dressing" -> SaladDressing
  "salal_berry" -> SalalBerry
  "salary_currency" -> SalaryCurrency
  "salsa" -> Salsa
  "salsa_golf" -> SalsaGolf
  "salt" -> Salt
  "salt_and_pepper" -> SaltAndPepper
  "samarium" -> Samarium
  "sambal" -> Sambal
  "same_as" -> SameAs
  "samite" -> Samite
  "sample_type" -> SampleType
  "sarsaparilla" -> Sarsaparilla
  "sassafras" -> Sassafras
  "sateen" -> Sateen
  "satisfy" -> Satisfy
  "satsuma" -> Satsuma
  "saturated_fat_content" -> SaturatedFatContent
  "saturday" -> Saturday
  "sauerkraut" -> Sauerkraut
  "save" -> Save
  "savory" -> Savory
  "scallion" -> Scallion
  "scandium" -> Scandium
  "scarlet" -> Scarlet
  "scatter" -> Scatter
  "schedule_action" -> ScheduleAction
  "scheduled_payment_date" -> ScheduledPaymentDate
  "scheduled_time" -> ScheduledTime
  "schema_version" -> SchemaVersion
  "scholarly_article" -> ScholarlyArticle
  "scold" -> Scold
  "scorch" -> Scorch
  "scrape" -> Scrape
  "scratch" -> Scratch
  "screen_count" -> ScreenCount
  "screening_event" -> ScreeningEvent
  "screenshot" -> Screenshot
  "screw" -> Screw
  "scribble" -> Scribble
  "scrim" -> Scrim
  "scrub" -> Scrub
  "sculpture" -> Sculpture
  "sea_body_of_water" -> SeaBodyOfWater
  "sea_silk" -> SeaSilk
  "seaborgium" -> Seaborgium
  "search" -> Search
  "search_action" -> SearchAction
  "search_results_page" -> SearchResultsPage
  "season" -> Season
  "season_number" -> SeasonNumber
  "seasons" -> Seasons
  "seat_number" -> SeatNumber
  "seat_row" -> SeatRow
  "seat_section" -> SeatSection
  "seating_map" -> SeatingMap
  "seating_type" -> SeatingType
  "security_screening" -> SecurityScreening
  "seersucker" -> Seersucker
  "self_storage" -> SelfStorage
  "sell_action" -> SellAction
  "send_action" -> SendAction
  "serge" -> Serge
  "serial_number" -> SerialNumber
  "series" -> Series
  "serve" -> Serve
  "server_status" -> ServerStatus
  "serves_cuisine" -> ServesCuisine
  "service" -> Service
  "service_area" -> ServiceArea
  "service_audience" -> ServiceAudience
  "service_channel" -> ServiceChannel
  "service_location" -> ServiceLocation
  "service_operator" -> ServiceOperator
  "service_output" -> ServiceOutput
  "service_phone" -> ServicePhone
  "service_postal_address" -> ServicePostalAddress
  "service_sms_number" -> ServiceSmsNumber
  "service_type" -> ServiceType
  "service_url" -> ServiceUrl
  "serving_size" -> ServingSize
  "sesame" -> Sesame
  "sesame_oil" -> SesameOil
  "shade" -> Shade
  "share_action" -> ShareAction
  "shared_content" -> SharedContent
  "sharena_sol" -> SharenaSol
  "shave" -> Shave
  "shelter" -> Shelter
  "shiplap" -> Shiplap
  "shiso" -> Shiso
  "shiver" -> Shiver
  "shock" -> Shock
  "shoe_store" -> ShoeStore
  "shoegaze" -> Shoegaze
  "shop" -> Shop
  "shopping_center" -> ShoppingCenter
  "shot_silk" -> ShotSilk
  "shrug" -> Shrug
  "sibling" -> Sibling
  "siblings" -> Siblings
  "sichuan_pepper" -> SichuanPepper
  "signal" -> Signal
  "significant_link" -> SignificantLink
  "significant_links" -> SignificantLinks
  "silk" -> Silk
  "silky" -> Silky
  "silver" -> Silver
  "single_family_residence" -> SingleFamilyResidence
  "single_player" -> SinglePlayer
  "single_release" -> SingleRelease
  "sisal" -> Sisal
  "site_navigation_element" -> SiteNavigationElement
  "ska_jazz" -> SkaJazz
  "ska_punk" -> SkaPunk
  "skate_punk" -> SkatePunk
  "ski" -> Ski
  "ski_resort" -> SkiResort
  "skills" -> Skills
  "skip" -> Skip
  "skirret" -> Skirret
  "sku" -> Sku
  "slip" -> Slip
  "sludge_metal" -> SludgeMetal
  "smile" -> Smile
  "smokey" -> Smokey
  "smoking_allowed" -> SmokingAllowed
  "smooth" -> Smooth
  "smooth_jazz" -> SmoothJazz
  "snap_pea" -> SnapPea
  "snatch" -> Snatch
  "sneeze" -> Sneeze
  "sniff" -> Sniff
  "social_event" -> SocialEvent
  "social_media_posting" -> SocialMediaPosting
  "sodium" -> Sodium
  "sodium_content" -> SodiumContent
  "soft_rock" -> SoftRock
  "software_add_on" -> SoftwareAddOn
  "software_application" -> SoftwareApplication
  "software_help" -> SoftwareHelp
  "software_requirements" -> SoftwareRequirements
  "software_source_code" -> SoftwareSourceCode
  "software_version" -> SoftwareVersion
  "sold_out" -> SoldOut
  "some_products" -> SomeProducts
  "sorrel" -> Sorrel
  "soul_jazz" -> SoulJazz
  "sound" -> Sound
  "sound_art" -> SoundArt
  "soundtrack_album" -> SoundtrackAlbum
  "source_organization" -> SourceOrganization
  "southern_rock" -> SouthernRock
  "soy_bean" -> SoyBean
  "soy_sauce" -> SoySauce
  "space_disco" -> SpaceDisco
  "space_house" -> SpaceHouse
  "space_rock" -> SpaceRock
  "spaghetti_squash" -> SpaghettiSquash
  "spandex" -> Spandex
  "spare" -> Spare
  "spark" -> Spark
  "spatial" -> Spatial
  "spatial_coverage" -> SpatialCoverage
  "special_commitments" -> SpecialCommitments
  "special_opening_hours_specification" -> SpecialOpeningHoursSpecification
  "specialty" -> Specialty
  "speed_garage" -> SpeedGarage
  "speed_metal" -> SpeedMetal
  "spider_silk" -> SpiderSilk
  "spinach" -> Spinach
  "spoil" -> Spoil
  "spoken_word_album" -> SpokenWordAlbum
  "sponsor" -> Sponsor
  "sporting_goods_store" -> SportingGoodsStore
  "sports_activity_location" -> SportsActivityLocation
  "sports_club" -> SportsClub
  "sports_event" -> SportsEvent
  "sports_organization" -> SportsOrganization
  "sports_team" -> SportsTeam
  "spot" -> Spot
  "spouse" -> Spouse
  "spray" -> Spray
  "spreadsheet_digital_document" -> SpreadsheetDigitalDocument
  "sprout" -> Sprout
  "squeak" -> Squeak
  "squeal" -> Squeal
  "squeeze" -> Squeeze
  "sriracha" -> Sriracha
  "stack_exchange" -> StackExchange
  "stadium_or_arena" -> StadiumOrArena
  "stamp" -> Stamp
  "star_anise" -> StarAnise
  "star_fruit" -> StarFruit
  "star_rating" -> StarRating
  "start_date" -> StartDate
  "start_time" -> StartTime
  "state" -> State
  "steak_sauce" -> SteakSauce
  "steering_position" -> SteeringPosition
  "steering_position_value" -> SteeringPositionValue
  "step_value" -> StepValue
  "sti_accommodation_ontology" -> StiAccommodationOntology
  "stitch" -> Stitch
  "stone" -> Stone
  "stoner_rock" -> StonerRock
  "stop" -> Stop
  "storage_requirements" -> StorageRequirements
  "store" -> Store
  "straight_ahead_jazz" -> StraightAheadJazz
  "strawberry" -> Strawberry
  "street_address" -> StreetAddress
  "street_punk" -> StreetPunk
  "strengthen" -> Strengthen
  "stretch" -> Stretch
  "stride_jazz" -> StrideJazz
  "strip" -> Strip
  "strontium" -> Strontium
  "structured" -> Structured
  "structured_value" -> StructuredValue
  "stub_tex" -> StubTex
  "studio_album" -> StudioAlbum
  "stuff" -> Stuff
  "styrofoam" -> Styrofoam
  "sub_event" -> SubEvent
  "sub_events" -> SubEvents
  "sub_organization" -> SubOrganization
  "sub_reservation" -> SubReservation
  "subscribe_action" -> SubscribeAction
  "subtitle_language" -> SubtitleLanguage
  "subtract" -> Subtract
  "subway_station" -> SubwayStation
  "succeed" -> Succeed
  "successor_of" -> SuccessorOf
  "suck" -> Suck
  "suffer" -> Suffer
  "sugar_content" -> SugarContent
  "suggest" -> Suggest
  "suggested_answer" -> SuggestedAnswer
  "suggested_gender" -> SuggestedGender
  "suggested_max_age" -> SuggestedMaxAge
  "suggested_min_age" -> SuggestedMinAge
  "suit" -> Suit
  "suitable_for_diet" -> SuitableForDiet
  "sumac" -> Sumac
  "sunday" -> Sunday
  "sung_poetry" -> SungPoetry
  "super_event" -> SuperEvent
  "supply" -> Supply
  "support" -> Support
  "supporting_data" -> SupportingData
  "suppose" -> Suppose
  "surf_rock" -> SurfRock
  "surface" -> Surface
  "surprise" -> Surprise
  "surround" -> Surround
  "suspect" -> Suspect
  "suspend" -> Suspend
  "suspend_action" -> SuspendAction
  "sweet" -> Sweet
  "sweet_chilli_sauce" -> SweetChilliSauce
  "sweet_potato" -> SweetPotato
  "swing" -> Swing
  "swing_house" -> SwingHouse
  "switch" -> Switch
  "symphonic_metal" -> SymphonicMetal
  "synagogue" -> Synagogue
  "syrup" -> Syrup
  "tabasco_pepper" -> TabascoPepper
  "table" -> Table
  "taffeta" -> Taffeta
  "take_action" -> TakeAction
  "tamarillo" -> Tamarillo
  "tamarind" -> Tamarind
  "tandoori_masala" -> TandooriMasala
  "tangerine" -> Tangerine
  "tannic" -> Tannic
  "tantalum" -> Tantalum
  "target_collection" -> TargetCollection
  "target_description" -> TargetDescription
  "target_name" -> TargetName
  "target_platform" -> TargetPlatform
  "target_product" -> TargetProduct
  "target_url" -> TargetUrl
  "taro" -> Taro
  "tarragon" -> Tarragon
  "tart" -> Tart
  "tartan" -> Tartan
  "tartar_sauce" -> TartarSauce
  "tasmanian_pepper" -> TasmanianPepper
  "tattersall" -> Tattersall
  "tattoo_parlor" -> TattooParlor
  "tax_id" -> TaxId
  "taxi_reservation" -> TaxiReservation
  "taxi_service" -> TaxiService
  "taxi_stand" -> TaxiStand
  "tech_article" -> TechArticle
  "tech_house" -> TechHouse
  "tech_trance" -> TechTrance
  "technetium" -> Technetium
  "technical_death_metal" -> TechnicalDeathMetal
  "techno_dnb" -> TechnoDnb
  "techno_folk" -> TechnoFolk
  "telephone" -> Telephone
  "television_channel" -> TelevisionChannel
  "television_station" -> TelevisionStation
  "temporal" -> Temporal
  "temporal_coverage" -> TemporalCoverage
  "tempt" -> Tempt
  "tennis_complex" -> TennisComplex
  "teriyaki_sauce" -> TeriyakiSauce
  "terra_cotta" -> TerraCotta
  "terrazzo" -> Terrazzo
  "terrify" -> Terrify
  "tewkesbury_mustard" -> TewkesburyMustard
  "text" -> Text
  "text_digital_document" -> TextDigitalDocument
  "thai_basil" -> ThaiBasil
  "thallium" -> Thallium
  "thank" -> Thank
  "theater_event" -> TheaterEvent
  "theater_group" -> TheaterGroup
  "thing" -> Thing
  "third_stream" -> ThirdStream
  "thorium" -> Thorium
  "thrash_metal" -> ThrashMetal
  "thulium" -> Thulium
  "thumbnail" -> Thumbnail
  "thumbnail_url" -> ThumbnailUrl
  "thursday" -> Thursday
  "thyme" -> Thyme
  "tick" -> Tick
  "ticker_symbol" -> TickerSymbol
  "ticket" -> Ticket
  "ticket_number" -> TicketNumber
  "ticket_token" -> TicketToken
  "ticketed_seat" -> TicketedSeat
  "tickle" -> Tickle
  "tie_action" -> TieAction
  "tight" -> Tight
  "timber" -> Timber
  "time" -> Time
  "time_required" -> TimeRequired
  "tin" -> Tin
  "tip" -> Tip
  "tip_action" -> TipAction
  "tire_shop" -> TireShop
  "titanium" -> Titanium
  "title" -> Title
  "to_location" -> ToLocation
  "toasty" -> Toasty
  "toll_free" -> TollFree
  "tomato" -> Tomato
  "tonka_bean" -> TonkaBean
  "total_payment_due" -> TotalPaymentDue
  "total_price" -> TotalPrice
  "total_time" -> TotalTime
  "touch" -> Touch
  "tourist_attraction" -> TouristAttraction
  "tourist_information_center" -> TouristInformationCenter
  "toy_store" -> ToyStore
  "toytown_techno" -> ToytownTechno
  "trace" -> Trace
  "track_action" -> TrackAction
  "tracking_number" -> TrackingNumber
  "tracking_url" -> TrackingUrl
  "tracks" -> Tracks
  "trad_jazz" -> TradJazz
  "trade" -> Trade
  "trade_action" -> TradeAction
  "traditional_doom" -> TraditionalDoom
  "trailer" -> Trailer
  "train" -> Train
  "train_name" -> TrainName
  "train_number" -> TrainNumber
  "train_reservation" -> TrainReservation
  "train_station" -> TrainStation
  "train_trip" -> TrainTrip
  "trance" -> Trance
  "trans_fat_content" -> TransFatContent
  "transcript" -> Transcript
  "transfer_action" -> TransferAction
  "transit_map" -> TransitMap
  "translator" -> Translator
  "transparent" -> Transparent
  "transport" -> Transport
  "travel" -> Travel
  "travel_action" -> TravelAction
  "travel_agency" -> TravelAgency
  "treat" -> Treat
  "tremble" -> Tremble
  "tribal_house" -> TribalHouse
  "trick" -> Trick
  "trip" -> Trip
  "trip_hop" -> TripHop
  "trot" -> Trot
  "trouble" -> Trouble
  "trust" -> Trust
  "try" -> Try
  "tubers" -> Tubers
  "tuesday" -> Tuesday
  "tulle" -> Tulle
  "tumble" -> Tumble
  "tungsten" -> Tungsten
  "turmeric" -> Turmeric
  "turn" -> Turn
  "turnip" -> Turnip
  "twee_pop" -> TweePop
  "tweed" -> Tweed
  "twill" -> Twill
  "twist" -> Twist
  "type" -> Type
  "type_and_quantity_node" -> TypeAndQuantityNode
  "type_of_bed" -> TypeOfBed
  "type_of_good" -> TypeOfGood
  "typical_age_range" -> TypicalAgeRange
  "ugli_fruit" -> UgliFruit
  "un_register_action" -> UnRegisterAction
  "unctuous" -> Unctuous
  "under_name" -> UnderName
  "undress" -> Undress
  "unfasten" -> Unfasten
  "unit_code" -> UnitCode
  "unit_price_specification" -> UnitPriceSpecification
  "unit_text" -> UnitText
  "unite" -> Unite
  "unlock" -> Unlock
  "unpack" -> Unpack
  "unsaturated_fat_content" -> UnsaturatedFatContent
  "untidy" -> Untidy
  "update_action" -> UpdateAction
  "uplifting_trance" -> UpliftingTrance
  "upload_date" -> UploadDate
  "upvote_count" -> UpvoteCount
  "uranium" -> Uranium
  "urbanite" -> Urbanite
  "url" -> Url
  "url_template" -> UrlTemplate
  "use_action" -> UseAction
  "used_condition" -> UsedCondition
  "user_blocks" -> UserBlocks
  "user_checkins" -> UserCheckins
  "user_comments" -> UserComments
  "user_downloads" -> UserDownloads
  "user_interaction" -> UserInteraction
  "user_interaction_count" -> UserInteractionCount
  "user_likes" -> UserLikes
  "user_page_visits" -> UserPageVisits
  "user_plays" -> UserPlays
  "user_plus_ones" -> UserPlusOnes
  "user_tweets" -> UserTweets
  "valid_for" -> ValidFor
  "valid_from" -> ValidFrom
  "valid_in" -> ValidIn
  "valid_through" -> ValidThrough
  "valid_until" -> ValidUntil
  "value" -> Value
  "value_added_tax_included" -> ValueAddedTaxIncluded
  "value_max_length" -> ValueMaxLength
  "value_min_length" -> ValueMinLength
  "value_name" -> ValueName
  "value_pattern" -> ValuePattern
  "value_reference" -> ValueReference
  "value_required" -> ValueRequired
  "vanadium" -> Vanadium
  "vanilla" -> Vanilla
  "vanillin" -> Vanillin
  "vat_id" -> VatId
  "vegan_diet" -> VeganDiet
  "vegetable_flannel" -> VegetableFlannel
  "vegetal" -> Vegetal
  "vegetarian_diet" -> VegetarianDiet
  "vehicle" -> Vehicle
  "vehicle_configuration" -> VehicleConfiguration
  "vehicle_engine" -> VehicleEngine
  "vehicle_identification_number" -> VehicleIdentificationNumber
  "vehicle_interior_color" -> VehicleInteriorColor
  "vehicle_interior_type" -> VehicleInteriorType
  "vehicle_model_date" -> VehicleModelDate
  "vehicle_seating_capacity" -> VehicleSeatingCapacity
  "vehicle_special_usage" -> VehicleSpecialUsage
  "vehicle_transmission" -> VehicleTransmission
  "velvet" -> Velvet
  "velveteen" -> Velveteen
  "velvety" -> Velvety
  "venue_map" -> VenueMap
  "version" -> Version
  "video" -> Video
  "video_format" -> VideoFormat
  "video_frame_size" -> VideoFrameSize
  "video_gallery" -> VideoGallery
  "video_game" -> VideoGame
  "video_game_clip" -> VideoGameClip
  "video_game_series" -> VideoGameSeries
  "video_object" -> VideoObject
  "video_quality" -> VideoQuality
  "vietnamese_coriander" -> VietnameseCoriander
  "view_action" -> ViewAction
  "viking_metal" -> VikingMetal
  "vino_cotto" -> VinoCotto
  "vinyl_coated_polyester" -> VinylCoatedPolyester
  "vinyl_format" -> VinylFormat
  "visit" -> Visit
  "visual_arts_event" -> VisualArtsEvent
  "visual_artwork" -> VisualArtwork
  "vocal_house" -> VocalHouse
  "vocal_jazz" -> VocalJazz
  "vocal_trance" -> VocalTrance
  "volcano" -> Volcano
  "volume_number" -> VolumeNumber
  "vote_action" -> VoteAction
  "wallpaper" -> Wallpaper
  "want" -> Want
  "want_action" -> WantAction
  "warm" -> Warm
  "warranty" -> Warranty
  "warranty_promise" -> WarrantyPromise
  "warranty_scope" -> WarrantyScope
  "wasabi" -> Wasabi
  "waste" -> Waste
  "watch" -> Watch
  "watch_action" -> WatchAction
  "water" -> Water
  "water_chestnut" -> WaterChestnut
  "watercress" -> Watercress
  "waterfall" -> Waterfall
  "watermelon" -> Watermelon
  "watermelon_rind_preserves" -> WatermelonRindPreserves
  "wave" -> Wave
  "wear_action" -> WearAction
  "web_application" -> WebApplication
  "web_checkin_time" -> WebCheckinTime
  "web_page" -> WebPage
  "web_page_element" -> WebPageElement
  "web_site" -> WebSite
  "wednesday" -> Wednesday
  "weight" -> Weight
  "welcome" -> Welcome
  "west_coast_jazz" -> WestCoastJazz
  "western" -> Western
  "whipcord" -> Whipcord
  "whirl" -> Whirl
  "whisper" -> Whisper
  "whistle" -> Whistle
  "white_mustard" -> WhiteMustard
  "white_peppercorn" -> WhitePeppercorn
  "white_radish" -> WhiteRadish
  "wholesale_store" -> WholesaleStore
  "width" -> Width
  "wigan" -> Wigan
  "wiki_doc" -> WikiDoc
  "win_action" -> WinAction
  "winery" -> Winery
  "wink" -> Wink
  "winner" -> Winner
  "wipe" -> Wipe
  "wire_rope" -> WireRope
  "witch_house" -> WitchHouse
  "wobble" -> Wobble
  "wonder" -> Wonder
  "wood" -> Wood
  "woodruff" -> Woodruff
  "wool" -> Wool
  "word_count" -> WordCount
  "work_example" -> WorkExample
  "work_featured" -> WorkFeatured
  "work_hours" -> WorkHours
  "work_location" -> WorkLocation
  "work_performed" -> WorkPerformed
  "work_presented" -> WorkPresented
  "works_for" -> WorksFor
  "world_fusion" -> WorldFusion
  "worry" -> Worry
  "worst_rating" -> WorstRating
  "wpad_block" -> WpadBlock
  "wrap" -> Wrap
  "wreck" -> Wreck
  "wrestle" -> Wrestle
  "wriggle" -> Wriggle
  "write_action" -> WriteAction
  "write_permission" -> WritePermission
  "x_ray" -> XRay
  "xo_sauce" -> XoSauce
  "yacht_rock" -> YachtRock
  "yam" -> Yam
  "yawn" -> Yawn
  "yearly_revenue" -> YearlyRevenue
  "years_in_operation" -> YearsInOperation
  "yell" -> Yell
  "yorkshire_bleeps_and_bass" -> YorkshireBleepsAndBass
  "ytterbium" -> Ytterbium
  "yttrium" -> Yttrium
  "yuzu" -> Yuzu
  "zedoary" -> Zedoary
  "zephyr" -> Zephyr
  "zest" -> Zest
  "zibeline" -> Zibeline
  "zinc" -> Zinc
  "zip" -> Zip
  "zirconium" -> Zirconium
  "zone_boarding_policy" -> ZoneBoardingPolicy
  "zoom" -> Zoom
  "zucchini" -> Zucchini
  _ -> digitOrComposed(s)


-- https://www.w3schools.com/charsets/ref_utf_box.asp
hexaToVisual: String -> String
hexaToVisual s =
 split "0" s |> join "┼"
 |> split "1" |> join "╀" -- 0001
 |> split "2" |> join "┾" -- 0010
 |> split "3" |> join "╄" -- 0011
 |> split "4" |> join "╁" -- 0100
 |> split "5" |> join "╂" -- 0101
 |> split "6" |> join "╆" -- 0110
 |> split "7" |> join "╊" -- 0111
 |> split "8" |> join "┽" -- 1000
 |> split "9" |> join "┹" -- 1001
 |> split "A" |> join "┿" -- 1010
 |> split "B" |> join "╇" -- 1011
 |> split "C" |> join "╅" -- 1100
 |> split "D" |> join "╉" -- 1101
 |> split "E" |> join "╈" -- 1110
 |> split "F" |> join "◌" -- 1111
 |> split " " |> join "◌" -- 1111

hexaToCons: String -> String
hexaToCons s =
  case s of
  "0" -> "p"
  "1" -> "t"
  "2" -> "k"
  "3" -> "m"
  "4" -> "n"
  "5" -> "d"
  "6" -> "b"
  "7" -> "g"
  "8" -> "w"
  "9" -> "j"
  "A" -> "sɑː"
  "B" -> "goʊ"
  "C" -> "fʊ"
  "D" -> "zaɪ"
  "E" -> "yɛ"
  "F" -> " "
  " " -> " "
  "G" -> "!"
  _ -> "?"

hexaToVowels: String -> String
hexaToVowels s =
  case s of
  "0" -> "ɑː"
  "1" -> "ɛ"
  "2" -> "iː"
  "3" -> "oʊ"
  "4" -> "ʊ"
  "5" -> "aɪ"
  "6" -> "eɪ"
  "7" -> "ɪʃ"
  "8" -> "ɔɪ"
  "9" -> "juː"
  "A" -> "sɑː"
  "B" -> "goʊ"
  "C" -> "fʊ"
  "D" -> "zaɪ"
  "E" -> "yɛ"
  "F" -> " "
  " " -> " "
  "G" -> "ʌ"
  _ -> "?"


type Word
 = Unknown
  | N String
  | X (List Word)
  | C (List Word)
  | Yes
  | No
  | FictLang
  | AboutPage
  | Accept
  | AcceptAction
  | AcceptedAnswer
  | AcceptedOffer
  | AcceptedPaymentMethod
  | AcceptsReservations
  | AccessCode
  | AccessMode
  | AccessModeSufficient
  | AccessibilityApi
  | AccessibilityControl
  | AccessibilityFeature
  | AccessibilityHazard
  | AccessibilitySummary
  | Accommodation
  | AccountId
  | AccountablePerson
  | AccountingService
  | AchieveAction
  | AcidBreaks
  | AcidHouse
  | AcidJazz
  | AcidRock
  | AcidTechno
  | AcidTrance
  | Acidic
  | AcornSquash
  | AcquiredFrom
  | Acrylic
  | Actinium
  | Action
  | ActionApplication
  | ActionCollabClass
  | ActionOption
  | ActionPlatform
  | ActionStatus
  | ActionStatusType
  | ActivateAction
  | ActiveActionStatus
  | Actors
  | AdditionalName
  | AdditionalNumberOfGuests
  | AdditionalProperty
  | AdditionalType
  | AddressCountry
  | AddressLocality
  | AddressRegion
  | AdministrativeArea
  | Admire
  | Admit
  | AdultEntertainment
  | AdvanceBookingRequirement
  | Advise
  | Affiliation
  | AggregateOffer
  | AggregateRating
  | AgreeAction
  | Aircraft
  | AlbumProductionType
  | AlbumRelease
  | AlbumReleaseType
  | Albums
  | Alcoholic
  | AlfalfaSprout
  | AlignmentObject
  | AlignmentType
  | AllWheelDriveConfiguration
  | AlligatorPepper
  | AllocateAction
  | Allspice
  | Alpaca
  | AlternateName
  | AlternativeDance
  | AlternativeHeadline
  | AlternativeMetal
  | AlternativeRock
  | Aluminium
  | Aluminum
  | Alumni
  | AlumniOf
  | Amaranth
  | Ambient
  | AmbientDub
  | AmbientHouse
  | AmbientTechno
  | AmenityFeature
  | Americium
  | AmountOfThisGood
  | Amuse
  | AmusementPark
  | Angelica
  | Angular
  | AnimalShelter
  | Anise
  | Announce
  | AnnualPercentageRate
  | Answer
  | AnswerCount
  | AntiFolk
  | Apartment
  | ApartmentComplex
  | Apologise
  | ApplicationCategory
  | ApplicationSubCategory
  | ApplicationSuite
  | AppliesToDeliveryMethod
  | AppliesToPaymentMethod
  | ApplyAction
  | Appreciate
  | Approve
  | Apricot
  | Aquarium
  | AromaticGinger
  | Arrange
  | Arrest
  | ArrivalAirport
  | ArrivalBusStop
  | ArrivalGate
  | ArrivalPlatform
  | ArrivalStation
  | ArrivalTerminal
  | ArrivalTime
  | Arrive
  | ArriveAction
  | ArtEdition
  | ArtGallery
  | ArtMedium
  | ArtPunk
  | Artichoke
  | Article
  | ArticleBody
  | ArticleSection
  | ArtworkSurface
  | Asafoetida
  | Asbestos
  | AsianUnderground
  | AskAction
  | Asparagus
  | Asphalt
  | AssemblyVersion
  | AssessAction
  | AssignAction
  | AssociatedArticle
  | AssociatedMedia
  | Astringent
  | Attach
  | Attendee
  | Attendees
  | Audience
  | AudienceType
  | AudioObject
  | AudiobookFormat
  | AuthorizeAction
  | AutoBodyShop
  | AutoDealer
  | AutoPartsStore
  | AutoRental
  | AutoWash
  | Autolytic
  | AutomatedTeller
  | AutomotiveBusiness
  | AutomotiveOntologyWgclass
  | Availability
  | AvailabilityEnds
  | AvailabilityStarts
  | AvailableAtOrFrom
  | AvailableChannel
  | AvailableDeliveryMethod
  | AvailableFrom
  | AvailableLanguage
  | AvailableOnDevice
  | AvailableThrough
  | AvantGardeJazz
  | Avocado
  | AwayTeam
  | Baked
  | Bakery
  | Balance
  | Balanced
  | BalearicBeat
  | BallisticNylon
  | BaltimoreClub
  | Banana
  | BananaKetchup
  | BananaSquash
  | BankAccount
  | BankOrCreditUnion
  | BarOrPub
  | Barathea
  | BarbecueSauce
  | Barcode
  | Barnyard
  | BaseSalary
  | Basil
  | Bassline
  | Bat
  | Battle
  | Beach
  | BeanSprout
  | BeatMusic
  | BeauMondeSeasoning
  | BeautySalon
  | Bebop
  | Bed
  | BedAndBreakfast
  | BedDetails
  | BedfordCord
  | BefriendAction
  | BellPepper
  | Belong
  | Benefits
  | BengalineSilk
  | Berkelium
  | Beryllium
  | BestRating
  | BetaCloth
  | BibExTerm
  | Bilberry
  | BillingAddress
  | BillingIncrement
  | BillingPeriod
  | BirthDate
  | BirthPlace
  | Bismuth
  | Bitter
  | BizarreSilk
  | BlackBean
  | BlackCardamom
  | BlackEyedPea
  | BlackMetal
  | BlackMustard
  | BlackPeppercorn
  | BlackVinegar
  | Blackberry
  | Blackcurrant
  | Bleach
  | Bless
  | Blind
  | Blink
  | BlogPost
  | BlogPosting
  | BlogPosts
  | BloodOrange
  | Blueberry
  | Blush
  | BoardingGroup
  | BoardingPolicy
  | BoardingPolicyType
  | Boast
  | Bobbinet
  | BodyOfWater
  | Bohrium
  | BoiledWool
  | Boldo
  | BolivianCoriander
  | Bolt
  | Bombazine
  | BookEdition
  | BookFormat
  | BookFormatType
  | BookSeries
  | BookingAgent
  | BookingTime
  | BookmarkAction
  | Boolean
  | BorrowAction
  | BossaNova
  | Bounce
  | BouncyHouse
  | BouncyTechno
  | BowlingAlley
  | Box
  | Boysenberry
  | Branch
  | BranchCode
  | BranchOf
  | Brand
  | BrazilianPepper
  | Breadcrumb
  | BreadcrumbList
  | Breadfruit
  | Breakbeat
  | BreakbeatHardcore
  | Breathe
  | Brewery
  | Bridge
  | Bright
  | Brilliance
  | Brilliantine
  | BritishDance
  | Britpop
  | BroadBeans
  | BroadcastAffiliateOf
  | BroadcastChannel
  | BroadcastChannelId
  | BroadcastDisplayName
  | BroadcastEvent
  | BroadcastOfEvent
  | BroadcastRelease
  | BroadcastService
  | BroadcastServiceTier
  | BroadcastTimezone
  | Broadcaster
  | Broadcloth
  | Brocade
  | Broccoflower
  | Broccoli
  | BrokenBeat
  | BrownMustard
  | BrowserRequirements
  | Bruise
  | Brush
  | BrusselsSprout
  | Bubble
  | BubblegumDance
  | Buckram
  | BuddhistTemple
  | Bump
  | Bunting
  | Burlap
  | BusName
  | BusNumber
  | BusReservation
  | BusStation
  | BusStop
  | BusTrip
  | BusinessAudience
  | BusinessEntityType
  | BusinessEvent
  | BusinessFunction
  | ButternutSquash
  | Buttery
  | ByArtist
  | Cabbage
  | CableOrSatelliteService
  | Cadmium
  | CafeOrCoffeeShop
  | Calabrese
  | Calcium
  | Calculate
  | Calico
  | Californium
  | Calories
  | Cambric
  | Camp
  | Campground
  | CampingPitch
  | Canal
  | CanaryMelon
  | CancelAction
  | Candidate
  | Cantaloupe
  | CanterburyScene
  | Canvas
  | CapeJazz
  | Caption
  | Caraway
  | CarbohydrateContent
  | CarbonFiber
  | Cardamom
  | CargoVolume
  | Carpet
  | CarrierRequirements
  | Carrot
  | Cashmere
  | Casino
  | CassetteFormat
  | Cassis
  | CatPee
  | Catalog
  | CatalogNumber
  | Category
  | CatholicChurch
  | Cauliflower
  | Cause
  | CayennePepper
  | CedarBark
  | Celeriac
  | Celery
  | CeleryPowder
  | CelerySeed
  | Celtic
  | CelticMetal
  | CelticPunk
  | Cement
  | Cemetery
  | CeramicTile
  | Cesium
  | ChaatMasala
  | Challenge
  | ChamberJazz
  | Chambray
  | Chamomile
  | Change
  | CharCloth
  | CharacterAttribute
  | CharacterName
  | Charcoal
  | Charmeuse
  | Chase
  | Cheat
  | CheatCode
  | CheckAction
  | CheckInAction
  | CheckOutAction
  | CheckinTime
  | CheckoutPage
  | CheckoutTime
  | Cheesecloth
  | Chenille
  | Cherimoya
  | Cherry
  | Chervil
  | Chewy
  | ChicagoHouse
  | Chickpea
  | Chiffon
  | ChildCare
  | ChildMaxAge
  | ChildMinAge
  | ChiliOil
  | ChiliPepper
  | ChiliPeppers
  | ChiliPowder
  | ChiliSauce
  | ChillOut
  | Chimichurri
  | ChineseRock
  | Chino
  | Chintz
  | Chives
  | Chocolaty
  | Choke
  | CholesterolContent
  | ChooseAction
  | Chop
  | ChristianMetal
  | ChristianPunk
  | ChristianRock
  | Chromium
  | Church
  | Chutney
  | Cicely
  | CigarBox
  | Cilantro
  | CinderBlock
  | Cinnamon
  | Citation
  | CityHall
  | CivicStructure
  | Claim
  | ClaimReviewed
  | ClassicTrance
  | Clean
  | Clementine
  | Clip
  | ClipNumber
  | Closed
  | Closes
  | ClothOfGold
  | ClothingStore
  | Cloudberry
  | Clove
  | Coach
  | Cobalt
  | CocktailSauce
  | Coconut
  | Code
  | CodeRepository
  | CodeSampleType
  | CollardGreen
  | Collect
  | Collection
  | CollectionPage
  | CollegeOrUniversity
  | ComedyClub
  | ComedyEvent
  | Command
  | Comment
  | CommentAction
  | CommentCount
  | CommentPermission
  | CommentText
  | CommentTime
  | Communicate
  | CommunicateAction
  | Compare
  | Compete
  | Competitor
  | CompilationAlbum
  | Complain
  | Complete
  | CompletedActionStatus
  | Complex
  | Composer
  | CompoundPriceSpecification
  | ComputerLanguage
  | ComputerStore
  | Concentrate
  | Concentrated
  | Concern
  | Concrete
  | Conductive
  | Confess
  | ConfirmAction
  | ConfirmationNumber
  | Confuse
  | Connected
  | Consider
  | Consist
  | ConsumeAction
  | ContactOption
  | ContactPage
  | ContactPoint
  | ContactPointOption
  | ContactPoints
  | ContactType
  | Contain
  | ContainedIn
  | ContainedInPlace
  | ContainsPlace
  | ContainsSeason
  | ContemporaryFolk
  | ContentLocation
  | ContentRating
  | ContentSize
  | ContentType
  | ContentUrl
  | Continent
  | ContinentalJazz
  | Continue
  | Contributor
  | ControlAction
  | ConvenienceStore
  | Conversation
  | CookAction
  | CookTime
  | CookingMethod
  | CoolJazz
  | Coolmax
  | CopyrightHolder
  | CopyrightYear
  | Cordura
  | Corduroy
  | CorianderLeaf
  | CorianderSeed
  | Corked
  | Corn
  | CornSalad
  | Corporation
  | Correct
  | CosmicDisco
  | Cotton
  | Cough
  | CountriesNotSupported
  | CountriesSupported
  | Country
  | CountryOfOrigin
  | Courgette
  | CourseCode
  | CourseInstance
  | CourseMode
  | CoursePrerequisites
  | Courthouse
  | CoverageEndTime
  | CoverageStartTime
  | Cowpunk
  | CrabBoil
  | Cranberry
  | Crape
  | Crawl
  | Creamy
  | CreateAction
  | CreativeWork
  | CreativeWorkSeason
  | CreativeWorkSeries
  | Creator
  | CreditCard
  | CreditedTo
  | Crematorium
  | Cretonne
  | Crimplene
  | Crisp
  | Cross
  | CrossoverJazz
  | CrossoverThrash
  | Crunk
  | Crush
  | CrushedRedPepper
  | CrustPunk
  | Cubeb
  | Cucumber
  | Cumin
  | Curium
  | Currant
  | CurrenciesAccepted
  | Currency
  | CurrencyConversionService
  | CurryKetchup
  | CurryLeaf
  | CurryPowder
  | Customer
  | Daikon
  | Dam
  | Damage
  | DamagedCondition
  | Damask
  | Damson
  | DanceEvent
  | DanceGroup
  | DancePop
  | DancePunk
  | DanceRock
  | DarkAmbient
  | DarkCabaret
  | DarkElectro
  | DarkWave
  | DarksideJungle
  | Darmstadtium
  | DataCatalog
  | DataDownload
  | DataFeed
  | DataFeedElement
  | DataFeedItem
  | DataType
  | DatasetClass
  | DatasetTimeInterval
  | DateCreated
  | DateDeleted
  | DateIssued
  | DateModified
  | DatePosted
  | DatePublished
  | DateRead
  | DateReceived
  | DateSent
  | DateTime
  | DateVehicleFirstRegistered
  | DatedMoneySpecification
  | Dateline
  | DayOfWeek
  | Dazzle
  | DeactivateAction
  | DeathDate
  | DeathIndustrial
  | DeathMetal
  | DeathPlace
  | Decay
  | Deceive
  | Decide
  | Decorate
  | DeepHouse
  | DefaultValue
  | DefenceEstablishment
  | DeleteAction
  | Delight
  | Deliver
  | DeliveryAddress
  | DeliveryChargeSpecification
  | DeliveryEvent
  | DeliveryLeadTime
  | DeliveryMethod
  | DeliveryStatus
  | Demand
  | DemoAlbum
  | Denim
  | Dense
  | Dentist
  | DepartAction
  | Department
  | DepartmentStore
  | DepartureAirport
  | DepartureBusStop
  | DepartureGate
  | DeparturePlatform
  | DepartureStation
  | DepartureTerminal
  | DepartureTime
  | Depend
  | Dependencies
  | DepositAccount
  | Depth
  | Describe
  | Description
  | DesertRock
  | Deserve
  | Destroy
  | Detect
  | DetroitTechno
  | Develop
  | DiabeticDiet
  | DigitalAudioTapeFormat
  | DigitalDocument
  | DigitalDocumentPermission
  | DigitalDocumentPermissionType
  | DigitalFormat
  | DigitalHardcore
  | DijonKetchup
  | DijonMustard
  | Dill
  | DillSeed
  | DimensionalLumber
  | Dimity
  | Dip
  | Director
  | Directors
  | Disagree
  | DisagreeAction
  | DisambiguatingDescription
  | Disappear
  | Disapprove
  | Disarm
  | Disco
  | DiscoPolo
  | Discontinued
  | Discount
  | DiscountCode
  | DiscountCurrency
  | Discover
  | DiscoverAction
  | Discusses
  | DiscussionForumPosting
  | DiscussionUrl
  | Dislike
  | DislikeAction
  | DissolutionDate
  | Distance
  | Distribution
  | DivaHouse
  | Divide
  | Dixieland
  | DjmixAlbum
  | DonateAction
  | DonegalTweed
  | DoomMetal
  | DoorTime
  | Double
  | DownloadAction
  | DownloadUrl
  | DownvoteCount
  | Drag
  | DrawAction
  | Dream
  | DreamHouse
  | DreamPop
  | DreamTrance
  | Dress
  | DriedLime
  | Drill
  | DrinkAction
  | DriveWheelConfiguration
  | DriveWheelConfigurationValue
  | DroneMetal
  | Drop
  | DropoffLocation
  | DropoffTime
  | Drown
  | Drugget
  | Drum
  | DrumAndBass
  | Dry
  | DryCleaningOrLaundry
  | Dubnium
  | Dubstep
  | Duck
  | DunedinSound
  | Duration
  | DurationOfWarranty
  | Durian
  | Dust
  | DutchHouse
  | Dysprosium
  | ETextiles
  | EastAsianPepper
  | Ebook
  | Editor
  | Educate
  | EducationEvent
  | EducationRequirements
  | EducationalAlignment
  | EducationalAudience
  | EducationalFramework
  | EducationalOrganization
  | EducationalRole
  | EducationalUse
  | Eggplant
  | Einsteinium
  | Elderberry
  | Electrician
  | Electro
  | ElectroBackbeat
  | ElectroGrime
  | ElectroHouse
  | ElectroIndustrial
  | Electroacoustic
  | ElectronicArtMusic
  | ElectronicRock
  | Electronica
  | ElectronicsStore
  | Electropop
  | Elegant
  | ElementarySchool
  | Elevation
  | EligibleCustomerType
  | EligibleDuration
  | EligibleQuantity
  | EligibleRegion
  | EligibleTransactionVolume
  | Email
  | EmailMessage
  | Embarrass
  | Embassy
  | EmbedUrl
  | EmergencyService
  | Employee
  | EmployeeRole
  | Employees
  | EmploymentAgency
  | EmploymentType
  | Empty
  | EncodesCreativeWork
  | Encoding
  | EncodingFormat
  | EncodingType
  | Encodings
  | Encourage
  | EndTime
  | Endive
  | EndorseAction
  | EngineSpecification
  | Entertain
  | EntertainmentBusiness
  | EntryPoint
  | Enumeration
  | Epazote
  | EpicDoom
  | Episode
  | EpisodeNumber
  | Episodes
  | Equal
  | EstimatedFlightDuration
  | EtherealWave
  | EthnicElectronica
  | EuroDisco
  | EuropeanFreeJazz
  | Europium
  | Event
  | EventCancelled
  | EventPostponed
  | EventRescheduled
  | EventReservation
  | EventScheduled
  | EventStatus
  | EventStatusType
  | EventVenue
  | Examine
  | ExampleOfWork
  | Excuse
  | ExecutableLibraryName
  | Exercise
  | ExerciseAction
  | ExerciseCourse
  | ExerciseGym
  | ExhibitionEvent
  | ExifData
  | Expand
  | Expect
  | ExpectedArrivalFrom
  | ExpectedArrivalUntil
  | ExpectsAcceptanceOf
  | ExperienceRequirements
  | ExperimentalRock
  | Expires
  | Explain
  | Explode
  | Expressive
  | Extend
  | Extracted
  | Fade
  | FailedActionStatus
  | FallenOver
  | FamilyName
  | FastFoodRestaurant
  | FatContent
  | FaxNumber
  | FeatureList
  | FeesAndCommissionsSpecification
  | Fence
  | Fennel
  | Fenugreek
  | Fermium
  | Festival
  | FiberContent
  | FileFormat
  | FileSize
  | FilmAction
  | FinancialProduct
  | FinancialService
  | FindAction
  | FireStation
  | FirstPerformance
  | FishPaste
  | FishSauce
  | FiveSpicePowder
  | Fix
  | Flabby
  | Flamboyant
  | Flannel
  | Flap
  | Flight
  | FlightDistance
  | FlightNumber
  | FlightReservation
  | Float
  | Flood
  | FloorSize
  | FloridaBreaks
  | Florist
  | Fold
  | FolkPunk
  | Folktronica
  | FoodEstablishment
  | FoodEstablishmentReservation
  | FoodEvent
  | FoodFriendly
  | FoodService
  | Form
  | Foulard
  | Founder
  | FoundingDate
  | FoundingLocation
  | FourWheelDriveConfiguration
  | Foxy
  | Francium
  | FreakFolk
  | Freestyle
  | FreestyleHouse
  | FrenchHouse
  | Friday
  | Frighten
  | Frisee
  | FromLocation
  | FrontWheelDriveConfiguration
  | FruitKetchup
  | FruitPreserves
  | Fry
  | FrySauce
  | FuelConsumption
  | FuelEfficiency
  | FuelType
  | FuneralDoom
  | FunkMetal
  | FunkyHouse
  | FurnitureStore
  | Fustian
  | Gadolinium
  | GamePlatform
  | GamePlayMode
  | GameServer
  | GameServerStatus
  | GameTip
  | GaragePunk
  | GarageRock
  | GaramMasala
  | GardenStore
  | GarlicChives
  | GarlicPowder
  | GarlicSalt
  | GasStation
  | GatedResidenceCommunity
  | GemSquash
  | Gender
  | GenderType
  | GeneralContractor
  | GeoCircle
  | GeoCoordinates
  | GeoMidpoint
  | GeoRadius
  | GeoShape
  | GeographicArea
  | Georgette
  | GhettoHouse
  | Ginger
  | GivenName
  | GlamMetal
  | GlamRock
  | Glass
  | GlassBrick
  | GlassFiber
  | GlassWool
  | GlobalLocationNumber
  | GlueLaminate
  | GlutenFreeDiet
  | GojiBerry
  | GolfCourse
  | GoodRelationsClass
  | GoodRelationsTerms
  | Gooseberry
  | GothicMetal
  | GothicRock
  | GovernmentBuilding
  | GovernmentOffice
  | GovernmentOrganization
  | GovernmentPermit
  | GovernmentService
  | GrainsOfParadise
  | GrainsOfSelim
  | Grapefruit
  | Gravel
  | GreaterGalangal
  | GreaterOrEqual
  | GreenBean
  | GreenPepper
  | GreenPeppercorn
  | Grenadine
  | GrenfellCloth
  | GroceryStore
  | GrooveMetal
  | Grosgrain
  | GroupBoardingPolicy
  | Guacamole
  | Guarantee
  | Guava
  | GypsumBoard
  | Habanero
  | Haircloth
  | HalalDiet
  | HardBop
  | HardDance
  | HardRock
  | HardTrance
  | Hardcover
  | HardwareStore
  | HarrisTweed
  | HasCourseInstance
  | HasDeliveryMethod
  | HasDigitalDocumentPermission
  | HasMap
  | HasMenu
  | HasMenuItem
  | HasMenuSection
  | HasOfferCatalog
  | HasPart
  | Headline
  | HealthAndBeautyBusiness
  | HealthClub
  | HearingImpairedSupported
  | HeavyMetal
  | Help
  | Herbaceous
  | Herbal
  | HerbesDeProvence
  | HerbsAndSpice
  | HighPrice
  | HighSchool
  | HinduDiet
  | HinduTemple
  | HipHouse
  | HiringOrganization
  | HobbyShop
  | Hodden
  | HojaSanta
  | Holmium
  | HolyBasil
  | HomeAndConstructionBusiness
  | HomeGoodsStore
  | HomeLocation
  | HomeTeam
  | HoneyDill
  | Honeydew
  | HonorificPrefix
  | HonorificSuffix
  | HorrorPunk
  | Horseradish
  | Hospital
  | HostingOrganization
  | HotMustard
  | HotSauce
  | HotelRoom
  | Houndstooth
  | HoursAvailable
  | HousePainter
  | HttpMethod
  | Huckleberry
  | IataCode
  | IceCreamShop
  | Identify
  | IdliPodi
  | IgnoreAction
  | Illustrator
  | ImageGallery
  | ImageObject
  | Imagine
  | Impress
  | Improve
  | InBroadcastLineup
  | InLanguage
  | InPlaylist
  | InStock
  | InStoreOnly
  | IncentiveCompensation
  | Incentives
  | Include
  | IncludedComposition
  | IncludedDataCatalog
  | IncludedInDataCatalog
  | IncludesObject
  | Increase
  | IndianBayLeaf
  | IndieFolk
  | IndiePop
  | IndieRock
  | Indium
  | IndividualProduct
  | Industrial
  | IndustrialFolk
  | IndustrialMetal
  | IndustrialRock
  | Industry
  | IneligibleRegion
  | Influence
  | Inform
  | InformAction
  | Ingredients
  | Inject
  | Injure
  | InsertAction
  | InstallAction
  | InstallUrl
  | Instructor
  | Instrument
  | InsuranceAgency
  | Intangible
  | Integer
  | IntellectuallySatisfying
  | IntelligentDrumAndBass
  | Intend
  | InteractAction
  | InteractionCounter
  | InteractionService
  | InteractionStatistic
  | InteractionType
  | InteractivityType
  | Interest
  | InterestRate
  | Interfere
  | InternetCafe
  | Interrupt
  | Introduce
  | Invent
  | InventoryLevel
  | InvestmentOrDeposit
  | Invite
  | InviteAction
  | Invoice
  | IrishLinen
  | Irritate
  | IsAccessibleForFree
  | IsAccessoryOrSparePartFor
  | IsBasedOn
  | IsBasedOnUrl
  | IsConsumableFor
  | IsFamilyFriendly
  | IsGift
  | IsLiveBroadcast
  | IsPartOf
  | IsRelatedTo
  | IsSimilarTo
  | IsVariantOf
  | IssueNumber
  | IssuedBy
  | IssuedThrough
  | ItaloDance
  | ItaloDisco
  | ItaloHouse
  | ItemAvailability
  | ItemCondition
  | ItemList
  | ItemListElement
  | ItemListOrder
  | ItemListOrderAscending
  | ItemListOrderDescending
  | ItemListOrderType
  | ItemListUnordered
  | ItemOffered
  | ItemPage
  | ItemReviewed
  | ItemShipped
  | Jackfruit
  | Jalapeno
  | JamaicanJerkSpice
  | JazzBlues
  | JazzFunk
  | JazzFusion
  | JazzRap
  | JazzRock
  | JerusalemArtichoke
  | JewelryStore
  | Jicama
  | JobBenefits
  | JobLocation
  | JobPosting
  | JobTitle
  | JoinAction
  | Judge
  | Juicy
  | Jujube
  | JumpUp
  | JuniperBerry
  | KenteCloth
  | Kerseymere
  | Ketchup
  | Kevlar
  | Keywords
  | KhakiDrill
  | Kick
  | KidneyBean
  | Kill
  | Kimchi
  | Kiss
  | KiwiFruit
  | Kneel
  | Knock
  | KnownVehicleDamages
  | Kohlrabi
  | KosherDiet
  | Krautrock
  | Kumquat
  | Label
  | LakeBodyOfWater
  | Lampas
  | Landform
  | Landlord
  | LandmarksOrHistoricalBuildings
  | Language
  | Lanthanum
  | LaserDiscFormat
  | LaserLike
  | LastReviewed
  | LatinHouse
  | LatinJazz
  | Latitude
  | Laugh
  | Launch
  | Lavender
  | Lawrencium
  | Learn
  | LearningResourceType
  | Leathery
  | LeaveAction
  | LeftHandDriving
  | LegalName
  | LegalService
  | LegislativeBuilding
  | Legume
  | LeiCode
  | Lemon
  | LemonBalm
  | LemonGrass
  | LemonMyrtle
  | LemonPepper
  | LemonVerbena
  | LendAction
  | Lender
  | Lentils
  | Lesser
  | LesserGalangal
  | LesserOrEqual
  | Lettuce
  | Library
  | License
  | Lighten
  | LikeAction
  | LimaBean
  | Lime
  | LimitedAvailability
  | Linen
  | LiquidFunk
  | LiquorStore
  | Liquorice
  | List
  | ListItem
  | Listen
  | ListenAction
  | LiteraryEvent
  | Lithium
  | LiveAlbum
  | LiveBlogPosting
  | LiveBlogUpdate
  | Load
  | LoanOrCredit
  | LoanTerm
  | LocalBusiness
  | Location
  | LocationCreated
  | LocationFeatureSpecification
  | LockerDelivery
  | Locksmith
  | Loden
  | LodgingBusiness
  | LodgingReservation
  | LodgingUnitDescription
  | LodgingUnitType
  | LongPepper
  | Longitude
  | Look
  | Loquat
  | LoseAction
  | Loser
  | Lovage
  | Love
  | LowCalorieDiet
  | LowFatDiet
  | LowLactoseDiet
  | LowPrice
  | LowSaltDiet
  | Lutetium
  | Lychee
  | Lyricist
  | Lyrics
  | MachineKnitting
  | Madras
  | Magnesium
  | MainContentOfPage
  | MainEntity
  | MainEntityOfPage
  | MainstreamJazz
  | MakesOffer
  | Male
  | Mamey
  | Manage
  | Mandarine
  | Manganese
  | Mangetout
  | MangoGinger
  | MangoPickle
  | Manufacturer
  | MapCategoryType
  | MapType
  | Marjoram
  | MarryAction
  | Mastic
  | Match
  | Material
  | MathRock
  | Matter
  | MaxPrice
  | MaxValue
  | MaximumAttendeeCapacity
  | Mayonnaise
  | MealService
  | MediaObject
  | MedicalOrganization
  | MedievalMetal
  | Meitnerium
  | MelodicDeathMetal
  | Melt
  | Member
  | MemberOf
  | Members
  | MembershipNumber
  | Memorise
  | MemoryRequirements
  | Mendelevium
  | MensClothingStore
  | Mentions
  | Menu
  | MenuItem
  | MenuSection
  | Merchant
  | Mercury
  | Mesh
  | MessUp
  | Message
  | MessageAttachment
  | Microfiber
  | Microhouse
  | MiddleSchool
  | MignonetteSauce
  | MileageFromOdometer
  | Milk
  | MinPrice
  | MinValue
  | MinimumPaymentDue
  | Mint
  | Miss
  | Mix
  | MixedSpice
  | MixtapeAlbum
  | Moan
  | MobileApplication
  | MobilePhoneStore
  | ModalJazz
  | Model
  | ModifiedTime
  | Moleskin
  | Molybdenum
  | Monday
  | MonetaryAmount
  | MonkeyGlandSauce
  | MontrealSteakSeasoning
  | Moquette
  | Mosque
  | Motel
  | MotorcycleDealer
  | MotorcycleRepair
  | Mountain
  | Mourn
  | Move
  | MoveAction
  | Movie
  | MovieClip
  | MovieRentalStore
  | MovieSeries
  | MovieTheater
  | MovingCompany
  | Mud
  | Muddle
  | Mugwort
  | Mulberry
  | MullingSpices
  | MultipleValues
  | Multiply
  | MumboSauce
  | MungBean
  | Murder
  | Museum
  | Mushroom
  | MushroomKetchup
  | MusicAlbum
  | MusicAlbumProductionType
  | MusicAlbumReleaseType
  | MusicArrangement
  | MusicBy
  | MusicComposition
  | MusicCompositionForm
  | MusicEvent
  | MusicGroup
  | MusicGroupMember
  | MusicPlaylist
  | MusicRecording
  | MusicRelease
  | MusicReleaseFormat
  | MusicReleaseFormatType
  | MusicStore
  | MusicVenue
  | MusicVideoObject
  | MusicalKey
  | Muslin
  | Mustard
  | MustardGreen
  | MustardOil
  | Musty
  | NailSalon
  | Nainsook
  | NamedPosition
  | Nankeen
  | Nationality
  | NavyBean
  | Nectarine
  | Need
  | NeoBopJazz
  | NeoPsychedelia
  | NeoSwing
  | Neodymium
  | Neptunium
  | Nest
  | NetWorth
  | NewAge
  | NewBeat
  | NewCondition
  | NewProg
  | NewRave
  | NewWave
  | NewZealandSpinach
  | NewsArticle
  | NextItem
  | Ngo
  | Nickel
  | Nigella
  | NigellaSativa
  | NightClub
  | Ninon
  | Niobium
  | Nobelium
  | NoisePop
  | NoiseRock
  | NonEqual
  | Notary
  | Note
  | NoteDigitalDocument
  | Notice
  | NoveltyRagtime
  | NuDisco
  | NuJazz
  | NuMetal
  | NuSkoolBreaks
  | Null
  | NumAdults
  | NumChildren
  | Number
  | NumberOfAirbags
  | NumberOfAxles
  | NumberOfBeds
  | NumberOfDoors
  | NumberOfEmployees
  | NumberOfEpisodes
  | NumberOfForwardGears
  | NumberOfItems
  | NumberOfPages
  | NumberOfPlayers
  | NumberOfPreviousOwners
  | NumberOfRooms
  | NumberOfSeasons
  | NumberedPosition
  | Nut
  | Nutmeg
  | Nutrition
  | NutritionInformation
  | NutritionalYeast
  | Nylon
  | Oaked
  | Object
  | Observe
  | Obtain
  | Occupancy
  | OccupationalCategory
  | OceanBodyOfWater
  | OfferCatalog
  | OfferCount
  | OfferItemCondition
  | OfficeEquipmentStore
  | OfflinePermanently
  | OfflineTemporarily
  | Oilskin
  | Okra
  | OldBaySeasoning
  | OldschoolJungle
  | Olefin
  | Olive
  | OliveOil
  | OnDemandEvent
  | OnSitePickup
  | Onion
  | OnionPowder
  | Online
  | OnlineFull
  | OnlineOnly
  | OpeningHours
  | OpeningHoursSpecification
  | OperatingSystem
  | Opponent
  | Option
  | Opulent
  | Orange
  | OrchestralJazz
  | OrchestralUplifting
  | OrderAction
  | OrderCancelled
  | OrderDate
  | OrderDelivered
  | OrderDelivery
  | OrderInTransit
  | OrderItemNumber
  | OrderItemStatus
  | OrderNumber
  | OrderPaymentDue
  | OrderPickupAvailable
  | OrderProblem
  | OrderProcessing
  | OrderQuantity
  | OrderReturned
  | OrderStatus
  | OrderedItem
  | Organdy
  | Organization
  | OrganizationRole
  | OrganizeAction
  | Organza
  | OrientedStrandBoard
  | OriginAddress
  | Osmium
  | Osnaburg
  | Ottoman
  | OutOfStock
  | OutletStore
  | Overflow
  | OwnedFrom
  | OwnedThrough
  | OwnershipInfo
  | Oxford
  | Oxidized
  | Paddle
  | Paduasoy
  | PageEnd
  | PageStart
  | Pagination
  | PaintAction
  | Painting
  | Paisley
  | PaisleyUnderground
  | Palladium
  | Paperback
  | Paprika
  | ParallelStrandLumber
  | ParcelDelivery
  | ParcelService
  | Parent
  | ParentAudience
  | ParentItem
  | ParentOrganization
  | ParentService
  | ParkingFacility
  | ParkingMap
  | Parsley
  | Parsnip
  | PartOfEpisode
  | PartOfInvoice
  | PartOfOrder
  | PartOfSeason
  | PartOfSeries
  | PartOfTvseries
  | Participant
  | PartySize
  | Pashmina
  | Pass
  | PassengerPriorityStatus
  | PassengerSequenceNumber
  | PattyPan
  | Pause
  | PawnShop
  | PayAction
  | PaymentAccepted
  | PaymentAutomaticallyApplied
  | PaymentCard
  | PaymentChargeSpecification
  | PaymentComplete
  | PaymentDeclined
  | PaymentDue
  | PaymentDueDate
  | PaymentMethod
  | PaymentMethodId
  | PaymentPastDue
  | PaymentService
  | PaymentStatus
  | PaymentStatusType
  | PaymentUrl
  | Peach
  | Pedal
  | Peep
  | PeopleAudience
  | PepperJelly
  | Percale
  | PerformAction
  | PerformanceRole
  | Performer
  | PerformerIn
  | Performers
  | PerformingArtsTheater
  | PerformingGroup
  | Perilla
  | Periodical
  | PermissionType
  | Permit
  | PermitAudience
  | PermittedUsage
  | Persimmon
  | Person
  | PeruvianPepper
  | PetStore
  | PetsAllowed
  | Pharmacy
  | Photo
  | Photograph
  | PhotographAction
  | Photos
  | Physalis
  | Piccalilli
  | PickledCucumber
  | PickledFruit
  | PickledOnion
  | PickledPepper
  | PickupLocation
  | PickupTime
  | PicoDeGallo
  | PinStripes
  | Pine
  | Pineapple
  | PintoBean
  | Place
  | PlaceOfWorship
  | Plan
  | PlanAction
  | Plant
  | Plastic
  | PlasticLaminate
  | Platinum
  | PlayAction
  | PlayMode
  | PlayerType
  | PlayersOnline
  | Playground
  | Plush
  | Plutonium
  | Plywood
  | Point
  | PolarFleece
  | PoliceStation
  | Polish
  | Polonium
  | Polyester
  | Polygon
  | Polystyrene
  | Polyurethane
  | Pomegranate
  | PomegranateSeed
  | Pomelo
  | Pond
  | Pongee
  | Pop
  | PopPunk
  | PopRock
  | PopcornSeasoning
  | Poplin
  | PoppySeed
  | Position
  | Possess
  | Post
  | PostBop
  | PostBritpop
  | PostDisco
  | PostGrunge
  | PostHardcore
  | PostMetal
  | PostOffice
  | PostOfficeBoxNumber
  | PostPunk
  | PostPunkRevival
  | PostRock
  | PostalAddress
  | PostalCode
  | Potassium
  | Potato
  | PotentialAction
  | PotentialActionStatus
  | PowderDouce
  | PowerElectronics
  | PowerMetal
  | PowerNoise
  | PowerPop
  | Powerful
  | Practise
  | Praseodymium
  | Pray
  | PreOrder
  | PreSale
  | Preach
  | Precede
  | PredecessorOf
  | Prefer
  | PrepTime
  | Prepare
  | PrependAction
  | Preschool
  | Present
  | PresentationDigitalDocument
  | Preserve
  | Pretend
  | Prevent
  | PreviousItem
  | PreviousStartDate
  | Price
  | PriceComponent
  | PriceCurrency
  | PriceRange
  | PriceSpecification
  | PriceType
  | PriceValidUntil
  | Prick
  | PrimaryImageOfPage
  | Print
  | PrintColumn
  | PrintEdition
  | PrintPage
  | PrintSection
  | ProcessingTime
  | ProcessorRequirements
  | Produce
  | Produces
  | Product
  | ProductId
  | ProductModel
  | ProductSupported
  | ProductionCompany
  | ProductionDate
  | ProfessionalService
  | ProficiencyLevel
  | ProfilePage
  | ProgramMembership
  | ProgramMembershipUsed
  | ProgramName
  | ProgrammingLanguage
  | ProgrammingModel
  | Progressive
  | ProgressiveBreaks
  | ProgressiveDrumBass
  | ProgressiveFolk
  | ProgressiveHouse
  | ProgressiveMetal
  | ProgressiveRock
  | ProgressiveTechno
  | Promethium
  | Promise
  | PropertyId
  | PropertyValue
  | PropertyValueSpecification
  | Protactinium
  | Protect
  | ProteinContent
  | Provide
  | Provider
  | ProviderMobility
  | ProvidesBroadcastService
  | ProvidesService
  | PsychedelicFolk
  | PsychedelicRock
  | PsychedelicTrance
  | PublicHolidays
  | PublicSwimmingPool
  | Publication
  | PublicationEvent
  | PublicationIssue
  | PublicationVolume
  | PublishedOn
  | Publisher
  | PublishingPrinciples
  | Pull
  | Pump
  | Pumpkin
  | PumpkinPieSpice
  | Puncture
  | Punish
  | PunkJazz
  | PunkRock
  | PurchaseDate
  | PurpleMangosteen
  | Push
  | Qualifications
  | QualitativeValue
  | QuantitativeValue
  | Quantity
  | Query
  | Quest
  | Question
  | Quince
  | QuoteAction
  | RNews
  | Race
  | Radiate
  | Radicchio
  | RadioChannel
  | RadioClip
  | RadioEpisode
  | RadioSeason
  | RadioSeries
  | RadioStation
  | Radish
  | Radium
  | RagaRock
  | RaggaJungle
  | Ragtime
  | Raisiny
  | Rambutan
  | RammedEarth
  | RapMetal
  | RapRock
  | Raspberry
  | RatingCount
  | RatingValue
  | Reach
  | ReactAction
  | ReadAction
  | ReadPermission
  | ReadonlyValue
  | RealEstateAgent
  | Realise
  | RearWheelDriveConfiguration
  | Receive
  | ReceiveAction
  | Recipe
  | RecipeCategory
  | RecipeCuisine
  | RecipeIngredient
  | RecipeInstructions
  | RecipeYield
  | Recipient
  | Recognise
  | Record
  | RecordLabel
  | RecordedAs
  | RecordedAt
  | RecordedIn
  | RecordingOf
  | RecyclingCenter
  | Redcurrant
  | Reduce
  | ReferenceQuantity
  | ReferencesOrder
  | Refined
  | Reflect
  | RefurbishedCondition
  | Refuse
  | RegionsAllowed
  | RegisterAction
  | Regret
  | Reign
  | Reject
  | RejectAction
  | Rejoice
  | RelatedLink
  | RelatedTo
  | Relax
  | Release
  | ReleaseDate
  | ReleaseNotes
  | ReleaseOf
  | ReleasedEvent
  | Relish
  | Remain
  | RemainingAttendeeCapacity
  | Remember
  | Remind
  | RemixAlbum
  | Remoulade
  | Remove
  | RentAction
  | RentalCarReservation
  | Replace
  | ReplaceAction
  | Replacer
  | Reply
  | ReplyAction
  | ReplyToUrl
  | Report
  | ReportNumber
  | RepresentativeOfPage
  | Reproduce
  | Request
  | RequiredCollateral
  | RequiredGender
  | RequiredMaxAge
  | RequiredMinAge
  | Requirements
  | RequiresSubscription
  | Rescue
  | Researcher
  | Reservation
  | ReservationCancelled
  | ReservationConfirmed
  | ReservationFor
  | ReservationHold
  | ReservationId
  | ReservationPackage
  | ReservationPending
  | ReservationStatus
  | ReservationStatusType
  | ReserveAction
  | ReservedTicket
  | Reservoir
  | Residence
  | Resort
  | Responsibilities
  | Restaurant
  | RestrictedDiet
  | Result
  | ResultComment
  | ResultReview
  | ResumeAction
  | Reticent
  | Retire
  | Return
  | ReturnAction
  | Review
  | ReviewAction
  | ReviewBody
  | ReviewCount
  | ReviewRating
  | ReviewedBy
  | Reviews
  | Rhenium
  | Rhodium
  | Rhubarb
  | Rhyme
  | Rich
  | RightHandDriving
  | Rinse
  | RiotGrrrl
  | Ripstop
  | Risk
  | RiverBodyOfWater
  | RockAndRoll
  | RockInOpposition
  | RockMelon
  | Roentgenium
  | RoleName
  | RoofingContractor
  | Rose
  | Rosemary
  | Rot
  | Rough
  | Round
  | RsvpAction
  | RsvpResponse
  | RsvpResponseMaybe
  | RsvpResponseNo
  | RsvpResponseType
  | RsvpResponseYes
  | Rubidium
  | Ruin
  | Rule
  | RunnerBean
  | Runtime
  | RuntimePlatform
  | Rush
  | RussellCord
  | Rutabaga
  | Ruthenium
  | Rutherfordium
  | Saffron
  | Sage
  | SaladCream
  | SaladDressing
  | SalalBerry
  | SalaryCurrency
  | Salsa
  | SalsaGolf
  | Salt
  | SaltAndPepper
  | Samarium
  | Sambal
  | SameAs
  | Samite
  | SampleType
  | Sarsaparilla
  | Sassafras
  | Sateen
  | Satisfy
  | Satsuma
  | SaturatedFatContent
  | Saturday
  | Sauerkraut
  | Save
  | Savory
  | Scallion
  | Scandium
  | Scarlet
  | Scatter
  | ScheduleAction
  | ScheduledPaymentDate
  | ScheduledTime
  | SchemaVersion
  | ScholarlyArticle
  | Scold
  | Scorch
  | Scrape
  | Scratch
  | ScreenCount
  | ScreeningEvent
  | Screenshot
  | Screw
  | Scribble
  | Scrim
  | Scrub
  | Sculpture
  | SeaBodyOfWater
  | SeaSilk
  | Seaborgium
  | Search
  | SearchAction
  | SearchResultsPage
  | Season
  | SeasonNumber
  | Seasons
  | SeatNumber
  | SeatRow
  | SeatSection
  | SeatingMap
  | SeatingType
  | SecurityScreening
  | Seersucker
  | SelfStorage
  | SellAction
  | SendAction
  | Serge
  | SerialNumber
  | Series
  | Serve
  | ServerStatus
  | ServesCuisine
  | Service
  | ServiceArea
  | ServiceAudience
  | ServiceChannel
  | ServiceLocation
  | ServiceOperator
  | ServiceOutput
  | ServicePhone
  | ServicePostalAddress
  | ServiceSmsNumber
  | ServiceType
  | ServiceUrl
  | ServingSize
  | Sesame
  | SesameOil
  | Shade
  | ShareAction
  | SharedContent
  | SharenaSol
  | Shave
  | Shelter
  | Shiplap
  | Shiso
  | Shiver
  | Shock
  | ShoeStore
  | Shoegaze
  | Shop
  | ShoppingCenter
  | ShotSilk
  | Shrug
  | Sibling
  | Siblings
  | SichuanPepper
  | Signal
  | SignificantLink
  | SignificantLinks
  | Silk
  | Silky
  | Silver
  | SingleFamilyResidence
  | SinglePlayer
  | SingleRelease
  | Sisal
  | SiteNavigationElement
  | SkaJazz
  | SkaPunk
  | SkatePunk
  | Ski
  | SkiResort
  | Skills
  | Skip
  | Skirret
  | Sku
  | Slip
  | SludgeMetal
  | Smile
  | Smokey
  | SmokingAllowed
  | Smooth
  | SmoothJazz
  | SnapPea
  | Snatch
  | Sneeze
  | Sniff
  | SocialEvent
  | SocialMediaPosting
  | Sodium
  | SodiumContent
  | SoftRock
  | SoftwareAddOn
  | SoftwareApplication
  | SoftwareHelp
  | SoftwareRequirements
  | SoftwareSourceCode
  | SoftwareVersion
  | SoldOut
  | SomeProducts
  | Sorrel
  | SoulJazz
  | Sound
  | SoundArt
  | SoundtrackAlbum
  | SourceOrganization
  | SouthernRock
  | SoyBean
  | SoySauce
  | SpaceDisco
  | SpaceHouse
  | SpaceRock
  | SpaghettiSquash
  | Spandex
  | Spare
  | Spark
  | Spatial
  | SpatialCoverage
  | SpecialCommitments
  | SpecialOpeningHoursSpecification
  | Specialty
  | SpeedGarage
  | SpeedMetal
  | SpiderSilk
  | Spinach
  | Spoil
  | SpokenWordAlbum
  | Sponsor
  | SportingGoodsStore
  | SportsActivityLocation
  | SportsClub
  | SportsEvent
  | SportsOrganization
  | SportsTeam
  | Spot
  | Spouse
  | Spray
  | SpreadsheetDigitalDocument
  | Sprout
  | Squeak
  | Squeal
  | Squeeze
  | Sriracha
  | StackExchange
  | StadiumOrArena
  | Stamp
  | StarAnise
  | StarFruit
  | StarRating
  | StartDate
  | StartTime
  | State
  | SteakSauce
  | SteeringPosition
  | SteeringPositionValue
  | StepValue
  | StiAccommodationOntology
  | Stitch
  | Stone
  | StonerRock
  | Stop
  | StorageRequirements
  | Store
  | StraightAheadJazz
  | Strawberry
  | StreetAddress
  | StreetPunk
  | Strengthen
  | Stretch
  | StrideJazz
  | Strip
  | Strontium
  | Structured
  | StructuredValue
  | StubTex
  | StudioAlbum
  | Stuff
  | Styrofoam
  | SubEvent
  | SubEvents
  | SubOrganization
  | SubReservation
  | SubscribeAction
  | SubtitleLanguage
  | Subtract
  | SubwayStation
  | Succeed
  | SuccessorOf
  | Suck
  | Suffer
  | SugarContent
  | Suggest
  | SuggestedAnswer
  | SuggestedGender
  | SuggestedMaxAge
  | SuggestedMinAge
  | Suit
  | SuitableForDiet
  | Sumac
  | Sunday
  | SungPoetry
  | SuperEvent
  | Supply
  | Support
  | SupportingData
  | Suppose
  | SurfRock
  | Surface
  | Surprise
  | Surround
  | Suspect
  | Suspend
  | SuspendAction
  | Sweet
  | SweetChilliSauce
  | SweetPotato
  | Swing
  | SwingHouse
  | Switch
  | SymphonicMetal
  | Synagogue
  | Syrup
  | TabascoPepper
  | Table
  | Taffeta
  | TakeAction
  | Tamarillo
  | Tamarind
  | TandooriMasala
  | Tangerine
  | Tannic
  | Tantalum
  | TargetCollection
  | TargetDescription
  | TargetName
  | TargetPlatform
  | TargetProduct
  | TargetUrl
  | Taro
  | Tarragon
  | Tart
  | Tartan
  | TartarSauce
  | TasmanianPepper
  | Tattersall
  | TattooParlor
  | TaxId
  | TaxiReservation
  | TaxiService
  | TaxiStand
  | TechArticle
  | TechHouse
  | TechTrance
  | Technetium
  | TechnicalDeathMetal
  | TechnoDnb
  | TechnoFolk
  | Telephone
  | TelevisionChannel
  | TelevisionStation
  | Temporal
  | TemporalCoverage
  | Tempt
  | TennisComplex
  | TeriyakiSauce
  | TerraCotta
  | Terrazzo
  | Terrify
  | TewkesburyMustard
  | Text
  | TextDigitalDocument
  | ThaiBasil
  | Thallium
  | Thank
  | TheaterEvent
  | TheaterGroup
  | Thing
  | ThirdStream
  | Thorium
  | ThrashMetal
  | Thulium
  | Thumbnail
  | ThumbnailUrl
  | Thursday
  | Thyme
  | Tick
  | TickerSymbol
  | Ticket
  | TicketNumber
  | TicketToken
  | TicketedSeat
  | Tickle
  | TieAction
  | Tight
  | Timber
  | Time
  | TimeRequired
  | Tin
  | Tip
  | TipAction
  | TireShop
  | Titanium
  | Title
  | ToLocation
  | Toasty
  | TollFree
  | Tomato
  | TonkaBean
  | TotalPaymentDue
  | TotalPrice
  | TotalTime
  | Touch
  | TouristAttraction
  | TouristInformationCenter
  | ToyStore
  | ToytownTechno
  | Trace
  | TrackAction
  | TrackingNumber
  | TrackingUrl
  | Tracks
  | TradJazz
  | Trade
  | TradeAction
  | TraditionalDoom
  | Trailer
  | Train
  | TrainName
  | TrainNumber
  | TrainReservation
  | TrainStation
  | TrainTrip
  | Trance
  | TransFatContent
  | Transcript
  | TransferAction
  | TransitMap
  | Translator
  | Transparent
  | Transport
  | Travel
  | TravelAction
  | TravelAgency
  | Treat
  | Tremble
  | TribalHouse
  | Trick
  | Trip
  | TripHop
  | Trot
  | Trouble
  | Trust
  | Try
  | Tubers
  | Tuesday
  | Tulle
  | Tumble
  | Tungsten
  | Turmeric
  | Turn
  | Turnip
  | TweePop
  | Tweed
  | Twill
  | Twist
  | Type
  | TypeAndQuantityNode
  | TypeOfBed
  | TypeOfGood
  | TypicalAgeRange
  | UgliFruit
  | UnRegisterAction
  | Unctuous
  | UnderName
  | Undress
  | Unfasten
  | UnitCode
  | UnitPriceSpecification
  | UnitText
  | Unite
  | Unlock
  | Unpack
  | UnsaturatedFatContent
  | Untidy
  | UpdateAction
  | UpliftingTrance
  | UploadDate
  | UpvoteCount
  | Uranium
  | Urbanite
  | Url
  | UrlTemplate
  | UseAction
  | UsedCondition
  | UserBlocks
  | UserCheckins
  | UserComments
  | UserDownloads
  | UserInteraction
  | UserInteractionCount
  | UserLikes
  | UserPageVisits
  | UserPlays
  | UserPlusOnes
  | UserTweets
  | ValidFor
  | ValidFrom
  | ValidIn
  | ValidThrough
  | ValidUntil
  | Value
  | ValueAddedTaxIncluded
  | ValueMaxLength
  | ValueMinLength
  | ValueName
  | ValuePattern
  | ValueReference
  | ValueRequired
  | Vanadium
  | Vanilla
  | Vanillin
  | VatId
  | VeganDiet
  | VegetableFlannel
  | Vegetal
  | VegetarianDiet
  | Vehicle
  | VehicleConfiguration
  | VehicleEngine
  | VehicleIdentificationNumber
  | VehicleInteriorColor
  | VehicleInteriorType
  | VehicleModelDate
  | VehicleSeatingCapacity
  | VehicleSpecialUsage
  | VehicleTransmission
  | Velvet
  | Velveteen
  | Velvety
  | VenueMap
  | Version
  | Video
  | VideoFormat
  | VideoFrameSize
  | VideoGallery
  | VideoGame
  | VideoGameClip
  | VideoGameSeries
  | VideoObject
  | VideoQuality
  | VietnameseCoriander
  | ViewAction
  | VikingMetal
  | VinoCotto
  | VinylCoatedPolyester
  | VinylFormat
  | Visit
  | VisualArtsEvent
  | VisualArtwork
  | VocalHouse
  | VocalJazz
  | VocalTrance
  | Volcano
  | VolumeNumber
  | VoteAction
  | Wallpaper
  | Want
  | WantAction
  | Warm
  | Warranty
  | WarrantyPromise
  | WarrantyScope
  | Wasabi
  | Waste
  | Watch
  | WatchAction
  | Water
  | WaterChestnut
  | Watercress
  | Waterfall
  | Watermelon
  | WatermelonRindPreserves
  | Wave
  | WearAction
  | WebApplication
  | WebCheckinTime
  | WebPage
  | WebPageElement
  | WebSite
  | Wednesday
  | Weight
  | Welcome
  | WestCoastJazz
  | Western
  | Whipcord
  | Whirl
  | Whisper
  | Whistle
  | WhiteMustard
  | WhitePeppercorn
  | WhiteRadish
  | WholesaleStore
  | Width
  | Wigan
  | WikiDoc
  | WinAction
  | Winery
  | Wink
  | Winner
  | Wipe
  | WireRope
  | WitchHouse
  | Wobble
  | Wonder
  | Wood
  | Woodruff
  | Wool
  | WordCount
  | WorkExample
  | WorkFeatured
  | WorkHours
  | WorkLocation
  | WorkPerformed
  | WorkPresented
  | WorksFor
  | WorldFusion
  | Worry
  | WorstRating
  | WpadBlock
  | Wrap
  | Wreck
  | Wrestle
  | Wriggle
  | WriteAction
  | WritePermission
  | XRay
  | XoSauce
  | YachtRock
  | Yam
  | Yawn
  | YearlyRevenue
  | YearsInOperation
  | Yell
  | YorkshireBleepsAndBass
  | Ytterbium
  | Yttrium
  | Yuzu
  | Zedoary
  | Zephyr
  | Zest
  | Zibeline
  | Zinc
  | Zip
  | Zirconium
  | ZoneBoardingPolicy
  | Zoom
  | Zucchini