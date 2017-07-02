#!/usr/bin/env python
import fileinput

ten = "0123456789"
dot = "."
minus = "-"
sep = ":"
sep2 = "/"
question = "?"

def createWordList():
    #wordList = {a + b + c : a + b + c for a in twelve for b in twelve for c in twelve}
    wordList = {a: {b + c : "{0} x {1}".format(decimals[b],decimals[c]) for b in twelve for c in twelve} for a in twelve}
    print wordList

def getDefinition(wordKey):
    if wordKey.startswith('rr'):
        return food.content[wordKey[2:]]
    else:
        return "???"

def interpretNumber(word):
    coreWord = word[1:]
    number = 0
    if "." in coreWord:
        number = float(coreWord)
    else:
        number = int(coreWord)
    return number

def get_soundex(name):
	"""Get the soundex code for the string"""
	name = name.upper()
	soundex = ""
	soundex += name[0]
	dictionary = {"BFPV": "1", "CGJKQSXZ":"2", "DT":"3", "L":"4", "MN":"5", "R":"6", "AEIOUHWY":"."}

	for char in name[1:]:
		for key in dictionary.keys():
			if char in key:
				code = dictionary[key]
				if code != soundex[-1]:
					soundex += code

	soundex = soundex.replace(".", "")
	soundex = soundex[:4].ljust(4, "0")
	return soundex

def interpret_number(word):
    coreWord = word[1:]
    number = 0
    if "." in coreWord:
        number = float(coreWord)
    else:
        number = int(coreWord)
    return number

def interpret_sound(word):
    coreWord = word[1:]
    sound = get_soundex(coreWord)
    return sound

def interpret(word):
    if word.startswith(sep):
        return interpret_number(word)
    elif word.startswith(sep2):
        return interpret_sound(word)
    else:
        return word

def toEnglish():
    for line in fileinput.input():
        words = line.lower().split()
        interpreted = map(interpret, words)
        print interpreted

print toEnglish()
