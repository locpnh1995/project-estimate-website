import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import Twemoji from 'react-twemoji';
const emoji = require("emojilib");

class EmojiPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        // this.compileEmoji = this.compileEmoji.bind(this);
    }

    handleOpen = () => {
        this.setState({ isOpen: true })
    }

    handleClose = () => {
        this.setState({ isOpen: false })
    }

    compileEmoji() {
        var emojis = emoji.lib;
        var charEmoji = [];
        for(let key in emojis) {
            charEmoji.push(emojis[key].char);
        }
        return charEmoji;
    }

    render() {
        return (
            <Popup wide trigger={<Icon name='smile' size='large' />} on='click' open={this.state.isOpen} style={{padding: 0}} onClose={this.handleClose} onOpen={this.handleOpen}>
                <Popup.Content className='emojis-container'>
                    {this.compileEmoji().map((emoji, key) => (
                        <li key={key} className="result emoji-wrapper js-emoji" onClick={this.props.handleClickEmoji.bind(null, emoji)}>
                            <div className='js-emoji-char native-emoji'>
                                <Twemoji options={{ className: 'twemoji' }} onClick={this.handleClose}>
                                    {emoji}
                                </Twemoji>
                            </div>
                        </li>
                    ))}
                </Popup.Content>
            </Popup>
        );
    }
}

export default EmojiPopup;