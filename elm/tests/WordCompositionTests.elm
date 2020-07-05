module WordCompositionTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string, maybe)
import Test exposing (..)
import WordComposition exposing (WordComposition)
import Fuzzing as Fuzzing

--disable string conversion 2nd level for performance reasons

create1stLevel: List String -> WordComposition
create1stLevel words =
    if List.length words > 1 then
        words 
            |> List.map WordComposition.createSingle
            |> WordComposition.createComposite
    else
        words 
            |> List.head 
            |> Maybe.withDefault "" 
            |> WordComposition.createSingle 

create2ndLevel: List (List String) -> WordComposition
create2ndLevel words =
    if List.length words > 1 then
        words |> List.map create1stLevel |> WordComposition.createComposite
    else
        words 
            |> List.head
            |> Maybe.withDefault ([])
            |> create1stLevel 

example1 = "alpha:::beta:charlie:::zulu::one:two"

suite : Test
suite =
    describe "The WordComposition Module"
    [
        describe "string conversion 1st level"
        [
            fuzz (Fuzzing.nonEmptyList Fuzzing.alphaNum) "should convert both ways" <|
                \words ->
                    WordComposition.toString ":" (create1stLevel words)
                    |> WordComposition.fromString ":"
                        |> Expect.equal (create1stLevel words)
        ]
        -- , describe "string conversion 2nd level"
        -- [
        --     fuzz (Fuzzing.nonEmptyList (Fuzzing.nonEmptyList Fuzzing.alphaNum)) "should convert both ways" <|
        --         \words ->
        --             WordComposition.toString ":" (create2ndLevel words)
        --             |> WordComposition.fromString ":"
        --                 |> Expect.equal (create2ndLevel words)
        -- ]
        , describe "string conversion 0nd lvel"
        [
            fuzz Fuzzing.alphaNum "should convert both ways" <|
                \str ->
                    WordComposition.fromString ":" str
                    |> WordComposition.toString ":"
                        |> Expect.equal str
        ]       
        , describe "manual example"
        [
            test "should convert both ways" <|
                \() ->
                    WordComposition.fromString ":" example1
                    |> WordComposition.toString ":"
                        |> Expect.equal example1
       ]
    ]
