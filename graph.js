function Vertex(dependencies, calculatedFunction){
	this.dependencies = dependencies;
	this.calculatedFunction = calculatedFunction;
	this.wasChecked = false;
}

var example = {
xs: new Vertex([], ([]) => [1,2,3,6]),
n: new Vertex(['xs'], ([xs]) => xs.length),
m: new Vertex(['xs', 'n'], ([xs, n]) => xs.reduce((sum, cur) => sum + cur) / n),
m2: new Vertex(['xs', 'n'], ([xs, n]) => xs.reduce((sum, cur) => sum + cur * cur) / n),
v: new Vertex(['m', 'm2'], ([m, m2]) => m2 - m * m)
};

var loopExample = {
a: new Vertex(['b'], ([b]) => b++),
b: new Vertex(['a'], ([a]) => a++)
};

function calculateLazy(vertexName, graph){
	var v = graph[vertexName];
	
	if (v === undefined){
		throw new Error("Calculation failed: Vertex \"" + vertexName + "\" is not presented in the graph");
	}
	
	if (v.result === undefined){
		
		if (v.wasChecked === true){
			throw new Error("Calculation failed: Loop with vertex \"" + vertexName + "\" was found during the calculation");
		}
		
		v.wasChecked = true;
		
		var dependenciesResults = [];
				
		for (var i = 0; i < v.dependencies.length; i++){
			if (graph[v.dependencies[i]].result === undefined){
				dependenciesResults.push(calculateLazy(v.dependencies[i], graph));
			} 
			else{
				dependenciesResults.push(graph[v.dependencies[i]].result);
			}
		}
		
		v.result = v.calculatedFunction(dependenciesResults);
	}
	
	return v.result;
}

function calculateAll(graph){
	for (var v in graph){
		var result = calculateLazy(v, graph);
		console.log(v + ": "  + result);
	}
}
//console.log("a: ", calculateLazy('a', loopExample));
//console.log("a: ", calculateLazy('a', example));

console.log("xs: ", calculateLazy('xs', example));
console.log("xs: ", calculateLazy('xs', example));
console.log("n: ", calculateLazy('n', example));
console.log("m: ", calculateLazy('m', example));
console.log("m2: ", calculateLazy('m2', example));
console.log("v: ", calculateLazy('v', example));


console.log("Calculate all started");
calculateAll(example);
console.log("Calculate all finished");
