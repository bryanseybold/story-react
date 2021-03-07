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
			<button onClick={props.request_edit_attribute}>Edit Attributes</button>
		</div>
	);
}

const StoryEntryEdit = (props) => {
	const [form, setForm] = useState({
		"id": -1,});
	if (form.id != props.node.id) {
		setForm({
			"id": props.node.id,
			"name": props.node.name,
			"content": props.node.content,
		});
	}
	const handleChange = event => {
		const target = event.target;
		const value = target.type === "checkbox" ? target.checked : target.value;
		const name = target.name;
		setForm({...form, [name]: value});
	}
	const onUpdateNode = () => (props.edit_node_callback(props.node.id, form.name, form.content));
	return (
		<div>
		<label>Name:</label>
		<input type="text" value={form.name} name="name" onChange={handleChange}/>
		<label>Content:</label>
		<textarea name="content" value={form.content} onChange={handleChange} />
		<button onClick={onUpdateNode}>update node</button>
		<button onClick={props.request_node_attr_select}>set attributes</button>
		</div>
	);
}

const StoryEntryView = (props) => {
	const onClick = () => (props.edit_node_callback(props.node)); return (
		<div>
		<h3>{props.node.name}</h3>
		<p>{props.node.content}</p>
		<p>attributes</p>
		<p>links</p>
		<button onClick={onClick}>edit</button>
		</div>
	);
}

const StoryColumn = (props) => {
	return (
		<div>
		<h2> {props.cluster.name} </h2>
		{props.story.nodes.filter( node => { return node.attributes.includes(props.cluster.id); }).map(node => { return <StoryEntryView key={node.id} edit_node_callback={props.edit_node_callback} node={node}/>;})} 
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

const AttributeSelect = (props) => {
	const [form, setForm] = useState({
		"node_id": -1,});
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div />
		);
	}
	if (form.node_id != props.node.id) {
		setForm({
			"node_id": props.node.id,
			"checked": props.node.attributes.includes(props.attribute.id),
		});
	}
	const handleChange = event => {
		const target = event.target;
		props.node_attribute_callback(props.node.id, props.attribute.id, target.checked);
	}
	const checked = props.node ? props.node.attributes.includes(props.attribute.id) : false;
	return (
		<div>
		<input type="checkbox" checked={checked} name="checked" onChange={handleChange}/><label>{props.attribute.name}</label>
		</div>
	);
}

const AttributeEdit = (props) => {
	const [form, setForm] = useState({
		"attr_id": -1,});
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div />
		);
	}
	if (form.attr_id != props.attribute.id) {
		setForm({
			"attr_id": props.attribute.id,
			"name": props.attribute.name,
			"color": props.attribute.color ? props.attribute.color : "#FFFFFF",
			"clustered": props.attribute.cluster ? true : false,
		});
	}
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div />
		);
	}
	const handleChange = event => {
		const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
		const name = event.target.name;
		const change = {[name]: value};
		setForm({...form, ...change});
		if ("color" in change || "clustered" in change) {
			props.edit_attr_callback(props.attribute.id, change);
		}
	}
	const handleBlur = event => {
		if (event.target.name === "name" && form.name != props.attribute.name) {
			props.edit_attr_callback(props.attribute.id, {"name": form.name});
		}
	}
	return (
		<div>
		<div className="attribute__drag-handle" />
		<label>Name:</label>
		<input type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}/>
		<input type="color" name="color" value={form.color} onChange={handleChange}/>
		<input type="checkbox" name="clustered" checked={form.clustered} onChange={handleChange}/><label>Clustered</label>
		</div>
	);
}

const AttributeEditor = (props) => {
	// DO A GRID LAYOUT!! loop through all positions, adding either attr or spacer.
	if (props.mode === "edit") {
		return (
			<div>
			<h1>Attribute Editor</h1>
			{props.story.attributes.map((attr) => {
				return <AttributeEdit key={attr.name} attribute={attr} edit_attr_callback={props.edit_attr_callback}/>;
			})}
			<button onClick={props.request_main_view}>Close</button>
			</div>
		);
	} else {
		const onClick = () => (props.request_edit_node_callback(props.node));
		return(
			<div>
			<h1>Attribute Editor</h1>
			{props.story.attributes.map((attr) => {
				return <AttributeSelect key={attr.name} attribute={attr}  node={props.node} node_attribute_callback={props.node_attribute_callback}/>;
			})}
			<button onClick={onClick}>Close</button>
			</div>
		);
	}
}


const Overlay = (props) => {
	if (props.action === "EditAttributes") {
		return <AttributeEditor story={props.story} mode={"edit"} edit_attr_callback={props.edit_attr_callback} request_main_view={props.request_main_view}/>;
	} else if (props.action === "SelectNodeAttributes") {
		console.log("in here! ", "select");
		return (<AttributeEditor story={props.story} node={props.edit_target} mode={"select"} node_attribute_callback={props.node_attribute_callback} request_edit_node_callback={props.request_edit_node_callback}/>);
	} else if (props.action === "SelectLinkAttributes") {
		return (<AttributeEditor story={props.story} mode={"select"} link_attribute_callback={props.link_attribute_callback}/>);
	} else if (props.action === "EditNode") {
		return (<StoryEntryEdit story={props.story} node={props.edit_target} edit_node_callback={props.edit_node_callback} request_node_attr_select={props.request_node_attr_select}/>);
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
	const RequestEditNode = function(target) {
		setMode("EditNode"); 
		if (typeof target != undefined) { 
			setEditTarget(target);}};
	const RequestSelectNodeAttr = function(target) {
		setMode("SelectNodeAttributes"); };  // setEditTarget(target);
	const RequestSelectLinkAttr = function(target) {
		setMode("SelectLinkAttributes"); setEditTarget(target);};
	// I still don't have the right view and callbacks for linking nodes.
	console.log("Current mode: ", mode, " Current target: ", editTarget);

	const EditAttrCallback = function(attr_id, change) {
		var attr = story.attributes.find((attr) => attr.id === attr_id);
		if ("name" in change) {
			attr.name = change.name;
		}
		if ("color" in change) {
			attr.color = change.color;
		}
		if ("clustered" in change) {
			attr.cluster = change.clustered;
		}
		setStory({...story});
	}

	const EditNodeCallback = function(node_id, new_name=null, new_content=null) {
		var node = story.nodes.find((node) => node.id === node_id);
		if (new_name != null) {
			node.name = new_name;
		}
		if (new_content != null) {
			node.content = new_content;
		}
		setStory({...story});
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
		setStory({...story});
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
			node.attributes.splice(attr_index, 1);
		}
		setStory({...story});
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
			link.attributes.splice(found_index, 1);
		}
		setStory({...story});
	}

	return (
		<div>
			<NavBar user={user} request_edit_attribute={RequestEditAttr} />
			<StoryBoard story={story} edit_node_callback={RequestEditNode}  />
			<Overlay story={story} action={mode} edit_target={editTarget}
				 request_main_view={RequestMainView}
		                 edit_attr_callback={EditAttrCallback}
				 edit_node_callback={EditNodeCallback}
				 link_nodes_callback={LinkNodesCallback}
				 node_attribute_callback={NodeAttributeCallback}
				 link_attribute_callback={LinkAttributeCallback}
				 request_node_attr_select={RequestSelectNodeAttr}
				 request_edit_node_callback={RequestEditNode}
		/>
		</div>
	);
}

ReactDOM.render(
	<App />, 
	document.querySelector('#app')
);
