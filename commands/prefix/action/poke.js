const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'poke',
  description: 'Chọc nhẹ một người bạn 😛',
  run: async (client, message) => {
    const user = message.mentions.users.first();
    if (!user) return message.reply('❌ Bạn cần tag ai đó để chọc!');
    if (user.id === message.author.id)
      return message.reply('😑 Tự chọc bản thân mình thì hơi lạ đấy...');

    const gifs = [
      'https://media.tenor.com/w3DQh7snq5gAAAAC/poke-anime.gif',
      'https://media.tenor.com/0GTCb_Mm1lEAAAAC/anime-poke.gif',
      'https://media.tenor.com/PjLGC8AaI6wAAAAC/poke.gif'
    ];

    const embed = new EmbedBuilder()
      .setColor('#F5DEB3')
      .setDescription(`👉 ${message.author} vừa chọc ${user} một cái đáng yêu!`)
      .setImage(gifs[Math.floor(Math.random() * gifs.length)]);

    message.channel.send({ embeds: [embed] });
  }
};
