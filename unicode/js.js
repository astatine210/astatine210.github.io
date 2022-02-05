var search, output;
var data = [];
var delay = 250; //Update time in milliseconds
var replacement_string = "'!#$%&()*+,.:;<=>?@[]^_abcdefghijklmnopqrstuvwxyz{|}~"

/**
 * Onload event. Set up variables, start the periodical update
 */
window.onload = () => {
    search = document.getElementsByTagName('input')[0];
    output = document.getElementsByTagName('div')[0];

    raw_data = raw_data.split(/\n/);
    let codepoint = 0;
    replacements = [];
    for(let line of raw_data) {
        if(line.startsWith('0')) {
            replacements = line.split(/ /);
            codepoint = replacements.shift();
            codepoint = parseInt(line.substring(1), 16);
        } else if (codepoint) {
            let character = String.fromCodePoint(codepoint);
            line = decode(line, replacements);
            let entity = "&#x"+codepoint.toString(16)+";"
            data.push([line, character, entity, codepoint]);
            codepoint += 1;
        }
    }
    search.last_value = '';
    search.focus();

    window.setInterval(check_for_update, delay);
}

/**
 * Unpacks the naive compression in unicode.js
 * @param {String} name 
 * @param {Array} replacements 
 * @returns name with the characters in replacement_string replaced by the strings in replacements
 */
function decode(name, replacements) {
    for(let i in replacements) {
        name = name.replaceAll(replacement_string[i], replacements[i]);
    }
    return name;
}

/**
 * Periodical check for an updated input
 */
function check_for_update() {
    if(search.value != search.last_value) {
        search.last_value = search.value;
        update();
    }
}

/**
 * Updates the output
 */
function update() {
    //Clear the output
    while(output.firstChild) {
        output.removeChild(output.firstChild);
    }
    //Case-insensitive search
    let search_term = search.value.toUpperCase();
    if(search_term.length>2) {
        for(let line of data) {
            if(line[0].indexOf(search_term) !=- 1) {
                let div = char_div(line);
                div.onclick = copy;
                output.appendChild(div);
            }
        }
    }
}

/**
 * @param {String[]} line An array: [NAME, CHARACTER, HEX, DECIMAL]
 * @returns {Element} A a DOM XML <div> element containing a unicode character and its description
 */
function char_div(line) {
    let div = document.createElement('div');
    div.classList.add('class', 'character');
    for([tagname, i] of [['h1', 1], ['p', 0], ['p', 2],['p', 3]]) {
        div.appendChild(text_el(tagname, line[i]))
    }
    return div;
}

/**
 * @param {String} name Tag name
 * @param {String} text Text contents of tag
 * @returns {Element} a DOM XML element equivalent to <name>text</name>
 */
function text_el(name, text) {
    let el = document.createElement(name);
    el.appendChild(document.createTextNode(text))
    return el;
}

/**
 * Copy this div's character to the clipboard buffer
 */
function copy() {
    let char = this.firstChild.firstChild.nodeValue;
    window.navigator.clipboard.writeText(char);
    this.classList.add('clicked');
    window.setTimeout(()=>this.classList.remove('clicked'), 0);
}
