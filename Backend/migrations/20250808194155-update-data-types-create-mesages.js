'use strict';

/** @type {import('sequelize-cli').Migration} */
const MessageType={
    TEXT : 'text',
  IMAGE : 'image',
  VIDEO : 'video',
  FILE : 'file',
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipientId: {
         type: Sequelize.STRING,
        allowNull: false,
      },
      messageTxt: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      messageType: {
        type: Sequelize.ENUM(...Object.values(MessageType)), 
        allowNull: false,
      },
      attachmentUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sentAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('messages');
  },
};

