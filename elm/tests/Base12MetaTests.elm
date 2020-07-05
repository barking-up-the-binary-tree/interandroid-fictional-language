module Base12MetaTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string, maybe, tuple)
import Test exposing (..)
import InfoMeta exposing(InfoMeta)
import Base12Meta exposing (Base12Meta, toString, fromString)
import Fuzzing as Fuzzing
import Tuple exposing (first, second)
import FictionalMorpheme_en exposing (fictionalMorphemeData_en)

badString : Fuzzer String
badString =
    ["!", "#", "(", "~", "]", ".", ",", "<"] |> Fuzzing.oneOfList

fictionalString : Fuzzer String
fictionalString =
    fictionalMorphemeData_en |> String.lines |> List.filter (String.isEmpty >> not) |> Fuzzing.oneOfList

createMaybeInfoMeta: Maybe String -> Maybe String -> Maybe InfoMeta
createMaybeInfoMeta maybeLabel maybeRef =
    maybeLabel |> Maybe.map (\label -> InfoMeta label maybeRef)

createBase12Meta: String -> Maybe String -> Maybe String -> Maybe String -> Maybe String -> Base12Meta
createBase12Meta name maybeLabel1 maybeRef1 maybeLabel2 maybeRef2 =
     {
    name = name
    , zero = createMaybeInfoMeta maybeLabel1 maybeRef1
    , one = createMaybeInfoMeta maybeLabel2 maybeRef2
    , two = createMaybeInfoMeta maybeLabel1 maybeRef1
    , three = createMaybeInfoMeta maybeLabel2 maybeRef2
    , four = createMaybeInfoMeta maybeLabel1 maybeRef1
    , five = createMaybeInfoMeta maybeLabel2 maybeRef2
    , six = createMaybeInfoMeta maybeLabel1 maybeRef1
    , seven = createMaybeInfoMeta maybeLabel2 maybeRef2
    , eight = createMaybeInfoMeta maybeLabel1 maybeRef1
    , nine = createMaybeInfoMeta maybeLabel2 maybeRef2
    , ten = createMaybeInfoMeta maybeLabel1 maybeRef1
    , eleven = createMaybeInfoMeta maybeLabel2 maybeRef2
    }

removeTrailingUnderscores: String -> String
removeTrailingUnderscores str =
    if (String.endsWith " __" str) then
        String.dropRight 3 str |> removeTrailingUnderscores
    else
        str

suite : Test
suite =
    describe "The Base12Meta Module"
    [
        describe "string conversion"
        [
            fuzz3 Fuzzing.refName (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) "should convert both ways" <|
                \name one two  ->
                    Base12Meta.toString (createBase12Meta name (first one) (second one) (first two) (second two))
                    |> Base12Meta.fromString
                        |> Expect.equal ( createBase12Meta name (first one) (second one) (first two) (second two) |> Ok)
            , fuzz3 Fuzzing.refName (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) "should convert both ways removing trailing __" <|
                \name one two  ->
                    Base12Meta.toString (createBase12Meta name (first one) (second one) (first two) (second two))
                    |> removeTrailingUnderscores
                    |> Base12Meta.fromString
                        |> Expect.equal ( createBase12Meta name (first one) (second one) (first two) (second two) |> Ok)
        ]
         , describe "string conversion with validation"
        [
            fuzz3 (tuple (Fuzzing.refName, badString)) (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) "validate name" <|
                \nameCorr one two ->
                    Base12Meta.toString (createBase12Meta (Fuzzing.corruptWith (second nameCorr) (first nameCorr)) (first one) (second one) (first two) (second two))
                    |> Base12Meta.fromString
                    |> Fuzzing.isErr
                    |> Expect.equal True
            , fuzz3 (tuple (Fuzzing.refName, badString)) (tuple (Fuzzing.alphaNum, Fuzzing.refName)) (tuple (maybe Fuzzing.alphaNum, maybe Fuzzing.refName)) "validate ref" <|
                \nameCorr one two ->
                    Base12Meta.toString (createBase12Meta (first nameCorr) (first one |> Just) (Fuzzing.corruptWith (second nameCorr) (second one) |> Just) (first two) (second two))
                    |> Base12Meta.fromString
                    |> Fuzzing.isErr
                    |> Expect.equal True
        ]
         , describe "test with fictional data"
        [
            fuzz fictionalString "should be succcessful" <|
                \str ->
                    Base12Meta.fromString str
                    |> Fuzzing.isErr
                    |> Expect.equal False
        ]
   ]
