/** Time between form update checks, in milliseconds. */
var delay = 250;
/** Input and output textareas. */
var in_text, out_text;
/** Array containing all regex fieldsets. */
var fieldsets;
/** Array of form items that will be periodically checked for changes. */
var inputs_to_check;
/** Copy of the regex fieldset, stored in memory so it can be inserted. */
var blank_fieldset;

window.onload = ()=> {
    fieldsets = document.getElementsByTagName('fieldset');
    blank_fieldset = fieldsets[0].cloneNode(true);
    [in_text, out_text] = document.getElementsByTagName('textarea');
    inputs_to_check = document.getElementsByClassName('check');

    //Set their last value, to see whether they've changed
    for(let i of inputs_to_check) {
        i.last_value = (i.type=='checkbox')?i.checked:i.value;
    }

    //There's only one "remove regex" button. Disable it.
    document.getElementsByClassName('remove')[0].disabled = true;

    check_for_update();

    //Periodically check for changes to the form.
    window.setInterval(check_for_update, delay);
}

/**
 * Check whether the form has changed, and if it has,
 *  start an update.
*/
function check_for_update() {
    let updated = false;

    //Check if anything's changed
    for(let i of inputs_to_check) {
        let new_value = (i.type=='checkbox')?i.checked:i.value;
        if(i.last_value != new_value) {
            i.last_value = new_value;
            updated = true;
        }
    }

    if(updated) {
        update();
    }
}

/** Unescape the tab and newline characters in a string */
var unescape_map = new Map([['\\n', '\n'],['\\t', '\t'],['\\r', '\r']]);
String.prototype.unescape = function() {
    return this.replace(
        /(\\[trn])/,
        s => unescape_map.has(s)?unescape_map.get(s):s
    );
}

/**
 * Run each regex in sequence on the contents of the first textarea,
 *  and put the result in the second textarea.
 */
function update() {
    let text = in_text.value;

    // Iterate over each regex
    for(let f of fieldsets) {
        let fieldset_inputs = [...f.getElementsByTagName('input')]

        // Get the inputs' values
        let [regex, replacement, i, g, m] =
            fieldset_inputs.map(
                (el) => (el.type=='checkbox')?el.checked:el.value
            );

        fieldset_inputs[0].classList.remove('error');

        if(regex != '') {
            try { // This block will throw an exception if passed a malformed regex
                text = text.replace(
                    new RegExp(regex, (i?"i":'') + (g?"g":'') + (m?"m":'')),
                    replacement.unescape()
                );
            } catch {
                // Regex is malformed. Highlight the regex and don't replace anything.
                fieldset_inputs[0].classList.add('error');
            }
        }

        // Sort button is on, so sort all the lines alphabetically.
        if(f.getElementsByClassName('sort')[0].value=="1") {
            text = sort_lines(text);
        }
    }

    out_text.value = text;
}

/**
 * Sort text by line, alphabetically
 * @arg {string} s - A button element
 */
function sort_lines(s) {
    s = s.split('\n');
    s.sort();
    return s.join("\n");
}

/**
 * Toggle a sort button's state
 * @arg {Object} A button element
 */
function toggle_sort(self) {
    self.value = (self.value!="1")?"1":"0";
}

/**
 * Add a new regex fieldset (when a "+" button has been clicked)
 * @arg {Object} self - A button element
 * @arg {Object} self.parentNode - This button's parent node (a fieldset)
 * @arg {Object} self.parentNode.parentNode - This button's grandparent node (a div)
 * @arg {Object} self.parentNode.parentNode.lastChild - The last fieldset in the div
 */
function add_fieldset(self) {
    //If we're adding after the last regex fieldsets, just append
    if(self.parentNode == self.parentNode.parentNode.lastChild) {
        self.parentNode.parentNode.appendChild(blank_fieldset.cloneNode(true));
        //Otherwise insert a new fieldset between fieldsets
    } else {
        self.parentNode.parentNode.insertBefore(
                blank_fieldset.cloneNode(true), self.parentNode.nextSibling
            );
        }
        
    //Update the inputs we're periodically checking
    inputs_to_check = document.getElementsByClassName('check');
    
    //Un-disable the remove buttons.
    for(let button of document.getElementsByClassName('remove')) {
        button.disabled = false;
    }
    update();
}
    
/**
 * Remove a regex fieldset (when a "-" button has been clicked)
 * @arg {Object} self - A button element
 */
function remove_fieldset(self) {
    let num_fieldsets = document.getElementsByTagName('fieldset').length

    // ...don't remove it if we're down to the last one.
    if(num_fieldsets == 1) {
        return false;
    }

    // Remove self from parent
    self.parentNode.parentNode.removeChild(self.parentNode);
    inputs_to_check = document.getElementsByClassName('check');

    // Disable the button if we're down to the last one
    num_fieldsets -= 1;

    if(num_fieldsets == 1) {
        document.getElementsByClassName('remove')[0].disabled = true;
    }
    update();
}