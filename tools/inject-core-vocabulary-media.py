#!/usr/bin/env python
import csv
from operator import itemgetter
import json
from shutil import copyfile
from typing import List, Tuple, Dict, Set


languages = ['en']

def loadVocabulary(lang: str):
    vocab = []
    with open('data/{}/core-vocabulary-media.csv'.format(lang), 'r') as tsvfile:
        vreader = csv.reader(tsvfile, delimiter=',')
        for row in vreader:
            if len(row) == 5:
                intergalactical = row[0].strip()
                title = row[1].strip()
                url = row[2].strip()
                mediaType = row[3].strip()
                attribution = row[4].strip()
                mediaInfo = {
                    "word": intergalactical,
                    "title": title,
                    "contentURL": url,
                    "encodingFormat": mediaType,
                    "attributionId": attribution
                }
                vocab.append(mediaInfo)


    return vocab

def saveAsJson(lang: str, vocab):
    with open('docs/data/{}/core-vocabulary-media.json'.format(lang), 'w') as json_file:
        json.dump(vocab, json_file)

def exportAttribution(lang: str):
    copyfile('data/{}/attribution.json'.format(lang), 'docs/data/{}/attribution.json'.format(lang))

for lang in languages:
    vocabulary = loadVocabulary(lang)
    saveAsJson(lang, vocabulary)
    exportAttribution(lang)

