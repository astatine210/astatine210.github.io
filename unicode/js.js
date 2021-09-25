var search, output;
var data = [];
var delay = 250; //Update time in milliseconds
/**
 * Onload event. Set up variables, start the periodical update
 */
window.onload = () => {
    search = document.getElementsByTagName('input')[0];
    output = document.getElementsByTagName('div')[0];

    raw_data = raw_data.split(/\n/);
    let codepoint = 0;
    for(let line of raw_data) {
        if(line.startsWith('0')) {
            codepoint = parseInt(line.substring(1), 16);
        } else if (codepoint) {
            data.push([line, String.fromCodePoint(codepoint), "&#x"+codepoint.toString(16)+";", codepoint]);
            codepoint += 1;
        }
    }

    console.log(data);

    search.last_value = '';
    search.focus();

    window.setInterval(check_for_update, delay);
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
    while(output.firstChild) {
        output.removeChild(output.firstChild);
    }
    search_term = search.value.toUpperCase();
    if(search_term.length>2) {
        for(let line of data) {
            if(line[0].indexOf(search_term) !=- 1) {
                let div = output.appendChild(char_div(line));
                div.onclick = copy;
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
 * @returns {Element} a DOM XML element equivalent to &lt;name&gt;text&lt;/name&gt;
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
