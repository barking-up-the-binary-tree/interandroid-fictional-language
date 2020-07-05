module MediaContentTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import MediaContent exposing(MediaContent, fromString)
import Fuzzing as Fuzzing
import Dict

jsonFixture = """
[
    {
        "word": "╀╀╀",
        "title": "Some title",
        "contentURL": "https://website.com/content",
        "encodingFormat": "image/jpeg",
        "attributionId": "attrib:attrib1"
    }
]
"""

mediaFixture = MediaContent "╀╀╀" "Some title" "https://website.com/content" "image/jpeg" "attrib:attrib1"

suite : Test
suite =
    describe "The MediaContent Module"
    [
        describe "fromString"
        [
            test "read from jsonString" <|
                \() ->
                    MediaContent.fromString jsonFixture
                        |> Result.map (\dict -> Dict.get "╀╀╀" dict)
                        |> Expect.equal (Ok (Just [mediaFixture]))
        ]

    ]
