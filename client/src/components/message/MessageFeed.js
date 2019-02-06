import React, { Component } from 'react';

import Message from './Message';

class MessageFeed extends Component {
  state = {
    messages: [
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      },
      {
        from: 'from',
        to: 'to',
        title: 'title',
        message:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, adipisci eius omnis ratione commodi debitis soluta assumenda. Repellendus soluta aliquam magni laborum ducimus praesentium, quis vero delectus accusantium ullam velit eligendi fuga nobis rem. Voluptate dignissimos, explicabo minus nihil quisquam quo officia maiores perspiciatis voluptatem atque quaerat dicta harum numquam.'
      }
    ]
  };

  render() {
    const messages = this.state.messages.map((item, i) => {
      return (
        <Message
          key={i}
          from={item.from}
          to={item.to}
          message={item.message}
          title={item.title}
        />
      );
    });

    return <div>{messages}</div>;
  }
}

export default MessageFeed;
