// hooks/use-notifications.ts
import { useState, useEffect } from "react";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types";

interface UseNotificationsParams {
  category?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export function useNotifications(params: UseNotificationsParams) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await notificationService.getAll(params);
    if (res.success) setNotifications(res.data);

    const resUnread = await notificationService.getUnreadCount();
    if (resUnread.success) setUnreadCount(resUnread.data.count);

    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [params.category, params.search, params.startDate, params.endDate, params.status]);

  return { notifications, unreadCount, loading, refresh: fetchNotifications };
}