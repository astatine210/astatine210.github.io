var data = {
    "length": [
        ["nm", .000001],
        ["µm", .001],
        ["mm", 1],
        ["hr", 0],
        ['cm', 10],
        ["m", 1000],
        ["hr", 0],
        ["mils", .0254],
        ["in", 25.4],
        ["hr", 0],
        ["ft", 25.4*12],
        ["yd", 25.4*12*3],
        ["hr", 0],
        ["km", 1000000],
        ["miles", 25.4*12*3*1760],
        //["AU", 149597870700000],
    ],
    "mass":[
        ["µg", .000001],
        ["mg", .001],
        ["g", 1],
        ["kg", 1000],
        ["tonne", 1e6],
        ["hr", 0],
        ["oz", 28.349523125],
        ["lb", 28.349523125*16],
        ["st", 28.349523125*16*14],
        ["cwt", 28.349523125*16*14*8],
        ["ton", 28.349523125*16*14*8*20],
    ],
    "area": [
        ["mm²", 1],
        ["cm²", 100],
        ["m²", 1e6],
        ["hr", 0],
        ["in²", Math.pow(25.4, 2)],
        ["ft²", Math.pow(25.4*12, 2)],
        ["yd²", Math.pow(25.4*12*3, 2)],
        ["hr", 0],
        ["hectares", 1e10],
        ["acres", Math.pow(25.4*12*3*22, 2) * 10],
        ["miles²", Math.pow(25.4*12*3*1760, 2)],
    ],
    "volume": [
        ["ml (cc)", 1],
        ["l (dm³)", 1000],
        ["m³", 1e6],
        ["hr", 0],
        ["cu in", Math.pow(2.54, 3)],
        ["cu ft", Math.pow(2.54*12, 3)],
        ["cu yd", Math.pow(2.54*12*3, 3)],
        ["hr", 0],
        ["US fl.oz", Math.pow(2.54, 3)*531/128],
        ["US pint", Math.pow(2.54, 3)*531/8],
        ["US gal.", Math.pow(2.54, 3)*531],
        ["hr", 0],
        ["imp. fl.oz", 28.4130625],
        ["imp. pint", 28.4130625*20],
        ["imp. gal.", 28.4130625*20*8],
    ],
    "pressure": [
        ["Pa", 1],
        ["kPa", 1000],
        ["atm", 101325],
    ]
}

var temperature_data = [
    //Name, to_c(), from_c()
    ["°C", t => t, t => t],
    ["°F", t => (t-32)/1.8, t => (t*1.8)+32],
    ["K",  t => t - 273.15, t => t + 273.15],
]