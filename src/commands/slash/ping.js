const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Kiểm tra độ trễ bot"),
  async execute(interaction) {
    await interaction.reply("🏓 Đang kiểm tra ping...");
    const sent = await interaction.fetchReply();
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`🏓 Pong! Độ trễ bot: ${latency}ms`);
  },
};