module InfoMetaTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string, maybe)
import Test exposing (..)
import InfoMeta exposing (InfoMeta, create, toString, fromString)
import Fuzzing as Fuzzing

badString : Fuzzer String
badString =
    ["!", "#", "(", "~", "]", ".", ",", "<", " "] |> Fuzzing.oneOfList

suite : Test
suite =
    describe "The InfoMeta Module"
    [
        describe "string conversion"
        [
            fuzz2 Fuzzing.alphaNum (maybe Fuzzing.refName) "should convert both ways" <|
                \name maybeRef ->
                    InfoMeta.toString (InfoMeta.create name maybeRef)
                    |> InfoMeta.fromString
                        |> Expect.equal (InfoMeta.create name maybeRef |> Ok)
        ]
        , describe "fromString validation"
        [
            fuzz3 Fuzzing.alphaNum (maybe Fuzzing.refName) badString "should fail name corruption" <|
                \name maybeRef corruptor ->
                    InfoMeta.toString (InfoMeta.create (Fuzzing.corruptWith corruptor name) maybeRef)
                    |> InfoMeta.fromString
                    |> Fuzzing.isErr
                    |> Expect.equal True
            , fuzz3 Fuzzing.alphaNum (Fuzzing.refName) badString "should fail ref corruption" <|
                \name ref corruptor ->
                    InfoMeta.toString (InfoMeta.create name (Fuzzing.corruptWith corruptor ref |> Just) )
                    |> InfoMeta.fromString
                    |> Fuzzing.isErr
                    |> Expect.equal True
        ]
    ]
