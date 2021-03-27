// import React, { useState } from 'react';  <-- this is how you do it with node/preprocessing.
const {useState} = React;

const GetDefaultStory = () => {
	return  {
		"attributes": [
			{
				"id": 0,
				"name": "People",
				"color": "#FFAAAA", // if not present, no color!
				"position": {
					"row": 1,
					"col": 1,
				},
				"cluster": true,
			},
			{	
				"id": 1,
				"name": "Places",
				"color": "#AAFFAA",
				"position": {
					"row": 1,
					"col": 2,
				},
				"cluster": true,
			},
			{
				"id": 2,
				"name":	"Things",
				"color": "#AAAAFF",
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
		<div className="navbar foreground-snow">
			<button onClick={props.request_edit_attribute}>Edit Attributes</button>
			<h1 className="navbar__title">Story Board</h1>
			<div className="navbar__login">
			<span>user:{props.user}</span>
			<button>log-out</button>
			</div>
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
		<div className="storyentry storyentryedit">
		<div>
		<label>Name:</label>
		<input className="storyentryedit__NameInput" type="text" value={form.name} name="name" onChange={handleChange}/>
		</div>
		<label>Content:</label>
		<textarea className="storyentryedit__ContentInput" name="content" value={form.content} onChange={handleChange} />
		<div className="storyentryedit__Buttons">
		<button onClick={onUpdateNode}>update node</button>
		<button onClick={props.request_node_attr_select}>set attributes</button>
		<button onClick={props.request_main_view}>close</button>
		</div>
		</div>
	);
}

const StoryEntryView = (props) => {
	console.log(props);
	const onClick = () => {props.edit_node_callback(props.node)};
	// add back <p> links </p> or similar
	return (
		<div className="card storyentry storyentryview foreground-snow">
		<h3 className="storyentryview__Name">{props.node.name}</h3>
		<p className="storyentryview__Contents">{props.node.content}</p>
		<div className="storyentryview__BottomLine">
		<p className="storyentryview__Attributes">attributes: {props.story.attributes.filter( attr => { return props.node.attributes.includes(attr.id); }).map((attr, idx) => {
			if (idx > 0) {return ", " + attr.name;} else { return attr.name;}})}</p>
		<button className="storyentryview__Edit" onClick={onClick}>edit</button>
		</div>
		</div>
	);
}

const StoryColumn = (props) => {
	const onClick = () => {props.add_node_callback(props.cluster.id)};
	return (
		<div className="storycolumn" style={{backgroundColor: props.cluster.color}}>
		<h2 className="storycolumn__Name" style={{backgroundImage: "linear-gradient("+props.cluster.color+", 10%, Snow)"}}> {props.cluster.name} </h2>
		{props.story.nodes.filter( node => { return node.attributes.includes(props.cluster.id); }).map(node => { return <StoryEntryView key={node.id} story={props.story} edit_node_callback={props.edit_node_callback} node={node}/>;})} 
		<button onClick={onClick}>add node</button>
		</div>
	);
}

const StoryBoard = (props) => {
	const clusters = props.story.attributes.filter((attr) => {
		return attr.cluster;
	});
	return (
		<div className="storyboard foreground-snow">
			{clusters.map(cluster => (
				<StoryColumn key={cluster.name} cluster={cluster} story={props.story} edit_node_callback={props.edit_node_callback} add_node_callback={props.add_node_callback}/>
			))}
		</div>
	);
}

const AttributeSelect = (props) => {
	const [form, setForm] = useState({
		"node_id": -1,});
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div className="card attribute emptyattribute"/>
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
		<div className="card attribute attributeselect">
		<input type="checkbox" checked={checked} name="checked" onChange={handleChange}/><label>{props.attribute.name}</label>
		</div>
	);
}

const AttributeEdit = (props) => {
	const [form, setForm] = useState({
		"attr_id": -1,});
	if (!props.attribute) {  // a placeholder for empties.
		return (
			<div className="card attribute emptyattribute"/>
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
		<div className="card attribute attributeedit attribute__drag-handle">
		<label className="attributeedit__Item">Name:</label>
		<input className="attributeedit__NameInput attributeedit__Item" type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur}/>
		<input className="attributeedit__Item" type="color" name="color" value={form.color} onChange={handleChange}/>
		<input className="attributeedit__Item" type="checkbox" name="clustered" checked={form.clustered} onChange={handleChange}/><label className="attributeedit__Item">Clustered</label>
		</div>
	);
}

const AttributeEditor = (props) => {
	// DO A GRID LAYOUT!! loop through all positions, adding either attr or spacer
	if (props.mode === "edit") {
		return (
			<div className="attributepanel attributeeditor">
			<h1>Attribute Editor</h1>
			{props.story.attributes.map((attr) => {
				return <AttributeEdit key={attr.name} attribute={attr} edit_attr_callback={props.edit_attr_callback}/>;
			})}
			<button onClick={props.add_attr_callback}>add attr</button>
			<button onClick={props.request_main_view}>Close</button>
			</div>
		);
	} else {
		const onClick = () => {props.request_edit_node_callback(props.node)};
		return(
			<div className="attributepanel attributeselector">
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
	var contents;
	if (props.action === "EditAttributes") {
		contents = <AttributeEditor story={props.story} mode={"edit"} edit_attr_callback={props.edit_attr_callback} request_main_view={props.request_main_view} add_attr_callback={props.add_attr_callback}/>;
	} else if (props.action === "SelectNodeAttributes") {
		contents = (<AttributeEditor story={props.story} node={props.edit_target} mode={"select"} node_attribute_callback={props.node_attribute_callback} request_edit_node_callback={props.request_edit_node_callback}/>);
	} else if (props.action === "SelectLinkAttributes") {
		contents = (<AttributeEditor story={props.story} mode={"select"} link_attribute_callback={props.link_attribute_callback}/>);
	} else if (props.action === "EditNode") {
		contents = (<StoryEntryEdit story={props.story} node={props.edit_target} edit_node_callback={props.edit_node_callback} request_node_attr_select={props.request_node_attr_select} request_main_view={props.request_main_view}/>);
	} else if (props.action === "SelectNode") {
		contents = (<StoryBoard story={props.story} mode={"select"} link_nodes_callback={props.link_nodes_callback}/>);
	} else { return null; }
	return <div className="overlay foreground-snow"> {contents} </div>
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

	const AddAttrCallback = function() {
		var next_id = -1;
		story.attributes.forEach((attr) => {if (attr.id >= next_id) {next_id = attr.id + 1;}});
		var new_attr = {
			id: next_id,
			name: "<unnamed>",
			clustered: false,
		}
		story.attributes.push(new_attr);
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

	const AddNodeCallback = function(cluster_id) {
		var next_id = -1;
		story.nodes.forEach((node) => {if (node.id >= next_id) {next_id = node.id + 1;}});
		var new_node = {
			id: next_id,
			name: "<unnamed>",
			content: "<unknown>",
			attributes: [cluster_id],
		}
		story.nodes.push(new_node);
		setStory({...story});
		setEditTarget(new_node);
		setMode("EditNode"); 

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
			<NavBar className="topbar" user={user} request_edit_attribute={RequestEditAttr} />
			<StoryBoard className="mainview"
				story={story}
				edit_node_callback={RequestEditNode}
				add_node_callback={AddNodeCallback}
			/>
			<Overlay className="overlay"
				 story={story} action={mode} edit_target={editTarget}
				 request_main_view={RequestMainView}
		                 edit_attr_callback={EditAttrCallback}
				 add_attr_callback={AddAttrCallback}
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
