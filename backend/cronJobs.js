const cron = require('node-cron');
const { Op } = require('sequelize');
const BorrowHistory = require('./models/borrowHistory');

cron.schedule('59 23 * * *', async () => {
  try {
    const [affected] = await BorrowHistory.update(
      { status: 'Late' },
      {
        where: {
          status: 'Active',
          dueDate: { [Op.lt]: new Date() }
        }
      }
    );
    if (affected > 0) {
      console.log(`⏰ ${affected} empréstimos marcados como atrasados`);
    }
  } catch (err) {
    console.error('Erro no cron para marcar atrasados:', err);
  }
});
