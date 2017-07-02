module FromEnglish
  exposing(engToHexa, hexaToVisual, hexaToPhonetic)
{-| FromEnglish

# Basics
@docs

-}

import List exposing (map, member, all, range)
import String exposing (join, split, words, cons, contains, startsWith, dropLeft, foldr)
import Tuple exposing (first, second)

zip : List a -> List b -> List (a,b)
zip xs ys =
  case (xs, ys) of
    ( x :: xBack, y :: yBack ) ->
        (x,y) :: zip xBack yBack

    (_, _) ->
        []


wordJoinX: (List Word) -> String
wordJoinX list = toHexa(list) |> join "C"

wordJoinC: (List Word) -> String
wordJoinC list = toHexa(list) |> join "D"

toHexa: List(Word) -> List(String)
toHexa s = map wordToHexa s

toComposedWordsX: (List String) -> Word
toComposedWordsX list =
  X (map engToWord list)

toComposedWordsC: (List String) -> Word
toComposedWordsC list =
  C (map engToWord list)


digitOrComposed: String -> Word
digitOrComposed s =
  if startsWith "#" s then
    N (dropLeft 1 s)
  else if contains "/" s then
    toComposedWordsX (split "/" s)
  else if contains ":" s then
    toComposedWordsC (split ":" s)
  else
    Unknown

isEven: Int -> Bool
isEven n = n%2==0

engToHexa: String -> String
engToHexa s =
  (words s) |> map engToWord |> toHexa |> join " "

hexaToConsOrVowel: (String, Bool) -> String
hexaToConsOrVowel tuple =
  let
    (char, isVowel) = tuple
  in
    if isVowel then hexaToVowels char else hexaToCons char

wordToPhonetic: String -> String
wordToPhonetic s =
  let
    w = split "" s
    evenWord = if isEven (List.length w) then w else w ++ ["G"]
    index = range 1 (List.length evenWord)
    isVowel = map isEven index
    pairs = zip evenWord isVowel
  in
    pairs |> map hexaToConsOrVowel |> join ""

composedToPhonetic: String -> String
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


hexaToPhonetic: String -> String
hexaToPhonetic s =
  map composedToPhonetic (words s) |> join " "

wordToHexa: Word -> String
wordToHexa s =
  case s of
  X w -> wordJoinX(w)
  C w -> wordJoinC(w)
  N n -> cons 'A' n
  Unknown -> "??"
  FictLang -> "0123"
  Yes -> "99"
  No -> "4"
  -- PYTHON: wordToHexa

engToWord: String -> Word
engToWord s =
  case s of
  "unknown" -> Unknown
  "yes" -> Yes
  "no" -> No
  "fictlang" -> FictLang
  -- PYTHON: engToWord
  _ -> digitOrComposed(s)


-- https://www.w3schools.com/charsets/ref_utf_box.asp
hexaToVisual: String -> String
hexaToVisual s =
 split "0" s |> join "┼"
 |> split "1" |> join "╀" -- 0001
 |> split "2" |> join "┾" -- 0010
 |> split "3" |> join "╄" -- 0011
 |> split "4" |> join "╁" -- 0100
 |> split "5" |> join "╂" -- 0101
 |> split "6" |> join "╆" -- 0110
 |> split "7" |> join "╊" -- 0111
 |> split "8" |> join "┽" -- 1000
 |> split "9" |> join "┹" -- 1001
 |> split "A" |> join "┿" -- 1010
 |> split "B" |> join "╇" -- 1011
 |> split "C" |> join "╅" -- 1100
 |> split "D" |> join "╉" -- 1101
 |> split "E" |> join "╈" -- 1110
 |> split "F" |> join "◌" -- 1111
 |> split " " |> join "◌" -- 1111

hexaToCons: String -> String
hexaToCons s =
  case s of
  "0" -> "p"
  "1" -> "t"
  "2" -> "k"
  "3" -> "m"
  "4" -> "n"
  "5" -> "d"
  "6" -> "b"
  "7" -> "g"
  "8" -> "w"
  "9" -> "j"
  "A" -> "sɑː"
  "B" -> "goʊ"
  "C" -> "fʊ"
  "D" -> "zaɪ"
  "E" -> "yɛ"
  "F" -> " "
  " " -> " "
  "G" -> "!"
  _ -> "?"

hexaToVowels: String -> String
hexaToVowels s =
  case s of
  "0" -> "ɑː"
  "1" -> "ɛ"
  "2" -> "iː"
  "3" -> "oʊ"
  "4" -> "ʊ"
  "5" -> "aɪ"
  "6" -> "eɪ"
  "7" -> "ɪʃ"
  "8" -> "ɔɪ"
  "9" -> "juː"
  "A" -> "sɑː"
  "B" -> "goʊ"
  "C" -> "fʊ"
  "D" -> "zaɪ"
  "E" -> "yɛ"
  "F" -> " "
  " " -> " "
  "G" -> "ʌ"
  _ -> "?"


type Word
 = Unknown
  | N String
  | X (List Word)
  | C (List Word)
  | Yes
  | No
  | FictLang
-- PYTHON: type Word
