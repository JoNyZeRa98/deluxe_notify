$('#selectNotificationsPosContainer').hide();

let notificationsConfigData;

$(document).ready(() => {
  $.getJSON('../../../config.json', (data) => {
    notificationsConfigData = data;

    if (!localStorage.getItem('notificationsPos')) {
      localStorage.setItem('notificationsPos', data.notificationsPos);
    }

    setNotificationsPos();
    translate();
  })

  window.addEventListener('message', (event) => {
    if (event.data.action === 'showNotification') {
      showNotification(event.data.data);
    } else if (event.data.action === 'selectNotificationsPos') {
      showSelectPosition();
    }
  });
});

// ! Notifications
const notificationsArray = [];

const removeNotification = (targetNotification) => {
  const indexToRemove = notificationsArray.findIndex((notification) => notification.id === targetNotification.id);

  if (indexToRemove !== -1) {
    notificationsArray.splice(indexToRemove, 1);
    targetNotification.element.remove();
  }
};

const showNotification = (data) => {
  const { notificationsTheme } = notificationsConfigData;

  const { notifyInfo, notifyHeader, notifyMessage, notifyDuration } = data;
  const { icon, defaultTitle, defaultMessage, color: { backgroundColor, headerColor, messageColor } } = notificationsTheme[notifyInfo];

  const notificationID = genNotificationID();

  const notification = $('<div>', { id: `notification-${notificationID}`, class: 'notification', style: `background-color: ${backgroundColor || '#333333'}` })
  .append(
    $('<div>', { class: 'notification_header' })
      .append(
        $('<div>', { class: 'header_title_container' })
          .append(
            $('<div>', { class: 'notification_icon', text: icon, style: `color: ${headerColor || '#666666'}` }),
            $('<span>', { class: 'notification_title', text: (notifyHeader || defaultTitle).toUpperCase(), style: `color: ${headerColor || '#666666'}` })
          ),
        $('<div>', { id: 'notificationTimer', class: 'notification_timer' })
      ),
    $('<div>', { class: 'notification_separator' })
  )
  .append(
    $('<span>', { class: 'notification_message', text: notifyMessage || defaultMessage, style: `color: ${messageColor || '#FFFFFF'}` })  
  );

  const newNotification = {
    id: notificationID,
    element: notification,
  };

  notificationsArray.push(newNotification);
  notification.appendTo('#notificationsContainer');

  setTimeout(() => {
    setTransformNotification();

    notification.addClass('active');
    notification.find('#notificationTimer').addClass('active').css({ 
      'animation': `progress ${notifyDuration}ms cubic-bezier(0.42, 0, 0.58, 1) forwards`,
      '--colorTimer': headerColor,
    });
    setTimeout(() => {
      notification.removeClass('active');
      setTimeout(() => removeNotification(newNotification), 500);
    }, notifyDuration || 5000);
  }, 50);
};

// ! Notifications Utils
const getNotificationsPos = () => {
  const { notificationsPosLayout } = notificationsConfigData;
  const notificationsPos = localStorage.getItem('notificationsPos');

  const layoutPosStyled = {};

  $.each(notificationsPosLayout, (key, value) => {
    layoutPosStyled[key] = {};

    $.each(value, (propKey, propValue) => {
      layoutPosStyled[key]['flex-direction'] = value['top'] ? 'column' : 'column-reverse';
      layoutPosStyled[key][propKey] = `${propValue || 1.5}rem`;

      if (key.includes('center')) {
        layoutPosStyled[key]['left'] = '50%';
        layoutPosStyled[key]['transform'] = 'translateX(-50%)';
      }
    });
  });

  return { layoutPosStyled, currentPosStyled: layoutPosStyled[notificationsPos] };
};

const setNotificationsPos = () => {
  const { currentPosStyled  } = getNotificationsPos();

  $('#notificationsContainer').removeAttr('style').css(currentPosStyled);

  setTransformNotification();
};

const setTransformNotification = () => {
  const { currentPosStyled } = getNotificationsPos();

  const notificationChildren = $('#notificationsContainer').children();

  const validKeys = ['flex-direction', 'top', 'bottom', 'left', 'right'];

  const filteredCurrentPosStyled = Object.fromEntries(
    Object.entries(currentPosStyled).filter(([key]) => validKeys.includes(key))
  );

  Object.entries(filteredCurrentPosStyled).forEach(([key]) => {
    const pxToAddLeftRight = notificationChildren.outerWidth();
    const pxToAddTopBottom = notificationChildren.outerHeight();

    let translate = '';
    let activeTranslate = '';

    if (key === 'left' && currentPosStyled['left'] !== '50%') {
      translate = `translateX(calc(-110% - ${pxToAddLeftRight || 0}px))`;
      activeTranslate = 'translateX(0%)';
    } else if (key === 'right') {
      translate = `translateX(calc(110% + ${pxToAddLeftRight || 0}px))`;
      activeTranslate = 'translateX(0%)';
    } else if (currentPosStyled['flex-direction'] === 'column' && currentPosStyled['left'] === '50%') {
      translate = `translateY(calc(-110% - ${pxToAddTopBottom || 0}px))`;
      activeTranslate = 'translateY(0%)';
    } else if (currentPosStyled['flex-direction'] === 'column-reverse' && currentPosStyled['left'] === '50%') {
      translate = `translateY(calc(110% + ${pxToAddTopBottom || 0}px))`;
      activeTranslate = 'translateY(0%)';
    }

    document.documentElement.style.setProperty('--translate', translate);
    document.documentElement.style.setProperty('--activeTranslate', activeTranslate);
  });
};

const showSelectPosition = () => {
  const { layoutPosStyled, currentPosStyled } = getNotificationsPos();

  $.each(layoutPosStyled, (key, value) => {
    const isSelected = currentPosStyled === value;

    const notificationBox = $('<div>', { class: `notification_box ${isSelected ? 'selected' : ''}` }).css(value)
      .append(
        $('<div>', { id: key, class: 'notification_box_content', text: key.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase()) })
      );

    $('#notificationsContainer').hide();  

    $('#selectNotificationsPosContainer').append(notificationBox);
    $('#selectNotificationsPosContainer').show();
  });

  $(document).on('click', '.notification_box', async (event) => {
    const newPosition = $(event.currentTarget).find('.notification_box_content').prop('id');
    
    $('.notification_box').removeClass('selected');
    $(event.currentTarget).addClass('selected');

    localStorage.setItem('notificationsPos', newPosition);
    setNotificationsPos();

    $('#notificationsContainer').hide();  
  });

  const hideSelectPos = () => {
    $('.notification_box').remove();

    $('#selectNotificationsPosContainer').hide();
    $.post(`https://${GetParentResourceName()}/hideSelectPos`, JSON.stringify({ }));
    
    $('#notificationsContainer').show();
  };

  $(document).on('click', '#closeSelectNotificationsPos', hideSelectPos);
  $(document).on('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Backspace') {
      hideSelectPos();
    }
  });
};

// ! Utils
const genNotificationID = () => {
  return Math.random().toString(36).substring(2, 7);
};

// ! Translation
const translateText = (text) => {
  const translationData = notificationsConfigData['translation'];

  return translationData[notificationsConfigData.language][text] ?? "?";
};

const translate = () => {
  $('#infoTextSelectPos').text(translateText('[SELECT_NOTIFICATIONS_POS_TEXT]'));
};
