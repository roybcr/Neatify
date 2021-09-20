export type StatusType = "Display" | "Delay";
export type NotificationStatus = "success" | "warning" | "error" | "info" | "";
export interface INotification {
  _id: string;
  type: string;
  message: string;
}
