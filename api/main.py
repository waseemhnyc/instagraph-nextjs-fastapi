import os

from fastapi import FastAPI
from fastapi.responses import StreamingResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

from pydantic import BaseModel, Field
from typing import Iterable, List
import instructor

import openai

try:
	from dotenv import load_dotenv, find_dotenv
	load_dotenv(find_dotenv())
	openai_api_key = os.getenv("OPENAI_API_KEY")
except:
	openai_api_key = os.environ.get('OPENAI_API_KEY')
        

model_35 = "gpt-3.5-turbo-1106"
model_4 = "gpt-4-0613"
model_4_preview = "gpt-4-1106-preview"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

aclient = instructor.patch(openai.AsyncClient(api_key=openai_api_key), mode=instructor.Mode.FUNCTIONS)

class Edge(BaseModel):
    """
    Represents an Edge in a knowledge graph, defining the connection between two Nodes.
    Each Node can be connected to a maximum of 4 other Nodes. Each Edge is unique to a pair of Nodes.

    No cycles should exist. A Node may be linked to another Node only once in the entire graph.
    """
    target: str = Field(description="Unique identifier of the target Node.")
    label: str = Field(description="Descriptive label of the Edge, indicating the relationship type.")
    color: str = Field(description="Color code (e.g., hexadecimal) representing the Edge's visual color.")

class Node(BaseModel):
    """
    Represents a Node in a knowledge graph. The graph contains a minimum of 8 and a maximum of 15 Nodes.
    Nodes are the fundamental units in the graph, each with unique attributes and connections.
    """
    id: str = Field(description="Unique identifier for the Node.")
    label: str = Field(description="Descriptive label or name of the Node.")
    stroke: str = Field(default="#000000", description="Border color of the Node.")
    background: str = Field(description="Background color of the Node.")
    x: int = Field(description="Horizontal position of the Node in the graph.")
    y: int = Field(description="Vertical position of the Node in the graph.")
    adjacencies: List[Edge] = Field(
         description="List of Edges to other Nodes, defining the Node's connections. No cycles should exist. A Node may be linked to another Node only once in the entire graph."
    )

@app.get("/")
async def root():
    return Response(status_code=200)


@app.get("/api/get_graph/{message}")
async def get_graph(message: str):
    if not message:
        raise HTTPException(status_code=400, detail="Invalid input")
    try:
        system_instruction = """
        Generate a knowledge graph with Nodes and Edges, adhering to the following specifications:

        Important Guidelines:
        - No cycles should exist. A Node may be linked to another Node only once in the entire graph.
        - Strive for a balanced and aesthetically pleasing graph.
        - Prioritize clarity and legibility in the graph's design.
        - The graph should be structured to facilitate easy understanding of the relationships and hierarchy among Nodes.

        Node Specifications:
        1. Each Node should be connected to no more than 4 other Nodes, but at least 1.
        2. The total number of Nodes in the graph should be between 8 and 15.
        3. Nodes should be visually distinct, approximately px in width and 50px in height.
        4. Use light pastel colors for Node backgrounds to ensure compatibility with black font.
        5. Arrange Nodes in a clear, readable layout, with the primary Node at the center and others radiating outwards.
        6. Ensure Nodes are spaced adequately to prevent clutter.

        Edge Specifications:
        1. Edges represent relationships between source and target Nodes.
        2. No cycles should exist. A Node may be linked to another Node only once in the entire graph.
        3. The total number of Edges connected to a Node should not exceed 4.
        4. Ensure variation in stroke colors for Edges to denote different relationship types or categories.
        5. Edges sharing the same label should have identical colors.
        """
        message = f"Topic: {message} - Rephrase topic if helpful."

        node_messages = [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": message},
        ]

        node_response = await aclient.chat.completions.create(
            model=model_35,
            stream=True,
            messages=node_messages,
            response_model=Iterable[Node]
        )
    
        async def generate():
            async for chunk in node_response:
                if chunk is not None:
                    yield f"data: {chunk.model_dump_json()}\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")
    except Exception as e:
        print(e)
        return {"message": "Error"}
