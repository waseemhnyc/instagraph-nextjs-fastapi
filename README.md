# InstaGraph 🌐 Next JS and FastAPI

Original project and inspiration: [<a href="https://twitter.com/yoheinakajima">Yohei Nakajima</a>](https://twitter.com/yoheinakajima) - [<a href="https://github.com/yoheinakajima/instagraph">Instagraph</a>](https://github.com/yoheinakajima/instagraph)

Even though I love working with Python apps (previous Django developer), modern frontend technologies like NextJS (and Tailwind CSS, Shadcn etc) enable you to move faster. Also with the popularity of LLMs, streaming and server-sent-endpoints have become more important in AI products. FastAPI is perfect for building backends to support this.

[<a href="https://tally.so/r/mY0676">Sign up for updates and more information about the deployed app.</a>]((https://tally.so/r/mY0676))

Project made with:
- [<a href="https://twitter.com/shadcn">Shadcn</a>](https://twitter.com/shadcn) - [<a href="https://github.com/shadcn/next-template">Next JS Template</a>](https://github.com/shadcn/next-template)
- [<a href="https://reactflow.dev/">React Flow</a>](https://reactflow.dev/)

## Installation 🛠️

1. Clone the repository
```bash
git clone https://github.com/waseemhnyc/instagraph-nextjs-fastapi.git
```
2. Navigate to the project directory
```bash
cd instagraph-nextjs-fastapi
```
3. Install packages
```bash
yarn
```
4. Set environment variables
```bash
OPENAI_API_KEY=your-api-key-here
```
5. Run Next JS app
```bash
yarn run dev
```

Now that you have the frontend running locally its time to get the backend running.

6. Move into the `api` directory, create a virutalenv and source the environment

```bash
cd api/
python3 -m venv venv
source venv/bin/activate
```

7. Install libraries

```bash
pip install -r requirements.txt
```

8. Create a .env file and input your OpenAI API Key in the file

```bash
cp .env.example .env
```

9. Run local server
```bash
uvicorn main:app --host 0.0.0.0
```

## Usage 🎉

Web Interface
- Open your web browser and navigate to `http://localhost:3000/`.
- Type your text in the input box.
- Click "Submit" and wait for the magic to happen!

## License 📝

MIT License. See LICENSE for more information.
