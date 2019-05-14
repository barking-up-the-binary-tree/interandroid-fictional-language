module App exposing (Document, Metadata, Model, Msg(..), area, asStyle, colorInput, colorSection, columnChip, columnInfo, defaultModel, eCol, hexaToText, iCol, init, main, stylish, subscriptions, switchBox, tableInfo, tdChip, tdText, textToHexa, update, view)

{-| App


# Basics

-}

import Browser
import Dict exposing (fromList, get)
import FictionalLanguage exposing (FieldModel, engToHexa, hexaToEng, hexaToListFieldModel, hexaToPhonetic, hexaToVisual, visualToHexa)
import Html exposing (Html, div, fieldset, form, h2, h5, input, label, p, span, table, tbody, td, text, textarea, tr)
import Html.Attributes exposing (class, id, type_, value)
import Html.Events exposing (onClick, onInput)
import List exposing (map)
import Maybe exposing (withDefault)
import String exposing (join)


main =
    Browser.document
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }


type alias Model =
    { text : String
    , hexa : String
    , fromEng : Bool
    }


type alias Document msg =
    { title : String
    , body : List (Html msg)
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( defaultModel, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


defaultModel : Model
defaultModel =
    { text = "", hexa = "", fromEng = True }


stylish =
    fromList [ ( "conjunction", "chip" ), ( "verb-start", "chip" ), ( "verb-end", "chip" ) ]


asStyle : String -> String
asStyle index =
    withDefault "" (Dict.get index stylish)


type Msg
    = NewContent String
    | ToggleLanguage


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewContent text ->
            ( { model | text = text, hexa = textToHexa model.fromEng text }, Cmd.none )

        ToggleLanguage ->
            ( { model | fromEng = not model.fromEng, text = hexaToText model.fromEng model.hexa }, Cmd.none )


type alias Metadata =
    { title : String
    , id : String
    , fromEng : Bool
    }


area : String -> Metadata -> Html Msg
area str meta =
    div [ class "" ]
        [ div [ class "col s1" ]
            []
        , div [ class "col s11" ]
            [ h5 [ class (colorSection meta.fromEng) ]
                [ text meta.title ]
            , p [ class "flow-text validate", id meta.id ]
                [ text str ]
            ]
        ]



-- Colors


eCol =
    "amber"


iCol =
    "blue"


colorSection : Bool -> String
colorSection fromEng =
    if fromEng then
        join " " [ eCol, "lighten-2" ]

    else
        join " " [ iCol, "lighten-2" ]


colorInput : Bool -> String
colorInput fromEng =
    if fromEng then
        join " " [ "materialize-textarea", eCol, "lighten-4" ]

    else
        join " " [ "materialize-textarea", iCol, "lighten-4" ]


switchBox : msg -> String -> String -> Html msg
switchBox msg name1 name2 =
    div [ class "switch" ]
        [ label []
            [ text name1
            , input [ type_ "checkbox", onClick msg ]
                []
            , span [ class "lever" ]
                []
            , text name2
            ]
        ]


tdText : FieldModel -> Html Msg
tdText fmodel =
    td [ class (asStyle fmodel.style) ] [ text fmodel.text ]


tdChip : FieldModel -> Html Msg
tdChip fmodel =
    td [] [ div [ class (asStyle fmodel.hintStyle) ] [ text fmodel.hint ] ]


columnInfo : List FieldModel -> Html Msg
columnInfo list =
    tr [] (List.map tdText list)


columnChip : List FieldModel -> Html Msg
columnChip list =
    tr [] (List.map tdChip list)


tableInfo : Model -> List FieldModel -> Html Msg
tableInfo model trModel =
    div [ class "" ]
        [ div [ class "col s1" ]
            []
        , div [ class "col s11" ]
            [ h5 [ class (colorSection model.fromEng) ]
                [ text "Structure" ]
            , table []
                [ tbody []
                    [ columnInfo trModel
                    , columnChip trModel
                    ]
                ]
            ]
        ]


textToHexa : Bool -> String -> String
textToHexa fromEng text =
    if fromEng then
        engToHexa text

    else
        visualToHexa text


hexaToText : Bool -> String -> String
hexaToText fromEng hexa =
    if fromEng then
        hexaToVisual hexa

    else
        hexaToEng hexa


view : Model -> Document Msg
view model =
    let
        asHexa =
            textToHexa model.fromEng model.text

        asVisual =
            hexaToVisual asHexa

        asPhonetic =
            hexaToPhonetic asHexa

        asEng =
            hexaToEng asHexa

        asListFieldModel =
            hexaToListFieldModel asHexa
    in
    { title = "Interandroid-fictional-language"
    , body =
        [ div [ class "row" ]
            [ h2 [ class "orange-text text-accent-4" ] [ text "Translate" ]
            , form [ class "col s12" ]
                [ div [ class "row" ]
                    [ textarea [ class (colorInput model.fromEng), id "textarea1", onInput NewContent, value model.text ] []
                    , fieldset []
                        [ switchBox ToggleLanguage "English" "Interandroid" ]
                    , area asHexa { title = "Hexa", id = "disabled", fromEng = model.fromEng }
                    , area asVisual { title = "Visual", id = "disabled", fromEng = model.fromEng }
                    , area asPhonetic { title = "Phonetic", id = "disabled", fromEng = model.fromEng }
                    , area asEng { title = "English", id = "disabled", fromEng = model.fromEng }
                    , tableInfo model asListFieldModel
                    ]
                ]
            ]
        ]
    }
