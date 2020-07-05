module Base12Tests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import Base12 exposing(Base12)
import Fuzzing as Fuzzing

base12 : Fuzzer Base12
base12 = Base12.asList |> Fuzzing.oneOfList

suite : Test
suite =
    describe "The Base12 Module"
    [
        describe "char conversion"
        [
            fuzz Fuzzing.droidBase12 "should convert both ways" <|
                \value ->
                    Base12.fromDroidChar value
                    |> Base12.toDroidChar
                        |> Expect.equal value
        ]
        , describe "string conversion"
        [
            fuzz Fuzzing.stringBase12 "should convert both ways" <|
                \value ->
                    Base12.fromString value
                    |> Base12.toString
                        |> Expect.equal value
        ]
        , describe "starts with"
        [
            fuzz3 base12 (list base12) (list base12) "should be true" <|
                \ a prefix suffix ->
                    Base12.startsWith (a :: prefix) (a :: (prefix ++ suffix))
                    |> Expect.equal True
        ]



    ]
