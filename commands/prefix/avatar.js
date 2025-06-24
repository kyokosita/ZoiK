const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Hiển thị avatar của người dùng được tag hoặc chính bạn',
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar của ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor('#00BFFF')
      .setFooter({ text: `Yêu cầu bởi ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    message.reply({ embeds: [embed] });
  }
};