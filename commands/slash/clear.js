const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Xoá một số lượng tin nhắn nhất định trong kênh.')
    .addIntegerOption(option =>
      option.setName('số_lượng')
        .setDescription('Số tin nhắn cần xoá (tối đa 100)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const amount = interaction.options.getInteger('số_lượng');

    if (amount < 1 || amount > 100) {
      return await interaction.reply({ content: '⚠️ Vui lòng chọn số lượng từ 1 đến 100.', ephemeral: true });
    }

    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `✅ Đã xoá ${amount} tin nhắn.`, ephemeral: true });
    } catch (error) {
      console.error('Lỗi khi xoá tin nhắn:', error);
      await interaction.reply({ content: '❌ Không thể xoá tin nhắn trong kênh này.', ephemeral: true });
    }
  }
};