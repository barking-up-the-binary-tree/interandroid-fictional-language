#!/usr/bin/python
import sys
from DictionaryServices import *
import fileinput

def searchWord(searchword):
    wordrange = (0, len(searchword))
    dictresult = DCSCopyTextDefinition(None, searchword, wordrange)
    if not dictresult:
        return None
    else:
        return dictresult.encode('utf-8')

def searchPhonetic(searchword):
    found = searchWord(searchword)
    if found:
        if found.count("|") >=2:
            soundAlt= found.split('|')[1]
            return soundAlt.split(",")[0].strip()
        else:
            return "."
    else:
        return "."

def makePhonetic(searchword):
    words = searchword.split()
    phonics = map(searchPhonetic, words)
    return " ".join(phonics)

def main():
    hasArg = len(sys.argv)>1
    if hasArg:
        search = sys.argv[1].decode('utf-8')
        print makePhonetic(search)
    else:
        for line in fileinput.input():
            print makePhonetic(line)

if __name__ == '__main__':
    main()
