# Discord timestamp generator

A quick'n'dirty generator for timezone-agnostic timestamps in Discord with no distracting choices.

## Features & Limitations

* It's fixed to the timezone of whatever browser you're using. There's no dialog to change that.

* Only outputs one kind of timestamp - a full date with the weekday, followed by relative time in parentheses.

* The date you enter is limited by the capabilities of JavaScript's `[Date.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)` function.

* Doesn't advertise anything.

* Doesn't connect to anything remotely; no external scripts, fonts, stylesheets, spyware, *etc.*

## Disclaimer

The author makes no guarantee of this software being of any practical or reliable use.

If you want to add features to this tool, fork it and write your own.
