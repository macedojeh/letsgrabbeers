import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.png';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Message } from '../pages/Message';
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, messages } = useRoom(roomId);

  console.log(messages);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    history.push('/');
  }

  async function handleDeleteMessage(messageId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/messages/${messageId}`).remove();
    }
  }

  async function handleCheckMessageAsAnswered(messageId: string) {
    await database.ref(`rooms/${roomId}/messages/${messageId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightMessage(messageId: string) {
    await database.ref(`rooms/${roomId}/messages/${messageId}`).update({
      isHighlighted: true,
    });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          { messages.length > 0 && <span>{messages.length} mensagem(s)</span>}
        </div>

        <div className="message-list">
          {messages.map(message => {
            return (
              <Message 
                key={message.id}
                content={message.content}
                author={message.author}
                isAnswered={message.isAnswered}
                isHighlighted={message.isHighlighted}
              >
                {!message.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckMessageAsAnswered(message.id)}
                    >
                      <img src={checkImg} alt="Marcar mensagem como respondida" />
                      </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightMessage(message.id)}
                    >
                      <img src={answerImg} alt="Dar destaque à mensagem" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <img src={deleteImg} alt="Remover mensagem" />
                </button>
              </Message>
            );
          })}
        </div>
      </main>
    </div>
  );
}