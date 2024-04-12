import heart from '~/assets/heart.png';
import hearthalf from '~/assets/heart-half.png';
import heartempty from '~/assets/heart-empty.png';
import backpackImage from '~/assets/backpack.png';
import ZorkEngine from '~/services/zork-engine';
import { Form, redirect, useLoaderData } from '@remix-run/react';
import { TypedResponse } from '@remix-run/node';
import { ZorkMessage } from '~/services/zork-ai';

export async function loader({
  request
}: {
  request: Request;
}): Promise<
  | { threadId: string; thread: ZorkMessage[]; health: number; items: string[]; situation: string }
  | TypedResponse<never>
> {
  const zorkEngine = new ZorkEngine();
  const url = new URL(request.url);
  let threadId = url.searchParams.get('threadId') || '';
  if (!threadId) {
    threadId = await zorkEngine.startNewThread();
    return redirect(`/game?threadId=${threadId}`);
  }

  const thread = [];
  const allMessages = await zorkEngine.getThread(threadId);
  for (let i = allMessages.length - 1; i >= 0; i--) {
    for (let j = allMessages[i].length - 1; j >= 0; j--) {
      const message = allMessages[i][j];
      thread.push(message);
    }
  }

  const firstHealth = thread.find((message) => message?.health)?.health || 100;
  const health = thread.reduce(
    (totalHealth, message) => totalHealth - (message?.damage || 0),
    firstHealth
  );
  const items = thread[thread.length - 1].items;
  const prefix = 'start game: ';
  const situation =
    thread.find((message) => message?.situation)?.situation?.slice(prefix.length) || 'zork';

  return { threadId, thread, health, items, situation };
}

export default function Game() {
  const { threadId, thread, health, items, situation } = useLoaderData<typeof loader>();

  return (
    <div className="game-screen">
      <div className="command-terminal-container">
        <div className="command-messages">
          {thread.map(
            (message, index) =>
              (message.reply || message.player_decision) && (
                <div key={index} className="message">
                  {message.reply ? (
                    <span className="message-role">ZorkBot: </span>
                  ) : (
                    <span>&gt; </span>
                  )}
                  <span className="message-text">
                    {message?.reply ?? message?.player_decision ?? ''}
                  </span>
                </div>
              )
          )}
        </div>
        <div className="command-input-container">
          <div className="command-prompt">&gt;</div>
          <Form method="post">
            <input type="hidden" name="threadId" value={threadId} />
            <input type="hidden" name="health" value={health} />
            <input type="hidden" name="items" value={items} />
            <input type="hidden" name="situation" value={situation} />
            <input
              type="text"
              name="decision"
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              placeholder="" // eslint-disable-line jsx-a11y/label-has-associated-control
              className="command-input"
              // onKeyPress={handleKeyPress}
            />
            <button hidden>submit</button>
          </Form>
        </div>
      </div>
      <div className="vertical-divider"></div>
      <div className="side-panel">
        <div className="health-bar">{renderHearts(health)}</div>
        <div className="backpack-header">
          <img src={backpackImage} alt="backpack"></img>
        </div>
        <div className="backpack-items">
          {items.map((item, index) => (
            <div key={index} className="backpack-item">
              <p>{item}</p>
            </div>
          ))}{' '}
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const threadId = formData.get('threadId') || '';
  const playerDecision = formData.get('decision') || '';
  const health = formData.get('health') || '';
  const items = formData.get('items') || '';
  const situation = formData.get('situation') || 'zork';
  await new ZorkEngine().postUserDecision(
    threadId.toString(),
    playerDecision.toString(),
    Number(health.toString()),
    items.toString().split(','),
    situation.toString()
  );
  return redirect(`/game?threadId=${threadId}`);
}

// Function to render hearts based on health
function renderHearts(health: number) {
  const fullHearts = Math.floor(health / 10); // Number of full hearts
  const halfHeart = health % 10 >= 5; // Check if there's a half heart needed
  const emptyHearts = 10 - fullHearts - (halfHeart ? 1 : 0); // Calculate number of empty hearts

  return (
    <>
      {[...Array(emptyHearts)].map((_, index) => (
        <img key={`empty-${index}`} src={heartempty} className="pixelized--heart" alt="heart" />
      ))}
      {halfHeart && <img key="half" src={hearthalf} className="pixelized--heart" alt="heart" />}
      {[...Array(fullHearts)].map((_, index) => (
        <img key={index} src={heart} className="pixelized--heart" alt="heart" />
      ))}
    </>
  );
}
