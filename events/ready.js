module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);

    const statuses = [
      { name: 'z!help | ZoiK đẹp trai', type: 0 },        // Playing
      { name: 'Cẩn thận 2 hòn dái của bạn', type: 2 },      // Listening
      { name: 'Béo béo béo', type: 3 }, // Watching
      { name: 'Bot by Kyo', type: 0 }
    ];

    let index = 0;

    const updateStatus = () => {
      const status = statuses[index];
      client.user.setPresence({
        status: 'online',
        activities: [status]
      });
      index = (index + 1) % statuses.length;
    };

    updateStatus(); // Đặt status ban đầu
    setInterval(updateStatus, 10000); // Cập nhật mỗi 30 giây
  }
};