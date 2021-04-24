import React, {useState} from 'react';
import { ChatEngine, getChat} from 'react-chat-engine';

const DirectChatPage = () => {
    const [username, setUsername] = useState('')

    function createDirectChat(creds) {
		getChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
		return (
			<div>
				<input 
					placeholder='Username' 
					value={username} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
	}
 

    return (
        <ChatEngine
            height = '100vh'
 			projectID='d6414df1-8882-4eff-8380-40d6b34b5a69'
 			userName='John'
 			userSecret='john'
            renderNewChatForm={(creds) => renderChatForm(creds)}
 		/>
 	)
 }

export default DirectChatPage;
