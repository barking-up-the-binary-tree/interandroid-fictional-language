module WordInfo exposing (WordInfo, createDefault, createUnexpectedWord, matchAnyWordType)

import MediaContent exposing (MediaContent)
import WordType exposing(WordType(..))
import WordComposition
import List exposing(member)

type alias WordInfo = {
    fictionalWord: String -- simple of composed
    , origin: Maybe String -- core origin of the word
    , phonetic: String
    , translations: List String -- all possible translations
    , mediaContents: List MediaContent
    , description: Maybe String
    , altDescription: Maybe String
    , wordType: WordType
    }

createDefault: String ->  WordInfo
createDefault fictionalWord =
   {
    fictionalWord = fictionalWord
    , origin = Nothing
    , phonetic = ""
    , translations = []
    , mediaContents = []
    , description = Nothing
    , altDescription = Nothing
    , wordType = UnkwnownWord
    }

createUnexpectedWord: String ->  WordInfo
createUnexpectedWord fictionalWord =
   {
    fictionalWord = fictionalWord
    , origin = Nothing
    , phonetic = ""
    , translations = []
    , mediaContents = []
    , description = Nothing
    , altDescription = Nothing
    , wordType = if WordComposition.matchCompoundFictionalWord fictionalWord then UnkwnownWord else IncorrectWord
    }
 
matchAnyWordType: List WordType ->  WordInfo -> Bool
matchAnyWordType wordtypes wordInfo =
   List.member wordInfo.wordType wordtypes