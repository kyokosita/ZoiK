const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Trả lời Pong!'),
  async execute(interaction, client) {
    await interaction.reply('🏓 Pong!');
  }
};
