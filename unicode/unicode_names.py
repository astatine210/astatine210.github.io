"""Creates a Javascript file with all the unicode characters in it
that the uniccodedata module knows of."""

from os import replace
import unicodedata
import pprint

data = {}
last_char_worked = (
    False  # Flag whether the last character code attempted worked in unicode
)
last_block_start = ""

for n in range(0x10FFFF):
    # Test whether this character is in unicode
    try:
        # The next line throws an exception if the codepoint at n doesn't have a name
        name = unicodedata.name(chr(n))
        # If the last character didn't work, start a new block of unicode characters
        if not last_char_worked:
            last_char_worked = True
            last_block_start = "0"+hex(n)[2:]
            data[last_block_start] = []
        data[last_block_start].append(name)
    # code point n doesn't have a name.
    except ValueError:
        if last_char_worked:
            last_char_worked = False

with open("unicode.js", "w", encoding="ASCII") as fh:
    fh.write(f"var raw_data=`")
    for block_start, names in data.items():
        fh.write(f"\n{block_start}\n")
        fh.write("\n".join(names))
    fh.write("`;")
