const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'list',
  description: 'Hiển thị danh sách các hành động có thể dùng (hug, kiss, slap,...)',
  run: async (client, message, args) => {
    const actions = [
      '💞 `z!hug @user` – Ôm một cái thật ấm áp',
      '💋 `z!kiss @user` – Hôn ngọt ngào 😳',
      '👋 `z!slap @user` – Tát cho tỉnh 😤',
      '🐱 `z!pat @user` – Xoa đầu dễ thương',
      '🥺 `z!cuddle @user` – Âu yếm nhẹ nhàng',
      '👉 `z!poke @user` – Chọc ghẹo ai đó',
      '🦷 `z!bite @user` – Cắn yêu 😈',
      '❄️ `z!boop @user` – Chạm mũi ngộ nghĩnh'
    ];

    const embed = new EmbedBuilder()
      .setTitle('🤝 Danh sách hành động dễ thương')
      .setDescription(actions.join('\n'))
      .setColor('#FFD1DC')
      .setFooter({ text: 'Dùng z! + tên hành động để thực hiện. Ví dụ: z!hug @user' });

    message.channel.send({ embeds: [embed] });
  }
};