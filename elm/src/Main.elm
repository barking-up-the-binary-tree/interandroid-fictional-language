module Main exposing(..)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onMouseOver, onInput, onCheck, onClick)
import Http
import Task exposing (Task)
import Applicative as Applicative
import DocumentId exposing(DocumentId(..), toRelativeUrl)
import WordInfo exposing (WordInfo, matchAnyWordType)
import WordType exposing (WordType(..))

-- MAIN

main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }
init : () -> (Applicative.Model, Cmd Msg)
init _ =
  (Applicative.reset, Task.attempt OnGotTasksBack (allTasks "en"))


-- UPDATE

type Msg = 
    OnFlipTranslationDir
    | OnGetWordInfo String
    | OnGotTasksBack (Result (List String) (List (DocumentId, String)))
    | OnChangeContent String

update : Msg -> Applicative.Model -> (Applicative.Model, Cmd Msg)
update msg model =
  case msg of
    OnFlipTranslationDir ->
      (Applicative.flipTranslation model, Cmd.none)
    
    OnGetWordInfo aboutWord ->
     ({ model | aboutWord =  Just aboutWord}, Cmd.none)

    OnChangeContent content ->
        (Applicative.changeContent content model , Cmd.none)

    OnGotTasksBack result ->
      case result of
        Ok taskDocs ->
           ( Applicative.load taskDocs model, Cmd.none)

        Err warnings ->
            ({ model | warnings = warnings }, Cmd.none)



-- SUBSCRIPTIONS


subscriptions : Applicative.Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW


view : Applicative.Model -> Html Msg
view model =
  div []
    [ viewHeader
    , viewLanguageDirection model
    , viewContent model
    , viewPrettyContent model
    , viewWordInfo model
    , viewWarnings model
    , viewFooter
    ]


viewHeader: Html Msg
viewHeader =
  div [ class "w-full bg-teal-900" ]
      [
      h2 [ class "text-5xl text-center"] [ span [ class "text-white tracking-widest p-3"] [text "TRANSLATE" ], span [ class "text-base text-white align-text-top"] [text "BETA" ]]
      ]


viewLanguageDirection: Applicative.Model -> Html Msg
viewLanguageDirection model =
  div [ class "container m-3 mx-auto" ]
    [ div [ class "flex flex-wrap text-center bg-gray-200"]
      [ div [ class "w-1/3 p-1"]
        [
          button [ class "text-white bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg text-base" , onClick OnFlipTranslationDir] [ text "⇄"]
        ],
        div [ class "w-1/3 p-1"]
        [
          h3 [ class "title-font font-medium sm:text-4xl text-3xl text-gray-900" ] [text (model.wordInfoList |> List.filter (matchAnyWordType [WordSeparator, ClauseSeparator, SentenceClauseSeparator, SentenceSeparator, ParagraphSeparator] >> not)|> List.length |> String.fromInt)]
          , p [ class "leading-relaxed"] [text "Words"]
        ],
        div [ class "w-1/3 p-1"]
        [
          h3 [ class "title-font font-medium sm:text-4xl text-3xl text-gray-900" ] [text (model.wordInfoList |> List.filter (matchAnyWordType [SentenceSeparator])|> List.length |> (+) 1 |> String.fromInt)]
          , p [ class "leading-relaxed"] [text "Sentences"]
        ]
      ]
    ]
viewContent: Applicative.Model -> Html Msg
viewContent model =
  div [ class "w-full m-3" ]
      [
      textarea [ onInput OnChangeContent, value model.content, class "appearance-none block w-full h-auto bg-gray-200 text-gray-700 border border-blue-500 rounded leading-tight focus:outline-none focus:bg-white", rows 8 ] []
      ]


firstTranslation: WordInfo -> String
firstTranslation wordInfo =
    List.head wordInfo.translations |> Maybe.withDefault "???"

