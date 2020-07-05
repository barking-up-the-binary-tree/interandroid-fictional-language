#!/usr/bin/env python
import string
import json
from typing import List, Tuple, Dict, Set

languages = ['en']

def loadVocabulary(lang: str):
    with open('data/{}/core-vocabulary-description.md'.format(lang), 'r') as textfile:
        return [s.strip() for s in textfile.readlines()]

def splitWordDescription(lines: List[str]):
    row = { "word" : ""}
    rows = []
    descriptionPart = []
    for line in lines:
        if line[0:6] == '######':
            if row["word"]:
                description = "\n".join(descriptionPart)
                row["description"] = description
                rows.append(row)
            word = line[6:].strip()
            row = { "word" : word }
            descriptionPart = []
        else:
           if line:
                descriptionPart.append(line)
    description = "\n".join(descriptionPart)
    row["description"] = description
    rows.append(row)
    return rows

def saveAsJson(lang: str, rows):
    with open('docs/data/{}/core-vocabulary-description.json'.format(lang), 'w') as json_file:
        json.dump(rows, json_file)


for lang in languages:
    vocabulary = loadVocabulary(lang)
    rows = splitWordDescription(vocabulary)
    saveAsJson(lang, rows)

