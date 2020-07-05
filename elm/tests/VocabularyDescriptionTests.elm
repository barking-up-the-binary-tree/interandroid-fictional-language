module VocabularyDescriptionTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import VocabularyDescription exposing(VocabularyDescription, fromString)
import Fuzzing as Fuzzing
import Dict

jsonFixture = """
[
    {
        "word": "╀╀╀",
        "description": "Some description"
    }
]
"""

descriptionFixture = VocabularyDescription "╀╀╀" "Some description"

suite : Test
suite =
    describe "The VocabularyDescription Module"
    [
        describe "fromString"
        [
            test "read from jsonString" <|
                \() ->
                    VocabularyDescription.fromString jsonFixture
                        |> Result.map (\dict -> Dict.get "╀╀╀" dict)
                        |> Expect.equal (Ok (Just (descriptionFixture.description)))
        ]

    ]
