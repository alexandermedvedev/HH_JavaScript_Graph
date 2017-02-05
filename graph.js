function Vertex(dependencies, calculatedFunction){
	this.dependencies = dependencies;
	this.calculatedFunction = calculatedFunction;
	this.result;
	this.isCheckingForLoop = false;
}

var example = {};
example.xs = new Vertex([], ([]) => [1,2,3,6]);
example.n = new Vertex(['xs'], function([xs]) {return xs.length});
example.m = new Vertex(['xs', 'n'], function([xs, n]) {return xs.reduce((sum, cur) => sum + cur) / n});
example.m2 = new Vertex(['xs', 'n'], function([xs, n]) {return xs.reduce((sum, cur) => sum + cur * cur) / n});
example.v = new Vertex(['m', 'm2'], function([m, m2]) {return m2 - m * m});


var loopExample = {};
loopExample.a = new Vertex(['b'], function([b]) {return b++});
loopExample.b = new Vertex(['a'], function([a]) {return a++});

function lazyCalculation(vertexName, graph){
	console.log("Start calculation of " + vertexName);
	var v = graph[vertexName];
	
	if (v === undefined){
		throw new Error("Calculation failed: Vertex \"" + vertexName + "\" is not presented in the graph");
	}
	
	if (v.isCheckingForLoop === true){
		throw new Error("Calculation failed: Loop with vertex \"" + vertexName + "\" was found during the calculation");
	}
	else{
		v.isCheckingForLoop = true;
	}
	
	if (v.result === undefined){
	
		var dependenciesResults = new Array();
	
		for (var i = 0; i < v.dependencies.length; i++){
			if (graph[v.dependencies[i]].result === undefined){
				dependenciesResults.push(lazyCalculation(v.dependencies[i], graph));
			} 
			else{
				console.log("Calculating " + vertexName + ": vertex " + v.dependencies[i] + " was calculated before");
				dependenciesResults.push(graph[v.dependencies[i]].result);
			}
		}
		
		v.result = v.calculatedFunction(dependenciesResults);
		console.log("Finish calculation of " + vertexName);
	}
	
	v.isCheckingForLoop = false;
	return v.result;
}

function calculateAll(graph){
	for (var v in graph){
		var result = lazyCalculation(v, graph);
		console.log(v + ": "  + result);
	}
}

//console.log("a: ", lazyCalculation('a', loopExample));
//console.log("a: ", lazyCalculation('a', example));

/*
console.log("xs.result: " + example.xs.result);
console.log("n.result: " + example.n.result);
console.log("m.result: " + example.m.result);
console.log("m2.result: " + example.m2.result);
console.log("v.result: " + example.v.result);
console.log();

//console.log("xs: ", lazyCalculation('xs', example));
//console.log("n: ", lazyCalculation('n', example));

console.log("m: ", lazyCalculation('m', example));
console.log("xs.result: " + example.xs.result);
console.log("n.result: " + example.n.result);
console.log("m.result: " + example.m.result);
console.log("m2.result: " + example.m2.result);
console.log("v.result: " + example.v.result);
console.log();

//console.log("m2: ", lazyCalculation('m2', example));

console.log("v: ", lazyCalculation('v', example));
console.log("xs.result: " + example.xs.result);
console.log("n.result: " + example.n.result);
console.log("m.result: " + example.m.result);
console.log("m2.result: " + example.m2.result);
console.log("v.result: " + example.v.result);
console.log();
*/

/*
console.log("Calculate all started");
calculateAll(example);
console.log("Calculate all finished");
*/