import heart from '~/assets/heart.png';
import hearthalf from '~/assets/heart-half.png';
import heartempty from '~/assets/heart-empty.png';
import backpack from '~/assets/backpack.png';
import ZorkEngine from '~/services/zork-engine';
import { Form, redirect, useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { TypedResponse } from '@remix-run/node';

export async function loader({
  request
}: {
  request: Request;
}): Promise<string[] | TypedResponse<never>> {
  const url = new URL(request.url);
  let threadId = url.searchParams.get('threadId') || '';
  if (!threadId) {
    threadId = await ZorkEngine.startNewThread();
    return redirect(`/game?threadId=${threadId}`);
  }
  return ZorkEngine.getThread(threadId);
}

export default function Game() {
  const [threadId, setThreadId] = useState('');
  const [searchParams] = useSearchParams();
  const threadIdParam = searchParams.get('threadId');

  useEffect(() => {
    setThreadId(threadIdParam || '');
  }, [threadIdParam]);

  const messages = useLoaderData();

  const health = 65;

  const messagesList =
    Array.isArray(messages) && messages.length > 0
      ? messages
      : [
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          },
          {
            role: 'ZorkBot',
            text: 'You are standing in an open field west of a white house, with a boarded front door. There is a small mailbox here.'
          },
          {
            role: 'Player',
            text: 'I want to open the mailbox.'
          }
        ];

  return (
    <div className="game-screen">
      <div className="command-terminal-container">
        <div className="command-messages">
          {messagesList.map((message, index) => (
            <div key={index} className="message">
              {message.role === 'ZorkBot' ? (
                <span className="message-role">{message.role}: </span>
              ) : (
                <span>&gt; </span>
              )}
              <span className="message-text">{message.text}</span>
            </div>
          ))}
        </div>
        <div className="command-input-container">
          <div className="command-prompt">&gt;</div>
          <Form method="post">
            <input type="hidden" name="threadId" value={threadId} />
            <input
              type="text"
              name="decision"
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              placeholder="" // eslint-disable-line jsx-a11y/label-has-associated-control
              className="command-input"
              // onKeyPress={handleKeyPress}
            />
            <button>submit</button>
          </Form>
        </div>
      </div>
      <div className="vertical-divider"></div>
      <div className="side-panel">
        <div className="health-bar">{renderHearts(health)}</div>
        <div className="backpack-header">
          <img src={backpack} alt="backpack"></img>
        </div>
        <div className="backpack-items">
          <div className="backpack-item">
            <p>Sword</p>
          </div>
          <div className="backpack-item">
            <p>Shield</p>
          </div>
          <div className="backpack-item">
            <p>Illegal Drugs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const threadId = formData.get('threadId') || '';
  const playerDecision = formData.get('decision') || '';
  await ZorkEngine.postUserDecision(threadId.toString(), playerDecision.toString());
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
