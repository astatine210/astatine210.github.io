let precision = 4; // Number precision
let inputs = []; // Array of <input> elements
let last_input; // Records the last input updated

/**
 * Onload event. Sets the whole page up.
 */
window.onload = ()=> {
    document.title = document.getElementsByTagName('legend')[0].firstChild.nodeValue + " " + document.title;
    
    let fieldset = document.getElementsByTagName('fieldset')[0];

    for([name, to_c, from_c] of units) {

        if(name == 'hr') {
            fieldset.appendChild(document.createElement('hr'));
            continue;
        }
        
        let div = document.createElement('div');

        let label = document.createElement('label');
        label.setAttribute('for', name);
        label.appendChild(document.createTextNode(name));
        div.appendChild(label);
        
        let input = document.createElement('input');
        input.to_c = to_c;
        input.from_c = from_c;
        input.setAttribute('name', name);
        input.value = this.from_c(0);
        input.onchange = update;
        if(to_c(1) == 1) {
            last_input = input;
        }
        div.appendChild(input);
        inputs.push(input);
        
        fieldset.appendChild(div);
        fieldset.appendChild(document.createTextNode('\n'));
    }   
    
    fieldset.appendChild(document.createElement('span'));
    
    let minus_button = fieldset.appendChild(document.createElement('button'));
    minus_button.appendChild(document.createTextNode('-'));
    
    let plus_button = fieldset.appendChild(document.createElement('button'));
    plus_button.appendChild(document.createTextNode('+'));
    
    /**
     * Set the displayed precision value
     */
    function set_precision() {
        document.getElementsByTagName('span')[0].innerText = "Precision: " + precision;
    }
    
    set_precision(precision);
    
    minus_button.onclick = ()=> {
        if(precision > 1) {
            precision -= 1;
        }
        set_precision(precision);
        last_input.onchange();
    }
    
    plus_button.onclick = ()=> {
        precision += 1;
        set_precision(precision);
        last_input.onchange();
    }
    
    minus_button.setAttribute('accesskey', "-");
    plus_button.setAttribute('accesskey', "+");
    
    last_input.focus()
}
/**
 * Updates all inputs, except the one that just changed
 */
function update() {
    let base_unit = this.to_c(parseFloat(this.value));

    for(input of inputs) {
        if(input != this) {
            input.value = input.from_c(base_unit).toPrecision(precision);
        }
    }
    last_input = this;
}