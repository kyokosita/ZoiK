module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`❌ Lỗi khi thực hiện lệnh ${interaction.commandName}:`, err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Đã xảy ra lỗi khi thực hiện lệnh.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Đã xảy ra lỗi khi thực hiện lệnh.', ephemeral: true });
      }
    }
  }
};