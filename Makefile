.PHONY: html js

SRC = elm
BUILD = docs
HTML = html

vocabulary:
	python tools/inject-vocabulary.py

build: build-directory vocabulary html js

build-directory:
	mkdir -p $(BUILD)

html:
		cp $(HTML)/index.html $(BUILD)/index.html
js:
	elm-make $(SRC)/app.elm --output $(BUILD)/app.js

start:
	cd docs;python -m SimpleHTTPServer 8000
