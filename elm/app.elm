module App
  exposing(..)
{-| App

# Basics
@docs

-}

import Html exposing (Html, Attribute, beginnerProgram, text, div, input, form, textarea, label, h2, h5)
import Html.Attributes exposing (placeholder, style, class, id , for)
import Html.Events exposing (onInput)
import FromEnglish exposing(engToHexa, hexaToVisual, hexaToPhonetic)



main =
  beginnerProgram { model = "", view = view, update = update }

type Msg = NewContent String

update (NewContent content) oldContent =
  content

type alias Metadata = { title : String }

area: String -> Metadata -> Html Msg
area str meta =
    div [ class "purple lighten-3" ]
      [ div [ class "purple lighten-2 col s3" ]
        [ h5 []
          [ text meta.title]
        ],
        div [ class "input-field col s9" ]
          [ textarea [ class "materialize-textarea", id "textarea1" ]
           [text str]
          ]
       ]


view content =
  let
    asHexa = engToHexa(content)
    asVisual = hexaToVisual(asHexa)
    asPhonetic = hexaToPhonetic(asHexa)
  in
  div [ class "row" ]
      [
        h2 [] [ text "Translate"]
        , form [ class "col s12" ]
        [  div [ class "row" ]
          [ textarea [ class "materialize-textarea purple lighten-5", id "textarea1" , onInput NewContent][]
          , area asHexa { title = "Hexa" }
          , area asVisual { title = "Visual" }
          , area asPhonetic { title = "Phonetic" }
          ]
        ]
      ]
