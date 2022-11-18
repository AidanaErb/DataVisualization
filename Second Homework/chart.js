// window.onload = function() {
//     var buttons = document.getElementsByClassName('btn');
    
//     for (let index = 0; index < buttons.length; index++) {
//         buttons[index].addEventListener("click", (event) => {
//             const wrapper = d3.select("#wrapper");
//             wrapper.innerHTML = "";
//             event.preventDefault();
//             buildPlot(buttons[index].value);
//         })
        
//     }
// }

async function buildPlot(id, parameter) {
    const data = await d3.json("my_weather_data.json");
    const xAccessor = (d) => d[parameter];
    const yAccessor = (d) => d.length;

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 350,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right-15;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    wrapper.html("");

    const svg = wrapper.append("svg")
        .attr("height",dimension.height)
        .attr("width",dimension.width);

    const bounded = svg.append("g")
        .style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const scaleX = d3.scaleLinear()
        .domain(d3.extent(data,xAccessor))
        .range([0, dimension.boundedWidth])
        .nice();

    svg.append("g")
        .attr("transform", "translate(39," + dimension.boundedHeight + ")")
        .call(d3.axisBottom(scaleX));

    const histogram = d3.histogram()
        .domain(scaleX.domain())
        .value(xAccessor)
        .thresholds(12);

    const bins = histogram(data);

    const scaleY = d3.scaleLinear()
        .domain([0, d3.max(bins, yAccessor)])
        .range([dimension.boundedHeight,0]);
    
    svg.append("g")
        .attr("transform", "translate(" + 39 + " ,0)")
        .call(d3.axisLeft(scaleY));

    const binGroup = bounded.append("g");
    const binGroups = binGroup.selectAll("g")
            .data(bins)
            .enter()
            .append("g");

    console.log(bins);

    const margin = 40;
    const barPadding = 1
    const barRect = binGroups.append("rect")
        .attr("x", d => scaleX(d.x0) + barPadding / 2 + margin) 
        .attr("y", d => scaleY(yAccessor(d)))
        .attr("width", d => d3.max([0, scaleX(d.x1) - scaleX(d.x0) - barPadding]))
        .attr("height", d => dimension.boundedHeight - scaleY(yAccessor(d)))
        .attr("fill", "#88A2AD");

    const barText = binGroups.filter(yAccessor)
        .append("text")
        .attr("x", d => scaleX(d.x0) + (scaleX(d.x1) - scaleX(d.x0)) / 2 + margin)
        .attr("y", d => scaleY(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill", "darkgrey")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");
}

buildPlot(1, 'temperatureLow');