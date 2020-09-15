# Readme file for Regular Expression Search and Replace

## What is this?

It's a simple webpage that performs regular expression searches and replacements on plain text.

## Who is this made for?

Mostly:

1. People in clerical jobs who want to use regular expressions on plain text, but don't have a programming environment.
2. Programmers who want to test regular expressions without having to write a program for them.

If you don't want to learn how to use regular expressions, this may not be for you. If you have a programming environment, it may still save you time.

## Why did you make this?

I've worked in web development, and I've also worked in clerical jobs to keep food on the table. It was frustrating to not have something that could do regular expression replacements, so I made this. I thought it would be nice to pass it on.

## How do I use this?

* Paste your starting text in the top text area.
* Put a replacement pattern in the mid-section.
* If your regular expression is invalid, it won't be performed on the text, and it will show up in red.
* Replaced text should appear in the bottom text area.

### Other notes on use

* Toggling the 'sort' button will sort the output's lines alphabetically.
* The '+' button adds a new regular expression below the current one.
* The '-' button deletes that regular expression.
* The 'm', 'g' and 'i' checkboxes are for the *multiline*, *greedy* and *case-insensitive* flags, respectively. Greedy and multiline are set by default.
* Regular expressions are limited to the capabilities of your browser's `RegExp` javascript engine.