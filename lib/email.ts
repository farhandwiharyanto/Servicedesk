/**
 * Utility for sending email notifications.
 * In a production environment, this would use nodemailer, SendGrid, or Resend.
 */

export async function sendOverdueAlert(email: string, ticketSubject: string, dueDate: Date) {
  const formattedDate = dueDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  console.log('---------------------------------------------------------');
  console.log('📧 SIMULATED EMAIL SENT');
  console.log(`To: ${email}`);
  console.log(`Subject: [OVERDUE ALERT] Tiket: ${ticketSubject}`);
  console.log(`Body: Halo,\n\nTiket dengan subjek "${ticketSubject}" telah melewati batas waktu (${formattedDate}). Segera lakukan penanganan.\n\nTerima kasih,\nServiceDesk System`);
  console.log('---------------------------------------------------------');
  
  return { success: true, message: 'Simulated email sent successfully' };
}
