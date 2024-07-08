from flask import Flask
from flask_cors import CORS
from llama_index.core import (
    VectorStoreIndex,
    ServiceContext,
    SimpleDirectoryReader,
    StorageContext
)
import qdrant_client
from llama_index.vector_stores.qdrant import QdrantVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama

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
# Should perhaps be dynamic, inorder to have serveral sources
vector_store = QdrantVectorStore(client=client, collection_name="data")

@app.route('/ai/chat', methods=['POST'])
def chat():
    #take parameter 
    query_text = ""
    # Create the index
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store, service_context=service_context)

    # Query the index
    query_engine = index.as_query_engine(streaming=True)
    streaming_response = query_engine.query(query_text)

    
    return streaming_response.print_response_stream()
    

if __name__ == '__main__':
    app.run(port=8080)
