const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'zoik',
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setTitle('👑 Danh sách lệnh k!')
      .setColor(0xff6600)
      .setDescription('Các lệnh quản trị chỉ dành cho bạn (owner):')
      .addFields(
        { name: '🛠️ Hệ thống Zoik', value: '`k!server copy/paste` – Sao chép & dán template server' },
        { name: '📢 Thông báo', value: '`k!notify say` – Gửi embed thông báo toàn server' },
        { name: '🎭 Quản lý role', value: '`k!deleteroles`, `k!giveroles`...' },
        { name: '🧪 Dev tools', value: '`k!eval`, `k!reload`, v.v.' }
      )
      .setFooter({ text: 'Chỉ owner mới thấy được help này 👀' });

    // Trả về để messageCreate.js xử lý tự động xóa
    return message.reply({ embeds: [embed] });
  }
};