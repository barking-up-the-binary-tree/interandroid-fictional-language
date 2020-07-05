#!/usr/bin/env python
import string
from shutil import copyfile
from typing import List, Tuple, Dict, Set

languages = ['en']

def loadVocabulary(lang):
    with open('data/{}/core-vocabulary.iandroid.txt'.format(lang), 'r') as textfile:
        return [s.strip() for s in textfile.readlines()]

def convertToDict(lines: List[str]):
    wordDict = {}
    for line in lines:
        if not line:
            continue
        [key, values] = line.split("=")
        wordDict[key.strip()] = values.strip().split(" ")
    return wordDict

def findDuplicate(langDict):
    duplicates = []
    for key in langDict:
        if "$" not in key:
            continue
        values = langDict[key]
        for value in values:
            normValue = value.lower()
            if normValue in duplicates:
                print("Duplicate", normValue)
            else:
                duplicates.append(normValue)

def writeElmScript(lang: str, lines):
    with open('elm/tests/FictionalMorpheme_{}.elm'.format(lang), 'w') as wfile:
        wfile.write("\n".join(lines))

def createElmScript(lang: str, vocabulary):
    content = ["module FictionalMorpheme_{} exposing (fictionalMorphemeData_{})".format(lang, lang)]
    content.append('fictionalMorphemeData_{} = """'.format(lang))
    content.extend(vocabulary)
    content.append('"""')
    writeElmScript(lang, content)

def exportVocabulary(lang: str):
    copyfile('data/{}/core-vocabulary.iandroid.txt'.format(lang), 'docs/data/{}/core-vocabulary.txt'.format(lang))

for lang in languages:
    vocabulary = loadVocabulary(lang)
    findDuplicate(convertToDict(vocabulary))
    createElmScript(lang, vocabulary)
    exportVocabulary(lang)

