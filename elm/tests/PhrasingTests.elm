module PhrasingTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string, tuple)
import Test exposing (..)
import Dict
import Tuple exposing(first, second)
import Phrasing
import WordInfo exposing (WordInfo)
import ReferenceModel exposing(ReferenceModel)
import Fuzzing as Fuzzing

createFictionalChar: Char -> Char
createFictionalChar n =
    case n of
        '0' -> '┼'
        '1' -> '╀'
        '2' -> '┾'
        '3' -> '╄'
        '4' -> '╁'
        '5' -> '╂'
        '6' -> '╆'
        '7' -> '╊'
        '8' -> '┽'
        '9' -> '┹'
        otherwise -> '?'

createChar: Char -> Char
createChar n =
    case n of
        '0' -> 'a'
        '1' -> 'b'
        '2' -> 'c'
        '3' -> 'd'
        '4' -> 'e'
        '5' -> 'f'
        '6' -> 'g'
        '7' -> 'h'
        '8' -> 'i'
        '9' -> 'j'
        otherwise -> '?'

splitNumbers: Int -> List Char
splitNumbers n =
    String.fromInt n
    |> String.toList

tupleFictEng: Int -> (String, String)
tupleFictEng n =
   ( splitNumbers n |> List.map createFictionalChar |> String.fromList
    , splitNumbers n |> List.map createChar |> String.fromList)
    
fixtureTranslation: List (String, String)
fixtureTranslation =
    List.range 10000 10100 
        |> List.map tupleFictEng

fictWord: Fuzzer String
fictWord =
   fixtureTranslation |> List.map Tuple.first |> Fuzzing.oneOfList 

classicWord: Fuzzer String
classicWord =
   fixtureTranslation |> List.map Tuple.second |> Fuzzing.oneOfList

fictionalSeparator: Fuzzer String
fictionalSeparator =
    ["◌", "◌◌", "◌◌◌", "◌◌◌◌",  "◌◌◌◌◌" ] |> Fuzzing.oneOfList

classicSeparator: Fuzzer String
classicSeparator =
    [" ", ", ", "; ", ". ",  "\n\n" ] |> Fuzzing.oneOfList

createFictionalSentences: List (String, String) -> String
createFictionalSentences parts =
    List.map (\duo-> (first duo) ++ (second duo) ) parts
        |> String.join ""

createClassicSentences: List (String, String) -> String
createClassicSentences parts =
    List.map (\duo-> (first duo) ++ (second duo) ) parts
        |> String.join ""

fixtureReferenceModel: ReferenceModel
fixtureReferenceModel =
    ReferenceModel.createDefault
    |> ReferenceModel.loadTranslation fixtureTranslation
    |> ReferenceModel.loadWordInfo

suite : Test
suite =
    describe "The Phrasing Module"
    [
        describe "fictional conversion"
        [
            fuzz (Fuzzing.nonEmptyList (tuple (fictWord, fictionalSeparator))) "should convert both ways" <|
                \sentences ->
                Phrasing.fromFictionalString fixtureReferenceModel (createFictionalSentences sentences)
                |> Phrasing.toFictionalString fixtureReferenceModel
                |> Expect.equal (createFictionalSentences sentences)
        ]
        , describe "english-ish conversion"
        [
            fuzz (Fuzzing.nonEmptyList (tuple (classicWord, classicSeparator))) "should convert both ways" <|
                \sentences ->
                Phrasing.fromClassicString fixtureReferenceModel (createClassicSentences sentences)
                |> Phrasing.toClassicString fixtureReferenceModel
                |> Expect.equal (createClassicSentences sentences)
        ]
        , describe "fictional to classic conversion"
        [
            fuzz (Fuzzing.nonEmptyList (tuple (fictWord, fictionalSeparator))) "should convert both ways" <|
                \sentences ->
                Phrasing.fromFictionalString fixtureReferenceModel (createFictionalSentences sentences)
                |> Phrasing.toClassicString fixtureReferenceModel
                |> Phrasing.fromClassicString fixtureReferenceModel
                |> Phrasing.toFictionalString fixtureReferenceModel
                |> Expect.equal (createFictionalSentences sentences)
        ]
    ]
