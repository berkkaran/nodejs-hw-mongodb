import nodemailer from 'nodemailer';

// ***************************************************************
// ****** KULLANICI İÇİN NOT: LÜTFEN BİLGİLERİNİZİ BURAYA YAPIŞTIRIN ******
// ***************************************************************

const SMTP_HOST = 'smtp-relay.brevo.com';
const SMTP_PORT = 587;
const SMTP_USER = 'berkyagizkaran@gmail.com'; // Brevo'daki GİRİŞ E-POSTANIZ
const SMTP_PASSWORD = 'ryNw0R2QkO6JS8bH'; // YENİ OLUŞTURDUĞUNUZ Brevo SMTP Anahtarı
const SMTP_FROM = 'berkyagizkaran@gmail.com'; // Brevo'da DOĞRULANMIŞ gönderen e-postanız
const TO_EMAIL = 'berkyagizkaran@gmail.com'; // Test e-postasını alacak adres (kendi adresiniz olabilir)

// ***************************************************************
// ***************************************************************

async function testEmail() {
  console.log('--- E-posta Gönderme Testi Başlatılıyor ---');
  console.log(`Host: ${SMTP_HOST}, Port: ${SMTP_PORT}, User: ${SMTP_USER}`);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // Port 465 için true, diğerleri için false
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    debug: true,
    logger: true
  });

  try {
    console.log('Transporter oluşturuldu. Bağlantı doğrulanıyor...');
    await transporter.verify();
    console.log('✅ Sunucu bağlantısı başarılı!');

    console.log('Test e-postası gönderiliyor...');
    const info = await transporter.sendMail({
      from: `"${SMTP_FROM}" <${SMTP_FROM}>`,
      to: TO_EMAIL,
      subject: 'Nodemailer Test E-postası',
      text: 'Bu, Node.js sunucunuzdan gönderilen bir test e-postasıdır.',
      html: '<b>Bu, Node.js sunucunuzdan gönderilen bir test e-postasıdır.</b>',
    });

    console.log('✅ E-posta başarıyla gönderildi!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ E-posta gönderme sırasında HATA oluştu:');
    console.error(error);
  }
}

testEmail();
