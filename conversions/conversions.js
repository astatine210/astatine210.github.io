var precision;
var fieldsets = [];

var iter = Object.entries

window.onload = function () {
    let body = document.getElementsByTagName('body')[0];
    precision = document.getElementById('precision');

    // onchange event for precision slider
    precision.onchange = function () {
        // Update legend
        precision.previousSibling.textContent = "Precision: " + precision.value;

        // Update each fieldset, if something's been entered
        for(let fs of fieldsets) {
            for(let i of fs.inputs) {
                if(i.lastUpdated) {
                    i.onchange();
                }
            }
        }
    }
    precision.onchange();

    // Create fieldsets with conversion tables from data
    for(let [name, conversion_data] of iter(data)) {
        let fs = conversion_fieldset(name, conversion_data);
        fieldsets.push(fs);
        body.append(fs);
    }

    // Create fieldset with conversion table from temperature functions
    let temp_fs = temperature_fieldset(temperature_data);
    fieldsets.push(temp_fs);
    body.append(temp_fs);
}

function conversion_fieldset(name, data) {
    // <fieldset><legend>$type Conversion</legend><table/><fieldset>
    let fs = new_el('fieldset', [
        new_el('legend', (name + " conversion").toTitleCase()),
        table = new_el('table')
    ]);
    
    fs.inputs = [];

    // Add rows to table
    for(let [unit, factor] of data) {
        if(unit != "hr") {
            // <tr><td>Unit name</td><td><input/></td></tr>
            table.append(
                new_el('tr', [
                    new_el('td', unit),
                    new_el('td',
                        i = new_el('input')
                    )
                ])
            );
            // onchange event for input field
            i.factor = factor;
            i.onchange = function() {
                for(let input of fs.inputs) {
                    // Update all other input fields in this fieldset
                    if(input != this) {
                        // Remove highlighting
                        input.lastUpdated = false;
                        input.classList.remove('last_updated');
                        // Update value
                        input.value = round(this.value * this.factor / input.factor);
                    }
                }
                // Add highlighting to self
                this.lastUpdated = true;
                this.classList.add('last_updated');
            }
            fs.inputs.push(i);
        } else {
            // <tr><td colspan="2"><hr/></td></tr>
            table.append(
               new_el('tr',
                   new_el('td',
                       new_el('hr'), {"colspan":2}
                    )
                )
            );
        }
    }
    return fs;
}

function temperature_fieldset(data) {
    let fs = new_el('fieldset', [
        new_el('legend', 'Temperature Conversion'),
        table = new_el('table')
    ]);
    fs.inputs = [];

    for(let [unit, to_c, from_c] of data) {
        table.append(
            new_el('tr', [
                new_el('td', unit),
                new_el('td',
                    i = new_el('input')
                )
            ])
        )
        i.to_c = to_c;
        i.from_c = from_c;
        i.onchange = function () {
            let c = this.to_c(parseFloat(this.value));
            for(let input of fs.inputs) {
                if(input != this) {
                    input.lastUpdated = false;
                    input.classList.remove('last_updated');
                    input.value = round(input.from_c(c));
                }
                this.lastUpdated = true;
                this.classList.add('last_updated');
            }
        }
        fs.inputs.push(i);
    }
    return fs;
}

/**
 * @param {String} name Element name
 * @param {Array|String|Element} child Appends child, or children.
 * @param {Object} attrs Creates node attributes from key:pair values
 * @returns {Element} Element
 */
function new_el(name, child, attrs) {
    let e = document.createElement(name);
    if(child) {
        if(Array.isArray(child)) {
            for(let item of child) {
                e.append(item);
            }
        } else {
            e.append(child);
        }
    }
    if(attrs) {
        for(let [attr, value] of iter(attrs)) {
            e.setAttribute(attr, value);
        }
    }
    return e;
}

/**
 * @returns String to title case
 */
String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, s=>s[0].toUpperCase() + s.substr(1));
}

/**
 * 
 * @param {number} n 
 * @returns n rounded to integer if it's more than precision digits, or to precision.
 */
function round(n) {
    let p = precision.value;
    if(Math.log10(Math.abs(n)) >= p) {
        return Math.round(n, 0);
    }
    return parseFloat(n).toPrecision(p);
}
