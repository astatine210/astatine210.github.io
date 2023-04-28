"use strict";
const hands = {};

window.onload = () => {
    // Copy minute and hour markers to their positions
    let marker_group = document.getElementById('markers');
    let markers = marker_group.getElementsByTagName('rect');
    for(let t=1; t<60; ++t) {
        let copied_marker = markers[t%5?1:0].cloneNode();
        copied_marker.setAttribute('transform', `rotate(${t*6})`);
        marker_group.appendChild(copied_marker);
    }
    marker_group.removeChild(markers[1]);

    // Instantiate hands
    for(let id of 'hms') { 
        hands[id] = document.getElementById(id);
    }

    // Write numerals
    let numerals = document.getElementById('numerals');
    let original = numerals.getElementsByTagName('text')[0];
    // Radius of number position
    let r = -parseInt(original.getAttribute("y")); 
    original.setAttribute("y","0");
    for(let n=1; n<=12; ++n) {
        let t = original.cloneNode();
        t.textContent = n;
        let dx = r * Math.sin(Math.PI*n/6);
        let dy = -r * Math.cos(Math.PI*n/6);
        t.setAttribute('transform', `translate(${dx} ${dy})`);
        numerals.appendChild(t);
    }
    numerals.removeChild(original);

    update();
    window.setTimeout(()=>{
        hands.s.classList.toggle('tick');
    }, 1000);
}

function update() {
    let d = new Date();
    let s = d.getSeconds()/60;
    let m = (d.getMinutes() + s)/60;
    let h = (d.getHours()%12 + m)/12;
    
    // Prevent the second hand from rotating anticlockwise at 60s
    if(s==0) {
        s=1;
        window.setTimeout(()=>{
            hands.s.classList.toggle('tick');
            hands.s.style.transform = "rotate(0turn)";
            window.setTimeout(()=>{
                hands.s.classList.toggle('tick');
            }, 100);
        }, 500);
    }
    hands.h.style.transform = `rotate(${h}turn)`;
    hands.m.style.transform = `rotate(${m}turn)`;
    hands.s.style.transform = `rotate(${s}turn)`;

    window.setTimeout(update, 1000-d.getMilliseconds());
}
