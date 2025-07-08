module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: "❌ Có lỗi xảy ra khi thực hiện lệnh này.",
                ephemeral: true
            });
            client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;

            const [action, senderId] = interaction.customId.split('_');

            if (action === 'acceptLove') {
                // lưu database ghép đôi
            await interaction.reply(`💖 Bạn đã chấp nhận lời tỏ tình của <@${senderId}>!`);
            // TODO: ghi vào database
            } else if (action === 'declineLove') {
            await interaction.reply(`💔 Bạn đã từ chối lời tỏ tình của <@${senderId}>.`);
  }
});
        }
    }
};
