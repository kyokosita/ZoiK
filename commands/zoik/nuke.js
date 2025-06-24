module.exports = {
  name: 'nuke',
  run: async (client, message, args) => {
    if (message.author.id !== process.env.OWNER_ID)
      return message.reply('❌ Lệnh này chỉ dành cho chủ bot.');

    const amount = parseInt(args[0]);
    const baseName = args.slice(1).join('-') || 'kênh-nuke';

    if (isNaN(amount) || amount <= 0)
      return message.reply('⚠️ Vui lòng nhập số kênh cần tạo (ví dụ: `k!nuke 5 tên-kênh`).');

    if (amount > 100000000)
      return message.reply('⚠️ Tối đa 100000000 kênh.');

    for (let i = 1; i <= amount; i++) {
      try {
        await message.guild.channels.create({
          name: `${baseName}-${i}`,
          type: 0 // 0 = GUILD_TEXT
        });
      } catch (err) {
        console.error(`❌ Lỗi khi tạo kênh ${baseName}-${i}:`, err);
      }
    }

    return message.reply(`✅ Đã tạo ${amount} kênh với tên bắt đầu là \`${baseName}\`.`);
  }
};