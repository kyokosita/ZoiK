const { EmbedBuilder } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

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

      const existing = db.get(`love_${authorId}`) || db.get(`love_${partner.id}`);
      if (existing)
        return message.reply('❌ Một trong hai người đã có cặp đôi. Hãy huỷ trước khi yêu mới.');

      db.set(`love_${authorId}`, partner.id);
      db.set(`love_${partner.id}`, authorId);
      db.set(`love_start_${authorId}_${partner.id}`, Date.now());
      db.set(`love_points_${authorId}_${partner.id}`, 0);

      return message.reply(`💘 ${message.author} đã trở thành cặp đôi với ${partner}!
Hãy yêu nhau vui vẻ nhé 💞`);
    }

    // --- INFO ---
    if (sub === 'info') {
      const loverId = db.get(`love_${authorId}`);
      if (!loverId) return message.reply('💤 Bạn chưa có người yêu. Dùng `z!love setlove @ai_do` để bắt đầu.');

      const lover = await client.users.fetch(loverId).catch(() => null);
      const key = [authorId, loverId].sort().join('_');
      const points = db.get(`love_points_${key}`) || 0;
      const date = db.get(`love_start_${key}`);
      const since = date ? moment(date).fromNow() : 'Không rõ';

      const embed = new EmbedBuilder()
        .setTitle('💞 Tình yêu của bạn')
        .setColor(0xff66cc)
        .setDescription(`👤 **${message.author.username}** ❤️ **${lover?.username || 'Không rõ'}**`)
        .addFields(
          { name: '🗓️ Bắt đầu yêu', value: since, inline: true },
          { name: '💗 Điểm yêu', value: `${points}`, inline: true }
        )
        .setThumbnail(lover?.displayAvatarURL({ dynamic: true }) || '')
        .setFooter({ text: 'Hãy dùng z!love count để xem số ngày yêu' });

      return message.reply({ embeds: [embed] });
    }

    // --- COUNT ---
    if (sub === 'count') {
      const loverId = db.get(`love_${authorId}`);
      if (!loverId) return message.reply('😢 Bạn chưa có người yêu.');

      const key = [authorId, loverId].sort().join('_');
      const date = db.get(`love_start_${key}`);
      if (!date) return message.reply('❌ Không tìm thấy ngày bắt đầu yêu.');

      const days = moment().diff(moment(date), 'days');
      return message.reply(`💑 Bạn và người yêu đã bên nhau được **${days} ngày** rồi! 🥰`);
    }

    // --- BREAK ---
    if (sub === 'break') {
      const loverId = db.get(`love_${authorId}`);
      if (!loverId) return message.reply('❌ Bạn chưa có ai để chia tay.');

      const key = [authorId, loverId].sort().join('_');
      db.delete(`love_${authorId}`);
      db.delete(`love_${loverId}`);
      db.delete(`love_start_${key}`);
      db.delete(`love_points_${key}`);

      return message.reply('💔 Bạn đã chia tay. Mong bạn sớm tìm được tình yêu mới.');
    }

    // --- SETDATE ---
    if (sub === 'setdate') {
      const loverId = db.get(`love_${authorId}`);
      if (!loverId) return message.reply('❌ Bạn chưa có người yêu.');

      const dateStr = args[1];
      if (!dateStr || !moment(dateStr, 'YYYY-MM-DD', true).isValid())
        return message.reply('📅 Vui lòng nhập ngày hợp lệ (định dạng `YYYY-MM-DD`).');

      const key = [authorId, loverId].sort().join('_');
      db.set(`love_start_${key}`, moment(dateStr, 'YYYY-MM-DD').valueOf());

      return message.reply(`🗓️ Đã cập nhật ngày bắt đầu yêu là **${dateStr}**.`);
    }

    // --- Nếu không có subcommand ---
    return message.reply('❓ Dùng: `z!love setlove | info | count | break | setdate` Sắp tới: hug, kiss, shop,...');
  }
};
