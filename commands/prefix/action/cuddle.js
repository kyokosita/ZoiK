const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'cuddle',
  description: 'Âu yếm một người nào đó',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn cần tag người để âu yếm!');
    if (user.id === message.author.id)
      return message.reply('🥹 Bạn tự âu yếm mình sao... để bot ôm bạn nhé 🫂');

    const gifs = [
      'https://media.tenor.com/4W3hOMfNffkAAAAC/anime-cuddle.gif',
      'https://media.tenor.com/Xy1iXYRMClMAAAAC/cuddle-anime.gif',
      'https://media.tenor.com/HO4n1t-wKlsAAAAC/hug-anime.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FFAEC9')
      .setDescription(`🥺 ${message.author} đang âu yếm ${user} một cách đầy tình cảm!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
