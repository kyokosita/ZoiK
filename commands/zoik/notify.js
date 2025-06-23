const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  name: 'notify',
  description: 'Thông báo.',
  run: async (client, message, args) => {
    // Chỉ chủ bot
    if (message.author.id !== process.env.OWNER_ID) {
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');
    }

    // ============ Hiển thị cú pháp chung ============
    if (!args[0]) {
      return message.reply(
        '❌ Cú pháp:\n' +
        '- `k!notify set #kênh`\n' +
        '- `k!notify #kênh <nội dung>` (gửi tới 1 kênh cụ thể)\n' +
        '- `k!notify <nội dung>` (gửi tới tất cả server đã set)'
      );
    }

    // ============ Lưu kênh thông báo ============
    if (args[0].toLowerCase() === 'set') {
      const ch = message.mentions.channels.first();
      if (!ch) return message.reply('❌ Hãy mention kênh bạn muốn lưu.');
      await db.set(`notifyChannel_${message.guild.id}`, ch.id);
      return message.reply(`✅ Đã lưu kênh thông báo: **#${ch.name}**`);
    }

    // ============ Gửi tới 1 kênh cụ thể (nếu có mention) ============
    if (message.mentions.channels.size) {
      const target = message.mentions.channels.first();
      const content = args.slice(1).join(' ');
      if (!content) return message.reply('❌ Bạn chưa nhập nội dung thông báo.');

      try {
        await target.send({
          embeds: [{
            title: '📢 Thông báo',
            description: content,
            color: 0xffc107,
            footer: { text: `Từ: ${message.author.tag}` },
            timestamp: new Date()
          }]
        });
        return message.reply(`✅ Đã gửi thông báo tới **#${target.name}**.`);
      } catch (err) {
        console.error(err);
        return message.reply('❌ Không thể gửi thông báo tới kênh này.');
      }
    }

    // ============ Gửi tới tất cả server đã set ============
    const notifyContent = args.join(' ');
    let success = 0, failed = 0;

    for (const guild of client.guilds.cache.values()) {
      const channelId = await db.get(`notifyChannel_${guild.id}`);
      if (!channelId) { failed++; continue; }

      const ch = guild.channels.cache.get(channelId);
      if (!ch || !ch.isTextBased()) { failed++; continue; }

      try {
        await ch.send({
          embeds: [{
            title: '📢 Thông báo',
            description: notifyContent,
            color: 0xffc107,
            footer: { text: `Từ: ${message.author.tag}` },
            timestamp: new Date()
          }]
        });
        success++;
      } catch (err) {
        console.error(`Lỗi gửi ở server ${guild.id}:`, err);
        failed++;
      }
    }

    message.reply(`✅ Đã gửi thông báo tới ${success} server. ❌ Lỗi ở ${failed} server.`);
  }
};