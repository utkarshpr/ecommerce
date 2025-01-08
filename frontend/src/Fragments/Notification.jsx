import React from 'react';

const Notifications = () => {
  const notifications = [
    { id: 1, message: 'New message from Admin' },
    { id: 2, message: 'System update scheduled at midnight' },
    { id: 3, message: 'Your profile has been updated' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className="border p-2 rounded mb-2">
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
