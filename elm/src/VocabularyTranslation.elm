module VocabularyTranslation exposing (fromString, toDict, toReverseDict)

import Dict exposing (Dict)
import Set
import Tuple exposing (first, second)


punctuations : List ( String, List String )
punctuations =
    [ ( "◌", [ " " ] )
    , ( "◌◌", [ ", ", "," ] )
    , ( "◌◌◌", [ "; ", ";" ] )
    , ( "◌◌◌◌", [ ". ", "." ] )
    , ( "◌◌◌◌◌", [ "\n\n", "\n" ] )
    ]


reversePunctuations : List ( String, List String )
reversePunctuations =
    [ ( " ", [ "◌" ] )
    , ( ",", [ "◌◌" ] )
    , ( ", ", [ "◌◌" ] )
    , ( ";", [ "◌◌◌" ] )
    , ( "; ", [ "◌◌◌" ] )
    , ( ".", [ "◌◌◌◌" ] )
    , ( ". ", [ "◌◌◌◌" ] )
    , ( "\n", [ "◌◌◌◌◌" ] )
    , ( "\n\n", [ "◌◌◌◌◌" ] )
    ]


csvToTuple : String -> Maybe ( String, String )
csvToTuple line =
    case String.split "," line of
        [ key, value ] ->
            Just ( key |> String.trim, value |> String.trim )

        _ ->
            Nothing


fromString : String -> List ( String, String )
fromString csv =
    String.lines csv |> List.filterMap csvToTuple


uniqueFirst : List ( String, String ) -> List String
uniqueFirst list =
    List.map first list |> Set.fromList |> Set.toList


uniqueSecond : List ( String, String ) -> List String
uniqueSecond list =
    List.map second list |> Set.fromList |> Set.toList


filterByFirst : List ( String, String ) -> String -> ( String, List String )
filterByFirst list predicate =
    List.filter (\duo -> first duo == predicate) list
        |> List.map second
        |> Tuple.pair predicate


filterBySecond : List ( String, String ) -> String -> ( String, List String )
filterBySecond list predicate =
    List.filter (\duo -> second duo == predicate) list
        |> List.map first
        |> Tuple.pair predicate


groupByFirst : List ( String, String ) -> List ( String, List String )
groupByFirst list =
    uniqueFirst list |> List.map (filterByFirst list)


groupBySecond : List ( String, String ) -> List ( String, List String )
groupBySecond list =
    uniqueSecond list |> List.map (filterBySecond list)


toDict : List ( String, String ) -> Dict String (List String)
toDict list =
    groupByFirst list
        ++ punctuations
        |> Dict.fromList


toReverseDict : List ( String, String ) -> Dict String (List String)
toReverseDict list =
    groupBySecond list
        ++ reversePunctuations
        |> Dict.fromList
