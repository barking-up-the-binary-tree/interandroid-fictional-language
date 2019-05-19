module FictionalLanguageTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import FictionalLanguage exposing (engToHexa, hexaToEng, hexaToPhonetic, hexaToVisual, visualToHexa)
import Fuzzing as Fuzzing

suite : Test
suite =
    describe "The Fictional Language Module"
    [
        describe "English to hexa conversion"
        [
            fuzz Fuzzing.english "should convert both ways" <|
                \eng ->
                    engToHexa eng
                    |> hexaToEng
                        |> Expect.equal eng
        ]
        , describe "Visual to hexa conversion"
        [
            fuzz Fuzzing.hexa "should convert both ways" <|
                \hexa ->
                    hexaToVisual hexa
                    |> visualToHexa
                        |> Expect.equal hexa
        ]
        , describe "Hexa to phonetic"
        [
            fuzz Fuzzing.hexa "should convert" <|
                \hexa ->
                    hexaToPhonetic hexa
                    |> visualToHexa
                        |> String.contains "?" |> not
                        |> Expect.equal True
                        
        ]

    ]
