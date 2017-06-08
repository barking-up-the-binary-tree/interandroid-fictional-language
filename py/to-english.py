#!/usr/bin/env python
import fileinput
import food

oneType = 'r'
manyType = 't'
noneType = 'n'
everyType = 's'
mostType = 'l'
verbType = 'k'
adjectiveType = 'd'
articleType = 'p'
pronounType = 'g'
adverbType= 'b'
ten = "rtnslckdpg"
twelve = "rtnslckdpgbf"
decimals = {twelve[a]: str(a) for a in range(0,12)}

def createWordList():
    #wordList = {a + b + c : a + b + c for a in twelve for b in twelve for c in twelve}
    wordList = {a: {b + c : "{0} x {1}".format(decimals[b],decimals[c]) for b in twelve for c in twelve} for a in twelve}
    print wordList

def getDefinition(wordKey):
    if wordKey.startswith('rr'):
        return food.content[wordKey[2:]]
    else:
        return "???"

def interpretNoun(word):
    plurality = word[:1]
    coreWord = word[1:6]
    return getDefinition(coreWord)

def interpretAdjective(word):
    plurality = word[:1]
    coreWord = word[1:5]
    return getDefinition(coreWord)

def interpretVerb(word):
    plurality = word[:1]
    coreWord = word[1:5]
    return getDefinition(coreWord)

def interpret(word):
    if word.startswith(oneType) or word.startswith(manyType) or word.startswith(noneType) or word.startswith(everyType) or word.startswith(mostType):
        return interpretNoun(word)
    elif word.startswith(adjectiveType):
        return interpretAdjective(word)
    elif word.startswith(verbType):
        return interpretVerb(word)
    else:
        return word

def toEnglish():
    for line in fileinput.input():
        words = line.lower().split()
        interpreted = map(interpret, words)
        print interpreted

print createWordList()
