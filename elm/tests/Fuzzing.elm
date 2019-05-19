module Fuzzing exposing (english, hexa, phonetic, visual)

import Fuzz as Fuzz exposing (Fuzzer, custom, intRange)
import Random as Random exposing (Generator)
import Random.Char as RandChar
import Random.Extra as RandExtra
import Random.String as RandString
import Shrink as Shrink exposing(Shrinker)

import Maybe exposing (withDefault)

oneOfList: List a -> Fuzzer a
oneOfList list =
    List.map Fuzz.constant list |> Fuzz.oneOf

decimalFLChar : Generator Char
decimalFLChar = 
    RandExtra.sample ['┼', '╀', '┾', '╄', '╂', '╂', '╆', '╊', '┽', '┹']  
        |> Random.map (Maybe.withDefault ' ')


decimalChar : Generator Char
decimalChar = 
    RandChar.char 48 57

type alias Vocab = {
    eng: String
    , hexa: String
    , phonetic: String
    , visual: String
    }

englishHexaList = [
    Vocab "blueberry" "6667" "beɪbɪʃ" "╆╆╆╊"
    , Vocab "orange" "744" "gʊnʌ" "╊╁╁"
    , Vocab "stuff" "910" "jɛpʌ" "┹╀┼"
    , Vocab "mustard_green" "391574" "mjuːtaɪgʊ" "╄┹╀╂╊╁"
    ]

english : Fuzzer String
english = 
    englishHexaList |> List.map .eng |> oneOfList

hexa : Fuzzer String
hexa = 
    englishHexaList |> List.map .hexa |> oneOfList

phonetic : Fuzzer String
phonetic = 
    englishHexaList |> List.map .phonetic |> oneOfList

visual : Fuzzer String
visual = 
    englishHexaList |> List.map .visual |> oneOfList