module ReferenceModel exposing (ReferenceModel, getWordInfoByDict, createDefault, loadWordInfo, setDescription, setAttribution, setMediaContent, setMorphemeLaw, getWordInfo, getWordInfoByClassic, loadTranslation)

import Dict exposing (Dict)
import Tuple exposing (first)
import MediaContent exposing (MediaContent)
import Attribution exposing (Attribution)
import Morpheme exposing (MorphemeLaw)
import WordInfo exposing (WordInfo)
import Base12 as Base12
import VocabularyTranslation as VocabularyTranslation

type alias ReferenceModel = {
    classicLanguage: String --en fr
    , translation: Dict String (List String)
    , reverseTranslation: Dict String (List String)
    , description: Dict String String
    , altDescription: Dict String String
    , mediaContent: Dict String (List MediaContent)
    , attribution: Dict String Attribution
    , morphemeLaw: MorphemeLaw
    , wordInfo: Dict String WordInfo
    , reverseWordInfo: Dict String WordInfo
 }

createDefault: ReferenceModel
createDefault = 
    {
    classicLanguage = "en"
    , translation = Dict.empty
    , reverseTranslation = Dict.empty
    , description = Dict.empty
    , altDescription = Dict.empty
    , mediaContent = Dict.empty
    , attribution = Dict.empty
    , morphemeLaw = Morpheme.createDefault
    , wordInfo = Dict.empty
    , reverseWordInfo = Dict.empty
    }

deduceWordInfo: ReferenceModel -> String -> (String, WordInfo)
deduceWordInfo refModel fictWord =
    (fictWord,
        {
        fictionalWord = fictWord
        , origin = Morpheme.checkOrigin refModel.morphemeLaw fictWord |> Just
        , phonetic = fictWord |> Base12.fromString |> Base12.toDroidPhonetic
        , translations = refModel.translation |> Dict.get fictWord |> Maybe.withDefault []
        , mediaContents = refModel.mediaContent |> Dict.get fictWord |> Maybe.withDefault []
        , description = refModel.description |> Dict.get fictWord
        , altDescription = refModel.altDescription |> Dict.get fictWord
        , wordType = Morpheme.checkWordType fictWord
        }
    )

loadTranslation: List (String, String) -> ReferenceModel -> ReferenceModel
loadTranslation list refModel =
   let
       translationDict = VocabularyTranslation.toDict list
       translationReverseDict = VocabularyTranslation.toReverseDict list
   in
    { refModel | translation = translationDict, reverseTranslation = translationReverseDict}


loadWordInfo: ReferenceModel -> ReferenceModel
loadWordInfo refModel =
   let
       wordInfo = refModel.translation |> Dict.toList |> List.map first |> List.map (deduceWordInfo refModel) |> Dict.fromList
       reverseWordInfo = refModel.reverseTranslation |> Dict.toList |> List.map (Tuple.mapSecond (\fict -> getWordInfoByDict wordInfo (fict |> List.head |> Maybe.withDefault "?")))
   in
    { refModel | wordInfo = wordInfo , reverseWordInfo = reverseWordInfo |> Dict.fromList}

setDescription: Dict String String -> ReferenceModel -> ReferenceModel
setDescription desc model =
    { model | description = desc }


setAttribution: Dict String Attribution -> ReferenceModel -> ReferenceModel
setAttribution attrib model =
    { model | attribution = attrib }

setMediaContent: Dict String (List MediaContent) -> ReferenceModel -> ReferenceModel
setMediaContent mediaContent model =
    { model | mediaContent = mediaContent }

setMorphemeLaw: MorphemeLaw -> ReferenceModel -> ReferenceModel
setMorphemeLaw morphemeLaw model =
    { model | morphemeLaw = morphemeLaw }
getWordInfoByDict: Dict String WordInfo -> String -> WordInfo
getWordInfoByDict dictWordInfo fictionalWord =
    dictWordInfo |> Dict.get fictionalWord |> Maybe.withDefault (WordInfo.createUnexpectedWord fictionalWord)
getWordInfo: ReferenceModel -> String -> WordInfo
getWordInfo refModel fictionalWord =
    getWordInfoByDict refModel.wordInfo fictionalWord

getWordInfoByClassic: ReferenceModel -> String -> WordInfo
getWordInfoByClassic refModel classicWord =
    refModel.reverseWordInfo |> Dict.get classicWord |> Maybe.withDefault (WordInfo.createUnexpectedWord classicWord)