from flask import Flask, jsonify
from flask import request,Response,stream_with_context
from flask_cors import CORS
from llama_index.core import (
    VectorStoreIndex,
    ServiceContext,
    SimpleDirectoryReader,
    StorageContext,
    Document
)
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
import json


collections = ["blog"]

app = Flask(__name__)
CORS(app)  # Apply CORS middleware

MODEL = 'qwen2:0.5b'
# Initialize the LLM with the specified model and timeout

llm = Ollama(model=MODEL, request_timeout=1000.0)
# Provide a model name for the HuggingFaceEmbedding
embedding_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
# Create service context with the embedding model
service_context = ServiceContext.from_defaults(llm=llm, embed_model=embedding_model)
client = qdrant_client.QdrantClient(path="./qdrant_data")

def check_collection_exists(element, collection):
    """
    Check if an element exists in the collection.

    :param element: The element to check
    :param collection: The collection to check against (can be a list, set, etc.)
    :return: Boolean indicating if the element exists in the collection
    """
    return element in collection


@app.route('/ai/chat', methods=['POST'])
def chat():

    # Get the collection from the headers and the query text from the request data
    collection = request.headers.get('ce-topic')
    query_data = request.get_json()  # Use get_json to parse JSON data
    query_text = query_data.get('prompt') if query_data else None

    # Null check for collection and query_text
    if not check_collection_exists(element=collection,collection=collections):
        return jsonify({'error': 'Missing collection name in headers'}), 400
    if not query_text:
        return jsonify({'error': 'Missing query text in request data'}), 400
    
    vector_store = QdrantVectorStore(client=client, collection_name=collection)
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store, service_context=service_context)
    # Query the index
    query_engine = index.as_query_engine(streaming=True)
    stream_response = query_engine.query(query_text)
    def stream_query_results():
        for text in stream_response.response_gen:
            yield text

    # Return a streaming response to the client
    return Response(stream_query_results(), content_type='text/plain')
    

@app.route('/ai/import', methods=['POST'])
def import_data():
    # Get the collection from the headers and the query text from the request data
    collection = request.headers.get('ce-topic')
    data = request.get_json()  # Use get_json to parse JSON data
    # Null check for collection and query_text
    if not check_collection_exists(element=collection, collection=collections):
        return jsonify({'error': 'Missing collection name in headers'}), 400
    ## Create a document from the request body JSON data
    document = Document(doc_id="test",text=json.dumps(data),mimetype="application/json")

    ## Store data directly into the vector store
    print("Storing data in the vector base")
    vector_store = QdrantVectorStore(client=client, collection_name=collection)
    
    # Assuming StorageContext and VectorStoreIndex are correctly implemented and integrated
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    # Create the index with the single document
    print("Creating index on the document")
    index = VectorStoreIndex.from_documents([document], service_context=service_context, storage_context=storage_context)

    return jsonify({'message': 'Data imported and stored in vector base'}), 200



if __name__ == '__main__':
    app.run(port=8080)



