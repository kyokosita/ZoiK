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

    if (usedPrefix === 'z!') {
      command = client.prefixCommands.get(cmdName);
    } else if (usedPrefix === 'k!') {
      if (message.author.id !== process.env.OWNER_ID)
        return message.reply('❌ Lệnh `k!` chỉ dành cho chủ bot.');

      const realCmd = cmdName === 'help' ? 'zoikhelp' : cmdName;
      command = client.zoikCommands.get(realCmd);
    }

    if (!command) return;

    try {
      const reply = await command.run(client, message, args);

      // Nếu là k! và phản hồi là message → xoá cả lệnh & phản hồi sau 5 giây
      if (usedPrefix === 'k!' && reply && reply.deletable) {
        setTimeout(() => {
          if (message.deletable) message.delete().catch(() => {});
          reply.delete().catch(() => {});
        }, 5000);
      }

    } catch (err) {
      console.error(err);
      const errMsg = await message.reply('❌ Có lỗi xảy ra khi thực hiện lệnh.');
      if (usedPrefix === 'k!' && reply && reply.deletable) {
  setTimeout(() => {
    if (message.deletable) message.delete().catch(() => {});
    reply.delete().catch(() => {});
  }, 60000);
}
    }
  }
};