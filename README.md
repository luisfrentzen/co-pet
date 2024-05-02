# Leo: co-pet virtual assistant

![Leo Banner](https://github.com/luisfrentzen/co-pet/assets/54829425/af2765fe-cbf2-458b-8b66-8a905c0a4a92)

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

<img width="1470" alt="image" src="https://github.com/luisfrentzen/co-pet/assets/54829425/051db5e7-6aa9-4531-98cf-31c8f983d0b3">

Now Leo will wander around your desktop freely. To interact with Leo via a chat interface press `CMD/CTRL` and `l` to spawn an input box. 

<img width="1470" alt="image" src="https://github.com/luisfrentzen/co-pet/assets/54829425/ed22a87f-6d31-4817-8bd4-83fa4d6910c9">

Simply type in your chat and wait for Leo to respond. Example:
```
hi Leo!
```

<img width="1470" alt="image" src="https://github.com/luisfrentzen/co-pet/assets/54829425/506767c2-d924-4b5a-8074-9ea641a0708d">

If you want Leo to take a look at your screen, add `/screenshot` in front of your question. Example:
```
/screenshot take a look at this!
```

<img width="1470" alt="image" src="https://github.com/luisfrentzen/co-pet/assets/54829425/927db7b7-a8d7-4aff-9219-645e958a5dc5">

if you want Leo to search for something for you on the internet, add `/search` in front of your query. Example:
```
/search what is the country with the most islands in the world?
```

<img width="1470" alt="image" src="https://github.com/luisfrentzen/co-pet/assets/54829425/f38ab648-abd0-4ff1-a451-a82f8809fcdd">

## Future Plans

I hope you are enjoying Leo so far! We are not to stop at this point, here are some features that we are planning for:
- function calling
- more pet interactions
- speech interface
