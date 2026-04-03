export interface NewOrder {
    tracking_number: string,
    description: string,
    product_url: string,
    cost_per_good: number,
    count: number,
    image_url: string,
    client_id: string
}