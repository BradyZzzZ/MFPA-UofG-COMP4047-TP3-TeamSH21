/**
 * Display a notification message.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import toast from 'react-hot-toast';

const Notify = (type: 'success' | 'error', msg: string, header?: string) => {
  switch (type) {
    case 'success':
      toast.success(
        <span className="*:text-pretty">
          <h1 className="font-bold capitalize">{header}</h1>
          <p className="break-words">{msg}</p>
        </span>,
        {
          style: {
            border: '1.5px solid #fff',
            color: '#fff',
            background: '#17c964',
            maxWidth: '26rem',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#17c964',
          },
          duration: 3000,
          position: 'bottom-center',
        }
      );
      break;
    case 'error':
      toast.error(
        <span className="*:text-pretty">
          <h1 className="font-bold">{header}</h1>
          <p className="break-words">{msg}</p>
        </span>,
        {
          style: {
            border: '1.5px solid #fff',
            color: '#fff',
            background: '#fa4e4d',
            maxWidth: '26rem',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#fa4e4d',
          },
          duration: 4000,
          position: 'bottom-center',
        }
      );
      break;
  }
};

export default Notify;
