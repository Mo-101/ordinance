import React from 'react';

interface NotificationBellProps {
  onOrderClick: (orderId: string) => void;
}

function NotificationBell({ onOrderClick }: NotificationBellProps) {
  return (
    <div className="notification-bell" style={{ position: 'relative', cursor: 'pointer', fontSize: '20px' }}>
      🔔
      <span style={{
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        background: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: '10px'
      }}>
        3
      </span>
    </div>
  );
}

export default NotificationBell;
