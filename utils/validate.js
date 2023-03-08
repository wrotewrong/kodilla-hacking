exports.validateText = (text) => {
  const textFormat = new RegExp(/^[A-Za-z0-9]+$/, 'g');
  if (textFormat.test(text)) {
    return text;
  } else {
    throw new Error('Invalid characters...');
  }
};

exports.validateEmail = (mail) => {
  const mailFormat = new RegExp(/^[A-Za-z0-9.]+@[A-Za-z0-9.]+$/, 'g');
  if (mailFormat.test(mail)) {
    return mail;
  } else {
    throw new Error('Invalid characters...');
  }
};
