module MediaContent exposing (MediaContent, decoder, toDict, fromString)

import Dict exposing (Dict)
import Json.Decode exposing (Decoder, map5, field, string, list)

type alias MediaContent =
    { word : String
    , title : String
    , contentURL : String
    , encodingFormat : String
    , attributionId : String
    }

itemDecoder : Decoder MediaContent
itemDecoder =
    map5 MediaContent
      (field "word" string)
      (field "title" string)
      (field "contentURL" string)
      (field "encodingFormat" string)
      (field "attributionId" string)

decoder : Decoder (List MediaContent)
decoder = list itemDecoder

toDict: List MediaContent -> Dict String (List MediaContent)
toDict medias =
    medias 
    |> List.map (\attr -> (attr.word, [ attr ])) -- TODO deal with duplicates
    |> Dict.fromList

fromString: String -> Result String (Dict String (List MediaContent))
fromString jsonContent =
        Json.Decode.decodeString decoder jsonContent
        |> Result.mapError (\err -> err |> Json.Decode.errorToString)
        |> Result.map toDict
    