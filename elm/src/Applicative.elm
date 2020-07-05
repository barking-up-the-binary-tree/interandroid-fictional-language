module Applicative exposing(Model, reset, load, changeContent, flipTranslation, getWordInfo)

import Dict
import ReferenceModel as ReferenceModel exposing (ReferenceModel, loadTranslation)
import MediaContent as MediaContent
import VocabularyTranslation as VocabularyTranslation
import VocabularyDescription as VocabularyDescription
import Attribution as Attribution
import Morpheme as Morpheme
import DocumentId exposing(DocumentId(..))
import Tuple exposing(first, second)
import WordInfo exposing (WordInfo)
import Phrasing as Phrasing
import Maybe as Maybe

type alias Model = {
    refModel: ReferenceModel
    , isClassicLanguage: Bool
    , aboutWord: Maybe String
    , warnings: List String
    , content: String
    , wordInfoList: List WordInfo
  }

reset: Model
reset = {
    refModel = ReferenceModel.createDefault
    , isClassicLanguage = True
    , aboutWord = Nothing
    , warnings = []
    , content = ""
    , wordInfoList = []
    }

setReferenceModel: ReferenceModel -> Model -> Model
setReferenceModel refModel model =
  { model | refModel = refModel }

asReferenceModelIn: Model -> ReferenceModel -> Model
asReferenceModelIn  model refModel =
  { model | refModel = refModel }

loadSomeAsset: (DocumentId, String) -> Model -> Model
loadSomeAsset taskDoc model =
  case first taskDoc of
    AttributionDoc ->
        ReferenceModel.setAttribution (Attribution.fromString (second taskDoc) |> Result.withDefault Dict.empty) model.refModel
        |> asReferenceModelIn model
    DescriptionDoc ->
        ReferenceModel.setDescription (VocabularyDescription.fromString (second taskDoc) |> Result.withDefault Dict.empty) model.refModel
        |> asReferenceModelIn model
    MediaDoc ->
        ReferenceModel.setMediaContent(MediaContent.fromString (second taskDoc) |> Result.withDefault Dict.empty) model.refModel
        |> asReferenceModelIn model
    TranslationDoc ->
        loadTranslation (VocabularyTranslation.fromString (second taskDoc)) model.refModel
        |> asReferenceModelIn model
    CoreDoc ->
        ReferenceModel.setMorphemeLaw(Morpheme.fromString (second taskDoc) |> Result.withDefault Morpheme.createDefault) model.refModel
        |> asReferenceModelIn model

loadAny: List (DocumentId, String) -> Model -> Model
loadAny taskDocList model =
  case taskDocList of
      [] ->
        model
      [docIdContent] ->
        loadSomeAsset docIdContent model
      docIdContent :: more ->
        loadSomeAsset docIdContent model |> loadAny more

load: List (DocumentId, String) -> Model -> Model
load taskDocList model =
  let
    newmodel = loadAny taskDocList model 
  in
    ReferenceModel.loadWordInfo newmodel.refModel
    |> asReferenceModelIn newmodel

changeClassicContent: String -> Model -> Model
changeClassicContent newcontent model =
  { model | content = newcontent, wordInfoList = Phrasing.fromClassicString model.refModel newcontent }

changeFictionalContent: String -> Model -> Model
changeFictionalContent newcontent model =
  { model | content = newcontent, wordInfoList = Phrasing.fromFictionalString model.refModel newcontent }

changeContent: String -> Model -> Model
changeContent newcontent model =
  if model.isClassicLanguage then
    changeClassicContent newcontent model
  else
    changeFictionalContent newcontent model

toContent: Bool -> ReferenceModel -> List WordInfo -> String
toContent isClassic refModel list =
  if isClassic then
    Phrasing.toClassicString refModel list
  else
    Phrasing.toFictionalString refModel list

flipTranslation: Model -> Model
flipTranslation model =
  { model | isClassicLanguage = not model.isClassicLanguage, content = toContent (not model.isClassicLanguage) model.refModel model.wordInfoList }

getWordInfo: Model -> Maybe WordInfo
getWordInfo model =
  model.aboutWord |> Maybe.map(ReferenceModel.getWordInfo model.refModel)
