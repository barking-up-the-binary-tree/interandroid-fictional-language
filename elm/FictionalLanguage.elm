module FictionalLanguage exposing (FieldModel, engToHexa, hexaToEng, hexaToListFieldModel, hexaToPhonetic, hexaToVisual, visualToHexa)

{-| FromEnglish


# Basics

-}

import Array exposing (Array, fromList, get)
import Dict exposing (Dict, fromList, get)
import FictionalWords exposing (csvContent, csvSpecialWords)
import List exposing (map, range)
import Maybe exposing (withDefault)
import String exposing (cons, contains, dropLeft, foldr, join, lines, split, startsWith, trim, words)
import Tuple exposing (first, second)


unknownWord =
    "????"


unknownHexa =
    "??"


type alias FieldModel =
    { text : String
    , style : String
    , hint : String
    , hintStyle : String
    }


zip : List a -> List b -> List ( a, b )
zip xs ys =
    case ( xs, ys ) of
        ( x :: xBack, y :: yBack ) ->
            ( x, y ) :: zip xBack yBack

        ( _, _ ) ->
            []


toHexa : List Word -> List String
toHexa s =
    map wordToHexa s


toEng : List Word -> List String
toEng s =
    map wordToEng s


toListFieldModel : List Word -> List FieldModel
toListFieldModel s =
    map wordToFieldModel s


toComposedWordsX : List String -> Word
toComposedWordsX list =
    X (map engToWord list)


toComposedWordsC : List String -> Word
toComposedWordsC list =
    C (map engToWord list)


toComposedHexaC : List String -> Word
toComposedHexaC list =
    X (map hexaToWord list)


toComposedHexaD : List String -> Word
toComposedHexaD list =
    C (map hexaToWord list)


isEven : Int -> Bool
isEven n =
    modBy 2 n == 0


engToHexa : String -> String
engToHexa s =
    words s |> map engToWord |> toHexa |> join " "


hexaToEng : String -> String
hexaToEng s =
    words s |> map hexaToWord |> toEng |> join " "


hexaToListFieldModel : String -> List FieldModel
hexaToListFieldModel s =
    words s |> map hexaToWord |> toListFieldModel


hexaToConsOrVowel : ( String, Bool ) -> String
hexaToConsOrVowel tuple =
    let
        ( char, isVowel ) =
            tuple
    in
    if isVowel then
        hexaToVowels char

    else
        hexaToCons char


wordToPhonetic : String -> String
wordToPhonetic s =
    let
        w =
            split "" s

        evenWord =
            if isEven (List.length w) then
                w

            else
                w ++ [ "G" ]

        index =
            range 1 (List.length evenWord)

        isVowel =
            map isEven index

        pairs =
            zip evenWord isVowel
    in
    pairs |> map hexaToConsOrVowel |> join ""


composedToPhonetic : String -> String
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


hexaToPhonetic : String -> String
hexaToPhonetic s =
    map composedToPhonetic (words s) |> join " "


getOrDefaultArr : Int -> Array String -> String
getOrDefaultArr index arr =
    withDefault "???" (Array.get index arr) |> trim


getOrDefaultDict : String -> Dict String String -> String
getOrDefaultDict index dict =
    withDefault unknownWord (Dict.get index dict)


specialWord : String -> String
specialWord index =
    withDefault "" (Dict.get index specialWordDict)


arrayToTuple : Array String -> ( String, String )
arrayToTuple arr =
    ( getOrDefaultArr 0 arr, getOrDefaultArr 1 arr )


csvToTuple : String -> ( String, String )
csvToTuple line =
    split "," line |> Array.fromList |> arrayToTuple


wordList : List ( String, String )
wordList =
    lines csvContent |> List.map csvToTuple


specialWordList : List ( String, String )
specialWordList =
    lines csvSpecialWords |> List.map csvToTuple


swapWordList =
    map (\t -> ( second t, first t )) wordList


wordDict =
    Dict.fromList wordList


swapWordDict =
    Dict.fromList swapWordList


specialWordDict =
    Dict.fromList specialWordList


wordToHexa : Word -> String
wordToHexa s =
    case s of
        X w ->
            toHexa w |> join "C"

        C w ->
            toHexa w |> join "D"

        --2nd level ?
        N n ->
            cons 'A' n

        Unknown ->
            unknownHexa

        W w ->
            getOrDefaultDict w wordDict


wordToEng : Word -> String
wordToEng s =
    case s of
        X w ->
            toEng w |> join "/"

        C w ->
            toEng w |> join ":"

        --2nd level ?
        N n ->
            cons '#' n

        Unknown ->
            unknownHexa

        W w ->
            w


