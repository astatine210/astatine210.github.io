"""Creates a Javascript file with all the unicode characters in it
that the unicodedata module knows of."""

import unicodedata
from collections import Counter

# ASCII Characters that never appear in unicode names and won't disrupt a javascript string in double quotes
replacement_string = "'!#$%&()*+,.:;<=>?@[]^_abcdefghijklmnopqrstuvwxyz{|}~"

# Flag whether the last codepoint has a name
last_char_worked = False
# Name of the current contiguous block of unicode characters
current_block = ""
# Dict to store {"block start":[list of names]}
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
            # Each block's key is the hex number of the first character's
            # code point prepended by a zero
            current_block = "0" + hex(n)[2:]
            data[current_block] = []
        # Append this name to the current block
        data[current_block].append(name)
    # If code point n doesn't have a name, mark that the last character didn't have one
    except ValueError:
        last_char_worked = False

# Find the commonest words in each block and replace them with single
#  characters that never appear in unicode names
for block_start, names in data.items():
    # Split words before hyphens
    words = [n.replace("-", "- ") for n in names]
    # Get a frequency distribution for the words
    words = Counter((" ").join(words).split())
    # Filter out short words and words that only appear once, and multiply the
    #  frequency by the length of the word (minus 1) to get the space that will be saved
    words = {
        word: freq * (len(word)-1) for (word, freq) in words.items() if freq > 1 and len(word) > 1
    }
    # Sort words by descending space taken up
    words = [word[0] for word in sorted(words.items(), key = lambda i:i[1], reverse=True)][:len(replacement_string)]
    # Create line at start of this block with the hex of the starting codepoint and
    #  the words we're replacing
    first_line = block_start + " " + " ".join(words)
    # Replace the frequent words with single characters from replacement_string
    for word, replacement in zip(words, replacement_string):
        for i, name in enumerate(names):
            names[i] = names[i].replace(word, replacement)
    # Prepend the first line to the list
    names.insert(0, first_line)

with open("unicode.js", "w", encoding="ASCII", newline="\n") as fh:
    fh.write(f"var raw_data=`")
    fh.write("\n".join("\n".join(names) for names in data.values()))
    fh.write("`;")
