const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  name: "joinvoice",
  category: "voice",
  description: "Tham gia kênh thoại (qua mention hoặc kênh bạn đang ở)",
  usage: "z!joinvoice [voice channel mention]",
  async execute(client, message, args) {
    let voiceChannel;

    // Nếu có đối số, xử lý mention <#...>
    if (args[0]) {
      const match = args[0].match(/^<#(\d+)>$/);
      if (!match) return message.reply("❌ Không phải định dạng mention kênh hợp lệ.");
      const channelId = match[1];

      voiceChannel = message.guild.channels.cache.get(channelId);
      if (!voiceChannel || voiceChannel.type !== 2) {
        return message.reply("❌ Kênh thoại không hợp lệ hoặc không tìm thấy.");
      }
    } else {
      // Nếu không có args, lấy kênh người dùng đang ở
      voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.reply("❌ Bạn phải ở trong kênh thoại hoặc mention kênh thoại.");
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      message.reply(`✅ Đã tham gia kênh thoại: **${voiceChannel.name}**`);
    } catch (error) {
      console.error(error);
      message.reply("❌ Lỗi khi tham gia kênh thoại.");
    }
  },
};