#!/usr/bin/env python
import csv
from operator import itemgetter

def loadVocabulary():
    vocab = {}
    with open('data/vocabulary.csv', 'rb') as csvfile:
        vreader = csv.reader(csvfile, delimiter=',')
        for row in vreader:
            if len(row) == 2:
                if row[1] in vocab:
                    print "duplicate for id {0} with {1} and {2}".format(row[1], vocab[row[1]], row[0]) 
                else:
                    vocab[row[1]] = row[0]
    return sorted(vocab.items(), key=itemgetter(1))

def saveVocabulary(vocabList):
    with open('data/vocabulary-norm.csv', 'wb') as csvfile:
        vwriter = csv.writer(csvfile, delimiter=',')
        for row in vocabList:
            vwriter.writerow([row[1], row[0]])

vocabulary = loadVocabulary()

saveVocabulary(vocabulary)
