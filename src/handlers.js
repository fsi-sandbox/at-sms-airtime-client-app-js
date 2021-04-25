let sendingSMS = false;
let buyingAirtime = false;

let notificationPerm;
const BACKEND = 'https://airsyms.herokuapp.com';

const notify = (message) => {
  // eslint-disable-next-line no-console
  console.log(message);

  if (notificationPerm !== 'granted') return;

  // eslint-disable-next-line no-new
  new Notification('Status', { body: message, icon: './images/feedback.svg' });
};

const handleResponse = async (form, btn, response) => {
  requestAnimationFrame(() => {
    btn.removeAttribute('disabled');
    btn.classList.remove('busy');
    form.reset();
  });

  if (!response || !response.ok || response.status !== 200) {
    notify('Sending the SMS failed');
    return;
  }

  const payload = await response.json();
  notify(payload.status || payload.message);
};

export const sendSMS = async (form) => {
  if (sendingSMS === true) return;

  const to = form.querySelector('[data-phoneinput]').value;
  const message = form.querySelector('textarea').value;

  const submitBtn = form.querySelector('button');
  requestAnimationFrame(() => {
    submitBtn.classList.add('busy');
    submitBtn.setAttribute('disabled', '');
  });

  try {
    sendingSMS = true;
    const response = await fetch(`${BACKEND}/sms/send-sms`, {
      method: 'post',
      body: JSON.stringify({
        to,
        message
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    sendingSMS = false;
    handleResponse(form, submitBtn, response);
  } catch (err) {
    sendingSMS = false;
    handleResponse(form, submitBtn);
  }
};

export const buyAirtime = async (form) => {
  if (buyingAirtime === true) return;

  const amount = form.querySelector('[data-moneyinput]').value;
  const phoneNumber = form.querySelector('[data-phoneinput]').value;

  const submitBtn = form.querySelector('button');
  requestAnimationFrame(() => {
    submitBtn.classList.add('busy');
    submitBtn.setAttribute('disabled', '');
  });

  try {
    buyingAirtime = true;
    const response = await fetch(`${BACKEND}/airtime/buy-airtime`, {
      method: 'post',
      body: JSON.stringify({
        amount,
        phoneNumber
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    buyingAirtime = false;
    handleResponse(form, submitBtn, response);
  } catch (err) {
    buyingAirtime = false;
    handleResponse(form, submitBtn);
  }
};

export const setupNotifications = () => {
  // notify the user about the status of buying airtime or sending SMS
  if (!('Notification' in window)) return;

  Notification.requestPermission((permission) => {
    notificationPerm = permission;
  });
};
