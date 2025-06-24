const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  run: async (client, message, args) => {
    const embed = new EmbedBuilder()
      .setTitle('📖 Danh sách lệnh Z!')
      .setColor(0x00bfff)
      .setDescription('Dưới đây là danh sách các lệnh có sẵn với prefix `z!`:')
      .addFields(
        { name: '💞 Tình yêu', value: '`z!love` – Quản lý tình yêu, shop, tương tác...' },
        { name: '💰 Kinh tế', value: '`z!e` – Tiền tệ, ví, ngân hàng, shop...' },
        { name: '🎉 Giveaway', value: '`z!giveaway` – Tạo, hủy, reroll giveaway...' },
        { name: '🎵 Nhạc', value: '`z!play`, `z!skip`, `z!stop`, `z!queue`, ...' },
        { name: '📊 Khác', value: '`z!userinfo`, `z!serverinfo`, `z!clear`, ...' }
      )
      .setFooter({ text: 'Dùng z!love help hoặc z!e help để biết chi tiết hệ thống đó.' });

    message.reply({ embeds: [embed] });
  }
};