module Attribution exposing (Attribution, decoder, toDict, fromString)

import Dict exposing (Dict)
import Json.Decode exposing (Decoder, map5, field, string, list)

type alias Attribution =
    { id : String
    , attributionName : String
    , attributionURL : String
    , licenseName : String
    , licenseURL : String
    }

itemDecoder : Decoder Attribution
itemDecoder =
    map5 Attribution
      (field "id" string)
      (field "attributionName" string)
      (field "attributionURL" string)
      (field "licenseName" string)
      (field "licenseURL" string)

decoder : Decoder (List Attribution)
decoder = list itemDecoder

toDict: List Attribution -> Dict String Attribution
toDict attributions =
    attributions 
    |> List.map (\attr -> (attr.id, attr))
    |> Dict.fromList

fromString: String -> Result String (Dict String Attribution)
fromString jsonContent =
        Json.Decode.decodeString decoder jsonContent
        |> Result.mapError (\err -> err |> Json.Decode.errorToString)
        |> Result.map toDict
    