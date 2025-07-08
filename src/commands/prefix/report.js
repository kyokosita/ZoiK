// src/commands/prefix/report.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "report",
  description: "Tố cáo người dùng vi phạm.",
  async execute(message, args, client) {
    const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (!logChannel) {
      return message.reply("❌ Không tìm thấy kênh báo cáo.");
    }

    const mentionedUser = message.mentions.users.first();
    if (!mentionedUser) {
      return message.reply("❌ Bạn phải mention người cần tố cáo.");
    }

    const reason = args.slice(1).join(" ");
    if (!reason) {
      return message.reply("❌ Bạn chưa nhập lý do tố cáo.");
    }

    const embed = new EmbedBuilder()
      .setTitle("🚨 TỐ CÁO NGƯỜI DÙNG")
      .setColor("Red")
      .addFields(
        { name: "👤 Người tố cáo", value: `${message.author.tag} (${message.author.id})` },
        { name: "🎯 Bị tố cáo", value: `${mentionedUser.tag} (${mentionedUser.id})` },
        { name: "📝 Lý do", value: reason }
      )
      .setTimestamp()
      .setFooter({ text: "ZoiK Report System" });

    await logChannel.send({ embeds: [embed] });

    return message.reply(`✅ Báo cáo đã gửi đến admin. Cảm ơn bạn!`);
  },
};
