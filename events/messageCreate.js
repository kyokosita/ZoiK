module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const prefixes = ['z!', 'k!'];
    const usedPrefix = prefixes.find(p => message.content.startsWith(p));
    if (!usedPrefix) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName) return;

    let command;

    // Phân loại
    if (usedPrefix === 'z!') {
      command = client.prefixCommands.get(cmdName);
    } else if (usedPrefix === 'k!') {
      if (message.author.id !== process.env.OWNER_ID) {
        const reply = await message.reply('❌ Lệnh `k!` chỉ dành cho chủ bot.');
        setTimeout(() => reply.delete().catch(() => {}), 5000);
        return;
      }
      command = client.zoikCommands.get(cmdName);
    }

    if (!command) return;

    try {
      const reply = await command.run(client, message, args);

      // Nếu là k! và có phản hồi là tin nhắn => xóa sau 5s
      if (usedPrefix === 'k!' && reply && reply.deletable) {
        setTimeout(() => reply.delete().catch(() => {}), 5000);
      }
    } catch (err) {
      console.error(err);
      const errMsg = await message.reply('❌ Có lỗi xảy ra khi thực hiện lệnh.');
      if (usedPrefix === 'k!' && errMsg.deletable) {
        setTimeout(() => errMsg.delete().catch(() => {}), 5000);
      }
    }
  }
};
