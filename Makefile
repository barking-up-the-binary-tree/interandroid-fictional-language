.PHONY: html js

SRC = src
BUILD = docs
HTML = elm/html

vocabulary:
	python tools/inject-vocabulary.py

build: build-directory vocabulary html js

org:
	python tools/organize-vocabulary.py

build-directory:
	mkdir -p $(BUILD)

html:
	cp $(HTML)/index.html $(BUILD)/index.html
js:
	cd elm; elm make $(SRC)/App.elm --output ../$(BUILD)/app.js

start:
	open http://localhost:7000; cd docs;python -m SimpleHTTPServer 7000

beautify:
	cd elm; elm-format src/ --yes

test:
	cd elm; elm-test
