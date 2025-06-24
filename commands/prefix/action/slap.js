const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'slap',
  description: 'Tát một ai đó thật mạnh 😤',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn phải tag một người để tát!');
    if (user.id === message.author.id)
      return message.reply('🤕 Bạn không nên tự tát mình...');

    const gifs = [
      'https://media.tenor.com/4MKa5Q0y13UAAAAC/slap-anime.gif',
      'https://media.tenor.com/LX6LhW3NUhYAAAAC/slap.gif',
      'https://media.tenor.com/RCf0LHZ2juQAAAAC/anime-slap.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FF6961')
      .setDescription(`😡 ${message.author} vừa tát ${user} một cái trời giáng!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
