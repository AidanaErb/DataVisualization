async function createForceLayout() {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

     var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
return hash;
    }, {})

     edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
      })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
     .force("charge", d3.forceManyBody().strength(-40))
     .force("center", d3.forceCenter().x(300).y(300))
     .force("link", linkForce)
     .nodes(nodes)
     .on("tick", forceTick)

   simulation.force("link").links(edges)

   var dimension = {
       width: window.innerWidth*0.8,
       height: window.innerWidth*0.8,
       margin: {
           top: 50,
           right: 10,
           bottom: 10,
           left: 55
       }
   }

   dimension.boundedWidth = dimension.width
       - dimension.margin.right
       - dimension.margin.left;

   dimension.boundedHeight = dimension.height
       - dimension.margin.top
       - dimension.margin.bottom;

   const wrapper = d3.select("#wrapper")
       .append("svg")
       .attr("width", dimension.width)
       .attr("height", dimension.height)


  wrapper.selectAll("line.link")
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .style("stroke-width", d => d.weight);

   var nodeEnter = wrapper.selectAll("g.node")
      .data(nodes, d => d.id)
      .enter()
      .append("g")
      .attr("class", "node");
   nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", d => roleScale(d.role))
   nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(d => d.id);

   function forceTick() {
     d3.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
     d3.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
   }

   //drag-n-drop
   var drag = d3.drag()
    drag.on("drag", (e, d) => {
        // console.log(e)
        d.fx = e.x
        d.fy = e.y
        if (simulation.alpha() < 0.1) {
            simulation.alpha(0.1)
            simulation.restart()
        }
    })

    d3.selectAll("g.node").call(drag);
}

window.onload = function() {
    var buttons = document.getElementsByClassName('btn');
    
    buttons[0].addEventListener("click", (event) => {
        event.preventDefault();
        id = document.getElementById('id').value;
        role = document.getElementById('role').value;
        team = document.getElementById('team').value;

        addNodesAndEdges(id, role, team);
    })
    buttons[1].addEventListener("click", (event) => {
        event.preventDefault();
        delete_id = document.getElementById('delete_id').value;

        deleteEdges(delete_id);
    })
}

async function addNodesAndEdges(id, role, team) {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

     var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
return hash;
    }, {})

     edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
      })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
     .force("charge", d3.forceManyBody().strength(-40))
     .force("center", d3.forceCenter().x(300).y(300))
     .force("link", linkForce)
     .nodes(nodes)
     .on("tick", forceTick)

   simulation.force("link").links(edges)

   var dimension = {
       width: window.innerWidth*0.8,
       height: window.innerWidth*0.8,
       margin: {
           top: 50,
           right: 10,
           bottom: 10,
           left: 55
       }
   }

   dimension.boundedWidth = dimension.width
       - dimension.margin.right
       - dimension.margin.left;

   dimension.boundedHeight = dimension.height
       - dimension.margin.top
       - dimension.margin.bottom;

   const wrapper = d3.select("#wrapper")
       .append("svg")
       .attr("width", dimension.width)
       .attr("height", dimension.height)


  wrapper.selectAll("line.link")
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .style("stroke-width", d => d.weight);

   var nodeEnter = wrapper.selectAll("g.node")
      .data(nodes, d => d.id)
      .enter()
      .append("g")
      .attr("class", "node");
   nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", d => roleScale(d.role))
   nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(d => d.id);

   function forceTick() {
     d3.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
     d3.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
   }

   //drag-n-drop
   var drag = d3.drag()
    drag.on("drag", (e, d) => {
        // console.log(e)
        d.fx = e.x
        d.fy = e.y
        if (simulation.alpha() < 0.1) {
            simulation.alpha(0.1)
            simulation.restart()
        }
    })

    d3.selectAll("g.node").call(drag);

    simulation.stop()
    var oldEdges = simulation.force("link").links()
    var oldNodes = simulation.nodes()
    var newNode1 = {id: id, role: role, team: "none"}

    var newSource = [];
    for (let index = 0; index < oldNodes.length; index++) {
        const element = oldNodes[index];
        if (element.id==team) {
            newSource = element;
            break;
        }
    }
    // console.log(newSource.id);
    var newEdge1 = {source: newSource, target: newNode1, weight: 5}

    oldEdges.push(newEdge1)
    oldNodes.push(newNode1)
    simulation.force("link").links(oldEdges)
    simulation.nodes(oldNodes)
    d3.select("svg").selectAll("line.link")
        .data(oldEdges, d => d.source.id + "-" + d.target.id)
        .enter()
        .insert("line", "g.node")
        .attr("class", "link")
        .style("stroke", "#FE9922")
        .style("stroke-width", 5)

    var nodeEnter = d3.select("svg").selectAll("g.node")
        .data(oldNodes, d => d.id)
        .enter()
        .append("g")
        .attr("class", "node")
    nodeEnter.append("circle")
        .attr("r", 5)
        .style("fill", "#FCBC34")
    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(d => d.id)
    simulation.alpha(0.1)
    simulation.restart()
}

