module MorphemeTests exposing (..)

import Expect
import Fuzz exposing (Fuzzer)
import Test exposing (..)
import Morpheme exposing (fromString, toString)
import Fuzzing as Fuzzing
import FictionalMorpheme_en exposing (fictionalMorphemeData_en)
import WordType exposing (WordType(..))

badString : Fuzzer String
badString =
    ["!", "#", "(", "~", "]", ".", ",", "<"] |> Fuzzing.oneOfList

ignoreMinorDiff: String -> String
ignoreMinorDiff str =
    String.replace "__" "" str
    |> String.replace " " ""
    |> String.replace "\n" ""

fictionalString : Fuzzer String
fictionalString =
    fictionalMorphemeData_en |> String.lines |> List.filter (String.isEmpty >> not) |> Fuzzing.oneOfList

coreWords : Fuzzer (String, String)
coreWords =
    [
        ("0004", "Noun AllConcept GeneralConcept Person"),
        ("1", "Verb Tense=Future Verb=ActionOf Management=Inspect Adverb=Badly Concept=Organic=Bird")
        ] |> Fuzzing.oneOfList

fictionalWord : Fuzzer String
fictionalWord =
    ["╄┼╁", "┼┼╀╇", "┼┼╆┽╀╀", "╀╂┼┼╃╆┽┼╇"] |> Fuzzing.oneOfList

adjectiveWord : Fuzzer String
adjectiveWord =
    ["┾┼┼╂╇┾╊", "┾╀┼╃┼┼┽"] |> Fuzzing.oneOfList

suite : Test
suite =
    describe "The Morpheme Module"
    [
        describe "test with fictional data"
        [
            test "simple conversion should be successful" <|
                \() ->
                    Morpheme.fromString fictionalMorphemeData_en
                    |> Fuzzing.isErr
                    |> Expect.equal False
           
            , test "double conversion should be successful" <|
                \() ->
                    Morpheme.fromString fictionalMorphemeData_en
                    |> Result.map (Morpheme.toString >> ignoreMinorDiff)
                    |> Expect.equal (fictionalMorphemeData_en |> ignoreMinorDiff |> Ok)
        ]
        , describe "test with corrupted fictional data"
        [
            fuzz badString "corrupted data should be rejected" <|
                \corruptor ->
                    Morpheme.fromString (Fuzzing.corruptWith corruptor fictionalMorphemeData_en)
                    |> Fuzzing.isErr
                    |> Expect.equal True
        ]
        , describe "test coherence of references"
        [
            fuzz fictionalString "duplicate should be rejected" <|
                \duplicate ->
                    Morpheme.fromString (fictionalMorphemeData_en ++ "\n" ++ duplicate )
                    |> Fuzzing.isErr
                    |> Expect.equal True
        ]
         , describe "check origin"
        [
            fuzz fictionalWord "any word from the micro vocabulary should have an origin" <|
                \fictword ->
                    Morpheme.checkOrigin (Morpheme.fromString fictionalMorphemeData_en |> Result.withDefault Morpheme.createDefault) fictword
                    |> String.split " "
                    |> List.length
                    |> Expect.equal (String.length fictword)
        ]
         , describe "check word type"
        [
            fuzz adjectiveWord "any adjective from the micro vocabulary should have the adjective type" <|
                \fictword ->
                    Morpheme.checkWordType fictword
                    |> Expect.equal AdjectiveType
        ]

   ]
