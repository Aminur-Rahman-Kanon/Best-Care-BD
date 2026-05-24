'use server';

import { BkashConfig } from "@/types/bkash";



const bkashConfig = { 
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
}