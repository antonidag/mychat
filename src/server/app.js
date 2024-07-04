import express from 'express';
import ollama from 'ollama';
import cors from 'cors';

const app = express();
const port = 8080;
const MODEL = 'qwen2:0.5b';

app.use(cors()); // Apply CORS middleware
app.use(express.json()); // Support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // Support URL-encoded bodies

app.options('*', cors()); // Handle preflight requests for all routes

/*
To build next. 
QDrant vector search with LLM. 

*/

app.post('/ai/chat', async (req, res) => {
    const message = { role: 'user', content: req.body.prompt };
    const response = await ollama.chat({ model: MODEL, messages: [message], stream: true });
    for await (const part of response) {
        res.write(part.message.content);
    }
    res.end();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
