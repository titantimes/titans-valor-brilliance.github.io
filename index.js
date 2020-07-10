var colors = {
    AVO: ["rgba(52, 180, 235,1)",0],
    IBT: ["rgba(165,199,214,1)",1],
    GSB: ["rgba(196,237,255,1)",2],
    Cdr: ["rgba(67,74,77,1)",3],
    EDN: ["rgba(46,255,49,1)",4],
    ERN: ["rgba(3,72,148,1)",5],
    ESI: ["rgba(163,54,0,1)",6],
    Hax: ["rgba(158,0,163,1)",7],
    Imp: ["rgba(232,31,5,1)",8],
    Fox: ["rgba(255,107,43,1)",9],
    LXA: ["rgba(247,10,184,1)",10],
    PUN: ["rgba(156,0,114,1)",11],
    Phi: ["rgba(209,0,77,1)",12],
    ANO: ["rgba(0,0,0,1)",13]
}
var ctx = document.getElementById('graph');
var graph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [1, 2, 3, 4, 5, 6],
        datasets: []
    },
    options: {
        responsive: false,
        // maintainAspectRatio: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

async function getData() {
    window.data = window.data || fetch("http://stormy-headland-17317.herokuapp.com/getdata")
    .then((res) => {
        return res.text()
    }).then((text) => {
        return JSON.parse(text)
    })
    return window.data
}
async function updateChart() {
    let data = await getData();
    let columns = [...document.querySelector("#list").children].filter((e)=>e.children[0].checked).map((e)=>colors[e.textContent][1])
    graph.data.labels = data.values.slice(1).map((d) => d[0])
    graph.data.datasets = data.values[0].slice(1).map((lab) => ({
        label: lab,
        data: [],
        backgroundColor: [colors[lab][0]],
        borderColor: [colors[lab][0]],
        borderWidth: 3,
        fill: false
    }))

    data.values.slice(1).forEach((e, i) => {
        columns.forEach((e1, i)=> {
            graph.data.datasets[e1].data.push(e[e1+1])
        })
        // e.slice(1).forEach((e1, i1) => {
        //     graph.data.datasets[i1].data.push(e1)
        // })
    })
    graph.update()
}
setTimeout(async (e) => {
    let elm = document.querySelector("#list")
    elm.onchange = async (e)=>{
        await updateChart()
    }
    Object.keys(colors).forEach((e)=>{
        let t = document.createElement("li", e)
        t.style.color = colors[e][0]
        t.textContent = e;
        let c = document.createElement("input")
        c.type = "checkbox"
        t.appendChild(c)
        elm.appendChild(t)
    })
    await updateChart()
}, 500)