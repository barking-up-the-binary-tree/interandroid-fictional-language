.PHONY: html js

SRC = src
BUILD = docs
HTML = elm/html

vocabulary:
	python tools/inject-core-vocabulary.py
	python tools/inject-core-vocabulary-media.py
	python tools/inject-core-vocabulary-description.py
	cat data/en/core-vocabulary-translation*.csv > docs/data/en/core-vocabulary-translation.csv

build: build-directory vocabulary html js

org:
	python tools/organize-vocabulary.py

build-directory:
	mkdir -p $(BUILD)

html:
	cp $(HTML)/index.html $(BUILD)/index.html
js:
	cd elm; elm make $(SRC)/Main.elm --output ../$(BUILD)/main.js

start:
	open -n -a "Google Chrome" --args --incognito http://localhost:7000; cd docs;http-server -p 7000

beautify:
	cd elm; elm-format src/ --yes

test:
	cd elm; elm-test

syntax-color:
	ln -s "`pwd`/vscode/interandroid" ~/.vscode/extensions/interandroid-0.0.1