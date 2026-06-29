import type { NotificationType } from "./NotificationType";

export default interface Notification {
    id: string,
    order_id: string,
    status: string,
    type: NotificationType,
    comment: string,
    msg: string | null,
    created_at: string
}
