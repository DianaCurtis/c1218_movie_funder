import React, { Component } from 'react';
import '../../section/messagesent.scss';
import Nav from '../navbar/index';

const MessageSent = () => {
  return (
    <div>
    <Nav/>
      <div className='form-box'>
        <h1>Your message has been sent!</h1>

        <h1>Thank You!</h1>
      </div>
    </div>
  )
}

export default MessageSent;