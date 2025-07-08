const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Xóa tin nhắn trong kênh.")
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("Số tin nhắn cần xóa (tối đa 100)")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Vui lòng chọn số từ 1 đến 100."
      });
    }

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);
      const reply = await interaction.reply({
        content: `✅ Đã xóa ${deleted.size} tin nhắn.`
      });
      // chờ 4 giây rồi xóa reply
      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 2000);
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "❌ Không thể xóa tin nhắn. Có thể tin nhắn quá cũ hoặc quyền không đủ."
      });
      // tự xóa lỗi sau 4 giây
      setTimeout(() => {
        interaction.deleteReply().catch(() => {});
      }, 2000);
    }
  },
};