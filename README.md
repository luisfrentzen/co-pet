# Leo: co-pet virtual assistant

## Installation

Before proceeding please make sure that you have the latest [Poetry](https://python-poetry.org/) and [NPM](https://www.npmjs.com/) installed.

First, clone this repository.
```sh
git clone https://github.com/luisfrentzen/co-pet
```

Then install all the libraries needed by running npm and poetry.
```sh
poetry install --no-root
npm install
```
Make sure that both installation processes are completed successfully.

## Starting Leo

Copy and rename `.envexample` to `.env` and fill out all the API key variables.

```sh
cp .envexample .env
```

and then run `run.py`

```
poetry run python run.py
```

A node and a flask process should be spawned with no error. You can now start chatting with Leo!

## Controls

Now Leo will wander around your desktop freely. To interact with Leo via a chat interface press `CMD/CTRL` and `l` to spawn an input box. Simply type in your chat and wait for Leo to respond. Example:
```
hi, tell me about yourself
```

If you want Leo to take a look at your screen, add `/screenshot` in front of your question. Example:
```
/screenshot take a look at this!
```

if you want Leo to search for something for you on the internet, add `/search` in front of your query. Example:
```
/search who's Indonesia's first president?
```
