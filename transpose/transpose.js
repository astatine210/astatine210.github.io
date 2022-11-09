const delay = 250;
var input, output, select;
var translation_map = new Map();

window.onload = () => {
    [input, output] = document.querySelectorAll('textarea');
    input.last_value = '';
    select = document.querySelector('select');
    for(let m of translation_map) {
        let option = document.createElement('option');
        option.setAttribute('value', option.textContent = m[0]);
        select.appendChild(option);
    }
    select.onchange = update;
    window.setInterval(check_for_update, delay);
}

function check_for_update() {
    if(input.last_value != input.value) {
        input.last_value = input.value;
        update();
    }
}

function update() {
    console.log("Updating "+Date());
    let m = translation_map.get(select.value);
    output.value = input.value.replaceAll(/./g, (c)=>m.has(c)?m.get(c):c);
}

function character_range_map(name, base_chars, offset, exceptions) {
    if(!translation_map.has(name)) {
        translation_map.set(name, new Map());
    }
    let m = translation_map.get(name);
    for(let i in base_chars) {
        i = parseInt(i);
        m.set(base_chars[i], String.fromCodePoint(i + offset));
    }
    if(exceptions) {
        let [characters, codes] = exceptions;
        for(let i in characters) {
            m.set(characters[i], String.fromCodePoint(codes[i]));
        }
    }
}

let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let lower = upper.toLowerCase();
let digits = "0123456789"

character_range_map("Double-struck", upper + lower, 0x1d538,
    ["CHNPQRZ", [0x2102, 0x210d, 0x2115, 0x2119, 0x211a, 0x211d, 0x2124]]);
character_range_map("Double-struck", digits, 0x1d7d8);

character_range_map("Fraktur", upper + lower, 0x1d504,
    ["HIRZC", [0x210c, 0x2111, 0x211c, 0x2128, 0x212d]]);
character_range_map("Fraktur bold", upper + lower, 0x1d56c);

character_range_map("Mathematical script", upper + lower, 0x1d49c,
    ['BEFHILMRego', [0x212c, 0x2130, 0x2131, 0x210b, 0x2110, 0x2112, 0x2133, 0x211b, 0x212f, 0x210a, 0x2134]]);
character_range_map("Mathematical script bold", upper + lower, 0x1d4d0);

character_range_map("Circled", "123456789", 0x2460, ['0', [0x24ea]]);
character_range_map("Circled", upper + lower, 0x24b6);

character_range_map("Negative circled", upper, 0x1f150);
character_range_map("Negative circled", lower, 0x1f150);
character_range_map("Negative circled", digits, 0x2775, ['0', [0x24ff]]);