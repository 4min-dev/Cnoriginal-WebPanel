import type { NewOrder } from "./NewOrder"

export interface OrderFile {
    type: 'succes' | 'error',
    row_num: number,
    tracknumber: string | null,
    error: {
        column: string,
        error: string
    },
    order: NewOrder | null
}