module VocabularyTranslationTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string, tuple)
import Test exposing (..)
import VocabularyTranslation exposing(fromString, toDict, toReverseDict)
import Fuzzing as Fuzzing
import Dict

toCsv: List (String, String) -> String
toCsv rows =
    rows |> List.map (\v -> Tuple.first v ++ "," ++ Tuple.second v)
    |> String.join "\n"

suite : Test
suite =
    describe "The VocabularyTranslation Module"
    [
        describe "fromString"
        [
            fuzz (list (tuple (Fuzzing.stringBase12, Fuzzing.alpha))) "read from jsonString" <|
                \ rows ->
                    VocabularyTranslation.fromString (toCsv rows)
                    |> Expect.equal rows
        ]
        , describe "toDict"
        [
            fuzz (Fuzzing.nonEmptyList (tuple (Fuzzing.stringBase12, Fuzzing.alpha))) "convert to dict" <|
                \ rows ->
                    VocabularyTranslation.fromString (toCsv rows)
                    |> VocabularyTranslation.toDict
                    |> Dict.get (rows |> List.head |> Maybe.map Tuple.first |> Maybe.withDefault "anykey")
                    |> Maybe.withDefault []
                    |> List.isEmpty
                    |> Expect.equal False
        ]
        , describe "toReverseDict"
        [
            fuzz (Fuzzing.nonEmptyList (tuple (Fuzzing.stringBase12, Fuzzing.alpha))) "convert to reverse dict" <|
                \ rows ->
                    VocabularyTranslation.fromString (toCsv rows)
                    |> VocabularyTranslation.toReverseDict
                    |> Dict.get (rows |> List.head |> Maybe.map Tuple.second |> Maybe.withDefault "anykey")
                    |> Maybe.withDefault []
                    |> List.isEmpty
                    |> Expect.equal False
        ]

    ]
