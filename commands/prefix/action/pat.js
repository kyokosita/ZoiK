const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'pat',
  description: 'Xoa đầu ai đó một cách dịu dàng',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn cần tag ai đó để xoa đầu!');
    if (user.id === message.author.id)
      return message.reply('😅 Bạn tự xoa đầu à? Thôi để mình xoa cho 🤗');

    const gifs = [
      'https://media.tenor.com/8FYlYQwHkZ8AAAAC/pat-anime.gif',
      'https://media.tenor.com/u_w5XYhD4VAAAAAC/anime-headpat.gif',
      'https://media.tenor.com/yyx4vEnGSYoAAAAC/anime-pat.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setDescription(`🐾 ${message.author} vừa xoa đầu ${user} thật dịu dàng!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
