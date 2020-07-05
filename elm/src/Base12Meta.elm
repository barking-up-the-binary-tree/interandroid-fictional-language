module Base12Meta exposing (Base12Meta, reset, fromString, toArray, toString, validatePurpose, getInfoMeta)

import Base12 exposing (Base12(..))
import InfoMeta exposing (InfoMeta)


type alias Base12Meta =
    { name : String
    , zero : Maybe InfoMeta
    , one : Maybe InfoMeta
    , two : Maybe InfoMeta
    , three : Maybe InfoMeta
    , four : Maybe InfoMeta
    , five : Maybe InfoMeta
    , six : Maybe InfoMeta
    , seven : Maybe InfoMeta
    , eight : Maybe InfoMeta
    , nine : Maybe InfoMeta
    , ten : Maybe InfoMeta
    , eleven : Maybe InfoMeta
    }


reset : Base12Meta
reset =
    { name = "name-to-defined"
    , zero = Nothing
    , one = Nothing
    , two = Nothing
    , three = Nothing
    , four = Nothing
    , five = Nothing
    , six = Nothing
    , seven = Nothing
    , eight = Nothing
    , nine = Nothing
    , ten = Nothing
    , eleven = Nothing
    }


toArray : Base12Meta -> List (Maybe InfoMeta)
toArray m =
    [ m.zero, m.one, m.two, m.three, m.four, m.five, m.six, m.seven, m.eight, m.nine, m.ten, m.eleven ]


checkMax12 : String -> Bool
checkMax12 str =
    (String.words str |> List.length) <= 12


splitNameValues : String -> Result String ( String, List String )
splitNameValues str =
    case String.split "=" str of
        [ a, b ] ->
            if a |> String.trim |> InfoMeta.checkRef then
                if checkMax12 b then
                    Ok ( a |> String.trim, b |> String.trim |> String.words )

                else
                    "Should not exceed 12 values: " ++ str |> Err

            else
                "Invalid name while splitting: " ++ str |> Err

        _ ->
            "Split name and values failed for: " ++ str |> Err


padWithNothing : List (Maybe a) -> List (Maybe a)
padWithNothing list =
    list ++ List.repeat (12 - List.length list) Nothing


isErr : Result error value -> Bool
isErr result =
    case result of
        Ok _ ->
            False

        Err _ ->
            True


mergeError : List (Result String value) -> List String
mergeError results =
    results
        |> List.filter isErr
        |> List.map
            (\result ->
                case result of
                    Err error ->
                        error

                    _ ->
                        ""
            )


toMaybeInfoMeta : String -> Result String (Maybe InfoMeta)
toMaybeInfoMeta str =
    if str == "__" then
        Ok Nothing

    else
        InfoMeta.fromString str |> Result.map Just


valuesToInfoMeta : List String -> Result String (List (Maybe InfoMeta))
valuesToInfoMeta values =
    let
        results =
            List.map toMaybeInfoMeta values

        errors =
            mergeError results
    in
    if List.isEmpty errors then
        results |> List.map (Result.withDefault Nothing) |> padWithNothing |> Ok

    else
        errors |> String.join ";" |> Err


strToInfoMeta : ( String, List String ) -> Result String ( String, List (Maybe InfoMeta) )
strToInfoMeta keyValues =
    Tuple.second keyValues
        |> valuesToInfoMeta
        |> Result.map (Tuple.pair (Tuple.first keyValues))


toBase12Meta : ( String, List (Maybe InfoMeta) ) -> Base12Meta
toBase12Meta key12InfoMeta =
    case Tuple.second key12InfoMeta of
        [ a, b, c, d, e, f, g, h, i, j, k, l ] ->
            Base12Meta (Tuple.first key12InfoMeta) a b c d e f g h i j k l

        _ ->
            reset


fromString : String -> Result String Base12Meta
fromString str =
    splitNameValues str
        |> Result.andThen strToInfoMeta
        |> Result.map toBase12Meta


toStr : Maybe InfoMeta -> String
toStr maybeMeta =
    maybeMeta |> Maybe.map InfoMeta.toString |> Maybe.withDefault "__"