viewPrettyWordType: WordType -> Html Msg
viewPrettyWordType wordType =
    case wordType of
        UnkwnownWord -> span [class "font-thin text-red-800 align-text-top text-xs"] [ text "(?)"]
        IncorrectWord -> span [class "font-thin text-red-800 align-text-top text-xs"] [ text "(??)"]
        WordSeparator -> span [] []
        ClauseSeparator -> span [] []
        SentenceClauseSeparator -> span [] []
        SentenceSeparator -> span [] []
        ParagraphSeparator -> span [] []
        NounType -> span [ class "font-thin text-gray-500 align-text-top text-xs"] [ text "(N)"]
        VerbType -> span [ class "font-thin text-blue-500 align-text-top text-xs"] [ text "(V)"]
        AdjectiveType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(Adj)"]
        AdverbType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(Adv)"]
        PronounType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(P)"]
        PrepositionType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(Pre)"]
        ConjunctionType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(Cj)"]
        DeterminerType -> span [class "font-thin text-gray-500 align-text-top text-xs"] [ text "(D)"]

viewPrettyWordTypeExplicit: WordType -> Html Msg
viewPrettyWordTypeExplicit wordType =
    case wordType of
        UnkwnownWord -> span [class "bg-gray-900 text-red-400 px-1 py-1 rounded"] [ text "Unknown word"]
        IncorrectWord -> span [class "bg-gray-900 text-red-400 px-1 py-1 rounded"] [ text "Incorrect word"]
        WordSeparator -> span [] []
        ClauseSeparator -> span [] []
        SentenceClauseSeparator -> span [] []
        SentenceSeparator -> span [] []
        ParagraphSeparator -> span [] []
        NounType -> span [ class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Noun"]
        VerbType -> span [ class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Verb"]
        AdjectiveType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Adjective"]
        AdverbType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Adverb"]
        PronounType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Pronoun"]
        PrepositionType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Preposition"]
        ConjunctionType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Conjunction"]
        DeterminerType -> span [class "bg-gray-900 text-white px-1 py-1 rounded"] [ text "Determiner"]

viewPrettyWordInfoClass: WordInfo -> String
viewPrettyWordInfoClass wordInfo =
      case wordInfo.wordType of
        UnkwnownWord -> ""
        IncorrectWord -> ""
        WordSeparator -> ""
        ClauseSeparator -> ""
        SentenceClauseSeparator -> ""
        SentenceSeparator -> ""
        ParagraphSeparator -> ""
        NounType -> "text-blue-800"
        VerbType -> "border-b-2 text-teal-800"
        AdjectiveType -> ""
        AdverbType -> ""
        PronounType -> ""
        PrepositionType -> ""
        ConjunctionType -> ""
        DeterminerType -> ""

viewPrettyWordInfo: WordInfo -> Html Msg
viewPrettyWordInfo wordInfo =
    if  wordInfo.wordType == ParagraphSeparator then
      p [] []
    else [viewPrettyWordType wordInfo.wordType, span [ class (viewPrettyWordInfoClass wordInfo), onMouseOver (OnGetWordInfo wordInfo.fictionalWord)] [ text <| firstTranslation wordInfo]] |> span [ class "hover:bg-yellow-400"]
viewPrettyContent: Applicative.Model -> Html Msg
viewPrettyContent model =
  model.wordInfoList |> List.map viewPrettyWordInfo |> div [ class "w-full m-3" ]


viewWordInfo: Applicative.Model -> Html Msg
viewWordInfo model =
  case Applicative.getWordInfo model of
    Nothing ->
        div [ class "w-full" ][]
    Just wordInfo ->
        div [ class "box-border border-4 border-gray-400 bg-gray-200 w-1/2 m-3"] [
          div [ class "w-full bg-gray-200 p-6" ][
              h3 [ class "font-mono text-black text-xl"] [ text wordInfo.fictionalWord]
            , [ span [class "text-black text-xl mr-1"] [ text (wordInfo.translations |> String.join " or ")], viewPrettyWordTypeExplicit wordInfo.wordType, span [ class "text-gray-700 ml-1 text-xl"] [text wordInfo.phonetic]] |> p[]
            , [ span [ class "text-gray-700"] [ text "origin: "], span [ class "text-gray-700"] [ text (wordInfo.origin |> Maybe.withDefault "")]] |> p[]
            , [ span [ class "text-blue-700"] [ text (wordInfo.description |> Maybe.withDefault "")]] |> p[ class "mt-1"]
            , [ span [ class "text-blue-500"] [ text (wordInfo.altDescription |> Maybe.withDefault "")]] |> p[ class "mt-1"]
            ]
        ]
      

viewWarnings: Applicative.Model -> Html Msg
viewWarnings model =
  if List.isEmpty model.warnings then
    div [] []
  else 
    div [ attribute "role" "alert" ]
      [ div [ class "bg-red-500 text-white font-bold rounded-t px-4 py-2" ]
          [ text "Danger  " ]
      , div [ class "border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700" ]
          [ p []
              [ text <| (model.warnings |> String.join ";")]
          ]
      ]

viewFooter: Html Msg
viewFooter =
  footer [ class "w-full bg-purple-200 bottom-0 m-3" ]
      [ div [ class "m-4"]
          [ p [ class "text-purple-800 text-sm"]
              [ strong [ class "font-bold"]
                  [ text "Interandroid Communication Language" ]
              , text " by "
              , a [ class "underline", href "https://github.com/olih" ]
                  [ text "Olivier Huin" ]
              , text ". The language and the use of the language itself will have a very open license (to be discussed) in the spirit of "
              , a [ href "https://creativecommons.org/share-your-work/public-domain/cc0/" ]
                  [ span [] [ text "the public domain "], span [ class "font-bold" ] [ text " CC0 "], span [ class "underline"] [ text " No Rights Reserved"] ]
              , text ". The definition of each word in the dictionary should be licensed under "
              , a [ class "underline", href "https://creativecommons.org/licenses/by-sa/4.0/" ]
                  [ text "Creative Commons Attribution-ShareAlike 4.0 International License" ]
              , text "."
              ],
              p [ class "text-purple-800 text-sm"]
              [ text "A complete list of the vocabulary is "
              , a [ class "underline", href "https://github.com/barking-up-the-binary-tree/interandroid-fictional-language/blob/master/docs/data/en/core-vocabulary-translation.csv" ]
                  [ text "available here" ]
              ]      
          ]
      ]

-- HTTP

handleStringResponse : DocumentId -> Http.Response String -> Result (List String) (DocumentId, String)
handleStringResponse docId response =
    case response of
        Http.BadUrl_ url ->
            ["Bad Url "++url] |> Err

        Http.Timeout_ ->
            ["Timeout"] |> Err

        Http.BadStatus_ { statusCode } _ ->
             ["Bad status "++String.fromInt statusCode] |> Err

        Http.NetworkError_ ->
            ["Network error"] |> Err

        Http.GoodStatus_ _ body ->
            Ok (docId, body)

taskReferenceModel : String -> DocumentId -> Task (List String) (DocumentId, String)
taskReferenceModel lang docId =
    Http.task
      { method = "GET"
      , headers = []
      , body = Http.emptyBody
      , timeout = Nothing
      , url = toRelativeUrl lang docId
      , resolver = Http.stringResolver <| handleStringResponse docId
      }

allTasks: String -> Task (List String) (List (DocumentId, String))
allTasks lang =
    [
        taskReferenceModel lang AttributionDoc
        , taskReferenceModel lang DescriptionDoc
        , taskReferenceModel lang MediaDoc
        , taskReferenceModel lang TranslationDoc
        , taskReferenceModel lang CoreDoc
    ] |> Task.sequence