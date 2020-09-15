/** Number precision of output */
let precision = 4; 
/** Array of <input> elements */
let inputs = [];
/** Records the last input element updated */ 
let last_input; 

/**
 * Onload event. Sets the whole page up.
 */
window.onload = ()=> {
    //Change the page title
    document.title = document.getElementsByTagName('legend')[0].firstChild.nodeValue + " " + document.title;
    
    let fieldset = document.getElementsByTagName('fieldset')[0];
    
    //Create each input field
    for([name, multiplier] of units) {
        if(name == 'hr'){
            fieldset.appendChild(document.createElement('hr'));
            continue;
        }

        let div = document.createElement('div');
        let label = document.createElement('label');
        label.setAttribute('for', name);
        label.appendChild(document.createTextNode(name));
        div.appendChild(label);
        
        let input = document.createElement('input');
        input.multiplier = multiplier;
        input.setAttribute('name', name);
        input.value = 0;
        input.onchange = update;
        if(multiplier == 1) {
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
    function set_precision(){
        document.getElementsByTagName('span')[0].innerText = "Precision: " + precision;
    }
    
    set_precision();
    
    minus_button.onclick = ()=> {
        if(precision > 1) {
            precision -= 1;
        }
        set_precision();
        last_input.onchange();
    }
    
    plus_button.onclick = ()=> {
        precision += 1;
        set_precision();
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
    let base_unit = parseFloat(this.value) * this.multiplier;

    for(input of inputs) {
        if(input != this) {
           input.value = (base_unit / input.multiplier).toPrecision(precision);
        }
    }
    last_input = this;
    this.focus();
}
