rm -rf temp
mkdir temp
cat "$REFDATA_DIR/schemaorg/data/releases/3.2/schema.jsonld" | jq -r '."@graph"[]."rdfs:label"' > temp/labels.txt
cat "$REFDATA_DIR/corpora/data/words/verbs.json" | jq -r '.verbs[].present' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/fruits.json" | jq -r '.fruits[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/vegetables.json" | jq -r '.vegetables[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/condiments.json" | jq -r '.condiments[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/wine_descriptions.json" | jq -r '.wine_descriptions[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/herbs_n_spices.json" | jq -r '.herbs[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/herbs_n_spices.json" | jq -r '.spices[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/foods/herbs_n_spices.json" | jq -r '.mixtures[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/materials/fabrics.json" | jq -r '.fabrics[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/materials/metals.json" | jq -r '.metals[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/materials/building-materials.json" | jq -r '."building materials"[]' | sort | uniq >> temp/labels.txt
cat "$REFDATA_DIR/corpora/data/music/genres.json" | jq -r '.genres[]' | sort | uniq >> temp/labels.txt
cat temp/labels.txt| sed -E 's/[A-Z]+/ &/g' | tr "A-Z" "a-z" | awk '{$1=$1};1' | sort | uniq > temp/words.txt
cat temp/words.txt | python phonetic.py | sed 's/(.)//g' | sed "s/ˈ//g" > temp/phonetic.txt
cat temp/phonetic.txt | tr -cd 'ptkmndbgwjʒðflŋrsʃθvzʒ\n'| sed 's/dʒ/g/g' | sed 's/ð/j/g' | sed 's/f/p/g' | sed 's/l/b/g' | sed 's/ŋ/n/g' | sed 's/r/g/g' | sed 's/s/j/g' | sed 's/ʃ/k/g' | sed 's/tʃ/t/g' | sed 's/θ/p/g' | sed 's/v/w/g' | sed 's/z/m/g' | sed 's/ʒ/n/g' > temp/ph10.txt
cat temp/phonetic.txt | tr -d '\n ' | sed 's/\(.\{1\}\)/\1 /g' | tr ' ' '\n' | sort | uniq | tr -d '\n ' > temp/letters.txt
cat temp/ph10.txt | tr 'ptkmndbgwj' '0123456789' > temp/ph-decimal.txt
paste temp/words.txt temp/phonetic.txt temp/ph-decimal.txt | column -s $'\t' -t > temp/all.txt
cat temp/all.txt | grep -v '\.' | egrep '[0-9]{2,}' > temp/vocabulary.tsv
