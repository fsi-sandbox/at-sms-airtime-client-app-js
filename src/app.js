/* eslint-disable import/extensions */
import { sendSMS, buyAirtime, setupNotifications } from './handlers.js';

const defaultView = 'send-sms';
const onScreenAttr = 'data-on-screen';

const startApp = () => {
  // handle navigation between airtime and SMS screens
  const navBtns = document.querySelectorAll('[data-nav-btn]');
  [...navBtns].forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.to || defaultView;
      const viewEl = document.querySelector(`[data-${view}]`);
      if (!viewEl || (viewEl && viewEl.hasAttribute(onScreenAttr))) return;

      requestAnimationFrame(() => {
        viewEl.closest('main').querySelector(`[${onScreenAttr}]`).removeAttribute(onScreenAttr);
        viewEl.setAttribute(onScreenAttr, '');
      });
    });
  });

  // handle form validation & submittion
  const handlers = {
    sms: sendSMS,
    airtime: buyAirtime
  };
  const forms = document.querySelectorAll('form');
  [...forms].forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const frm = event.target;
      const handler = handlers[frm.dataset.go];
      if (!handler) return;

      handler(form);
    });
  });

  setupNotifications();
};

document.addEventListener('DOMContentLoaded', startApp);
