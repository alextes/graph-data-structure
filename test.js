
// Unit tests for reactive-property.
var assert = require("assert");

// If using from the NPM package, this line would be
// var Graph = require("graph-data-structure");
var Graph = require("./index.js");

describe("Graph", function() {

  describe("Data structure", function() {

    it("Should add nodes and list them.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

    it("Should remove nodes.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.removeNode("a");
      graph.removeNode("b");
      assert.equal(graph.nodes().length, 0);
    });

    it("Should add edges and query for adjacent nodes.", function (){
      var graph = Graph();
      graph.addNode("a");
      graph.addNode("b");
      graph.addEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 1);
      assert.equal(graph.adjacent("a")[0], "b");
    });

    it("Should implicitly add nodes when edges are added.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 1);
      assert.equal(graph.adjacent("a")[0], "b");
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

    it("Should remove edges.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");
      assert.equal(graph.adjacent("a").length, 0);
    });

    it("Should not remove nodes when edges are removed.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeEdge("a", "b");
      assert.equal(graph.nodes().length, 2);
      assert(contains(graph.nodes(), "a"));
      assert(contains(graph.nodes(), "b"));
    });

    it("Should remove outgoing edges when a node is removed.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeNode("a");
      assert.equal(graph.adjacent("a").length, 0);
    });

    it("Should remove incoming edges when a node is removed.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.removeNode("b");
      assert.equal(graph.adjacent("a").length, 0);
    });

  });

  describe("Algorithms", function() {

    it("Should compute topological sort.", function (){
      var graph = Graph();
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      var sorted = graph.topologicalSort(["a"]);
      assert.equal(sorted.length, 2);
      assert.equal(sorted[0], "b");
      assert.equal(sorted[1], "c");
    });

    it("Should compute topological sort tricky case.", function (){

      var graph = Graph();     //      a
                               //     / \
      graph.addEdge("a", "b"); //    b   |
      graph.addEdge("a", "d"); //    |   d
      graph.addEdge("b", "c"); //    c   |
      graph.addEdge("d", "e"); //     \ /
      graph.addEdge("c", "e"); //      e   
      
      var sorted = graph.topologicalSort(["a"]);
      assert.equal(sorted.length, 4);
      assert(contains(sorted, "b"));
      assert(contains(sorted, "c"));
      assert(contains(sorted, "d"));
      assert.equal(sorted[sorted.length - 1], "e");

      assert(comesBefore(sorted, "b", "c"));
      assert(comesBefore(sorted, "b", "e"));
      assert(comesBefore(sorted, "c", "e"));
      assert(comesBefore(sorted, "d", "e"));

    });

    // This example is from Cormen et al. "Introduction to Algorithms" page 550
    it("Should compute topological sort relatable case.", function (){

      var graph = Graph();

      // Shoes depend on socks.
      // Socks need to be put on before shoes.
      graph.addEdge("socks", "shoes");

      // Shoes depend on pants.
      // Pants need to be put on before shoes.
      graph.addEdge("pants", "shoes");

      // Pants depend on underpants.
      graph.addEdge("underpants", "pants");

      // Belt depends on pants.
      graph.addEdge("pants", "belt");

      // Belt depends on shirt.
      graph.addEdge("shirt", "belt");

      // Tie depends on shirt.
      graph.addEdge("shirt", "tie");

      // Jacket depends on tie.
      graph.addEdge("tie", "jacket");

      // Jacket depends on belt.
      graph.addEdge("belt", "jacket");

      var sorted = graph.topologicalSort(graph.nodes(), true);

      assert.equal(sorted.length, 8);

      assert(comesBefore(sorted, "pants", "shoes"));
      assert(comesBefore(sorted, "underpants", "pants"));
      assert(comesBefore(sorted, "underpants", "shoes"));
      assert(comesBefore(sorted, "shirt", "jacket"));
      assert(comesBefore(sorted, "shirt", "belt"));
      assert(comesBefore(sorted, "belt", "jacket"));

    });

  });

  describe("Edge cases and error handling", function() {

    it("Should return empty array of adjacent nodes for unknown nodes.", function (){
      var graph = Graph();
      assert.equal(graph.adjacent("a").length, 0);
      assert.equal(graph.nodes(), 0);
    });

    it("Should do nothing if removing an edge that does not exist.", function (){
      assert.doesNotThrow(function (){
        var graph = Graph();
        graph.removeEdge("a", "b");
      });
    });

  });
});

function contains(arr, item){
  return arr.filter(function (d){
    return d === item;
  }).length > 0;
}

function comesBefore(arr, a, b){
  var aIndex, bIndex;
  arr.forEach(function (d, i){
    if(d === a){ aIndex = i; }
    if(d === b){ bIndex = i; }
  });
  return aIndex < bIndex;
}
