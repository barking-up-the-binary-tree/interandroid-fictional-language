module Phrasing exposing (..)

import WordInfo exposing (WordInfo)
import ReferenceModel exposing(ReferenceModel)

fictSep: Char
fictSep = '◌'

classicSeps: List Char
classicSeps = [' ', ',', ';', '.', '\n']

type alias CharAcc = {
    chars: List Char
    , words: List (List Char)
    }

containsFictionalSep: CharAcc -> Bool
containsFictionalSep acc =
    acc.chars |> List.member fictSep

containsClassicSep: CharAcc -> Bool
containsClassicSep acc =
    List.member (acc.chars |> List.head |> Maybe.withDefault 'A') classicSeps

checkFictionalChar: Char -> CharAcc -> CharAcc
checkFictionalChar ch acc =
    case [acc.chars |> List.isEmpty, containsFictionalSep acc, ch == fictSep] of
        [True, a, b] ->
            { acc | chars = List.singleton ch}
        [False, True, True] -> -- accumulating separators
             { acc | chars = ch :: acc.chars}
        [False, True, False] ->
             {acc | words = acc.chars :: acc.words, chars = List.singleton ch}
        [False, False, False] -> -- accumulating word chars
            { acc | chars = ch :: acc.chars}
        [False, False, True] ->
             {acc | words = acc.chars :: acc.words, chars = List.singleton ch}
        _ -> acc --should never happen

checkClassicChar: Char -> CharAcc -> CharAcc
checkClassicChar ch acc =
    case [acc.chars |> List.isEmpty, containsClassicSep acc, List.member ch classicSeps] of
        [True, a, b] ->
            { acc | chars = List.singleton ch}
        [False, True, True] -> -- accumulating separators
             { acc | chars = ch :: acc.chars}
        [False, True, False] ->
             {acc | words = acc.chars :: acc.words, chars = List.singleton ch}
        [False, False, False] -> -- accumulating word chars
            { acc | chars = ch :: acc.chars}
        [False, False, True] ->
             {acc | words = acc.chars :: acc.words, chars = List.singleton ch}
        _ -> acc --should never happen

toStringList: CharAcc -> List String
toStringList acc =
    if List.isEmpty acc.chars then
        acc.words |> List.map String.fromList
    else
        (acc.chars :: acc.words) |> List.map String.fromList

splitFictionalIntoWords: String -> List String
splitFictionalIntoWords str =
    str 
        |> String.toList 
        |> List.foldr checkFictionalChar { chars = [], words = []}
        |> toStringList

splitClassicIntoWords: String -> List String
splitClassicIntoWords str =
    str 
        |> String.toList 
        |> List.foldr checkClassicChar { chars = [], words = []}
        |> toStringList

fromFictionalString: ReferenceModel -> String -> List WordInfo
fromFictionalString refModel str =
    splitFictionalIntoWords str
     |> List.map (ReferenceModel.getWordInfo refModel)

toFictionalString: ReferenceModel -> List WordInfo -> String
toFictionalString refModel list =
     List.map .fictionalWord  list|> String.join ""

fromClassicString: ReferenceModel -> String -> List WordInfo
fromClassicString refModel str =
    splitClassicIntoWords str
     |> List.map (ReferenceModel.getWordInfoByClassic refModel)

toClassicString: ReferenceModel -> List WordInfo -> String
toClassicString refModel list =
    List.map (.translations >> List.head >> Maybe.withDefault "?") list|> String.join ""
