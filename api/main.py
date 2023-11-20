import os
import openai
from flask import Flask, jsonify, request
from pydantic import BaseModel, Field
from typing import List, Literal
from openai import OpenAI
import instructor

app = Flask(__name__)

try:
	from dotenv import load_dotenv, find_dotenv
	load_dotenv(find_dotenv())
	openai_api_key = os.getenv("OPENAI_API_KEY")
except:
	openai_api_key = os.environ.get('OPENAI_API_KEY')

openai.api_key = openai_api_key

client = instructor.patch(OpenAI())


class NodeStyle(BaseModel):
	stroke: str = "#000000"
	background: str
	color: str = "#000000" 


class EdgeStyle(BaseModel):
	stroke: str


class NodeData(BaseModel):
	label: str


class Position(BaseModel):
	x: int
	y: int


class Node(BaseModel):
	id: str
	data: NodeData
	label: str
	type: str
	color: str
	position: Position
	style: NodeStyle
	draggable: Literal[True]
	deletable: bool = Field(default=False)
	selectable: bool = Field(default=False)


class Edge(BaseModel):
	source: str
	target: str
	label: str
	type: str = "default"
	style: EdgeStyle
	id: str


class KnowledgeGraph(BaseModel):
   edges: List[Edge]
   nodes: List[Node]


@app.route("/api/get_graph_data", methods=["POST"])
def get_graph_data():
	try:
		user_input = request.json.get("user_input", "")
		if not user_input:
			return jsonify({"error": "No input provided"}), 400

		messages = [
			{
				"role": "system",
				"content": "You are a knowledge graph expert. You are helping a user understand a topic by describing it as a knowledge graph. A knowledge graph with nodes and edges. Use colors to help differentiate between different node or edge types/categories. Always provide light pastel colors that work well with black font. Each node is about 300px wide and 50px tall. The nodes should have positions that makes the graph readable and understandable. The main node should be in the center and the other nodes around it in a radial pattern. Space out the nodes and edges so that the graph is not cluttered. All nodes must connect to atleast one other node"
			},
			{
				"role": "user",
				"content": f"Help me understand the following by describing it as a detailed knowledge_graph: {user_input}",
			}
		]

		response = client.chat.completions.create(
			model="gpt-3.5-turbo-16k",
			messages=messages,
			response_model=KnowledgeGraph,
		)

		nodes_dict = [node.model_dump() for node in response.nodes]
		edges_dict = [edge.model_dump() for edge in response.edges]

		return jsonify({"elements": {"nodes": nodes_dict, "edges": edges_dict}})
	except Exception as e:
		print(e)
		return jsonify({"error": "Something went wrong"}), 500

if __name__ == '__main__':
  app.run(port=5000)
