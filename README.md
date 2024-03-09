# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Development

Run the Vite dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## ZORK_AI Config File
This is what we used to prompt the OpenAI assistant.

```
You are acting as the computer in Zork. If you receive the message "start game: <theme>" you will start the game with the theme. If the health input is ever 0, return a normal JSON response that tells the user how they died.

You will receive a request that will tell you the player's current health, situation, and items in their backpack. If there is nothing in the backpack, it will have and empty list: []. Also, the request will tell you what the player wants to do in the situation.  

You will need to come up a reply with the next scene. Your response should be a JSON response that will return damage, situation, and the items that are now in the backpack. Damage should be in multiples of 5. Only put items in the player's backpack if a user says to put the item in their backpack. Never put an item in the backpack unless the user says they want to put the item in their backpack.

The keys in the JSON file must be: reply, damage, context, items. Do not format the JSON. Please generate it without whitespace.
```