async function deleteEdges(delete_id) {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

     var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
return hash;
    }, {})

     edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
      })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
     .force("charge", d3.forceManyBody().strength(-40))
     .force("center", d3.forceCenter().x(300).y(300))
     .force("link", linkForce)
     .nodes(nodes)
     .on("tick", forceTick)

   simulation.force("link").links(edges)

   var dimension = {
       width: window.innerWidth*0.8,
       height: window.innerWidth*0.8,
       margin: {
           top: 50,
           right: 10,
           bottom: 10,
           left: 55
       }
   }

   dimension.boundedWidth = dimension.width
       - dimension.margin.right
       - dimension.margin.left;

   dimension.boundedHeight = dimension.height
       - dimension.margin.top
       - dimension.margin.bottom;

   const wrapper = d3.select("#wrapper")
       .append("svg")
       .attr("width", dimension.width)
       .attr("height", dimension.height)


  wrapper.selectAll("line.link")
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .style("stroke-width", d => d.weight);

   var nodeEnter = wrapper.selectAll("g.node")
      .data(nodes, d => d.id)
      .enter()
      .append("g")
      .attr("class", "node");
   nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", d => roleScale(d.role))
   nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(d => d.id);

   function forceTick() {
     d3.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
     d3.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
   }

   //drag-n-drop
   var drag = d3.drag()
    drag.on("drag", (e, d) => {
        // console.log(e)
        d.fx = e.x
        d.fy = e.y
        if (simulation.alpha() < 0.1) {
            simulation.alpha(0.1)
            simulation.restart()
        }
    })

    d3.selectAll("g.node").call(drag);

    simulation.stop()
    var oldEdges = simulation.force("link").links()
    var oldNodes = simulation.nodes()
    var newNode1 = {id: id, role: role, team: "none"}

    var newSource = [];
    var deleteIndex = 0;
    for (let index = 0; index < oldNodes.length; index++) {
        const element = oldNodes[index];
        if (element.id==delete_id) {
            newSource = element;
            deleteIndex = index;
            break;
        }
    }
    var deleteEdges = [];
    for (let index = 0; index < oldEdges.length; index++) {
        const element = oldEdges[index];
        if (element.target==newSource) {
            deleteEdges.push(index);
        }
    }
    var newEdge1 = {source: newSource, target: newNode1, weight: 5}

    for (let index = 0; index < deleteEdges.length; index++) {
        oldEdges.splice(deleteEdges[index], 1);
    }

    oldNodes.splice(deleteIndex, 1)
    simulation.force("link").links(oldEdges)
    simulation.nodes(oldNodes)
    d3.select("svg").selectAll("line.link")
        .data(oldEdges, d => d.source.id + "-" + d.target.id)
        .enter()
        .insert("line", "g.node")
        .attr("class", "link")
        .style("stroke", "#FE9922")
        .style("stroke-width", 5)

    var nodeEnter = d3.select("svg").selectAll("g.node")
        .data(oldNodes, d => d.id)
        .enter()
        .append("g")
        .attr("class", "node")
    nodeEnter.append("circle")
        .attr("r", 5)
        .style("fill", "#FCBC34")
    nodeEnter.append("text")
        .style("text-anchor", "middle")
        .attr("y", 15)
        .text(d => d.id)
    simulation.alpha(0.1)
    simulation.restart()
}



createForceLayout()
// addNodesAndEdges()