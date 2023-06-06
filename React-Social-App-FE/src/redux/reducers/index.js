import authReducer from "./authReducer";
import callReducer from "./callReducer";
import chatReducer from "./chatReducer";
import commentReducer from "./commentReducer";
import createRoomChatReducer from "./createRoomChatReducer";
import friendRequestReducer from "./friendRequestReducer";
import globalReducer from "./globalReducer";
import messageReducer from "./messageReducer";
import networkReducer from "./networkReducer";
import notifycationReducer from "./notifycationReducer";
import peerReducer from "./peerReducer";
import postReducer from "./postReducer";
import profileReducer from "./profileReducer";

const rootReducer = (state = {}, action) => ({
    auth: authReducer(state.auth, action),
    global: globalReducer(state.global, action),
    post: postReducer(state.post, action),
    comment: commentReducer(state.comment, action),
    chat: chatReducer(state.chat, action),
    friendRequest: friendRequestReducer(state.friendRequest, action),
    message: messageReducer(state.message, action),
    network: networkReducer(state.network, action),
    notification: notifycationReducer(state.notification, action),
    profile: profileReducer(state.profile, action),
    peer: peerReducer(state.peer, action),
    call: callReducer(state.call, action),
    createRoomChat: createRoomChatReducer(state.createRoomChat, action),
});

export default rootReducer;
