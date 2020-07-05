module Morpheme exposing (MorphemeLaw, recurseOrigin, createDefault, fromString, toString, checkWordType, checkOrigin)

import Base12Meta as Base12Meta exposing (Base12Meta, getInfoMeta)
import Base12 as Base12 exposing(Base12(..))
import Set
import WordType exposing (WordType(..))
import InfoMeta exposing (InfoMeta)
import Tuple exposing (first, second)
import List exposing(foldl, reverse)

type alias MorphemeLaw = {
    rules: List Base12Meta
 }

createDefault: MorphemeLaw
createDefault = 
    { 
        rules =[]
    }

create: List Base12Meta -> MorphemeLaw
create rules =
    MorphemeLaw rules

isErr : Result error value -> Bool
isErr result =
    case result of
        Ok _ -> False
        Err _ -> True


mergeError : List (Result String value) -> List String
mergeError results =
    results 
        |> List.filter isErr
        |> List.map (\result ->
            case result of
                Err error -> error
                _ -> ""
        )

removeUnique: (List String, List String) -> (List String, List String)
removeUnique value =
    case value of
        ([], b) -> ([], b)
        (a, []) -> (a, [])
        (a::resta, b) -> (resta, List.filter (\v-> v /= a) b) |> removeUnique

validateRefs: List Base12Meta -> List String
validateRefs rules =
    let
        names = rules 
            |> List.map .name

        unames = names |> Set.fromList

        duplicates = removeUnique (names, unames |> Set.toList) |> Tuple.first
        refs = rules 
            |> List.map Base12Meta.toArray 
            |> List.concat 
            |> List.filterMap ( Maybe.map .ref) 
            |> List.filterMap identity
            |> Set.fromList
        
        shouldBeDefined = Set.diff refs unames
    in
        if List.isEmpty duplicates then
            shouldBeDefined |> Set.toList
        else
            duplicates |> (::) "Duplicates"

validatePurpose: List Base12Meta -> List String
validatePurpose rules =
    rules |> List.concatMap Base12Meta.validatePurpose

fromString: String -> Result String MorphemeLaw
fromString str =
    let
        results = String.lines str 
            |> List.filter (String.isEmpty >> not) 
            |> List.map Base12Meta.fromString
        onlyValidResults = List.filterMap Result.toMaybe results
        syntaxErrs = validateRefs onlyValidResults ++ validatePurpose onlyValidResults
        errors = mergeError results
    in
        if List.isEmpty errors then
            if List.isEmpty syntaxErrs then
                create onlyValidResults |> Ok
            else
               syntaxErrs |> String.join "/n" |> Err 
        else
           errors |> String.join "/n" |> Err 
    

toString: MorphemeLaw -> String
toString law =
    law.rules 
        |> List.map Base12Meta.toString
        |> String.join "\n"

findInfoMeta: MorphemeLaw -> InfoMeta -> Base12 -> Maybe InfoMeta
findInfoMeta law previousInfoMeta base12 =
    Maybe.andThen (\refname ->
    law.rules 
        |> List.filter (\rule -> rule.name == refname)
        |> List.head
        |> Maybe.andThen (\base12Meta -> getInfoMeta base12Meta base12)
        ) previousInfoMeta.ref

type alias VocabStack = {
    origin: List String
    , nextInfoMeta: InfoMeta
    , stacks: List InfoMeta
  }


addVocabOrigin: String -> VocabStack -> VocabStack
addVocabOrigin originpart vocabStack =
    {vocabStack | origin = vocabStack.origin ++ [originpart]}

allVocabStack: VocabStack
allVocabStack = {
        origin = []
        , nextInfoMeta = {name = "All", ref = Just "?all" }
        , stacks = []
    }

recurseSwitch: MorphemeLaw -> Base12 -> VocabStack -> VocabStack
recurseSwitch law nextBase12 vocabStack =
    findInfoMeta law vocabStack.nextInfoMeta nextBase12
    |> Maybe.map (\infoMeta -> {vocabStack | nextInfoMeta = infoMeta} |> addVocabOrigin infoMeta.name)
    |> Maybe.withDefault vocabStack

recurseEnum: MorphemeLaw -> Base12 -> VocabStack -> VocabStack
recurseEnum law nextBase12 vocabStack =
    findInfoMeta law vocabStack.nextInfoMeta nextBase12
    |> Maybe.map (\infoMeta -> {vocabStack | nextInfoMeta = infoMeta} |> addVocabOrigin infoMeta.name)
    |> Maybe.withDefault vocabStack

pushSequence: MorphemeLaw -> VocabStack -> VocabStack
pushSequence  law vocabStack =
    let
     toadd = law.rules 
        |> List.filter (\rule -> rule.name == (vocabStack.nextInfoMeta.ref |> Maybe.withDefault "should-not-happen")) 
        |> List.head 
        |> Maybe.withDefault Base12Meta.reset
        |> Base12Meta.toArray
        |> List.filterMap identity       
    in
     { vocabStack | stacks = toadd ++ vocabStack.stacks, nextInfoMeta =   { name = "WaitingForNext", ref = Nothing  }}
    
recurseOrigin: MorphemeLaw -> Base12 -> VocabStack -> VocabStack
recurseOrigin law nextBase12 vocabStack =
    case vocabStack.nextInfoMeta.ref of
        Just nextKey ->
            case String.left 1 nextKey of
            "?" -> recurseSwitch law nextBase12 vocabStack
            "$" -> recurseEnum law nextBase12 vocabStack
            "@" -> pushSequence law vocabStack |> recurseOrigin law nextBase12
            _ -> vocabStack -- should not happen
        Nothing ->
            if List.isEmpty vocabStack.stacks then
                -- the end
                vocabStack
            else
                -- Pop the stack back
                { vocabStack | 
                nextInfoMeta = vocabStack.stacks |> List.head |> Maybe.withDefault  { name = "AllDoneNow", ref = Nothing  }
                , stacks = vocabStack.stacks |> List.tail |> Maybe.withDefault []
                } |> recurseOrigin law nextBase12

checkOrigin: MorphemeLaw -> String -> String
checkOrigin law str =
    Base12.fromString str
    |> foldl (recurseOrigin law) allVocabStack
    |> .origin
    |> String.join " "

checkExistingWordType: String -> WordType
checkExistingWordType str =
    case Base12.fromString str |> List.head |> Maybe.withDefault UnknownBase12 of
        Zero -> NounType
        One -> VerbType
        Two -> AdjectiveType
        Three -> AdverbType
        Four -> PronounType
        Five -> PrepositionType
        Six -> ConjunctionType
        Seven -> DeterminerType
        _ -> IncorrectWord

checkWordType: String -> WordType
checkWordType str =
    case str of
       "◌" -> WordSeparator
       "◌◌" -> ClauseSeparator
       "◌◌◌" -> SentenceClauseSeparator
       "◌◌◌◌" -> SentenceSeparator
       "◌◌◌◌◌" -> ParagraphSeparator
       shouldbeword ->
        checkExistingWordType shouldbeword

