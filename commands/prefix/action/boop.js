const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'boop',
  description: 'Chạm mũi ai đó một cách đáng yêu 🐽',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Tag ai đó để boop mũi họ!');
    if (user.id === message.author.id)
      return message.reply('😳 Bạn tự boop mũi mình à...?');

    const gifs = [
      'https://media.tenor.com/2I4x0R3MRb4AAAAC/anime-boop.gif',
      'https://media.tenor.com/IxKj1f2eRC8AAAAC/boop-anime.gif',
      'https://media.tenor.com/Wdfjvbx8GAYAAAAC/anime-girl.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FFE4E1')
      .setDescription(`🐽 ${message.author} vừa chạm mũi ${user} một cách siêu dễ thương!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
