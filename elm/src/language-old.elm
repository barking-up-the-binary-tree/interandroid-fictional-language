module Main exposing (Adjectives(..), Adverbs(..), Logic(..), Number(..), Sentence(..), Subject(..), Unit(..), Verb(..), Word(..), godOfWar, main, sentence1)

import Html exposing (text)


type Number
    = D Int
    | F Float
    | Minus Number
    | Exponent Number Number
    | Multiply (List Number)
    | Sum (List Number)
    | Fraction Number Number
    | Perc Number
    | Fibonacci Number
    | Approximate Number
    | High
    | Low
    | Medium


type Logic
    = Yes
    | No
    | Maybe
    | Likely
    | Unlikely
    | Unknown


type Unit
    = Gram
    | Liter
    | Newton
    | Pascal
    | Ampere
    | Volt
    | Joule
    | Watt
    | Second
    | Minute
    | Hour
    | Day
    | Year
    | Celcius
    | Degree
    | Hertz
    | Byte
    | Vote
    | Line
    | Pixel
    | Flops
    | Count
    | Currency Int
    | Per Unit Unit
    | Square Unit
    | Cubic Unit
    | Coeff Number Unit


type Word
    = W (List Word)
    | Us
    | You
    | Them
    | This
    | Phonetic String
    | Quantity Number Unit
    | Colour Int
    | Mendeleev Int
    | Country Int
    | Unicode Int
    | Dewey String
    | IAN Int
    | Rank Int
    | Status Int
    | Wiki String
    | Thing
    | Belief
    | Action
    | CreativeWork
    | Event
    | Intangible
    | Organization
    | Person
    | Male
    | Female
    | Place
    | Period
    | Product
    | Human
    | Robot
    | Good
    | Bad
    | Clear
    | Add
    | Remove
    | Merge
    | Copy
    | Paste
    | Cut
    | Without
    | First
    | Last
    | Find
    | Sort
    | Verify
    | Play
    | Previous
    | Next
    | Stop
    | Cancel
    | Increase
    | Decrease
    | Show
    | Hide
    | ZoomIn
    | ZoomOut
    | Help
    | Private
    | Public
    | Open
    | Close
    | Tag
    | Watch
    | Move
    | Assign
    | Translate
    | Explain
    | Require
    | Agreement
    | Aka
    | Of


type Adjectives
    = A
    | With (List Word)


type Adverbs
    = Including (List Word)
    | Now
    | Recently
    | A_long_time_ago
    | Soon
    | In_a_remote_future
    | Possibly
    | Do_not


type Subject
    = For Adjectives Word
    | Name Subject
    | None_of (List Subject)
    | One_of (List Subject)
    | Some_of (List Subject)
    | Most_of (List Subject)
    | Every_of (List Subject)
    | Any_of (List Subject)
    | Reject Subject


type Verb
    = Do Adverbs Word


type Sentence
    = Considering Subject Verb Subject
    | Then Sentence
    | Therefore Sentence
    | BecauseOf Sentence


godOfWar : Subject
godOfWar =
    Name (For A (W [ Belief, Person, Of, Period, Without, Agreement ]))


sentence1 : Sentence
sentence1 =
    Considering (For (With [ Good ]) Human) (Do Now Add) (For (With [ Good ]) Robot)


main =
    text (toString sentence1)
