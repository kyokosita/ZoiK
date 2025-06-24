const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'bite',
  description: 'Cắn ai đó một cách tinh nghịch 😈',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn phải tag người để cắn!');
    if (user.id === message.author.id)
      return message.reply('🧛‍♂️ Bạn không thể tự cắn mình...');

    const gifs = [
      'https://media.tenor.com/M6ayIChcJ9MAAAAC/anime-bite.gif',
      'https://media.tenor.com/EkPpCyEyrR0AAAAC/bite-neck.gif',
      'https://media.tenor.com/VkW3ntp8qDMAAAAC/anime-love-bite.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#D2691E')
      .setDescription(`😈 ${message.author} vừa cắn ${user} một cái thật ngầu!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
