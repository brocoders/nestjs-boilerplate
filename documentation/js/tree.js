document.addEventListener('DOMContentLoaded', function() {
    var tabs = document.getElementsByClassName('nav-tabs')[0],
        tabsCollection = tabs.getElementsByTagName('A'),
        treeTab;
    var len = tabsCollection.length;
    for(var i = 0; i < len; i++) {
        if (tabsCollection[i].getAttribute('id') === 'tree-tab') {
            treeTab = tabsCollection[i];
        }
    }

    // short-circuit if no tree tab
    if (!treeTab) return;

    var handler = new Tautologistics.NodeHtmlParser.HtmlBuilder(function(error, dom) {
        if (error) {
            console.log('handler ko');
        }
    }),
        parser = new Tautologistics.NodeHtmlParser.Parser(handler),
        currentLocation = window.location;
    parser.parseComplete(COMPONENT_TEMPLATE);

    var newNodes = [],
        newEdges = [],
        parsedHtml = handler.dom[0],
        nodeCount = 0,
        nodeLevel = 0;

    newNodes.push({
        _id: 0,
        label: parsedHtml.name,
        type: parsedHtml.type
    })
    //Add id for nodes
    var traverseIds = function(o) {
        for (i in o) {
            if (!!o[i] && typeof(o[i]) == "object") {
                if (!o[i].length && o[i].type === 'tag') {
                    nodeCount += 1;
                    o[i]._id = nodeCount;
                }
                traverseIds(o[i]);
            }
        }
    }
    parsedHtml._id = 0;
    traverseIds(parsedHtml);


    var DeepIterator = deepIterator.default,
        it = DeepIterator(parsedHtml);
    for (let {
            value,
            parent,
            parentNode,
            key,
            type
        } of it) {
        if (type === 'NonIterableObject' && typeof key !== 'undefined' && value.type === 'tag') {
            var newNode = {
                id: value._id,
                label: value.name,
                type: value.type
            };
            for(var i = 0; i < COMPONENTS.length; i++) {
                if (COMPONENTS[i].selector === value.name) {
                    newNode.font = {
                        multi: 'html'
                    };
                    newNode.label = '<b>' + newNode.label + '</b>';
                    newNode.color = '#FB7E81';
                    newNode.name = COMPONENTS[i].name;
                }
            }
            for(var i = 0; i < DIRECTIVES.length; i++) {
                if (value.attributes) {
                    for(attr in value.attributes) {
                        if (DIRECTIVES[i].selector.indexOf(attr) !== -1) {
                            newNode.font = {
                                multi: 'html'
                            };
                            newNode.label = '<b>' + newNode.label + '</b>';
                            newNode.color = '#FF9800';
                            newNode.name = DIRECTIVES[i].name;
                        }
                    }
                }
            }
            newNodes.push(newNode);
            newEdges.push({
                from: parentNode._parent._id,
                to: value._id,
                arrows: 'to'
            });
        }
    }

    newNodes.shift();

    var container = document.getElementById('tree-container'),
        data = {
            nodes: newNodes,
            edges: newEdges
        },
        options = {
            layout: {
                hierarchical: {
                    sortMethod: 'directed',
                    enabled: true
                }
            },
            nodes: {
                shape: 'ellipse',
                fixed: true
            }
        },

        handleClickNode = function(params) {
            var clickeNodeId;
            if (params.nodes.length > 0) {
                clickeNodeId = params.nodes[0];
                for(var i = 0; i < newNodes.length; i++) {
                    if (newNodes[i].id === clickeNodeId) {
                        for(var j = 0; j < COMPONENTS.length; j++) {
                            if (COMPONENTS[j].name === newNodes[i].name) {
                                document.location.href = currentLocation.origin + currentLocation.pathname.replace(ACTUAL_COMPONENT.name, newNodes[i].name);
                            }
                        }
                    }
                }
            }
        },
        
        loadTree = function () {
            setTimeout(function() {
                container.style.height = document.getElementsByClassName('content')[0].offsetHeight - 140 + 'px';
                var network = new vis.Network(container, data, options);
                network.on('click', handleClickNode);
            }, 200); // Fade is 0.150
        };

    loadTree();
    treeTab.addEventListener('click', function() {
        loadTree();
    });
});
