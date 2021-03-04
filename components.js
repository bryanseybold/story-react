// import React, { useState } from 'react';  <-- this is how you do it with node/preprocessing.
const {useState} = React;

const GetDefaultStory = () => {
	return  {
		"attributes": [
			{
				"id": 0,
				"name": "People",
				"color": "#FF0000", // if not present, no color!
				"position": {
					"row": 1,
					"col": 1,
				},
				"cluster": true,
			},
			{	
				"id": 1,
				"name": "Places",
				"color": "#00FF00",
				"position": {
					"row": 1,
					"col": 2,
				},
				"cluster": true,
			},
			{
				"id": 2,
				"name":	"Things",
				"color": "#0000FF",
				"position": {
					"row": 1,
					"col": 3,
				},
				"cluster": true,
			},
			{
				"id": 3,
				"name": "Events",
				"position": {
					"row": 1,
					"col": 4,
				},
			},
		],
		"nodes": [
			{
				"id": 0,
				"name": "node 0",
				"content": "contents",
				"attributes": [0],
			},
			{
				"id": 1,
				"name": "node 1",
				"content": "contents",
				"attributes": [0],
			},
			{
				"id": 2,
				"name": "node 2",
				"content": "contents",
				"attributes": [1],
			},
		],
		"links": [
			{
				"source": 0,
				"target": 1,
				"attributes": [3],
			}
		],
		"settings": {
			"current_view": 0,
			"num_columns": -1,
			"filter_string": "",
		},
	};
}

const NavBar = (props) => {
	return (
		<div>
			<span>Story Board</span>
			<span>user:{props.user}</span>
			<span>log-out</span>
		</div>
	);
}

const StoryEntry = (props) => {
	if (props.mode === "view") {
		const onClick = () => (props.edit_node_callback(props.node));
		return (
			<div>
			<h3>{props.node.name}</h3>
			<p>{props.node.content}</p>
			<p>attributes</p>
			<p>links</p>
			<button onClick={onClick}>edit</button>
			</div>
		);
	} else if (props.mode === "edit") {
		const onClick = () => (props.edit_node_callback(props.node));
		return (
			<div>
			<label>Name:</label>
			<input type="text" value={props.node.name} />
			<label>Content:</label>
			<textarea>{props.node.content}</textarea>
			<button>update node</button>
			<button>set attributes</button>
			</div>
		);
	} else {
		console.log("Cannot render StoryEntry with mode: " + props.mode);
	}
}

const StoryColumn = (props) => {
	return (
		<div>
		<h2> {props.cluster.name} </h2>
		{props.story.nodes.filter( node => { return node.attributes.includes(props.cluster.id); }).map(node => { return <StoryEntry key={node.id} node={node} mode={"view"} edit_node_callback={props.edit_node_callback}/>;})} 
		</div>
	);
}

const StoryBoard = (props) => {
	const clusters = props.story.attributes.filter((attr) => {
		return attr.cluster;
	});
	return (
		<div>
			<h1>Story Board</h1>
			{clusters.map(cluster => (
				<StoryColumn key={cluster.name} cluster={cluster} story={props.story} edit_node_callback={props.edit_node_callback}/>
			))}
		</div>
	);
}

const Attribute = (props) => {
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div />
		);
	}
	if (props.mode === "select") {
		const checked = props.node ? props.node.attributes.contains(props.attribute.id) : false;
		return (
			<div>
			<input type="checkbox" checked={checked}/><label>{props.attribute.name}</label>
			</div>
		);
	} else if (props.mode === "edit") {
		const color = props.attribute.color ? props.attribute.color : "#FFFFFF";
		return (
			<div>
			<div className="attribute__drag-handle" />
			<label>Name:</label>
			<input type="text" value={props.attribute.name} />
			<input type="color" value={color}/>
			<input type="checkbox" checked={props.attribute.cluster}/><label>Clustered</label>
			</div>
		);
	} else {
		console.log("Cannot render Attribute with mode: " + props.mode);
	}
}

const AttributeEditor = (props) => {
	// DO A GRID LAYOUT!! loop through all positions, adding either attr or spacer.
	return (
		<div>
		<h1>Attribute Editor</h1>
		{props.story.attributes.map((attr) => {
			return <Attribute key={attr.name} attribute={attr} mode={"edit"}/>;
		})}
		</div>
	);
}


