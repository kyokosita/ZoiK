const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'kiss',
  description: 'Hôn một người đặc biệt 😘',
  run: async (client, message, args) => {
    const user = message.mentions.users.first();

    if (!user) return message.reply('❌ Bạn phải tag một người để hôn!');
    if (user.id === message.author.id)
      return message.reply('😳 Bạn không thể hôn chính mình... hay là bạn cần một cái hôn từ bot? 🤖💋');

    const gifs = [
      'https://media.tenor.com/3zbo8Lw8BzMAAAAC/anime-kiss.gif',
      'https://media.tenor.com/wCrlEHV1u0wAAAAC/kiss-anime.gif',
      'https://media.tenor.com/0AVd1UQzzgUAAAAC/anime-couple-kiss.gif',
      'https://media.tenor.com/3sM5_q0zs4MAAAAC/anime-anime-kiss.gif',
      'https://media.tenor.com/HS2J9AZALyIAAAAC/anime-kiss-love.gif'
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFC0CB')
      .setDescription(`💋 ${message.author} đã hôn ${user} một cách ngọt ngào!`)
      .setImage(gif);

    message.channel.send({ embeds: [embed] });
  }
};