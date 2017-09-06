#!/usr/bin/swift
import Foundation
import CoreServices
import CoreServices.DictionaryServices

let unknown = "."

func searchWord(searchword: String) -> String {
  let wordLength = searchword.lengthOfBytes(using: String.Encoding.utf8)
  let range = CFRange(location: 0, length: wordLength)
  let definition = DCSCopyTextDefinition(nil, searchword as CFString, range)?.takeRetainedValue()
  return (definition as String?) ?? unknown
}

func beforeComa(text: String) -> String {
  return text.components(separatedBy: ",")[0]
}

func searchPhonetic(searchword: String) -> String {
  let found = searchWord(searchword: searchword)
  let sound = found.components(separatedBy: "|")
  let soundAlt = (sound.count <= 3) ? unknown : beforeComa(text: sound[1])
  return soundAlt
}

func makePhonetic(searchword: String) -> String {
  let words = searchword.components(separatedBy: " ")
  let phonics = words.map { searchPhonetic(searchword: $0 as String)}
  return phonics.joined(separator: " ")
}

func main() {  
  
  while let line = readLine() {
    let definition = makePhonetic(searchword: line)
    print(definition)
  }
   
}

main()