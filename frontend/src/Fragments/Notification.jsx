import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const notifications = [
    { "id": 1, "message": "New message from Admin", "type": "info" },
    { "id": 2, "message": "System update scheduled at midnight", "type": "warning" },
    { "id": 3, "message": "Your profile has been updated", "type": "success" },
    { "id": 4, "message": "Order #1234 has been shipped", "type": "success" },
    { "id": 5, "message": "Order #5678 has been delivered", "type": "success" },
    { "id": 6, "message": "Order #91011 is out for delivery", "type": "info" },
    { "id": 7, "message": "Order #1112 has been canceled", "type": "warning" },
    { "id": 8, "message": "Your email address has been updated", "type": "success" },
    { "id": 9, "message": "Your phone number has been updated", "type": "success" },
    { "id": 10, "message": "OTP for Order #7890 is 123456", "type": "info" },
    { "id": 11, "message": "Order #1314 payment failed. Please retry", "type": "warning" },
    { "id": 12, "message": "Refund initiated for Order #1516", "type": "success" },
    { "id": 13, "message": "Order #1718 has been successfully returned", "type": "success" },
    { "id": 14, "message": "Password has been updated", "type": "success" },
    { "id": 15, "message": "Address has been added to your profile", "type": "success" },
    { "id": 16, "message": "Account security alert: Unusual login detected", "type": "warning" },
    { "id": 17, "message": "Order #1920 delivery delayed due to weather", "type": "info" },
    { "id": 18, "message": "Your payment method has been updated", "type": "success" }
  ];  

  const notificationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-gray-700">Notifications</h1>
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.li
            key={notification.id}
            className={`p-4 rounded-lg mb-4 shadow-md ${getNotificationStyle(notification.type)} transition duration-300`}
            variants={notificationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {notification.message}
          </motion.li>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
