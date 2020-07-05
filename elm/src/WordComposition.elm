module WordComposition exposing (WordComposition, createSingle, createComposite, toString, fromString, matchCompoundFictionalWord)

import String exposing (repeat)

-- separators ┄ :

type WordComposition =
    SingleWord String -- word
    | CompositeWord (List WordComposition)

createSingle: String -> WordComposition
createSingle str =
    SingleWord str

createComposite: List WordComposition -> WordComposition
createComposite list =
    CompositeWord list

toStringValue: String -> Int -> WordComposition -> String
toStringValue separator level composite =
    case composite of
        SingleWord simpleWord -> 
            simpleWord
        CompositeWord mixed ->
            mixed 
                |> List.map (\values -> toStringValue separator (highestLevel values) values)
                |> String.join (String.repeat level separator)

highestLevelValue: Int -> WordComposition -> Int
highestLevelValue level composite =
    case composite of
        SingleWord _ -> 
            level
        CompositeWord mixed ->
            mixed 
                |> List.map (highestLevelValue (level + 1))
                |> List.maximum
                |> Maybe.withDefault 0



highestLevel: WordComposition -> Int
highestLevel composite =
    highestLevelValue 0 composite

highestLevelSeparatorValue: String -> Int -> String -> Int
highestLevelSeparatorValue separator level str =
    if String.contains (repeat (level + 1) separator) str then
        highestLevelSeparatorValue separator (level + 1) str
    else
        level

highestLevelSeparator: String -> String -> Int
highestLevelSeparator separator str =
   highestLevelSeparatorValue separator 0 str

splitBySeparator: String -> String -> List String
splitBySeparator separator str =
    let
        level = highestLevelSeparator separator str
    in
        if level > 0 then 
            String.split (repeat level separator) str
        else
            [str]


fromStringValue: String -> String -> WordComposition
fromStringValue separator str =
    case splitBySeparator separator str of
        [oneword] ->
            if String.contains separator oneword then
                fromStringValue separator oneword
            else
                SingleWord oneword
        manyWords ->
            manyWords 
                |> List.map (fromStringValue separator)
                |> CompositeWord


toString: String -> WordComposition -> String
toString separator composite =
    toStringValue separator (highestLevel composite) composite

fromString: String -> String -> WordComposition
fromString separator str =
    fromStringValue separator str

isCompoundFictionalChar: Char -> Bool
isCompoundFictionalChar ch =
    List.member ch ['┼', '╀', '┾', '╄', '╁', '╂', '╆', '╊', '┽', '┹', '┿', '╇', '┄']

matchCompoundFictionalWord: String -> Bool
matchCompoundFictionalWord str =
    String.all isCompoundFictionalChar str