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
                vocab[row[1]] = row[0]
    return sorted(vocab.items(), key=itemgetter(1))

def writeElmScript(lines):
    with open('elm/FromEnglish.elm', 'w') as file:
        file.write("\n".join(lines))

def readElmTemplate():
    with open('elm/FromEnglishTemplate.elm') as f:
        lines = f.readlines()
    return lines

def asElmType(value):
    return "".join([w.capitalize() for w in value.split(' ')])

def asEng(value):
    return "_".join([w.lower() for w in value.split(' ')])

def wordToExa(vocabulary):
    return [SPACE + asElmType(word[1])+" -> "+'"'+word[0]+'"' for word in vocabulary]

def engToWord(vocabulary):
    return [SPACE + '"'+ asEng(word[1])+ '"' + " -> "+asElmType(word[1]) for word in vocabulary]

def typeWord(vocabulary):
    return [SPACE + "| " + asElmType(word[1]) for word in vocabulary]

def createElmScript(vocabulary):
    lines = readElmTemplate()
    content = []
    for x in lines:
        if "PYTHON" in x:
            if "wordToHexa" in x:
                content.extend(wordToExa(vocabulary))
            elif "engToWord" in x:
                    content.extend(engToWord(vocabulary))
            elif "type Word" in x:
                    content.extend(typeWord(vocabulary))


        else:
            content.append(x.rstrip())

    writeElmScript(content)

vocabulary = loadVocabulary()

createElmScript(vocabulary)
