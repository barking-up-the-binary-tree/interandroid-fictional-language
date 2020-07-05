module AttributionTests exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Test exposing (..)
import Attribution exposing(Attribution, fromString)
import Dict

jsonFixture = """
[
    {
        "id": "attrib:attr1",
        "attributionName": "First Last Name",
        "attributionURL": "https://website.com/attr",
        "licenseName": "Creative Commons Attribution-ShareAlike 4.0 International License",
        "licenseURL": "https://creativecommons.org/licenses/by-sa/4.0/"
    }
]
"""

attributionFixture = Attribution "attrib:attr1" "First Last Name" "https://website.com/attr" "Creative Commons Attribution-ShareAlike 4.0 International License" "https://creativecommons.org/licenses/by-sa/4.0/"

suite : Test
suite =
    describe "The Attribution Module"
    [
        describe "fromString"
        [
            test "read from jsonString" <|
                \() ->
                    Attribution.fromString jsonFixture
                        |> Result.map (\dict -> Dict.get "attrib:attr1" dict)
                        |> Expect.equal (Ok (Just attributionFixture))
        ]

    ]