wordToFieldModel : Word -> FieldModel
wordToFieldModel s =
    let
        eng =
            wordToEng s

        hintStyle =
            specialWord eng
    in
    { text = eng, style = "a1", hint = hintStyle, hintStyle = hintStyle }


engToWord : String -> Word
engToWord s =
    if startsWith "#" s then
        N (dropLeft 1 s)

    else if contains "/" s then
        toComposedWordsX (split "/" s)
        -- TODO 2nd level :

    else if contains ":" s then
        toComposedWordsC (split ":" s)

    else if s == unknownWord then
        Unknown

    else
        W s


hexaToWord : String -> Word
hexaToWord s =
    if startsWith "A" s then
        N (dropLeft 1 s)

    else if contains "C" s then
        toComposedHexaC (split "C" s)
        -- TODO 2nd level :

    else if contains "D" s then
        toComposedHexaD (split "D" s)

    else if s == unknownWord then
        Unknown

    else
        W (getOrDefaultDict s swapWordDict)



-- https://www.w3schools.com/charsets/ref_utf_box.asp


hexaToVisual : String -> String
hexaToVisual s =
    split "0" s
        |> join "┼"
        |> split "1"
        |> join "╀"
        -- 0001
        |> split "2"
        |> join "┾"
        -- 0010
        |> split "3"
        |> join "╄"
        -- 0011
        |> split "4"
        |> join "╁"
        -- 0100
        |> split "5"
        |> join "╂"
        -- 0101
        |> split "6"
        |> join "╆"
        -- 0110
        |> split "7"
        |> join "╊"
        -- 0111
        |> split "8"
        |> join "┽"
        -- 1000
        |> split "9"
        |> join "┹"
        -- 1001
        |> split "A"
        |> join "┿"
        -- 1010
        |> split "B"
        |> join "╇"
        -- 1011
        |> split "C"
        |> join "╅"
        -- 1100
        |> split "D"
        |> join "╉"
        -- 1101
        |> split "E"
        |> join "╈"
        -- 1110
        |> split "F"
        |> join "◌"
        -- 1111
        |> split " "
        |> join "◌"



-- 1111


visualToHexa : String -> String
visualToHexa s =
    split "┼" s
        |> join "0"
        |> split "╀"
        |> join "1"
        -- 0001
        |> split "┾"
        |> join "2"
        -- 0010
        |> split "╄"
        |> join "3"
        -- 0011
        |> split "╁"
        |> join "4"
        -- 0100
        |> split "╂"
        |> join "5"
        -- 0101
        |> split "╆"
        |> join "6"
        -- 0110
        |> split "╊"
        |> join "7"
        -- 0111
        |> split "┽"
        |> join "8"
        -- 1000
        |> split "┹"
        |> join "9"
        -- 1001
        |> split "┿"
        |> join "A"
        -- 1010
        |> split "╇"
        |> join "B"
        -- 1011
        |> split "╅"
        |> join "C"
        -- 1100
        |> split "╉"
        |> join "D"
        -- 1101
        |> split "╈"
        |> join "E"
        -- 1110
        |> split "◌"
        |> join " "



-- 1111


hexaToCons : String -> String
hexaToCons s =
    case s of
        "0" ->
            "p"

        "1" ->
            "t"

        "2" ->
            "k"

        "3" ->
            "m"

        "4" ->
            "n"

        "5" ->
            "d"

        "6" ->
            "b"

        "7" ->
            "g"

        "8" ->
            "w"

        "9" ->
            "j"

        "A" ->
            "sɑː"

        "B" ->
            "goʊ"

        "C" ->
            "fʊ"

        "D" ->
            "zaɪ"

        "E" ->
            "yɛ"

        "F" ->
            " "

        " " ->
            " "

        "G" ->
            "!"

        _ ->
            "?"


hexaToVowels : String -> String
hexaToVowels s =
    case s of
        "0" ->
            "ɑː"

        "1" ->
            "ɛ"

        "2" ->
            "iː"

        "3" ->
            "oʊ"

        "4" ->
            "ʊ"

        "5" ->
            "aɪ"

        "6" ->
            "eɪ"

        "7" ->
            "ɪʃ"

        "8" ->
            "ɔɪ"

        "9" ->
            "juː"

        "A" ->
            "sɑː"

        "B" ->
            "goʊ"

        "C" ->
            "fʊ"

        "D" ->
            "zaɪ"

        "E" ->
            "yɛ"

        "F" ->
            " "

        " " ->
            " "

        "G" ->
            "ʌ"

        _ ->
            "?"


type Word
    = Unknown
    | N String
    | X (List Word)
    | C (List Word)
    | W String
