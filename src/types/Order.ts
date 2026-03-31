export interface Order {
    id: string,
    bx_id: number,
    user_id: string,
    description: string,
    price: number,
    paid: false,
    seo_description: string,
    customs_description: string,
    count: number,
    cost_per_good: number,
    product_url: string,
    img_url: string,
    cn_tracking_number: string,
    dobropost_id: number,
    dobropost_tracking_number: string,
    actual_bx_status: 'new' | 'error' | 'data_send' | 'china_storage' | 'shipped_to_russia' | 'pvz' | 'pickup' | 'outwardly' | 'send_to_russia' | 'collected' | 'export' | 'destruction' | 'won',
    created_at: Date,
    customer_personal_data: [
        {
            id: number,
            order_id: string,
            last_name: string,
            first_name: string,
            patronymic_name: string,
            full_address: string,
            city: string,
            postcode: string,
            region: string,
            phone_number: string,
            email: string,
            passport_series: string,
            passport_number: string,
            passport_issue_date: string,
            inn: string,
            created_at: Date
        }
    ],
    dimensions: [
        {
            id: number,
            dobropost_order_id: string,
            delivery_order_id: string,
            weight: number,
            width: number,
            height: number,
            length: number,
            created_at: Date
        }
    ]
}