module VocabularyDescription exposing (VocabularyDescription, decoder, toDict, fromString)

import Dict exposing (Dict)
import Json.Decode exposing (Decoder, map2, field, string, list)

type alias VocabularyDescription =
    { word : String
    , description : String
    }

itemDecoder : Decoder VocabularyDescription
itemDecoder =
    map2 VocabularyDescription
      (field "word" string)
      (field "description" string)

decoder : Decoder (List VocabularyDescription)
decoder = list itemDecoder

toDict: List VocabularyDescription -> Dict String String
toDict medias =
    medias 
    |> List.map (\attr -> (attr.word, attr.description))
    |> Dict.fromList

fromString: String -> Result String (Dict String String)
fromString jsonContent =
        Json.Decode.decodeString decoder jsonContent
        |> Result.mapError (\err -> err |> Json.Decode.errorToString)
        |> Result.map toDict
    