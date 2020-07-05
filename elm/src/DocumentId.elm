module DocumentId exposing(DocumentId(..), toRelativeUrl)

type DocumentId = AttributionDoc | DescriptionDoc | MediaDoc | TranslationDoc | CoreDoc

toString: DocumentId -> String
toString docId =
    case docId of
       AttributionDoc -> "attribution.json"
       DescriptionDoc -> "core-vocabulary-description.json"
       MediaDoc -> "core-vocabulary-media.json"
       TranslationDoc -> "core-vocabulary-translation.csv"
       CoreDoc -> "core-vocabulary.txt"

toRelativeUrl: String -> DocumentId -> String
toRelativeUrl lang docId =
    ["data", lang, toString docId] |> String.join "/"

