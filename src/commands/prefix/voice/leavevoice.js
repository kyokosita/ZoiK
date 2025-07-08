const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "leavevoice",
  category: "voice",
  description: "Rời khỏi kênh thoại",
  usage: "z!leavevoice",
  async execute(client, message) {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply("❌ Bot không đang ở trong kênh thoại nào.");

    try {
      connection.destroy();
      message.reply("👋 Đã rời khỏi kênh thoại.");
    } catch (error) {
      console.error(error);
      message.reply("❌ Lỗi khi rời khỏi kênh thoại.");
    }
  },
};
