module.exports = {
  name: 'deletechannel',
  description: 'Xóa Kênh hoặc kênh thoại.',
  run: async (client, message, args) => {
    const ownerId = process.env.OWNER_ID;
    if (message.author.id !== ownerId) {
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');
    }

    if (!args[0]) {
      return message.reply('❌ Cú pháp:\n- `k!deletechannel all`\n- `k!deletechannel #tên-kênh`');
    }

    if (args[0].toLowerCase() === 'all') {
      try {
        const channels = message.guild.channels.cache;

        // Xóa toàn bộ kênh
        for (const channel of channels.values()) {
          await channel.delete().catch(() => {});
        }

        // Tạo lại 1 kênh "zoik"
        await message.guild.channels.create({
          name: 'zoik',
          type: 0, // Text channel
          reason: `Reset lại kênh từ lệnh k!deletechannel all`
        });

        return;
      } catch (err) {
        console.error(err);
        return message.reply('❌ Có lỗi xảy ra khi xóa tất cả kênh.');
      }
    }

    // Xóa kênh chỉ định
    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.reply('❌ Bạn cần mention 1 kênh hợp lệ.');
    }

    try {
      await channel.delete();
      return message.reply(`✅ Đã xóa kênh **${channel.name}**.`);
    } catch (err) {
      console.error(err);
      return message.reply('❌ Không thể xóa kênh.');
    }
  }
};
