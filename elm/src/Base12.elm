module Base12 exposing (Base12(..), toDroidChar, fromDroidChar, toString, fromString,
 startsWith, asList, matchAny, toDroidPhonetic)

type Base12 = Zero | One | Two | Three | Four | Five | Six | Seven | Eight | Nine | Ten | Eleven | UnknownBase12

asList: List Base12
asList = [Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Eleven]

toDroidChar: Base12 -> Char
toDroidChar value =
    case value of
        Zero -> '┼'
        One -> '╀'
        Two -> '┾'
        Three -> '╄'
        Four -> '╁'
        Five -> '╂'
        Six -> '╆'
        Seven -> '╊'
        Eight -> '┽'
        Nine -> '╃'
        Ten -> '┿'
        Eleven -> '╇'
        UnknownBase12 -> '?'

toString: List Base12 -> String
toString chars =
   chars |> List.map toDroidChar
   |> String.fromList

fromDroidChar: Char -> Base12
fromDroidChar value =
    case value of
        '┼' -> Zero -- 0000
        '╀' -> One -- 1000
        '┾' -> Two -- 0100
        '╄' -> Three -- 1100
        '╁' -> Four -- 0010
        '╂' -> Five -- ...
        '╆' -> Six
        '╊' -> Seven
        '┽' -> Eight
        '╃' -> Nine 
        '┿' -> Ten
        '╇' -> Eleven
        _ -> UnknownBase12

fromString: String -> List Base12
fromString str =
    String.toList str|> List.map fromDroidChar

startsWith: List Base12 -> List Base12 -> Bool
startsWith prefix pseudoword =
    List.take (List.length prefix) pseudoword == prefix

matchAny: List Base12 -> Base12 -> Bool
matchAny anyOfThis given =
    List.any ((==) given )anyOfThis

toDroidCons: Base12 -> String
toDroidCons value =
    case value of
        Zero -> "p"
        One -> "t"
        Two -> "k"
        Three -> "m"
        Four -> "n"
        Five -> "d"
        Six ->  "b"
        Seven -> "g"
        Eight -> "w"
        Nine -> "j"
        Ten -> "sɑː"
        Eleven -> "goʊ"
        UnknownBase12 -> "?"

toDroidVowels: Base12 -> String
toDroidVowels value =
    case value of
        Zero -> "ɑː"
        One -> "ɛ"
        Two -> "iː"
        Three -> "oʊ"
        Four -> "ʊ"
        Five -> "aɪ"
        Six ->  "eɪ"
        Seven -> "ɪʃ"
        Eight -> "ɔɪ"
        Nine -> "juː"
        Ten -> "sɑː"
        Eleven -> "goʊ"
        UnknownBase12 -> "?"
       
toDroidPhonetic: List Base12 -> String
toDroidPhonetic values =
    case values of
       [] -> ""
       [a] -> toDroidCons a
       a :: b :: rest -> toDroidCons a ++ toDroidVowels b ++ toDroidPhonetic rest
