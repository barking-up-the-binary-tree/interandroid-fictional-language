module WordType exposing (WordType(..))

type WordType =
    UnkwnownWord
    | IncorrectWord
    | WordSeparator -- space
    | ClauseSeparator -- comma ,
    | SentenceClauseSeparator -- semicolon ;
    | SentenceSeparator -- dot .
    | ParagraphSeparator -- blank line
    | NounType
    | VerbType
    | AdjectiveType 
    | AdverbType
    | PronounType
    | PrepositionType 
    | ConjunctionType 
    | DeterminerType
