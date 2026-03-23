import * as Notifications from 'expo-notifications';

export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleWalkReminder(locale: 'ru' | 'en' = 'ru') {
  const body =
    locale === 'ru'
      ? 'Хороший вечер для короткой прогулки 🌤'
      : 'Nice evening for a short walk 🌤';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Waygo',
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 17,
      minute: 0,
    },
  });
}

export async function scheduleWeeklyRecap(locale: 'ru' | 'en' = 'ru') {
  const body =
    locale === 'ru'
      ? 'Твоя неделя собрана — загляни 📋'
      : 'Your week is ready — take a look 📋';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Waygo',
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // Monday
      hour: 10,
      minute: 0,
    },
  });
}

export async function scheduleStreakRiskReminder(locale: 'ru' | 'en' = 'ru') {
  const body =
    locale === 'ru'
      ? 'Один шаг — и серия продолжается 🔥'
      : 'One step — and the streak continues 🔥';

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Waygo',
      body,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 30,
    },
  });
}

export async function sendAchievementNotification(title: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Waygo 🏆',
      body: title,
    },
    trigger: null, // immediate
  });
}

export async function rescheduleAll(locale: 'ru' | 'en' = 'ru') {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await scheduleWalkReminder(locale);
  await scheduleWeeklyRecap(locale);
  await scheduleStreakRiskReminder(locale);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
