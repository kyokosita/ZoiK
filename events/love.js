const { QuickDB } = require('quick.db');
const db = new QuickDB();

const cooldowns = new Map();

module.exports = (client) => {
  // Tăng điểm khi cùng voice
  setInterval(async () => {
    const guilds = client.guilds.cache;

    for (const guild of guilds.values()) {
      const voiceStates = guild.voiceStates.cache;

      // Lọc người đang ở voice
      const membersInVoice = voiceStates
        .filter(v => v.channel && !v.member.user.bot)
        .map(v => v.member.user);

      for (const user of membersInVoice) {
        const loverId = await db.get(`love_${user.id}`);
        if (!loverId) continue;

        // Nếu người yêu cũng đang ở trong voice
        const loverInVoice = membersInVoice.find(u => u.id === loverId);
        if (!loverInVoice) continue;

        const key = [user.id, loverId].sort().join('_');

        // Kiểm tra cooldown
        const cdKey = `voice_${key}`;
        const lastGiven = cooldowns.get(cdKey) || 0;
        const now = Date.now();

        if (now - lastGiven >= 60 * 60 * 1000) { // 1 tiếng
          const currentPoints = await db.get(`love_points_${key}`) || 0;
          await db.set(`love_points_${key}`, currentPoints + 50);
          cooldowns.set(cdKey, now);

          console.log(`💗 Tăng 50 điểm cho cặp đôi ${key} vì cùng voice.`);
        }
      }
    }
  }, 60 * 1000); // Kiểm tra mỗi phút
};