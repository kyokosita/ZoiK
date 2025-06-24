const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { QuickDB } = require('quick.db');
const moment = require('moment');
moment.locale('vi');
const db = new QuickDB();

module.exports = {
  name: 'love',
  run: async (client, message, args) => {
    const sub = args[0]?.toLowerCase();
    const authorId = message.author.id;

    // --- SETLOVE ---
    if (sub === 'setlove') {
      const partner = message.mentions.users.first();
      if (!partner || partner.bot || partner.id === authorId)
        return message.reply('💔 Hãy tag người bạn muốn yêu (không phải bot hoặc chính bạn).');

      const has1 = await db.get(`love_${authorId}`);
      const has2 = await db.get(`love_${partner.id}`);
      if (has1 || has2)
        return message.reply('❌ Một trong hai người đã có cặp đôi.');

      try {
        const dm = await partner.send({
          content: `💌 **${message.author.tag}** muốn trở thành người yêu của bạn!`,
          embeds: [
            new EmbedBuilder()
              .setColor(0xff99cc)
              .setDescription(`Bạn có đồng ý yêu **${message.author.username}** không?`)
              .setFooter({ text: 'Bạn có 60 giây để quyết định.' })
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`love_accept_${authorId}`)
                .setLabel('💖 Đồng ý')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`love_decline_${authorId}`)
                .setLabel('💔 Từ chối')
                .setStyle(ButtonStyle.Danger)
            )
          ]
        });

        await message.reply('📨 Yêu cầu đã gửi. Chờ người kia phản hồi...');
        const filter = i =>
          i.customId === `love_accept_${authorId}` || i.customId === `love_decline_${authorId}`;
        const collector = dm.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

        collector.on('collect', async i => {
          const key = [authorId, partner.id].sort().join('_');
          if (i.customId === `love_accept_${authorId}`) {
            await db.set(`love_${authorId}`, partner.id);
            await db.set(`love_${partner.id}`, authorId);
            await db.set(`love_start_${key}`, Date.now());
            await db.set(`love_points_${key}`, 0);

            await i.update({ content: '💖 Bạn đã đồng ý yêu!', components: [] });
            await message.channel.send(`💘 ${message.author} và ${partner} đã trở thành người yêu của nhau!`);
          } else {
            await i.update({ content: '❌ Bạn đã từ chối lời yêu.', components: [] });
            await message.channel.send(`${partner} đã từ chối lời yêu của ${message.author} 💔`);
          }
        });

        collector.on('end', collected => {
          if (collected.size === 0) {
            dm.channel.send('⏰ Hết thời gian phản hồi.');
            message.channel.send('⏳ Người kia không phản hồi kịp. Hãy thử lại sau.');
          }
        });
      } catch {
        return message.reply('❌ Không thể gửi tin nhắn cho người đó. Có thể họ đã tắt DM.');
      }
    }

    // --- INFO ---
    else if (sub === 'info') {
  const loverId = await db.get(`love_${authorId}`);
  if (!loverId) return message.reply('💤 Bạn chưa có người yêu.');

  const lover = await client.users.fetch(loverId).catch(() => null);
  const key = [authorId, loverId].sort().join('_');
  const points = await db.get(`love_points_${key}`) || 0;
  const date = await db.get(`love_start_${key}`);
  const since = date ? moment(date).fromNow() : 'Không rõ';
  const days = date ? moment().diff(moment(date), 'days') : '0';

  const embed = new EmbedBuilder()
    .setTitle('💞 Thông tin tình yêu')
    .setColor(0xff66cc)
    .setDescription(`👤 **${message.author.username}** ❤️ **${lover?.username || 'Không rõ'}**`)
    .addFields(
      { name: '🗓️ Bắt đầu', value: since, inline: true },
      { name: '📅 Đã yêu được', value: `${days} ngày`, inline: true },
      { name: '💗 Điểm yêu', value: `${points}`, inline: true }
    )
    .setThumbnail(lover?.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Dùng z!love count để xem chính xác số ngày yêu.' });

  return message.reply({ embeds: [embed] });
}

    // --- COUNT ---
    else if (sub === 'count') {
      const loverId = await db.get(`love_${authorId}`);
      if (!loverId) return message.reply('😢 Bạn chưa có người yêu.');

      const key = [authorId, loverId].sort().join('_');
      const date = await db.get(`love_start_${key}`);
      if (!date) return message.reply('❌ Không tìm thấy ngày bắt đầu.');

      const days = moment().diff(moment(date), 'days');
      return message.reply(`💑 Hai bạn đã yêu nhau được **${days} ngày** rồi! 🥰`);
    }

    // --- BREAK ---
    else if (sub === 'break') {
      const loverId = await db.get(`love_${authorId}`);
      if (!loverId) return message.reply('❌ Bạn chưa có người yêu.');

      const lover = await client.users.fetch(loverId).catch(() => null);
      if (!lover) return message.reply('⚠️ Không tìm thấy người yêu của bạn.');

      try {
        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`confirm_break_${authorId}`)
            .setLabel('💔 Đồng ý chia tay')
            .setStyle(ButtonStyle.Danger)
        );

        await lover.send({
          content: `💔 ${message.author.tag} muốn chia tay bạn. Bạn có đồng ý không?`,
          components: [confirmRow]
        });

        await message.reply('📩 Đã gửi yêu cầu chia tay đến người kia. Chờ xác nhận...');

        const filter = i =>
          i.customId === `confirm_break_${authorId}` && i.user.id === loverId;

        const collector = client.once('interactionCreate', async i => {
          if (filter(i)) {
            const key = [authorId, loverId].sort().join('_');
            await db.delete(`love_${authorId}`);
            await db.delete(`love_${loverId}`);
            await db.delete(`love_start_${key}`);
            await db.delete(`love_points_${key}`);

            await i.update({ content: '💔 Bạn đã đồng ý chia tay.', components: [] });
            await message.channel.send('💔 Hai bạn đã chính thức chia tay nhau.');
          }
        });

        setTimeout(() => {
          client.removeAllListeners('interactionCreate');
        }, 60000);
      } catch {
        return message.reply('⚠️ Không thể gửi tin nhắn xác nhận đến người kia.');
      }
    }

    // --- SETDATE ---
    else if (sub === 'setdate') {
      const loverId = await db.get(`love_${authorId}`);
      if (!loverId) return message.reply('❌ Bạn chưa có người yêu.');

      const dateStr = args[1];
      if (!dateStr || !moment(dateStr, 'D/MM/YYYY', true).isValid())
        return message.reply('📅 Vui lòng nhập ngày hợp lệ (định dạng `Đ/MM/YYYY`).');

      const key = [authorId, loverId].sort().join('_');
      await db.set(`love_start_${key}`, moment(dateStr, 'D/MM/YYYY').valueOf());

      return message.reply(`🗓️ Đã cập nhật ngày yêu là **${dateStr}**.`);
    }

    // --- HELP ---
    else {
      return message.reply(
        '📖 Cú pháp: `z!love <setlove|info|count|break|setdate>`\n📌 Tính năng sắp tới: `hug`, `kiss`, `shop`,...'
      );
    }
  }
};
