#!/usr/bin/env python
import csv
from operator import itemgetter

SPACE = "  "
def loadVocabulary():
    vocab = {}
    with open('data/vocabulary.csv', 'rb') as tsvfile:
        vreader = csv.reader(tsvfile, delimiter=',')
        for row in vreader:
            if len(row) == 2:
                vocab[row[1]] = row[0].strip()
    return sorted(vocab.items(), key=itemgetter(1))

def loadSpecialWords():
    special = {}
    with open('data/special-words.csv', 'rb') as tsvfile:
        vreader = csv.reader(tsvfile, delimiter=',')
        for row in vreader:
            if len(row) == 2:
                special[row[0]] = row[1].strip()
    return sorted(special.items(), key=itemgetter(0))

def writeElmScript(lines):
    with open('elm/FictionalWords.elm', 'w') as file:
        file.write("\n".join(lines))

def asElmType(value):
    return "".join([w.capitalize() for w in value.split(' ')])

def quote(value):
    return '"' + value + '"'

def asEng(value):
    return "_".join([w.lower() for w in value.split(' ')])

def wordToExa(vocabulary):
    return [SPACE + asElmType(word[1])+" -> "+'"'+word[0]+'"' for word in vocabulary]

def engToWord(vocabulary):
    return [SPACE + '"'+ asEng(word[1])+ '"' + " -> "+asElmType(word[1]) for word in vocabulary]

def typeWord(vocabulary):
    return [SPACE + "| " + asElmType(word[1]) for word in vocabulary]

def csvContent(vocabulary):
    return [asEng(word[1].strip()) + "," + word[0].strip() for word in vocabulary]

def csvContent2(vocabulary):
    return [asEng(word[0].strip()) + "," + word[1].strip() for word in vocabulary]

def createElmScript(vocabulary, specialWords):
    content = ["module FictionalWords exposing(csvContent, csvSpecialWords)"]
    content.append('csvSpecialWords = """')
    content.extend(csvContent2(specialWords))
    content.append('  """')
    content.append('csvContent = """')
    content.extend(csvContent(vocabulary))
    content.append('  """')
    writeElmScript(content)

vocabulary = loadVocabulary()
specialWords = loadSpecialWords()

createElmScript(vocabulary, specialWords)
