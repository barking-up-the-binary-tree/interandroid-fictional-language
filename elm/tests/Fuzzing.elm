module Fuzzing exposing (oneOfList, nonEmptyList, droidBase12, stringBase12, refName, alpha, alphaNum, isErr, corruptWith)

import Fuzz as Fuzz exposing (Fuzzer, custom, intRange, list)
import Base12 exposing (Base12(..))

oneOfList: List a -> Fuzzer a
oneOfList list =
    List.map Fuzz.constant list |> Fuzz.oneOf

nonEmptyList: Fuzzer a -> Fuzzer (List a)
nonEmptyList tofuzz =
   list tofuzz |> Fuzz.map2 (\one base-> one :: base) tofuzz
  
base12Char : List Char
base12Char = ['┼', '╀', '┾', '╄', '╁', '╂', '╆', '╊', '┽', '╃', '┿', '╇']

upperChar : List Char
upperChar =  List.range 65 90 |> List.map Char.fromCode

lowerChar : List Char
lowerChar =  List.range 97 122 |> List.map Char.fromCode

digitChar : List Char
digitChar =  List.range 48 57 |> List.map Char.fromCode

nonEmptyString : List Char -> Fuzzer String
nonEmptyString allowedChars =
   allowedChars |> oneOfList
   |> list
   |> Fuzz.map2 (\prefix base-> prefix :: base) (allowedChars |> oneOfList)
   |> Fuzz.map String.fromList 

droidBase12 : Fuzzer Char
droidBase12 = base12Char |> oneOfList

dashName : Fuzzer String
dashName =
   lowerChar ++ digitChar ++ ['-'] |> nonEmptyString

refPrefix : Fuzzer String
refPrefix =
    ["$", "@", "?"] |> oneOfList

refName : Fuzzer String
refName =
   Fuzz.map2 (\p str -> p ++ str) refPrefix dashName 

alphaNum: Fuzzer String
alphaNum =
   lowerChar ++ upperChar ++ digitChar |> nonEmptyString

alpha: Fuzzer String
alpha =
   lowerChar ++ upperChar |> nonEmptyString

stringBase12 : Fuzzer String
stringBase12 = base12Char |> nonEmptyString

isErr : Result error value -> Bool
isErr result =
    case result of
        Ok value -> False
        Err error -> True

corruptWith: String -> String -> String
corruptWith corruptor str =
    corruptor ++ str ++ corruptor
