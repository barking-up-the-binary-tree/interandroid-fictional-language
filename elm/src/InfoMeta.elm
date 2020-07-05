module InfoMeta exposing (InfoMeta, checkConstant, checkRef, checkSlice, checkSwitch, create, fromString, toString)


type alias InfoMeta =
    { name : String
    , ref : Maybe String
    }


create : String -> Maybe String -> InfoMeta
create name ref =
    InfoMeta name ref


toString : InfoMeta -> String
toString info =
    info.ref
        |> Maybe.map (\ref -> info.name ++ ":" ++ ref)
        |> Maybe.withDefault info.name


checkName : String -> Bool
checkName str =
    (String.isEmpty str |> not) && String.all Char.isAlphaNum str


checkRef : String -> Bool
checkRef str =
    (String.length str >= 2)
        && String.all (\c -> Char.isLower c || Char.isDigit c || c == '-') (str |> String.dropLeft 1)
        && String.all (\c -> c == '?' || c == '$' || c == '@') (str |> String.left 1)


fromString : String -> Result String InfoMeta
fromString str =
    case String.split ":" str of
        [ a, b ] ->
            if checkName a && checkRef b then
                create a (Just b) |> Ok

            else
                "Invalid InfoMeta:" ++ str |> Err

        [ a ] ->
            if checkName a then
                create a Nothing |> Ok

            else
                "Invalid InfoMeta:" ++ str |> Err

        _ ->
            "Invalid InfoMeta:" ++ str |> Err


checkConstant : Maybe InfoMeta -> Bool
checkConstant infoMeta =
    infoMeta |> Maybe.map (\v -> v.ref == Nothing) |> Maybe.withDefault True


checkSlice : Maybe InfoMeta -> Bool
checkSlice maybeInfoMeta =
    case maybeInfoMeta of
        Just infoMeta ->
            case infoMeta.ref of
                Just str ->
                    String.contains "$" str || String.contains "@" str || String.contains "?" str

                Nothing ->
                    False

        Nothing ->
            True


checkSwitch : Maybe InfoMeta -> Bool
checkSwitch maybeInfoMeta =
    case maybeInfoMeta of
        Just infoMeta ->
            case infoMeta.ref of
                Just str ->
                    String.contains "$" str || String.contains "@" str || String.contains "?" str

                Nothing ->
                    True

        Nothing ->
            True
