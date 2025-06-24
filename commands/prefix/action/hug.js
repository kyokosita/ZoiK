const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'hug',
  description: 'Ôm một người dễ thương nào đó!',
  run: async (client, message, args) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn phải tag một người để ôm!');

    if (user.id === message.author.id)
      return message.reply('🥲 Bạn không thể ôm chính mình... nhưng mình ôm bạn nè 🤗');

    const gifs = [
      'https://media.tenor.com/WnU1ZrN1focAAAAC/hug-anime.gif',
      'https://media.tenor.com/VzvUvnRJ0cMAAAAC/anime-hug.gif',
      'https://media.tenor.com/Iyx2hVZ5_K4AAAAC/anime-couple.gif'
    ];

    const gif = gifs[Math.floor(Math.random() * gifs.length)];

    const embed = new EmbedBuilder()
      .setColor('#FFB6C1')
      .setDescription(`💞 ${message.author} vừa ôm ${user} một cái thật ấm áp!`)
      .setImage(gif);

    message.channel.send({ embeds: [embed] });
  }
};