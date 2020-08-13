#!/usr/bin/env python
# coding=utf8
import string
from random import randrange, choice
from typing import List, Tuple, Dict, Set


letters=['┼', '╀', '┾', '╄', '╁', '╂', '╆', '╊', '┽', '╃', '┿', '╇']

def convert_to_dict(lines: List[str])->Dict[str, str]:
    keyValuesList = [line.split("=", 2) for line in lines if line]
    return { keyValues[0].strip(): keyValues[1].strip().split(" ") for keyValues in keyValuesList }

def load_vocabulary(lang:str):
    with open('../data/{}/core-vocabulary.iandroid.txt'.format(lang), 'r') as textfile:
        return [s.strip() for s in textfile.readlines()]

def has_word(search_term: str)->bool:
     with open('../data/en/core-vocabulary-description.md', 'r') as textfile:
        return search_term in textfile.read()

def extract_fictional_letters(str1: str)->str:
    fictional = ""
    start = False
    for ch in str1:
        if ch is "]":
            start = False
        if start:
            fictional = fictional + ch
        if ch is "[":
            start = True                   
    return fictional

class WordGenerator: 
    def __init__(self, toConsume: List[str]):
        self.toConsume = toConsume.copy()
        self.langDict = convert_to_dict(load_vocabulary("en"))

    def find_next_to_consume(self, items):
        if self.toConsume == []:
            return -1
        nextToConsume = self.toConsume[0]
        for idx in range(len(items)):
            item = items[idx]
            if item.startswith(nextToConsume + ":"):
                del self.toConsume[0]
                return idx
        return -1

    def random_enum(self, name):
        items = self.langDict[name]
        start = 0
        stop = len(items)
        if "unit-prefix" in name:
           stop = 2
        idx = randrange(start, stop)
        return "{}[{}]".format(items[idx], letters[idx])

    def random_switch(self, name):
        items = self.langDict[name]
        idx = self.find_next_to_consume(items)
        if idx < 0 :
            idx = randrange(len(items))
        item = items[idx]
        if not ":" in item:
            return "{}[{}]".format(items[idx], letters[idx])
        [key, value] = item.split(":")
        if "$" in value:
            return "{}[{}]={}".format(key, letters[idx], self.random_enum(value) )
        elif "?" in value:
            return "{}[{}]/{}".format(key, letters[idx], self.random_switch(value) )
        elif "@" in value:
            return "{}[{}]==({})".format(key, letters[idx], self.whole_slice(value) )
        else:
            return "Really"

    def individual_slice(self, item):
            [key, value] = item.split(":")
            if "$" in value:
                return "{}=={}".format(key, self.random_enum(value) )
            elif "?" in value:
                return "{}/{}".format(key, self.random_switch(value) )
            elif "@" in value:
                return "{}==({})".format(key, self.whole_slice(value) )
            else:
                return "Really"

    def whole_slice(self, name):
        items = self.langDict[name]
        parts = map(self.individual_slice,items)
        return ",".join(parts)
        
    def generate(self):
        all = self.random_switch("?all")
        return (extract_fictional_letters(all), all)

class EnterData:
    def __init__(self):
        self.iword = ""
        self.category_name = ""
        self.translation = ""
        self.description = ""
        self.origin = ""

    def set_iword(self, iword: str):
        self.iword = iword
        return self

    def set_category_name(self, name: str):
        self.category_name = name
        return self

    def set_translation(self, translation):
        self.translation = translation
        return self

    def set_description(self, description: str):
        self.description = description
        return self

    def set_origin(self, origin: str):
        self.origin = origin
        return self

    def save(self):
        if len(self.description)==0 or len(self.translation) == 0:
            print("Missing description or translation")
            return self
        print("Saving {} to {}".format(self.iword, self.category_name))
        print("translation: {}".format(self.translation))
        print("description: {}".format(self.description))
        with open('../data/en/core-vocabulary-description.md', 'a') as desctextfile:
            desctextfile.writelines(["\n", "###### {}\n".format(self.iword),"\n", self.description, "\n\n"])
        
        with open('../data/en/core-vocabulary-translation-{}.csv'.format(self.category_name), 'a+') as transtextfile:
            transtextfile.write("{},{}\n".format(self.iword, self.translation))
        return self

    def keep(self, translation: str, description: str):
        self.translation = translation
        self.description = description
        self.save()


categories = [
    # { "name": "creature", "path": ['Noun', 'AllWord', "Creature"] },
    # { "name": "building", "path": ['Noun', 'AllWord', "Building"] },
    # { "name": "status", "path": ['Noun', 'AllWord', "KnownSeries", "Status"] },
    # { "name": "concept", "path": ['Noun', 'AllConcept']},
    # { "name": "math", "path": ['Noun', 'Math']},
    { "name": "content", "path": ['Noun', 'Content']},
    # { "name": "pronoun", "path": ['Pronoun']},
    # { "name": "verb", "path": ['Verb']},
    # { "name": "adjective-active-verb", "path": ['Adjective', "ActiveVerb"]},
    # { "name": "adjective-passive-verb", "path": ['Adjective', "PassiveVerb"]},
    # { "name": "adjective-noun", "path": ['Adjective', "NounAsAdjective"]},
    # { "name": "adverb", "path": ['Adverb']},
    # { "name": "preposition", "path": ['Preposition']},
    # { "name": "conjunction", "path": ['Conjunction']},
    # { "name": "determiner", "path": ['Determiner']}
    ]

def gen_new_word(count: int=100):
    if count <=0:
       print("No more words :-)")
       return
    category = choice(categories)
    wgen = WordGenerator(category["path"])
    iword, info = wgen.generate()
    if has_word(iword):
        return gen_new_word(count-1)
    enterData = EnterData()
    enterData.set_iword(iword)
    enterData.set_category_name(category["name"])
    enterData.set_origin(str(info))
    print(info)
    return enterData

def next():
    return gen_new_word()

def nextsearch(search: str, search2: str =""):
    for _ in range(500):
        new_word = gen_new_word()
        if not search in new_word.origin:
            continue
        if len(search2)>0 and not search2 in new_word.origin:
            continue
        return new_word
    print("nothing found")