toString : Base12Meta -> String
toString meta =
    meta.name ++ "=" ++ (toArray meta |> List.map toStr |> String.join " ")

getInfoMeta : Base12Meta -> Base12 -> Maybe InfoMeta
getInfoMeta meta id =
    case id of
        Zero ->
            meta.zero

        One ->
            meta.one

        Two ->
            meta.two
        Three ->
            meta.three

        Four ->
            meta.four

        Five ->
            meta.five

        Six ->
            meta.six

        Seven ->
            meta.seven

        Eight ->
            meta.eight

        Nine ->
            meta.nine

        Ten ->
            meta.ten
        Eleven ->
            meta.eleven

        UnknownBase12 ->
            Nothing


getName : Base12Meta -> Base12 -> Maybe String
getName meta id =
    case id of
        Zero ->
            meta.zero |> Maybe.map .name

        One ->
            meta.one |> Maybe.map .name

        Two ->
            meta.two |> Maybe.map .name

        Three ->
            meta.three |> Maybe.map .name

        Four ->
            meta.four |> Maybe.map .name

        Five ->
            meta.five |> Maybe.map .name

        Six ->
            meta.six |> Maybe.map .name

        Seven ->
            meta.seven |> Maybe.map .name

        Eight ->
            meta.eight |> Maybe.map .name

        Nine ->
            meta.nine |> Maybe.map .name

        Ten ->
            meta.ten |> Maybe.map .name

        Eleven ->
            meta.eleven |> Maybe.map .name

        UnknownBase12 ->
            Nothing


getRef : Base12Meta -> Base12 -> Maybe String
getRef meta id =
    case id of
        Zero ->
            meta.zero |> Maybe.andThen .ref

        One ->
            meta.one |> Maybe.andThen .ref

        Two ->
            meta.two |> Maybe.andThen .ref

        Three ->
            meta.three |> Maybe.andThen .ref

        Four ->
            meta.four |> Maybe.andThen .ref

        Five ->
            meta.five |> Maybe.andThen .ref

        Six ->
            meta.six |> Maybe.andThen .ref

        Seven ->
            meta.seven |> Maybe.andThen .ref

        Eight ->
            meta.eight |> Maybe.andThen .ref

        Nine ->
            meta.nine |> Maybe.andThen .ref

        Ten ->
            meta.ten |> Maybe.andThen .ref

        Eleven ->
            meta.eleven |> Maybe.andThen .ref

        UnknownBase12 ->
            Nothing


validateConstant : Base12Meta -> List String
validateConstant base12Meta =
    let
        incorrect =
            toArray base12Meta |> List.filter (InfoMeta.checkConstant >> not)
    in
    if List.isEmpty incorrect then
        []

    else
        incorrect |> List.map (\maybe -> Maybe.map .name maybe |> Maybe.withDefault "?") |> (::) (base12Meta.name ++ " enum should contain constant")


validateSlice : Base12Meta -> List String
validateSlice base12Meta =
    let
        incorrect =
            toArray base12Meta |> List.filter (InfoMeta.checkSlice >> not)
    in
    if List.isEmpty incorrect then
        []

    else
        incorrect |> List.map (\maybe -> Maybe.map .name maybe |> Maybe.withDefault "?") |> (::) (base12Meta.name ++ " slice should contain references")


validateSwitch : Base12Meta -> List String
validateSwitch base12Meta =
    let
        incorrect =
            toArray base12Meta |> List.filter (InfoMeta.checkSwitch >> not)
    in
    if List.isEmpty incorrect then
        []

    else
        incorrect |> List.map (\maybe -> Maybe.map .name maybe |> Maybe.withDefault "?") |> (::) (base12Meta.name ++ " switch should contain references")


validatePurpose : Base12Meta -> List String
validatePurpose base12Meta =
    case String.left 1 base12Meta.name of
        "$" ->
            validateConstant base12Meta

        "@" ->
            validateSlice base12Meta

        "?" ->
            validateSwitch base12Meta

        _ ->
            []