const Overlay = (props) => {
	if (props.action === "EditAttributes") {
		return (<AttributeEditor story={props.story} mode={"edit"} edit_attr_callback={props.edit_attr_callback}/>);
	} else if (props.action === "SelectNodeAttributes") {
		return (<AttributeEditor story={props.story} mode={"select"} node_attribute_callback={props.node_attribute_callback}/>);
	} else if (props.action === "SelectLinkAttributes") {
		return (<AttributeEditor story={props.story} mode={"select"} link_attribute_callback={props.link_attribute_callback}/>);
	} else if (props.action === "EditNode") {
		return (<StoryEntry story={props.story} node={props.edit_target} mode={"edit"} edit_node_callback={props.edit_node_callback}/>);
	} else if (props.action === "SelectNode") {
		return (<StoryBoard story={props.story} mode={"select"} link_nodes_callback={props.link_nodes_callback}/>);
	} else { return null; }
}

const App = () => {
	const [user, setUser] = useState("unset");
	const [story, setStory] = useState(GetDefaultStory());
	const [mode, setMode] = useState("main");
	const [editTarget, setEditTarget] = useState(null);

	const RequestMainView = function(target) {setMode("main");}
	const RequestEditAttr = function() {setMode("EditAttributes");};
	const RequestEditNode = function(target) {setMode("EditNode"); setEditTarget(target);};
	const RequestSelectNodeAttr = function(target) {
		setMode("SelectNodeAttributes"); setEditTarget(target);};
	const RequestSelectLinkAttr = function(target) {
		setMode("SelectLinkAttributes"); setEditTarget(target);};
	// I still don't have the right view and callbacks for linking nodes.
	console.log("Current target: ", editTarget);

	const EditAttrCallback = function(attr_id, new_name=null, new_color=null, new_cluster=null) {
		var attr = story.attributes.find((attr) => attr.id === attr_id);
		if (new_name != null) {
			attr.name = new_name;
		}
		if (new_color != null) {
			attr.color = color;
		}
		if (new_cluster != null) {
			attr.cluster = new_cluster;
		}
		setStory(story);
	}

	const EditNodeCallback = function(node_id, new_name=null, new_content=null) {
		var node = story.nodes.find((node) => node.id === node_id);
		if (new_name != null) {
			node.name = new_name;
		}
		if (new_content != null) {
			node.content = content;
		}
		setStory(story);
	}

	const LinkNodesCallback = function(source, target, create_not_destroy) {
		var found_index = story.links.findIndex(
			(link) => ( link.source === source && link.target === target ));
		if (create_not_destroy) {
			if (found_index === -1 ) {
				story.links.push({
					"source": source,
					"target": target,
					"attributes": [],
				});
				found_index = story.links.length - 1;
			} else {
				console.log("tried to add link that already exists.");
			}
		} else {
			if (found_index > -1) {
				story.links.splice(found_index, 1);
			}
		}
		setStory(story);
	}

	const NodeAttributeCallback = function(node_id, attr_id, shouldApply) {
		var node = story.nodes.find((node) => node.id === node_id);
		var attr_index = node.attributes.findIndex((id) => (id === attr_id));
		if (shouldApply) {
			if (attr_index === -1) {
				node.attributes.push(attr_id);
			} else {
				console.log("tried to add attribute that already exists");
			}
		} else {
			node.attributes.splie(found_index, 1);
		}
		setStory(story);
	}

	const LinkAttributeCallback = function(source, target, attr_id, shouldApply) {
		var link = story.links.find(
			(link) => ( link.source === source && link.target === target ));
		var attr_index = link.attributes.findIndex((id) => (id === attr_id));
		if (shouldApply) {
			if (attr_index === -1) {
				link.attributes.push(attr_id);
			} else {
				console.log("tried to add attribute that already exists");
			}
		} else {
			link.attributes.splie(found_index, 1);
		}
		setStory(story);
	}

	return (
		<div>
			<NavBar user={user} />
			<StoryBoard story={story} edit_node_callback={RequestEditNode}  />
			<Overlay story={story} action={mode} edit_target={editTarget}
		                 edit_attr_callback={EditAttrCallback}
				 edit_node_callback={EditNodeCallback}
				 link_nodes_callback={LinkNodesCallback}
				 node_attribute_callback={NodeAttributeCallback}
				 link_attribute_callback={LinkAttributeCallback}/>
		</div>
	);
}

ReactDOM.render(
	<App />, 
	document.querySelector('#app')
);
