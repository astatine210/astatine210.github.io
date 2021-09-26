"""Creates a Javascript file with all the unicode characters in it
that the unicodedata module knows of."""

import unicodedata
from collections import Counter

replacement_string = "!@#$%^&*()_:;<=>?~{}/|"


# Flag whether the last codepoint has a name
last_char_worked = False
last_block_start = ""
data = {}
for n in range(0x10FFFF):
    # Test whether this character is in unicode
    try:
        # The next line throws a ValueError exception if
        #  the codepoint at n doesn't have a name
        name = unicodedata.name(chr(n))
        # If the last character didn't work, start a new block of unicode characters
        if not last_char_worked:
            last_char_worked = True
            last_block_start = "0" + hex(n)[2:]
            data[last_block_start] = []
        data[last_block_start].append(name)
    # code point n doesn't have a name.
    except ValueError:
        if last_char_worked:
            last_char_worked = False

# Find the commonest words in each block
common_words = {}
for block_start, names in data.items():
    # Split words before hyphens
    names = [n.replace("-", "- ") for n in names]
    # Get a frequency distribution for the words
    words = Counter((" ").join(names).split())
    # Sort them by descending frequency
    words = sorted(words.items(), key=lambda i: i[1], reverse=True)

    # Zip into a dictionary of word:replacement for this block, for instance:
    #  {'CJK': '!', 'UNIFIED': '@', 'IDEOGRAPH-': '#'}
    common_words[block_start] = dict(
        zip(
            (word for (word, freq) in words if freq > 1 and len(word) > 1),
            replacement_string,
        )
    )

with open("unicode.js", "w", encoding="ASCII", newline="\n") as fh:
    fh.write(f"var raw_data=`")
    for block_start, names in data.items():
        replacements = common_words[block_start]
        replacement_string = " ".join(replacements)
        for i, name in enumerate(names):
            for string, replacement in replacements.items():
                names[i] = names[i].replace(string, replacement)
        fh.write(f"\n{block_start} {replacement_string}\n")
        fh.write("\n".join(names))
    fh.write("`;")
