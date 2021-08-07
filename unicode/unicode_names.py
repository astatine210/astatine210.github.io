"""Creates a Javascript file with all the unicode characters in it
that the uniccodedata library knows of."""

import unicodedata
import json

data = []
for n in range(0x10ffff):
    try:
        character = chr(n)
        name = unicodedata.name(character)
        entity = "&#" + hex(n)[1:] + ";"
        decimal = str(n)
        data.append((name, character, entity, decimal))
    except:
        pass

with open("unicode.js", "w", encoding="UTF8") as fh:
    fh.write("var data=" + json.dumps(data, separators=(",", ":")))
