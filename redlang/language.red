Red [
	Title:   "Interandroid Fictional Language"
	Author:  "Olivier Huin"
	File: 	 %language.red
	Tabs:	 4
	Version: 1.0.0.0
	Rights:  "Copyright (C) 2017 Olivier Huin. All rights reserved."
	License: {
		Distributed under the MIT License.
		See https://opensource.org/licenses/MIT
	}
]

rlang:  charset "Rr"
tlang:  charset "Tt"
nlang:  charset "Nn"
slang:  charset "Ss"
llang:  charset "Ll"
klang:  charset "CcKk"
dlang:  charset "Dd"
plang:  charset "Pp"
glang:  charset "Gg"
blang:  charset "Bb"
flang:  charset "Ff"
ylang:  charset "Yy"
wlang:  charset "Ww("
vlang:  charset "Vv)"
spaceLang:  charset " Zz"
xlang:  charset "Xx?"

ten: charset "RrTtNnSsLlCcKkDdPpGgBb"
extra: charset "FfYy"
begin: union spaceLang wlang xlang
finish: union spaceLang vlang
twelve: charset "RrTtNnSsLlCcKkDdPpGgBbFfYy"
category: [ten twelve]
; sets
oneType: rlang ; one and onl yone
manyType: tlang ; some or a subset
noneType: nlang; or complement
everyType: slang
mostType: llang
verbType: klang
adjectiveType: dlang
articleType: plang
pronounType: glang
adverbType: blang

nounType: union oneType manyType noneType everyType mostType
noun: [begin nounType category 3 twelve finish]
verb: [begin verbType category 3 twelve finish]
adjective: [adjectiveType category 3 twelve]
adverb: [begin adverbType category 3 twelve finish]

language: function [prog [string!]][
        size: 30000
        parse prog ["dtt" (prin "A")]
    ]

    ; This code will print a Hello World! message
language { dttnnn }
